import React, { useState, useEffect } from 'react';
import './tabstyles.css';

export default function TabButton({
  openTab,
  setOpenTab,
  mode,
  secondaryInput,
  setSecondaryInput,
}) {
  const [showContent, setShowContent] = useState(false);
  const [marginTop, setMarginTop] = useState('-5px');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTransitionEnd = (event) => {
    (mode === 'categorize-vids' || mode === 'brain-storm-from-channels') &&
      setShowContent(openTab);
  };
  const handleClick = () => {
    if (openTab) {
      setSecondaryInput('');
      setShowContent(false);
    }
    setOpenTab(!openTab);
  };
  const handleInputClick = (e) => {
    e.stopPropagation(); // This stops the click event from propagating to the parent div
  };
  const handleInputFocus = () => {
    setIsFocused(true); // Add this line
  };

  const handleInputBlur = () => {
    !secondaryInput && setIsFocused(false); // Add this line
  };

  useEffect(() => {
    if (
      (mode === 'categorize-vids' || mode === 'brain-storm-from-channels') &&
      !openTab
    ) {
      setMarginTop('-7px');
    } else if (
      (mode === 'categorize-vids' || mode === 'brain-storm-from-channels') &&
      openTab
    ) {
      setMarginTop('0px');
    } else {
      setOpenTab(false);
      setShowContent(false);
      setMarginTop('-40px');
    }
  }, [mode, openTab]);

  const placeholders =
    mode === 'categorize-vids'
      ? [
          `"Health, Psychology, Relationships"`,
          `"Vlogs, Interviews, Current Events, Debates"`,
          `"Skin Care, Makeup, Hair, Sleep, Health"`,
        ]
      : [
          `"How to draw a bear"`,
          `"My vacation in Paris"`,
          `"Chest exercises at home"`,
        ];

  // Handle cycling placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prevIdx) => (prevIdx + 1) % placeholders.length);
    }, 3000); // Change placeholder every 3 seconds
    return () => clearInterval(interval);
  }, [mode]);

  // Handle setting placeholder text with animation
  useEffect(() => {
    setPlaceholderText(placeholders[placeholderIdx]);
  }, [placeholderIdx]);

  useEffect(() => {
    setAnimationClass(''); // Reset animation class
    setPlaceholderText(placeholders[placeholderIdx]);

    // Async operation to set the animation class
    requestAnimationFrame(() => {
      setAnimationClass('placeholder-animation');
    });
  }, [placeholderIdx]);

  useEffect(() => {
    setAnimationClass(''); // Reset animation class
    setPlaceholderText(placeholders[placeholderIdx]);

    // Async operation to set the animation class
    requestAnimationFrame(() => {
      setAnimationClass('placeholder-animation');
    });
  }, [mode, showContent]);

  return (
    <div
      className={` px-3 py-2   bg-neutral-300 rounded-b-xl hover:bg-neutral-200  text-s sm:text-md flex justify-center cursor-pointer ${
        !openTab ? 'w-1/6' : 'w-3/4'
      }`}
      style={{
        marginTop: marginTop,
        zIndex: '1',
        transition: 'margin-top .3s ease-in-out,width .3s ease-in-out',
      }}
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
    >
      {!showContent ? (
        '+'
      ) : (
        <div className="w-full flex text-sm text-slate-900 items-center">
          <div className="whitespace-nowrap">
            {mode == 'categorize-vids'
              ? 'List Desired Categories:'
              : 'Write Video Topic:'}
          </div>
          <div
            onClick={handleInputClick}
            className="relative flex-grow rounded p-1 ml-2 bg-white overflow-hidden"
          >
            <div
              className={`pointer-events-none absolute fake-placeholder ${animationClass} ${
                isFocused ? 'hidden' : ''
              }`}
            >
              {placeholderText}
            </div>
            <input
              className="w-full bg-none"
              onFocus={handleInputFocus} // Add this line
              onBlur={handleInputBlur} // Add this line
              value={secondaryInput} // Add this line
              onChange={(e) => setSecondaryInput(e.target.value)} // Add this line
            ></input>
          </div>
        </div>
      )}
    </div>
  );
}
