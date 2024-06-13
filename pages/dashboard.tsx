
import VideoUpload from '@/components/video/VideoUpload';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import {  useSession } from 'next-auth/react';

const Dashboard: NextPageWithLayout = () => {
  const {data} =  useSession();
  console.log(`=========================dash session`)
  console.log(data)
  return <>
  <VideoUpload />
  </>
  

  


};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;
