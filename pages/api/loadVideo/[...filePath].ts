import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: { message: `Method ${req.method} Not Allowed` } });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}

// Serve video files from the uploads directory
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { filePath } = req.query;
  console.log('file path =======>.')
  console.log(filePath)
  console.log('file path =======>.')

  console.log(`Captured path segments:`, filePath);  // Log to verify segments
  
  if (!filePath || !Array.isArray(filePath)) {
    return res.status(400).json({ error: { message: 'Invalid file path' } });
  }

  // Join all the segments to form the full path
  const videoPath = path.join(process.cwd(), 'uploads', ...filePath);
  console.log(`Full file path: ${videoPath}`);  // Log the full path

  try {
    const videoFile = fs.createReadStream(videoPath);  // Stream the video file
    const stat = fs.statSync(videoPath);
    
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'video/mp4');
    
    videoFile.pipe(res);  // Send the video file as a stream
  } catch (error: any) {
    res.status(404).json({ error: { message: 'Video not found' } });
  }
};
