import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Never underestimate the power of a good book.",
  "Innovation distinguishes between a leader and a follower.",
  "The only way to do great work is to love what you do.",
  "Life is what happens when you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The journey of a thousand miles begins with a single step.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "The best way to predict the future is to create it."
];

const TypingSpeed: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentText(texts[randomIndex]);
    setInputText('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    setGameStarted(false);
    setGameFinished(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(performance.now());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateResults = () => {
    if (startTime === null) return;

    const timeTakenSeconds = ((endTime || performance.now()) - startTime) / 1000;
    const wordsTyped = inputText.split(' ').filter(word => word !== '').length;
    const calculatedWpm = (wordsTyped / timeTakenSeconds) * 60;
    setWpm(Math.round(calculatedWpm));

    let correctChars = 0;
    const minLength = Math.min(inputText.length, currentText.length);
    for (let i = 0; i < minLength; i++) {
      if (inputText[i] === currentText[i]) {
        correctChars++;
      }
    }
    const calculatedAccuracy = (correctChars / currentText.length) * 100;
    setAccuracy(Math.round(calculatedAccuracy));
    setGameFinished(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!gameStarted || gameFinished) return;

    const value = e.target.value;
    setInputText(value);

    if (value === currentText) {
      setEndTime(performance.now());
      calculateResults();
    }
  };

  const getCharClass = (char: string, index: number) => {
    if (index < inputText.length) {
      return char === inputText[index] ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-500';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Typing Speed Test',
          text: `I typed at ${wpm} WPM with ${accuracy}% accuracy! Can you beat me?`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Typing Speed Test</h1>

        {!gameStarted && !gameFinished ? (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Type the given text as fast and accurately as you can!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        ) : gameFinished ? (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">Test Complete!</p>
            <p className="text-2xl text-gray-700 mb-2">Your WPM: <span className="font-extrabold text-blue-800">{wpm}</span></p>
            <p className="text-2xl text-gray-700 mb-8">Accuracy: <span className="font-extrabold text-blue-800">{accuracy}%</span></p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={resetGame}
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
        ) : (
          <>
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-6">
              <p className="text-xl leading-relaxed">
                {currentText.split('').map((char, index) => (
                  <span key={index} className={getCharClass(char, index)}>
                    {char}
                  </span>
                ))}
              </p>
            </div>
            <textarea
              ref={inputRef}
              className="w-full p-4 text-xl rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
              rows={5}
              value={inputText}
              onChange={handleInputChange}
              placeholder="Start typing here..."
            ></textarea>
            <div className="text-center mt-6">
              <p className="text-xl text-gray-700">Time: {startTime ? ((performance.now() - startTime) / 1000).toFixed(1) : '0.0'}s</p>
            </div>
          </>
        )}

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

export default TypingSpeed;
