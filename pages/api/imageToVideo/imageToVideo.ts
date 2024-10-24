import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import fs from 'fs'; // Use fs for synchronous file checks
import path from 'path';
import formidable, { File as FormidableFile } from 'formidable';
import { spawn } from 'child_process';

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


    try {
        const config = {
          inputFilePath: filePath,
          outputPath:videosDir
        };
    
        const pythonScriptPath = path.join(
          process.cwd(),
          'ai_features',
          'text_img_video',
          'image_to_video.py'
        );
    
        console.log('spawn process begins to start');
    
        const pythonProcess = spawn(
          path.join(process.cwd(), 'ai_features', 'text_img_video', 'myenv', 'Scripts', 'python.exe'),
          [pythonScriptPath, JSON.stringify(config)]
        );
    
        // Listen for data from Python script
        pythonProcess.stdout.on('data', (data) => {
          console.log(`${data.toString()}`);
        });
    
        // Listen for errors
        pythonProcess.stderr.on('data', (data) => {
          console.error(`Error: ${data.toString()}`);
        });
    
        // Handle the close event
        pythonProcess.on('close', async () => {
          const filePath = path.join(videosDir, 'ai_img_to_video.mp4');
    
          // Ensure the file exists before streaming
          if (fs.existsSync(filePath)) {
            // Set the headers for the response to prompt a file download in the browser
            res.setHeader('Content-Disposition', `attachment; filename=ai_video.mp4`);
            res.setHeader('Content-Type', 'video/mp4');
    
            // Create a read stream and pipe it to the response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
    
            // Handle stream errors
            fileStream.on('error', (error) => {
              console.error('Stream error:', error);
              res.status(500).json({ message: 'Error streaming the file' });
            });
    
            // End the response once the file is fully sent
            fileStream.on('end', () => {
              res.end();
            });
          } else {
            res.status(404).json({ message: 'File not found' });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Failed to generate file', error: 'error exists' });
      }
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
