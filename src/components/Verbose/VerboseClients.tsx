'use client';

import { useState, useEffect } from 'react';
import { SetVerbose } from './SetVerbose';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const VerboseClients = () => {
  const [verbose, setVerbose] = useState(false);

  useEffect(() => {
    const verboseCookie = getCookie('verbose');
    if (verboseCookie) {
      setVerbose(!!verboseCookie);
    }
  }, []);

  return (
    <>
      <SetVerbose />
    </>
  );
};

export { VerboseClients };
