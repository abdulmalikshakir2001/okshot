import { useState, useRef } from 'react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios'; // Import axios
import type { NextPageWithLayout } from 'types';
import Image from 'next/image';
import { Loading } from '@/components/shared';

const ImageToVideo: NextPageWithLayout = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [loading1, setLoading1] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreview = URL.createObjectURL(file);
      setImage(file);
      setPreview(newPreview);
      
      // Revoke previous preview URL to free memory
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  };

  const handleCancelUpload = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // Reset the input field
    }

    if (preview) {
      URL.revokeObjectURL(preview); // Free up memory
    }
    setImage(null);
    setPreview(null);
  };

  const handleSendToServer = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', image); // Append the image to the formData
  
      setLoading(true); // Set loading state
  
      try {
        // Make the API request with responseType as 'blob' to handle binary data (the video file)
        setLoading1(true)
        const response = await axios.post('/api/imageToVideo/imageToVideo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
        setLoading1(false)
  
        console.log('Video generated and downloading...');
        setLoading(false); // Reset loading state after successful download
      } catch (error) {
        console.error('Error uploading image or downloading video:', error);
        setLoading(false); // Reset loading state on error
        alert('There was an issue generating or downloading the video.');
      }
    } else {
      alert('No image uploaded');
    }
  };
  if (loading1) {
    return <Loading />;
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      

      <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center space-y-6">
        {!image && (
          <label
            className="w-full h-64 border-4 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer bg-white shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16l5-5m0 0l5 5m-5-5v12M21 4H3"
              />
            </svg>
            <span className="text-gray-500 text-lg font-medium">{"Upload Image To Generate AI Video"}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}

        {preview && (
          <div className="relative mt-4 w-full h-64 flex justify-center items-center">
            <Image
              src={preview}
              alt="Uploaded"
              width={256}
              height={256}
              className="object-cover border rounded-lg shadow-lg w-full h-full"
            />
            <button
              onClick={handleCancelUpload}
              className="absolute -top-5 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none"
            >

                
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {image && (
          <button
          className={`btn w-full py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          onClick={handleSendToServer}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
        )}
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

export default ImageToVideo;
