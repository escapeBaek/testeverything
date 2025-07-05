import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const ReactionTime: React.FC = () => {
  const [phase, setPhase] = useState('waiting'); // waiting, ready, go, clicked
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setPhase('ready');
    setStartTime(0);
    setEndTime(0);

    const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
    timeoutRef.current = setTimeout(() => {
      setPhase('go');
      setStartTime(performance.now());
    }, randomDelay);
  };

  const handleClick = () => {
    if (phase === 'ready') {
      // Too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase('too-early');
    } else if (phase === 'go') {
      setEndTime(performance.now());
      setPhase('clicked');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Reaction Time Test',
          text: 'Challenge your friends! How fast are your reflexes?',
          url: window.location.href,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert(`Share this link to challenge your friends: ${window.location.href}\n\n(Sharing not supported on this browser.)`);
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'waiting':
        return (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Click the button below to start the test.</p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        );
      case 'ready':
        return (
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600 animate-pulse">Wait for Green...</p>
          </div>
        );
      case 'go':
        return (
          <div className="text-center">
            <div className="w-48 h-48 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce-slow cursor-pointer"
                 onClick={handleClick}>
              <span className="text-white text-5xl font-extrabold">CLICK!</span>
            </div>
          </div>
        );
      case 'clicked':
        const reactionTime = (endTime - startTime).toFixed(2);
        return (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-700 mb-4">Your Reaction Time:</p>
            <p className="text-6xl font-extrabold text-blue-800 mb-8">{reactionTime} ms</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={startTest}
                className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
              >
                Try Again
              </button>
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300"
              >
                Share Test
              </button>
            </div>
          </div>
        );
      case 'too-early':
        return (
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600 mb-4">Too Early!</p>
            <p className="text-2xl text-gray-700 mb-8">You clicked before the green light appeared.</p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Reaction Time Test</h1>
        {renderContent()}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-300 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H16a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReactionTime;
