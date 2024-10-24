import { useState } from 'react';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';

const TextToVideo: NextPageWithLayout = () => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (prompt.trim()) {
      try {
        // Make the API request with responseType as 'blob' to handle binary data
        const response = await axios.post('/api/textToVideo/textToVideo', { prompt }, {
          responseType: 'blob', // This ensures the response is treated as a file
        });

        // Create a URL for the video file
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ai_video.mp4'); // Specify the filename for the download
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger the download
        link.parentNode?.removeChild(link); // Clean up the link after download

        console.log('Video generated and downloading...');
      } catch (error) {
        console.error('Error generating video:', error);
        alert('There was an issue generating the video.');
      }
    } else {
      alert('Please enter a prompt to generate the video.');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2 flex flex-col">
        <textarea
          className="textarea textarea-primary w-full"
          placeholder="Describe the prompt to generate AI Video"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} // Update prompt state on change
        ></textarea>
        <button className="btn self-end mt-4" onClick={handleGenerate}>
          {"Generate Video"}
        </button>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default TextToVideo;
