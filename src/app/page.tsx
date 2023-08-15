'use client';
import ThemeSwitch from '@/components/core/ThemeSwitch';
import { MainInfo } from '@/components/modules/MainInfo';
import client from '@/lib/client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  // const fetchData = useCallback(async () => {
  //   const query = `*[_type == "users"]`;
  //   const res = await client.fetch(query);
  //   console.log(res);
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);
  return (
    <main
      className="min-h-screen w-full h-full"
      style={{
        color: 'var(--color-text)',
        background: 'var(--color-background)',
      }}
    >
      <MainInfo />
    </main>
  );
}
