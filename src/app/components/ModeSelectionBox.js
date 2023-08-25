import React from 'react';

export default function ModeSelectionBox({ mode, updateMode }) {
  return (
    <div
      id="mode-selection-box"
      className="mt-3 flex flex-col sm:flex-row justify-center text-xs sm:text-sm font-medium text-gray-600 items-center whitespace-nowrap"
    >
      <span className="font-bold">Mode:</span>
      <label className="ml-3 flex items-center">
        <input
          type="radio"
          value="comments"
          checked={mode === 'categorize-vids'}
          onChange={() => updateMode('categorize-vids')}
        />
        See Category Trends
      </label>
      <label className="ml-3 flex items-center">
        <input
          type="radio"
          value="comments"
          checked={mode === 'comments'}
          onChange={() => updateMode('comments')}
        />
        Analyze Comments
      </label>
      <label className="ml-3 flex items-center">
        <input
          type="radio"
          value="comments"
          checked={mode === 'brain-storm-from-channels'}
          onChange={() => updateMode('brain-storm-from-channels')}
        />
        Brainstorm Helper
      </label>
    </div>
  );
}
