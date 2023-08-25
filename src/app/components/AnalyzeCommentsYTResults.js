import React, { useState, useEffect } from 'react';
import './VidSuggestionYTResults.css';

export default function AnalyzeCommentsYTResults(props) {
  const { vidTitle, vidThumbnail } = props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (vidThumbnail) {
      setLoaded(true);
    }
  }, [vidThumbnail]);
  return (
    <>
      <h2 className="text-2xl">Video: {vidTitle}</h2>
      {vidThumbnail && (
        <div
          className={`my-5 relative w-1/2 input-shadow ${
            loaded ? 'bounce-in-up' : ''
          }`}
        >
          <div style={{ paddingBottom: '56.25%' }}></div>
          <img
            src={vidThumbnail}
            alt={vidTitle}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onLoad={() => setLoaded(true)}
          />
        </div>
      )}
    </>
  );
}
