import Head from 'next/head';
import { NextPageWithLayout } from 'types';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { getVideoById } from 'models/uploadedVideo';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import {  Loading } from '@/components/shared';


const FetchingVideo: NextPageWithLayout = ({
  originalLink,
  conVideoId,
}: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [loading,setLoading] = useState(false);

  const handleCreateClips = async () => {
    // setLoading(true)
    axios.post('/api/videoClips/clips', {
      originalLink: originalLink,
      videoId: id,
  })
  .then(response => {
    if(response.data.status === 'clips created'){
      router.push(`/videos/moments/${id}`)
    }
      console.log('Response:', response.data.status);
  })
  .catch(error => {
      console.error('Error:', error);
  });

    

    
  };

  

  


  if(loading){
    return <Loading />
  }
  

  return (
    <>
      <Head>
        <title>{`${t('create-clips')}`}</title>
      </Head>
      <div className="flex justify-center">
        <div className="create_clips_section flex gap-4 w-full md:w-3/4">
          <div className="flex-1">
            <ReactPlayer url={originalLink} width="100%" controls={true} />
          </div>
          <div className="flex-1 flex items-end">
            <button
              onClick={handleCreateClips}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t('create-clips')}
            </button>




          </div>
        </div>
      </div>
      
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;
  const { id }: any = context.params;

  const { originalLink, conVideoId }: any = await getVideoById(id);

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      originalLink,
      conVideoId,
    },
  };
};

export default FetchingVideo;
