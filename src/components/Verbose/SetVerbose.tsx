'use client';

import { useEffect } from 'react';

const SetVerbose = () => {
  useEffect(() => {
    const callback = async (event: KeyboardEvent) => {
      if (event.altKey && event.code === 'KeyV') {
        const { access, verbose } = await fetch('/api/verbose').then(
          (response) => response.json(),
        );

        if (!access) {
          return;
        }
        window.alert(`verbose: ${verbose ? 'ON' : 'OFF'}`);
        location.reload();
      }
    };
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, []);

  return null;
};

export { SetVerbose };
