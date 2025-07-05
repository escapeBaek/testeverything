import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  color: string;
}

const colors = ['#FF6347', '#6A5ACD', '#3CB371', '#FFD700', '#4682B4', '#DA70D6'];
const shapeTypes = ['circle', 'square', 'triangle'];

const generateShapes = (count: number, targetShapeType: 'circle' | 'square' | 'triangle', targetShapeColor: string): Shape[] => {
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const randomShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    shapes.push({
      id: i,
      type: randomShapeType as 'circle' | 'square' | 'triangle',
      color: randomColor,
    });
  }

  // Ensure at least one target shape exists
  const targetIndex = Math.floor(Math.random() * count);
  shapes[targetIndex] = { id: targetIndex, type: targetShapeType, color: targetShapeColor };

  return shapes;
};

const ShapeRecognition: React.FC = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetShape, setTargetShape] = useState<Shape | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(10); // Initial time for each level
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGame = useCallback(() => {
    const newTargetShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)] as 'circle' | 'square' | 'triangle';
    const newTargetShapeColor = colors[Math.floor(Math.random() * colors.length)];
    const newTarget = { id: -1, type: newTargetShapeType, color: newTargetShapeColor };
    setTargetShape(newTarget);

    const shapeCount = Math.min(25, 5 + level * 2); // Increase number of shapes with level
    setShapes(generateShapes(shapeCount, newTargetShapeType, newTargetShapeColor));
    setMessage('');
    setTimeLeft(Math.max(5, 10 - Math.floor(level / 5))); // Adjust time based on level, min 5 seconds
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          setMessage(`Time's up! Your score: ${score}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [level, score]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      initializeGame();
    }
  }, [gameStarted, gameOver, initializeGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleShapeClick = (clickedShape: Shape) => {
    if (gameOver || !gameStarted || !targetShape) return;

    if (clickedShape.type === targetShape.type && clickedShape.color === targetShape.color) {
      setScore(score + 1);
      setLevel(level + 1);
      setMessage('Correct!');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setGameOver(true);
      setMessage(`Game Over! You clicked the wrong shape. Your score: ${score}`);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameStarted(false);
    setGameOver(false);
    setMessage('');
    setTargetShape(null);
    setShapes([]);
    setTimeLeft(10);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shape Recognition Test',
          text: `I scored ${score} on the Shape Recognition Test! Can you beat me?`,
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

  const renderShape = (shape: Shape) => {
    const baseClasses = "w-16 h-16 flex items-center justify-center cursor-pointer transition-transform duration-100 hover:scale-105";
    const style = { backgroundColor: shape.color };

    switch (shape.type) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} style={style}></div>;
      case 'square':
        return <div className={`${baseClasses} rounded-md`} style={style}></div>;
      case 'triangle':
        return (
          <div
            className={`${baseClasses}`}
            style={{
              width: 0,
              height: 0,
              borderLeft: '32px solid transparent',
              borderRight: '32px solid transparent',
              borderBottom: `64px solid ${shape.color}`,
            }}
          ></div>
        );
      default:
        return null;
    }
  };

  const getGridColsClass = () => {
    const numShapes = shapes.length;
    if (numShapes <= 9) return 'grid-cols-3';
    if (numShapes <= 16) return 'grid-cols-4';
    if (numShapes <= 25) return 'grid-cols-5';
    return 'grid-cols-5'; // Max 25 shapes for 5x5 grid
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Shape Recognition Test</h1>

        {!gameStarted && !gameOver ? (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Find and click the target shape as fast as you can!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Test
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">{message}</p>
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
        ) : (
          <>
            <div className="flex justify-between text-2xl font-semibold mb-6">
              <span>Score: {score}</span>
              <span>Time Left: {timeLeft}s</span>
            </div>
            {targetShape && (
              <div className="text-center mb-6">
                <p className="text-2xl text-gray-700 mb-2">Find this shape:</p>
                <div className="inline-block p-4 bg-gray-100 rounded-lg shadow-inner">
                  {renderShape(targetShape)}
                </div>
              </div>
            )}
            <div className={`grid ${getGridColsClass()} gap-4 p-4 bg-gray-100 rounded-lg shadow-inner`}>
              {shapes.map((shape) => (
                <div key={shape.id} onClick={() => handleShapeClick(shape)}>
                  {renderShape(shape)}
                </div>
              ))}
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

export default ShapeRecognition;