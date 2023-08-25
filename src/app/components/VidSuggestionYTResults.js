import React, { useState, useEffect } from 'react';
import './VidSuggestionYTResults.css';

export default function VidSuggestionYTResults(props) {
  const { channelTitle, channelThumbnail } = props;
  const [loaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0); // Counter to limit retries
  const maxRetries = 3;

  useEffect(() => {
    if (channelThumbnail) {
      setLoaded(true);
    }
  }, [channelThumbnail]);

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // Increase the retry count
      setRetryCount(retryCount + 1);

      // Force re-render to attempt to load the image again
      setLoaded(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl">Channel: {channelTitle}</h2>
      {channelThumbnail && (
        <div className="space-y-10 relative w-1/6 ">
          <img
            src={channelThumbnail.url}
            alt={channelTitle}
            className={`rounded-full input-shadow ${
              loaded ? 'bounce-in-up' : ''
            }`}
            onLoad={() => {
              setRetryCount(0);
              setLoaded(true);
            }}
            onError={handleImageError}
          />
        </div>
      )}
    </>
  );
}
