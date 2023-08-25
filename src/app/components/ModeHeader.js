import React, { useEffect, useState } from 'react';

export default function ModeHeader({ mode }) {
  const [modeHeader, setModeHeader] = useState('');
  useEffect(() => {
    switch (mode) {
      case 'comments':
        setModeHeader(
          <>
            Analyze the comments of a YouTube video.
            <br />
            Add a <span className="font-bold">VIDEO URL</span> below.
          </>
        );
        break;
      case 'brain-storm-from-channels':
        setModeHeader(
          <>
            Get a list of topic suggestions and title templates to kick-start
            your ideation process
            <br />
            Add a <span className="font-bold">CHANNEL URL</span> below.
          </>
        );
        break;
      case 'categorize-vids':
        setModeHeader(
          <>
            See how topics perform on a channel over time
            <br />
            Add a <span className="font-bold">CHANNEL URL</span> below.
          </>
        );
        break;
    }
    localStorage.setItem('modeHeader', modeHeader);
    localStorage.setItem('mode', mode);
  }, [mode]);
  return <>{modeHeader}</>;
}
