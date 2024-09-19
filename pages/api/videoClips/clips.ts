import { NextApiRequest, NextApiResponse } from 'next';

import {   createVideoClip } from 'models/videoClips';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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

      const {  originalLink,videoId}: any = req.body;
      const session = await getSession(req,res)
      //  check usage
const subscription = await prisma.subscriptions.findFirst({
  where: {
    user_id: session?.user.id,
    status: true,
  },
  include: {
    subscriptionPackage: true,
  },
});

if (!subscription) {
  return  res.json({ status: 'false', message: 'payment required', data: 'payment' });
}
const latestSubscriptionUsage:any = await prisma.subscriptionUsage.findFirst({
  where: {
    subscriptions_id: subscription.id,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

if (
  subscription.subscriptionPackage &&
  (latestSubscriptionUsage.upload_count >= subscription.subscriptionPackage.upload_video_limit ||
    latestSubscriptionUsage.clip_count >= subscription.subscriptionPackage.generate_clips)
) {
  return res.json({ status: 'false', message: 'payment required', data: 'payment' });
}

//  check usage
      
      const fileNameWithExtension = path.basename(originalLink);

// Extract the file name without the extension
const { name: fileNameWithoutExt } = path.parse(fileNameWithExtension);
// Output the result
      const cleanedOriginalLink = originalLink.startsWith('/') ? originalLink.substring(1) : originalLink;
     const absoluteFilePath = path.join(process.cwd(), 'public', cleanedOriginalLink); // path for config options
     const folderPath = path.dirname(absoluteFilePath);
     const audioFilePath = path.join(folderPath, 'audio.mp3');
     const outputFilePath = path.join(folderPath, `${fileNameWithoutExt}_output.mp4`);
     const croppedFilePath = path.join(folderPath, `${fileNameWithoutExt}_cropped.mp4`);

// Output both variables
console.log('Absolute file path:', absoluteFilePath); // This gives you the full path including the file
console.log('Folder path:', folderPath); 
      const pathParts = originalLink.split('/videos/')[1].split('/');
    const firstVar = pathParts[0];
    const secondVar = pathParts[1];
    const dirPath = path.join(process.cwd(), 'public', 'videos', firstVar, secondVar, 'clips');
    
    try {
      // Check if the directory exists, if not create it
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      // python code start
      const config = {
        input_video: absoluteFilePath,
        audio_file: audioFilePath,
        output_video: outputFilePath,
        cropped_output_video: croppedFilePath,
        clips_folder_path: dirPath,
        device: "cpu",
        batch_size: 16,
        compute_type: "int8",
        language: "fr",
        group_size_min: 2,
        group_size_max: 4,
        srt_file: "subtitles.srt",
        highlight_color: "&H00FFFFFF",
        highlight_bg_color: "&H00FFC0CB",
        bg_radius: 3,
        fontname: "Arial",
        fontsize: 12,
        primary_color: "&H00FFFFFF",
        secondary_color: "&H000000FF",
        outline_color: "&H00FFFFFF",
        back_color: "&H00FFC0CB",
        bold: -1,
        italic: 0,
        underline: 0,
        strike_out: 0,
        scale_x: 100,
        scale_y: 100,
        spacing: 0,
        angle: 0,
        border_style: 1,
        outline: 1,
        shadow: 1,
        alignment: 2,
        margin_l: 10,
        margin_r: 10,
        margin_v: 10,
        encoding: 1,
        pyannote_auth_token: "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"
    };
    const pythonScriptPath = path.join(process.cwd(), 'video_processing.py');


// Convert the config to JSON and pass it to Python script
const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(config)]);

// Listen for data from Python script
pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data.toString()}`);
});

// Listen for errors
pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
});

// Handle the close event
pythonProcess.on('close', async (code) => {
  try {
    const startIndex = dirPath.indexOf('/videos');
const endIndex = dirPath.indexOf('/clips') + '/clips'.length;

const extractedPath = dirPath.substring(startIndex, endIndex);

    // Read all files from the directory
    const files = fs.readdirSync(dirPath);

    // Filter only .mp4 files and construct full paths
    const clipsArray = files
      .filter(file => file.endsWith('.mp4')) // Filter for only .mp4 files
      .map(file => path.join(extractedPath, file)); // Create full path for each file

    // Loop through the array and store each path in the database
    for (let clipPath of clipsArray) {
      // Insert each path into the database
      await createVideoClip({"clipPath":clipPath,"videoId":videoId})
    }
    const updatedSubscriptionUsage = await prisma.subscriptionUsage.update({
      where: {
        id: latestSubscriptionUsage.id,
      },
      data: {
        clip_count: latestSubscriptionUsage.clip_count + clipsArray.length,
        upload_count: latestSubscriptionUsage.upload_count + 1,
         
      },
    });

    console.log('All video clips have been processed and stored successfully.');
    return  res.json({status:'clips created',message:'video clips created'})
  } catch (err) {
    console.error('Error while processing video clips:', err);
  }
});


      // python code end 
      return false;
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload file', error: 'error exist' });
    }
      console.log(firstVar)
      return false;
}


