import { prisma } from '@/lib/prisma'; // Import your Prisma instance

export const createVideoClip = async (data: any) => {
  try {
    
    const {  clipSrc,srtSrc,assSrc,audioSrc,clipSubtitledSrc,videoId } = data;

    // Create a new video clip record in the VideoClips table
    const newClip = await prisma.videoClips.create({
      data: {
        clipSrc,
        srtSrc:srtSrc,
        assSrc:assSrc,
        audioSrc:audioSrc,
        clipSubtitledSrc:clipSubtitledSrc,
        videoId: +videoId,  // Ensuring videoId is cast to number
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