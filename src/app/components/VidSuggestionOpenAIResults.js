import React from 'react';

export default function VidSuggestionOpenAIResults(props) {
  const { openAIresults } = props;
  console.log(openAIresults);
  return (
    <div className="mt-10">
      <label className=" text-sm font-medium text-gray-600">Suggestions</label>
      {openAIresults.text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}
