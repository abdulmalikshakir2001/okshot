import { NextApiRequest, NextApiResponse } from 'next';

import {    getAllClips } from 'models/videoClips';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';




export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, PUT');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}

// Handle POST request to create a video
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        // Extract videoId from the request body
        const { videoIdForClips }: any = req.body;
    
        // Validate videoId before passing it to the function
        if (!videoIdForClips || isNaN(videoIdForClips)) {
          return res.status(400).json({ error: 'Invalid video ID' });
        }
    
        // Fetch all clips for the provided videoId
        const clips = await getAllClips(+videoIdForClips);
    
        // Return the clips data in the response
        return res.status(200).json({status:'true',message:'video clip created',data:clips});
      } catch (error) {
        console.error('Error fetching video clips:', error);
        return res.status(500).json({ error: 'Failed to fetch video clips' });
      }
     





  
  
}

