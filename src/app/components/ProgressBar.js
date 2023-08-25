import React, { useState, useEffect } from 'react';
import './ProgressBarStyle.css';

export default function ProgressBar({
  loading,
  openAiResults,
  setOpenAILoader,
}) {
  const [progressBarValue, setProgressBarValue] = useState(0);

  useEffect(() => {
    if (Object.keys(openAiResults).length > 0) {
      setProgressBarValue(100);
    }
    if (loading) {
      let progressInterval = setInterval(() => {
        setProgressBarValue((prevValue) => {
          if (prevValue >= 95) {
            clearInterval(progressInterval);
            return prevValue;
          }
          return prevValue + 1; // increment by 1
        });
      }, 1200); // 2 minutes => 120000 ms. Divided by 100 to get each 1% increment
      return () => {
        clearInterval(progressInterval);
      };
    }
    // Reset when the OpenAI results are received
  }, [loading, openAiResults]);

  useEffect(() => {
    if (progressBarValue === 100) {
      setTimeout(() => {
        setOpenAILoader(false);
      }, 250);
    }
  }, [progressBarValue]);
  return (
    <>
      <div className="py-1 px-2 w-1/2 mx-auto bg-neutral-300 rounded-full">
        <div
          className="progress-bar rounded-full bg-pink-500"
          style={{ width: `${progressBarValue}%` }}
        ></div>
      </div>
    </>
  );
}
