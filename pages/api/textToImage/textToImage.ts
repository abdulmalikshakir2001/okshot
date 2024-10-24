import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
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
        res.setHeader('Allow', ['POST']);
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
  const { prompt }: any = req.body;
  const session = await getSession(req, res); // session?.user.id
  const directoryPath = path.join(
    process.cwd(),
    'ai_features',
    'uploads',
    session?.user.id as string
  ); // path for config options

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  try {
    const config = {
      path: directoryPath,
      prompt: prompt,
    };

    const pythonScriptPath = path.join(
      process.cwd(),
      'ai_features',
      'text_img_video',
      'text_to_image.py'
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
      const filePath = path.join(directoryPath, 'ai_image.png');

      // Ensure the file exists before streaming
      if (fs.existsSync(filePath)) {
        // Set the headers for the response to prompt a file download in the browser
        res.setHeader('Content-Disposition', `attachment; filename=ai_image.png`);
        res.setHeader('Content-Type', 'image/png');

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
};
