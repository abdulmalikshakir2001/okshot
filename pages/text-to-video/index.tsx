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
        const response = await axios.post('/api/textToVideo', { prompt });
        console.log('Image generated:', response.data);
        // Handle the response, e.g., display the generated image or show a success message
      } catch (error) {
        console.error('Error generating image:', error);
        // Handle the error, e.g., show an error message
      }
    } else {
      alert('Please enter a prompt to generate the image.');
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
