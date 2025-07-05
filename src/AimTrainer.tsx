import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const AimTrainer: React.FC = () => {
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds game
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const TARGET_SIZE = 50; // px
  const TARGET_APPEAR_INTERVAL = 800; // ms

  const generateTargetPosition = useCallback(() => {
    if (!gameAreaRef.current) return;

    const gameAreaWidth = gameAreaRef.current.offsetWidth;
    const gameAreaHeight = gameAreaRef.current.offsetHeight;

    const newX = Math.random() * (gameAreaWidth - TARGET_SIZE);
    const newY = Math.random() * (gameAreaHeight - TARGET_SIZE);

    setTargetPosition({ x: newX, y: newY });
  }, []);

  const startGame = () => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    generateTargetPosition();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(targetTimerRef.current!); // Stop target generation
          setGameOver(true);
          setGameStarted(false);
          setTargetPosition(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    targetTimerRef.current = setInterval(() => {
      generateTargetPosition();
    }, TARGET_APPEAR_INTERVAL);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    e.stopPropagation(); // Prevent click from bubbling to game area
    setScore((prev) => prev + 1);
    setHits((prev) => prev + 1);
    generateTargetPosition(); // Immediately generate new target on hit
  };

  const handleGameAreaClick = () => {
    if (!gameStarted || gameOver) return;
    setMisses((prev) => prev + 1);
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (targetTimerRef.current) clearInterval(targetTimerRef.current);
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(30);
    setGameStarted(false);
    setGameOver(false);
    setTargetPosition(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aim Trainer Test',
          text: `I scored ${score} points in Aim Trainer with ${hits} hits and ${misses} misses! Can you beat me?`,
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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (targetTimerRef.current) clearInterval(targetTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Aim Trainer</h1>

        {!gameStarted && !gameOver ? (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Click the targets as fast as you can!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">Game Over!</p>
            <p className="text-2xl text-gray-700 mb-2">Final Score: <span className="font-extrabold text-blue-800">{score}</span></p>
            <p className="text-2xl text-gray-700 mb-8">Hits: {hits} / Misses: {misses}</p>
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
        ) : (
          <>
            <div className="flex justify-between text-2xl font-semibold mb-6">
              <span>Score: {score}</span>
              <span>Time Left: {timeLeft}s</span>
            </div>
            <div
              ref={gameAreaRef}
              className="relative w-full bg-gray-100 rounded-lg shadow-inner overflow-hidden cursor-crosshair"
              style={{ height: '400px' }}
              onClick={handleGameAreaClick}
            >
              {targetPosition && (
                <div
                  className="absolute bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer animate-pulse-once"
                  style={{
                    width: TARGET_SIZE,
                    height: TARGET_SIZE,
                    left: targetPosition.x,
                    top: targetPosition.y,
                  }}
                  onClick={handleTargetClick}
                >
                  🎯
                </div>
              )}
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

export default AimTrainer;
