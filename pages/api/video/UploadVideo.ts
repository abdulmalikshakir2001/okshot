import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import ytdl from 'ytdl-core';
import { createVideo, getAllVideos, getVideoById, updateConVideoSrcField, updateConVideoIdField } from 'models/uploadedVideo';

const extractVideoId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getVideoDuration = async (videoId: string): Promise<number | null> => {
  try {
    const info = await ytdl.getInfo(videoId);
    const duration = info.videoDetails.lengthSeconds;
    return duration ? parseInt(duration) : null;
  } catch (error) {
    console.error('Error fetching video duration:', error);
    return null;
  }
};

// Configure multer storage with dynamic folder structure
const storage = (userId: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    const videoName = file.originalname.replace(/\.[^/.]+$/, "");
    const uploadDir = path.join(process.cwd(), 'public', 'videos', userId, videoName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = (userId: string) => multer({ storage: storage(userId) });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      case 'GET':
        await handleGET(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
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

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const uploadMiddleware = upload(userId).single('file');

  uploadMiddleware(req as any, res as any, async (err) => {
    if (err) {
      return res.status(500).json({ status: 'false', message: 'File upload error' });
    }

    const { origionalVideoLink, fetchVideoById, updateConVidSrcById, src_url, title } = req.body;

    if (typeof origionalVideoLink === 'string') {
      const videoId = extractVideoId(origionalVideoLink);
      if (!videoId) {
        res.status(400).json({ status: 'false', message: 'Invalid YouTube URL' });
        return;
      }

      const videoDuration = await getVideoDuration(videoId);

      if (videoDuration === null) {
        res.status(500).json({ status: 'false', message: 'Failed to get video duration' });
        return;
      }

      const maxVideoLengthFromDB = subscription.subscriptionPackage?.max_length_video;
      let maxVideoLengthInSeconds = 0;
      if (maxVideoLengthFromDB) {
        maxVideoLengthInSeconds = timeStringToSeconds(maxVideoLengthFromDB);
      }

      if (videoDuration >= maxVideoLengthInSeconds) {
        return res.status(403).json({
          status: 'false',
          message: 'Video length exceeds the maximum allowed length for your subscription package',
          data: 'video_length_exceeded',
        });
      }

      const videoUploaded = await createVideo({ link: origionalVideoLink, userId: session.user.id, duration: videoDuration });
      if (videoUploaded) {
        res.status(200).json({ status: 'true', message: 'Video created', data: videoUploaded });
      } else {
        res.json({ status: 'false', message: 'Video not created' });
      }
      return;
    }

    if (req.file) {
      const file = req.file;
      const videoName = file.originalname;
      const videoDir = path.join(process.cwd(), 'public', 'videos', userId, videoName.replace(/\.[^/.]+$/, ""));
      const videoPath = path.join(videoDir, videoName);

      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      if (fs.existsSync(videoPath)) {
        res.status(400).json({ status: 'false', message: 'File already exists' });
        return;
      }

      fs.renameSync(file.path, videoPath);

      const videoDuration = await getVideoDuration(videoPath);

      if (videoDuration === null) {
        res.status(500).json({ status: 'false', message: 'Failed to get video duration' });
        return;
      }

      const maxVideoLengthFromDB = subscription.subscriptionPackage?.max_length_video;
      let maxVideoLengthInSeconds = 0;
      if (maxVideoLengthFromDB) {
        maxVideoLengthInSeconds = timeStringToSeconds(maxVideoLengthFromDB);
      }

      if (videoDuration >= maxVideoLengthInSeconds) {
        return res.status(403).json({
          status: 'false',
          message: 'Video length exceeds the maximum allowed length for your subscription package',
          data: 'video_length_exceeded',
        });
      }

      const videoUploaded = await createVideo({ link: videoPath, userId: session.user.id, duration: videoDuration });
      if (videoUploaded) {
        res.status(200).json({ status: 'true', message: 'Video uploaded', data: videoUploaded });
      } else {
        res.json({ status: 'false', message: 'Video not uploaded' });
      }
      return;
    }

    if (typeof fetchVideoById === 'string') {
      const getVideo = await getVideoById(fetchVideoById);
      if (getVideo) {
        res.status(200).json({ status: 'true', message: 'get video object', data: getVideo });
      } else {
        res.json({ status: 'false', message: 'video object not retrieved' });
      }
      return;
    }

    if (typeof src_url === 'string') {
      const getVideo = await updateConVideoSrcField({ id: updateConVidSrcById, userId: session.user.id, conVideoSrc: src_url, conVideoTitle: title });
      if (getVideo) {
        res.status(200).json({ status: 'true', message: 'src field and title field updated', data: getVideo });
      } else {
        res.json({ status: 'false', message: 'src field and title field not updated' });
      }
      return;
    }
  });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { conVideoId, videoId } = req.body;
  const session = await getSession(req, res);
  try {
    const updatedVideo = await updateConVideoIdField({ id: videoId, userId: session?.user.id, conVideoId });
    if (updatedVideo) {
      const latestActiveSubscription = await prisma.subscriptions.findFirst({
        where: {
          user_id: session?.user.id,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (latestActiveSubscription) {
        const subscriptionId = latestActiveSubscription.id;

        const latestSubscriptionUsage = await prisma.subscriptionUsage.findFirst({
          where: {
            subscriptions_id: subscriptionId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (latestSubscriptionUsage) {
          await prisma.subscriptionUsage.update({
            where: {
              id: latestSubscriptionUsage.id,
            },
            data: {
              upload_count: latestSubscriptionUsage.upload_count + 1,
            },
          });
        }
      }
    }
    res.status(200).json({ status: 'true', message: 'Video updated', data: updatedVideo });
  } catch (error) {
    res.json({ status: 'false', message: 'convideoField not updated' });
  }
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  try {
    const videos = await getAllVideos({ userId: session?.user.id });

    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: session?.user.id,
        status: true,
      },
      include: {
        subscriptionPackage: true,
      },
    });

    const maxVideoLengthFromDB = subscription?.subscriptionPackage?.max_length_video;

    res.status(200).json({
      status: 'true',
      message: 'get all videos',
      data: videos,
      maxVideoLengthFromDB,
    });
  } catch (error) {
    res.json({ status: 'false', message: 'something went wrong' });
  }
};

function timeStringToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
