'use client';

import { useEffect } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

interface HomeProps {
  id: string | string [] |undefined; // Define the prop type
}

export default function Home({id}:HomeProps) {
  const router = useRouter();

  useEffect(() => {
    const socket = io();
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('videoClipUpdate', () => {
      router.push(`/videos/moments/${id}`)

    });

    
  }, []);

  return (
    <></>
  );
}