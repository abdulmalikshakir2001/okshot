import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import fs from 'fs'; // Use fs for synchronous file checks
import path from 'path';
import formidable, { File as FormidableFile } from 'formidable';

// Disable Next.js body parser to handle `multipart/form-data` with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      await handlePOST(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        status: 'false',
        message: `Method ${method} Not Allowed`,
      });
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ status: 'false', message: 'Unauthorized' });
  }

  const form = formidable({ multiples: false }); // Handle single file upload

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ status: 'false', message: 'Error parsing form data' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : (files.file as FormidableFile | undefined);

    if (!file) {
      return res.status(400).json({ status: 'false', message: 'No file uploaded' });
    }

    const userId = session.user.id.toString();

    // Define the path for the videos directory using the user ID
    const videosDir = path.join(process.cwd(), 'ai_features', 'uploads', userId);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });  // Create the directory recursively
    }

    // Generate a new file name with a timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${file.originalFilename?.replace(/\.[^/.]+$/, '')}_${timestamp}${path.extname(file.originalFilename || '')}`;

    // Full path for the new file location
    const filePath = path.join(videosDir, fileName);

    // Move the uploaded file to the specified directory
    fs.renameSync(file.filepath, filePath);

    // Respond with success message and file path
    return res.status(200).json({
      status: 'true',
      message: 'File uploaded successfully',
      data: {
        filePath,
      },
    });
  });
}
