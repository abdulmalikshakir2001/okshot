import { useState } from 'react';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { Loading } from '@/components/shared';

const TextToImage: NextPageWithLayout = () => {
    const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (prompt.trim()) {
      try {
        setLoading(true);
        const response = await axios.post('/api/textToImage/textToImage', { prompt }, {
          responseType: 'blob' // Ensure the response is treated as a binary file (blob)
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ai_image.png'); // Specify the filename for the download
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link); // Clean up the DOM
        setPrompt('')
        setLoading(false);

        
        console.log('Image generated and downloading...');
      } catch (error) {
        console.error('Error generating image:', error);
        alert('There was an issue generating the image.');
      }
    } else {
      alert('Please enter a prompt to generate the image.');
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2 flex flex-col">
        <textarea
          className="textarea textarea-primary w-full"
          placeholder="Describe the prompt to generate AI image"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} // Update prompt state on change
        ></textarea>
        <button className="btn self-end mt-4" onClick={handleGenerate}>
          {"Generate Image"}
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

export default TextToImage;
