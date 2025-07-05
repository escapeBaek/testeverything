import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NumberSequence: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('start'); // start, display, input, result
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const generateSequence = (currentLevel: number) => {
    const newSequence: number[] = [];
    const length = currentLevel + 2; // Sequence length increases with level
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1); // Numbers 1-9
    }
    setSequence(newSequence);
    setInput('');
    setMessage('');
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setPhase('display');
    generateSequence(1);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'display') {
      timer = setTimeout(() => {
        setPhase('input');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, sequence.length * 700 + 1000); // Display time based on sequence length
    }
    return () => clearTimeout(timer);
  }, [phase, sequence.length]);

  const handleSubmit = () => {
    const inputNumbers = input.split('').map(Number);
    const isCorrect = sequence.every((num, index) => num === inputNumbers[index]);

    if (isCorrect && inputNumbers.length === sequence.length) {
      setScore(score + 1);
      setLevel(level + 1);
      setMessage('Correct! Moving to next level...');
      setTimeout(() => {
        setPhase('display');
        generateSequence(level + 1);
      }, 1500);
    } else {
      setMessage(`Game Over! Your score: ${score}. Correct sequence was: ${sequence.join('')}`);
      setPhase('result');
    }
  };

  const resetGame = () => {
    setPhase('start');
    setSequence([]);
    setInput('');
    setLevel(1);
    setScore(0);
    setMessage('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Number Sequence Test',
          text: `I scored ${score} on the Number Sequence Test! Can you beat me?`,
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
      case 'start':
        return (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Remember the sequence of numbers and type them back!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        );
      case 'display':
        return (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-4">Remember this sequence:</p>
            <div className="text-6xl font-extrabold text-blue-800 animate-pulse">
              {sequence.map((num, index) => (
                <span key={index} className="mx-2">{num}</span>
              ))}
            </div>
          </div>
        );
      case 'input':
        return (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-4">What was the sequence?</p>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
              className="w-full max-w-md p-4 text-center text-4xl font-bold rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter numbers..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              className="mt-6 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        );
      case 'result':
        return (
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600 mb-4">{message.split('.')[0]}</p>
            <p className="text-2xl text-gray-700 mb-8">{message.split('.')[1]}</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-purple-700 transition duration-300"
              >
                Play Again
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Number Sequence Test</h1>

        <div className="flex justify-between text-2xl font-semibold mb-6">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
        </div>

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

export default NumberSequence;
