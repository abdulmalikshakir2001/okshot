import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Assuming prisma is set up for database interactions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    // Check session for authorization (if needed)
    

    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.setHeader('Allow', 'POST');
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

// Handle POST request to fetch the first video clip based on momentId
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Extract momentId from the request body
    const { momentId }: any = req.body;

    // Validate momentId before passing it to the function
    if (!momentId || isNaN(momentId)) {
      return res.status(400).json({ error: 'Invalid moment ID' });
    }

    // Fetch the first video clip for the provided momentId using Prisma
    const clip = await prisma.videoClips.findFirst({
      where: {
        id: +momentId, // Ensure momentId is treated as an integer
      },
    });

    // If no clip is found, return a 404 response
    if (!clip) {
      return res.status(404).json({ error: 'Video clip not found' });
    }

    // Return the entire clip object in the response
    return res.status(200).json({
      status: 'true',
      message: 'Video clip fetched successfully',
      data: clip,
    });
  } catch (error) {
    console.error('Error fetching video clip:', error);
    return res.status(500).json({ error: 'Failed to fetch video clip' });
  }
};
