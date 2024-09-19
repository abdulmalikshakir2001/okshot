import { prisma } from '@/lib/prisma'; // Import your Prisma instance

export const createVideoClip = async (data: { videoId: number; clipPath: string }) => {
  try {
    const { videoId, clipPath } = data;

    // Create a new video clip record in the VideoClips table
    const newClip = await prisma.videoClips.create({
      data: {
        videoId: +videoId,     // Foreign key reference to the video
        clipSrc: clipPath,    // Path of the clip
      },
    });

    return newClip;
  } catch (error) {
    console.error('Error creating video clip:', error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
};


export const getAllClips = async (videoId: number) => {
  try {
    // Fetch all video clips where videoId matches the provided id
    const videoClips = await prisma.videoClips.findMany({
      where: {
        videoId: +videoId, // Find clips with this videoId
      },
    });

    return videoClips;
  } catch (error) {
    console.error('Error fetching video clips:', error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
};