// pages/index.js
'use client';
import { useState, useEffect } from 'react';

import './cursor.css';
import InputBar from './components/InputBar';
import TabButton from './components/TabButton';
import VidSuggestionYTResults from './components/VidSuggestionYTResults';
import VidSuggestionOpenAIResults from './components/VidSuggestionOpenAIResults';

import AnalyzeCommentsYTResults from './components/AnalyzeCommentsYTResults';
import CommentOpenAIResults from './components/CommentOpenAIResults';

import CategorizeOpenAIResults from './components/CategorizeOpenAIresults';
import OpenAILoader from './components/OpenAILoader';
import ModeHeader from './components/ModeHeader';
import ModeSelectionBox from './components/ModeSelectionBox';

import ProgressBar from './components/ProgressBar';

export default function Home() {
  const [inputURL, setInputURL] = useState('');
  const [openTab, setOpenTab] = useState(false);
  const [secondaryInput, setSecondaryInput] = useState('');

  const [ytDataResults, setYTDataResults] = useState({});
  const [openAiResults, setOpenAiResults] = useState({});

  const [loading, setLoading] = useState(false);
  const [openAILoader, setOpenAILoader] = useState(false);

  const [mode, setMode] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    setYTDataResults(
      localStorage.getItem('ytDataResults')
        ? JSON.parse(localStorage.getItem('ytDataResults'))
        : {}
    );
    setOpenAiResults(
      localStorage.getItem('openAiResults')
        ? JSON.parse(localStorage.getItem('openAiResults'))
        : {}
    );
    setMode(
      localStorage.getItem('mode')
        ? localStorage.getItem('mode')
        : 'categorize-vids'
    );
  }, []);

  useEffect(() => {
    if (errorMessage && showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (errorMessage && !showError) {
      setShowError(true);
    }
  }, [errorMessage]);

  function updateMode(newMode) {
    setMode(newMode);
    setSecondaryInput('');
    setYTDataResults({});
    setOpenAiResults({});
    localStorage.setItem('ytDataResults', JSON.stringify({}));
    localStorage.setItem('openAiResults', JSON.stringify({}));
  }

  const makeAPICall = async (apiEndpoint, messageBody) => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPromise = fetch(apiEndpoint, {
      method: 'POST',
      body: JSON.stringify(messageBody),
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        controller.abort(); // Cancel the fetch request
        reject(new Error('Request timed out'));
      }, 120000)
    );
    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`Failed to post videoId. Status: ${response.status}`);
      }

      const resultData = await response.json();
      console.log(resultData);
      return resultData;
    } catch (error) {
      setErrorMessage('There was an error with the request please try again');
      setLoading(false);
      setOpenAILoader(false);
    }
  };

  async function fetchResults(e) {
    e.preventDefault();
    setLoading(true);
    let apiEndpoint;
    let messageBody;
    let textAnalysisEndPoint;
    if (!inputURL.includes('youtube.com/')) {
      setLoading(false);
      setErrorMessage("The input URL must contain 'youtube.com/'");
      return;
    }
    switch (mode) {
      case 'comments':
        apiEndpoint = '/api/get-comments';
        const videoId = inputURL.split('v=')[1];
        if (!videoId) {
          setLoading(false);
          setErrorMessage("No video ID found in URL for 'comments' mode.");
          return;
        }
        messageBody = { videoId };
        textAnalysisEndPoint = '/api/analyze-video';
        break;
      case 'brain-storm-from-channels': // You can add other modes and API endpoints here
        apiEndpoint = '/api/get-top-vids-from-channel';
        const channelUserNameForBrainStorm = inputURL
          .split('/@')[1]
          ?.split('/')[0];
        if (!channelUserNameForBrainStorm) {
          setLoading(false);
          setErrorMessage(
            'The url format must be youtube.com/@xyz to use the brainstorm helper'
          );
          return;
        }
        messageBody = {
          channelUserName: channelUserNameForBrainStorm,
        };
        textAnalysisEndPoint = '/api/brain-storm-from-channels';
        break;
      case 'categorize-vids':
        apiEndpoint = '/api/get-top-vids-from-channel';
        const channelUserNameForCategorize = inputURL
          .split('/@')[1]
          ?.split('/')[0];
        if (!channelUserNameForCategorize) {
          setLoading(false);
          setErrorMessage(
            "To see category trends the url format must be 'youtube.com/@xyz'"
          );
          return;
        }
        messageBody = {
          channelUserName: channelUserNameForCategorize,
        };
        textAnalysisEndPoint = '/api/categorize-vids';
        break;
    }

    const resultsFromYT = await makeAPICall(apiEndpoint, messageBody);
    setYTDataResults(resultsFromYT ? resultsFromYT : {});
    console.log(resultsFromYT);
    if (!resultsFromYT) {
      return;
    }
    resultsFromYT &&
      localStorage.setItem('ytDataResults', JSON.stringify(resultsFromYT));

    setLoading(false);
    setOpenAILoader(true);
    const resultsFromOpenAI = await makeAPICall(textAnalysisEndPoint, {
      videoData: resultsFromYT.commentsData
        ? resultsFromYT.commentsData
        : resultsFromYT.videosData,
      secondaryInput: secondaryInput,
      channelUserName: messageBody.channelUserName,
    });

    if (!resultsFromOpenAI) {
      return;
    }
    setOpenAiResults(resultsFromOpenAI ? resultsFromOpenAI : {});
    resultsFromOpenAI &&
      localStorage.setItem('openAiResults', JSON.stringify(resultsFromOpenAI));
  }

  return (
    <div className="min-h-screen bg-gradient flex flex-col items-center justify-start">
      <div className="mt-10 w-full xs:w-3/4 md:w-1/2">
        <h1 className="text-xl sm:text-2xl mb-6 font-semibold text-center text-gray-700">
          YouTube Analyzer
        </h1>

        <form onSubmit={fetchResults} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              <ModeHeader mode={mode} />
            </label>
            <div
              className={`mx-auto rounded-full h-7 my-3 flex items-center justify-center w-3/4 ${
                errorMessage && showError ? 'bg-red-200 text-white' : ''
              }`}
            >
              {errorMessage && showError ? errorMessage : null}
            </div>
            <div className="relative flex flex-col items-center w-full">
              <InputBar
                inputURL={inputURL}
                setInputURL={setInputURL}
                openTab={openTab}
                mode={mode}
              />
              <TabButton
                openTab={openTab}
                setOpenTab={setOpenTab}
                mode={mode}
                secondaryInput={secondaryInput}
                setSecondaryInput={setSecondaryInput}
              />
            </div>
            <ModeSelectionBox mode={mode} updateMode={updateMode} />
          </div>
        </form>
      </div>
      {loading && (
        <div className="mt-5 mx-auto">
          <div className="spinner mx-auto "></div>
        </div>
      )}

      {/*DATA FROM APIS*/}
      {Object.keys(ytDataResults).length > 0 && !loading && (
        <div className="my-10 rounded-md w-full xs:w-3/4 md:w-1/2 space-y-4 input-shadow p-5 sm:p-10 text-gray-700 flex flex-col justify-center items-center">
          {/*RETURN YT DATA*/}
          {(mode == 'brain-storm-from-channels' ||
            mode == 'categorize-vids') && (
            <VidSuggestionYTResults
              channelTitle={ytDataResults.channelTitle}
              channelThumbnail={ytDataResults.channelThumbnail}
            />
          )}
          {mode == 'comments' && (
            <AnalyzeCommentsYTResults
              vidTitle={ytDataResults.title}
              vidThumbnail={ytDataResults.thumbnail_url}
            />
          )}
          {openAILoader && (
            <ProgressBar
              loading={openAILoader}
              openAiResults={openAiResults}
              setOpenAILoader={setOpenAILoader}
            />
          )}
          {/*RETURN OPENAI DATA*/}
          {openAILoader ? (
            <>
              <OpenAILoader mode={mode} />
            </>
          ) : (
            (openAiResults.mode == 'brain-storm-from-channels' && (
              <VidSuggestionOpenAIResults openAIresults={openAiResults} />
            )) ||
            (openAiResults.mode == 'comments' && (
              <CommentOpenAIResults openAIresults={openAiResults} />
            )) ||
            (openAiResults.mode == 'categorize-vids' && (
              <CategorizeOpenAIResults openAIresults={openAiResults} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
