import React from 'react';

export default function OpenAILoader({ mode }) {
  function renderMode(mode) {
    switch (mode) {
      case 'brain-storm-from-channels':
        return <div>Ideating</div>;
      case 'comments':
        return <div>Analyzing Comments</div>;
      case 'categorize-vids':
        return <div>Categorizing Videos</div>;
      default:
        return <div>Unknown Mode</div>;
    }
  }
  return (
    <div className="mt-5 flex flex-col justify-center items-center">
      <div className="mb-5 spinner "></div>
      {renderMode(mode)}
    </div>
  );
}
