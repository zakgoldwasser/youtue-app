import React, { useState, useEffect, useRef } from 'react';

export default function InputBar({ inputURL, setInputURL, openTab, mode }) {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [timeouts, setTimeouts] = useState([]);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const shouldAnimateRef = useRef(true);
  let placeholderTexts = ['Enter your YouTube URL'];
  const typingSpeed = 100;
  const pauseDuration = 1000;
  let currentIndex = 0;

  const clearAllTimers = () => {
    timeouts.forEach((timer) => clearTimeout(timer));
    setTimeouts([]);
  };

  useEffect(() => {
    if (!shouldAnimate) return;
    const typeText = (text, callback) => {
      for (let i = 0; i <= text.length; i++) {
        const currentTimer = setTimeout(() => {
          if (shouldAnimateRef.current) {
            // Use the ref's value here
            setAnimatedPlaceholder(text.substr(0, i));
            if (i === text.length && callback) callback();
          }
        }, typingSpeed * i);
        setTimeouts((prevTimeouts) => [...prevTimeouts, currentTimer]);
      }
    };

    const backspaceText = (text, callback) => {
      for (let i = text.length; i >= 0; i--) {
        const currentTimer = setTimeout(() => {
          if (shouldAnimateRef.current) {
            // Use the ref's value here
            setAnimatedPlaceholder(text.substr(0, i));
            if (i === 0 && callback) callback();
          }
        }, typingSpeed * (text.length - i));
        setTimeouts((prevTimeouts) => [...prevTimeouts, currentTimer]);
      }
    };
    const animateTexts = () => {
      if (!shouldAnimate) return;

      if (currentIndex === placeholderTexts.length) {
        currentIndex = 0; // Reset to start from the beginning
      }

      const currentText = placeholderTexts[currentIndex];
      typeText(currentText, () => {
        setTimeout(() => {
          backspaceText(currentText, () => {
            currentIndex++;
            animateTexts(); // Move to the next text
          });
        }, pauseDuration);
      });
    };
    animateTexts();

    return () => {
      clearAllTimers();
    };
  }, [shouldAnimate]);

  const handleInputClick = () => {
    clearAllTimers();
    setAnimatedPlaceholder('');
    setShouldAnimate(false);
    setIsCursorVisible(false);
  };
  const handleBlur = () => {
    console.log(handleBlur);
    if (!inputURL) {
      clearAllTimers();
      setShouldAnimate(true);
      setIsCursorVisible(true);
      setAnimatedPlaceholder('');
      currentIndex = 0;
    }
  };
  useEffect(() => {
    if (openTab) {
      clearAllTimers();
      setShouldAnimate(false);
    } else if (!openTab && !inputURL) {
      clearAllTimers();
      setShouldAnimate(true);
      setAnimatedPlaceholder('');
      currentIndex = 0;
    }
  }, [openTab, inputURL]);
  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate; // Update it whenever shouldAnimate changes
  }, [shouldAnimate]);
  return (
    <div className="bg-white mt-5 relative py-2 border rounded-full focus-within:ring focus-within:ring-pink-200 focus-within:border-pink-300 input-shadow z-10 w-full">
      <div
        className={
          inputURL ? 'hidden' : 'absolute px-4 py-2 pointer-events-none '
        }
      >
        {animatedPlaceholder}
        <span className={isCursorVisible ? 'cursor' : 'hidden'}>|</span>
      </div>
      <input
        className="w-full px-4 py-2 bg-transparent focus:outline-none"
        value={inputURL}
        onChange={(e) => {
          setInputURL(e.target.value);
          if (e.target.value) setAnimatedPlaceholder(''); // hide animation once the user starts typing
        }}
        onClick={handleInputClick}
        onBlur={handleBlur}
        placeholder=""
      />
      <button
        style={{
          position: 'absolute',
          top: '50%',
          right: '12px',
          transform: 'translateY(-50%)',
        }}
        className="py-2 px-5 bg-pink-500 text-white rounded-full hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
        type="submit"
      >
        ➜
      </button>
    </div>
  );
}
