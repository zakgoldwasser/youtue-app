import React from 'react';

export default function CommentOpenAIResults(props) {
  const { openAIresults } = props;
  console.log(openAIresults, 'openAIresults');
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">
        Comment Insights
      </label>
      {openAIresults.text.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}
