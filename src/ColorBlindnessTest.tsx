import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface TestPlate {
  id: number;
  number: string;
  mainColor: string;
  hiddenColor: string;
}

const testPlates: TestPlate[] = [
  { id: 1, number: '12', mainColor: '#8B0000', hiddenColor: '#006400' }, // Red-Green deficiency
  { id: 2, number: '8', mainColor: '#006400', hiddenColor: '#8B0000' },  // Red-Green deficiency
  { id: 3, number: '6', mainColor: '#00008B', hiddenColor: '#8B0000' },  // Blue-Yellow deficiency (less common)
  { id: 4, number: '29', mainColor: '#8B0000', hiddenColor: '#006400' },
  { id: 5, number: '5', mainColor: '#006400', hiddenColor: '#8B0000' },
  { id: 6, number: '74', mainColor: '#8B0000', hiddenColor: '#006400' },
];

const ColorBlindnessTest: React.FC = () => {
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [message, setMessage] = useState('');

  const currentPlate = testPlates[currentPlateIndex];

  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setCurrentPlateIndex(0);
    setScore(0);
    setUserInput('');
    setMessage('');
  };

  const handleSubmit = () => {
    if (userInput === currentPlate.number) {
      setScore(score + 1);
      setMessage('Correct!');
    } else {
      setMessage(`Incorrect. The number was ${currentPlate.number}.`);
    }

    setTimeout(() => {
      setUserInput('');
      setMessage('');
      if (currentPlateIndex < testPlates.length - 1) {
        setCurrentPlateIndex(currentPlateIndex + 1);
      } else {
        setTestFinished(true);
        setTestStarted(false);
      }
    }, 1500);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestFinished(false);
    setCurrentPlateIndex(0);
    setScore(0);
    setUserInput('');
    setMessage('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Color Blindness Test',
          text: `I scored ${score} out of ${testPlates.length} on the Color Blindness Test! Can you do better?`,
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

  const generateDots = useCallback((plate: TestPlate) => {
    const dots = [];
    const numDots = 300; // Number of dots to draw
    const radius = 150; // Radius of the circle

    for (let i = 0; i < numDots; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * radius;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);

      const isHiddenDot = Math.random() < 0.3; // Probability of being a hidden number dot
      const color = isHiddenDot ? plate.hiddenColor : plate.mainColor;

      dots.push(
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            width: '8px',
            height: '8px',
            left: `calc(50% + ${x}px - 4px)`,
            top: `calc(50% + ${y}px - 4px)`,
          }}
        ></div>
      );
    }
    return dots;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Color Blindness Test</h1>

        {!testStarted && !testFinished ? (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Identify the hidden number in each plate.</p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        ) : testFinished ? (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">Test Complete!</p>
            <p className="text-2xl text-gray-700 mb-8">You scored {score} out of {testPlates.length}.</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={resetTest}
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
            <div className="text-center mb-6">
              <p className="text-2xl font-semibold">Plate {currentPlateIndex + 1} of {testPlates.length}</p>
            </div>
            <div className="relative w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-6">
              {/* Simplified representation of an Ishihara plate */}
              <div className="absolute w-full h-full" style={{ backgroundColor: currentPlate.mainColor, opacity: 0.2 }}></div>
              <div className="absolute w-full h-full flex items-center justify-center text-8xl font-extrabold" style={{ color: currentPlate.hiddenColor, mixBlendMode: 'multiply' }}>
                {currentPlate.number}
              </div>
              {/* More complex dot generation could go here */}
            </div>
            <div className="text-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full max-w-xs p-3 text-center text-3xl rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800"
                placeholder="What number do you see?"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                className="mt-4 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-green-700 transition duration-300"
              >
                Submit
              </button>
              {message && <p className="mt-4 text-xl font-semibold text-blue-700">{message}</p>}
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

export default ColorBlindnessTest;