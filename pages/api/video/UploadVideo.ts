import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import multer, { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

interface ExtendedNextApiRequest extends NextApiRequest {
  fileValidationError?: string | null;
}

// Configure multer storage with dynamic folder structure
let globalTimestamp: string;

const storage = (userId: string) => diskStorage({
  destination: (req, file, cb) => {
    const videoName = file.originalname.replace(/\.[^/.]+$/, "");
    const uploadDir = path.join(process.cwd(), 'public', 'videos', userId, `${videoName}_${globalTimestamp}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}_${globalTimestamp}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = (userId: string) => multer({ 
  storage: storage(userId),
  fileFilter: (req: ExtendedNextApiRequest, file, cb) => {
    const videoName = file.originalname.replace(/\.[^/.]+$/, "");
    const uploadDir = path.join(process.cwd(), 'public', 'videos', userId, `${videoName}_${globalTimestamp}`);

    req.fileValidationError = null;

    if (fs.existsSync(uploadDir)) {
      req.fileValidationError = "file exist";
      return cb(null, false); // If directory exists, reject the file upload
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, true);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      
      default:
        res.setHeader('Allow', 'GET, POST, PUT');
        res.status(405).json({
          status: 'false',
          message: `Method ${method} Not Allowed`,
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ status: 'false', message });
  }
}

const handlePOST = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ status: 'false', message: 'Unauthorized' });
  }

  const userId = session.user.id.toString();

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      user_id: session.user.id,
      status: true,
    },
    include: {
      subscriptionPackage: true,
    },
  });

  if (!subscription) {
    return res.json({ status: 'false', message: 'payment required', data: 'payment' });
  }

  const latestSubscriptionUsage = await prisma.subscriptionUsage.findFirst({
    where: {
      subscriptions_id: subscription.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (
    subscription.subscriptionPackage &&
    latestSubscriptionUsage &&
    (latestSubscriptionUsage.upload_count >= subscription.subscriptionPackage.upload_video_limit ||
      latestSubscriptionUsage.clip_count >= subscription.subscriptionPackage.generate_clips)
  ) {
    return res.json({ status: 'false', message: 'payment required', data: 'payment' });
  }

  globalTimestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Set the global timestamp

  const uploadMiddleware = upload(userId).single('file');

  uploadMiddleware(req as any, res as any, async (err) => {
    if (err) {
      return res.json({ status: 'false', message: 'File upload error' });
    }
    if (req.fileValidationError && req.fileValidationError === "file exist") {
      return res.json({ status: 'file exist', message: 'File already exist' });
    }

    return res.json({ status: 'file uploaded', message: 'File upload successfully' });
  });
};
