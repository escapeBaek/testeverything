import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ColorPerception: React.FC = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [colors, setColors] = useState<string[]>([]);
  const [diffIndex, setDiffIndex] = useState<number>(-1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const generateColors = useCallback((currentLevel: number) => {
    const baseColor = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];

    // Determine the difference based on level
    const diff = Math.max(10, 50 - currentLevel * 2); // Decrease difference as level increases

    const differentColor = [
      Math.min(255, baseColor[0] + (Math.random() > 0.5 ? diff : -diff)),
      Math.min(255, baseColor[1] + (Math.random() > 0.5 ? diff : -diff)),
      Math.min(255, baseColor[2] + (Math.random() > 0.5 ? diff : -diff)),
    ];

    const numCells = Math.min(64, 4 + currentLevel); // Increase grid size
    const newColors: string[] = [];
    const newDiffIndex = Math.floor(Math.random() * numCells);

    for (let i = 0; i < numCells; i++) {
      if (i === newDiffIndex) {
        newColors.push(`rgb(${differentColor[0]}, ${differentColor[1]}, ${differentColor[2]})`);
      } else {
        newColors.push(`rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`);
      }
    }

    setColors(newColors);
    setDiffIndex(newDiffIndex);
    setMessage('');
  }, []);

  useEffect(() => {
    if (!gameOver) {
      generateColors(level);
    }
  }, [level, gameOver, generateColors]);

  const handleColorClick = (index: number) => {
    if (gameOver) return;

    if (index === diffIndex) {
      setScore(score + 1);
      setLevel(level + 1);
    } else {
      setGameOver(true);
      setMessage(`Game Over! You clicked the wrong color. Your score: ${score}`);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setMessage('');
    generateColors(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Color Perception Test',
          text: `I scored ${score} on the Color Perception Test! Can you beat me?`,
          url: window.location.href,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert(`Share this link to challenge your friends: ${window.location.href}

(Sharing not supported on this browser.)`);
    }
  };

  const getGridColsClass = () => {
    const numCells = colors.length;
    if (numCells <= 9) return 'grid-cols-3';
    if (numCells <= 16) return 'grid-cols-4';
    if (numCells <= 25) return 'grid-cols-5';
    if (numCells <= 36) return 'grid-cols-6';
    if (numCells <= 49) return 'grid-cols-7';
    return 'grid-cols-8';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Color Perception Test</h1>

        {!gameOver ? (
          <>
            <div className="flex justify-between text-2xl font-semibold mb-6">
              <span>Score: {score}</span>
              <span>Level: {level}</span>
            </div>
            <div className={`grid ${getGridColsClass()} gap-2 p-4 bg-gray-100 rounded-lg shadow-inner`}>
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-full aspect-square rounded-md cursor-pointer transition-transform duration-100 hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(index)}
                ></div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600 mb-4">{message}</p>
            <p className="text-2xl text-gray-700 mb-8">Your final score: {score}</p>
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

export default ColorPerception;
