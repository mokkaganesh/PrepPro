"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

function Page({ params }) {
  const [fullScreen, setFullScreen] = useState(false);
  const router = useRouter();

  const handleRequest = () => {
    router.push(`/dashboard/exam/${params?.examid}/start`);
  };

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      setFullScreen(true);
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter full screen:", err);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      setFullScreen(false);
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit full screen:", err);
      });
    }
  };

  // Disable right-click and prevent "Esc" from exiting full-screen mode
  useEffect(() => {
    const disableRightClick = (event) => {
      event.preventDefault();
    };

    const handleKeydown = (event) => {
      if (event.key === 'Esc' && fullScreen) {
        event.preventDefault();
        console.log('Escape key press ignored in full-screen mode');
      }
    };

    if (fullScreen) {
      document.addEventListener('contextmenu', disableRightClick);
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [fullScreen]);

  return (
    <div className='mt-5'>
      <div className="mt-5">
        <Button onClick={enterFullScreen} disabled={fullScreen} className="mr-2">
          Enter Full Screen
        </Button>
        <Button disabled={!fullScreen} onClick={exitFullScreen}>
          Exit Full Screen
        </Button>
      </div>
      <div className='mt-5'>
        {fullScreen && <Button onClick={handleRequest}>Start Exam</Button>}
      </div>
    </div>
  );
}

export default Page;
