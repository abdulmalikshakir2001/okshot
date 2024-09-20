import Head from 'next/head';
import { NextPageWithLayout } from 'types';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Link from 'next/link';
import { IoDownloadOutline, IoFilmOutline } from 'react-icons/io5';


const FetchingVideo: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [videoClips, setVidoClips] = useState<any[]>([]);

  useEffect(() => {
    axios
      .post('/api/videoClips/getAllClips', {
        videoIdForClips: id,

      })
      .then((res) => {
        console.log(res.data.data)
        setVidoClips(res.data.data)

      });

  }, [id])

  const handleEditClick = (clipSrc: string) => {
    router.push({
      pathname: '/editor',
      query: { src: clipSrc },  // Pass clipSrc as query parameter
    });
  };

  return (
    <>
      <Head>
        <title>{`${t('moments')}`}</title>
      </Head>
      <div>

        <Link href={`/dashboard`} passHref>
          <button

            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {t('home')}
          </button>
        </Link>

        <div className="flex flex-col gap-10 mt-7 w-full max-w-4xl">
        {videoClips.map((clip, index) => (
          clip.clipSrc ? (
            <div key={index} style={{ marginBottom: '20px' }} >
                <div className='flex items-center gap-8 ml-52'>
                  
                  <div style={{ borderRadius: '10px',  border: '2px solid #000000', overflow: "hidden", background: "black" }}>

                    <ReactPlayer 
                      url={clip.clipSrc} 
                      controls={true} 
                      width="280px"  
                      height="500px"
                      className='bg-black'
                      />

                  </div>

                  <div className=''>
                    <h3 className='text-center text-bold text-gray-500'>
                      <div className='flex justify-center items-center gap-2'> <span className='text-2xl uppercase font-bold text-gray-600 '>{t('title')}</span>  <span>{clip.title}</span> </div>
                    </h3>
                    <div className='flex gap-3 mt-3'>

                        <button onClick={() => handleEditClick(clip.clipSrc)}  className='bg-blue-500 flex justify-center items-center gap-2 text-white px-4 py-2 rounded'> <IoFilmOutline />  Edit</button>

                        <a
                          href={clip.clipSrc}
                          download
                          className='border-2 flex justify-center items-center gap-2 shadow-lg px-4 py-2 rounded'
                        >
                          <IoDownloadOutline /> {t('download')}
                        </a>
                    </div>
                    
                    
                  </div>
                  
                </div>
            </div>
          ) : null
        ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;





  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),

    },
  };
};

export default FetchingVideo;
