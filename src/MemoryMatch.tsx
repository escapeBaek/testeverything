import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const generateCards = (numPairs: number): Card[] => {
  const emojis = ['🍎', '🍌', '🍒', '🍇', '🍋', '🥭', '🍊', '🍓', '🍉', '🥝', '🍍', '🍑'];
  const selectedEmojis = emojis.slice(0, numPairs);
  let cards: Card[] = [];

  selectedEmojis.forEach((emoji, index) => {
    cards.push({ id: index * 2, value: emoji, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, value: emoji, isFlipped: false, isMatched: false });
  });

  return cards.sort(() => Math.random() - 0.5);
};

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // Stores indices of flipped cards
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [numPairs, setNumPairs] = useState(6); // Default 6 pairs (12 cards)

  const initializeGame = useCallback(() => {
    setCards(generateCards(numPairs));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameOver(false);
  }, [numPairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (matches === numPairs) {
      setGameOver(true);
    }
  }, [matches, numPairs]);

  const handleCardClick = (index: number) => {
    if (!gameStarted) return;
    if (gameOver) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedCards.length === 2) return; // Prevent flipping more than 2 cards

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    setFlippedCards((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = flippedCards;

      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        newCards[firstIndex].isFlipped = false; // Flip back after match
        newCards[secondIndex].isFlipped = false; // Flip back after match
        setCards(newCards);
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Memory Match Test',
          text: `I completed the Memory Match game in ${moves} moves! Can you beat my score?`,
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

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const getGridColsClass = () => {
    const totalCards = numPairs * 2;
    if (totalCards <= 12) return 'grid-cols-4'; // 3x4 or 4x3
    if (totalCards <= 16) return 'grid-cols-4'; // 4x4
    if (totalCards <= 20) return 'grid-cols-5'; // 4x5
    if (totalCards <= 24) return 'grid-cols-6'; // 4x6
    return 'grid-cols-6';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 text-gray-800">
        <h1 className="text-5xl font-bold text-center mb-8">Memory Match</h1>

        {!gameStarted ? (
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Match all the pairs to win!</p>
            <div className="mb-6">
              <label htmlFor="numPairs" className="text-xl font-semibold mr-4">Number of Pairs:</label>
              <select
                id="numPairs"
                value={numPairs}
                onChange={(e) => setNumPairs(Number(e.target.value))}
                className="p-2 rounded-md bg-gray-100 text-gray-800"
              >
                <option value={4}>4 Pairs (8 cards)</option>
                <option value={6}>6 Pairs (12 cards)</option>
                <option value={8}>8 Pairs (16 cards)</option>
                <option value={10}>10 Pairs (20 cards)</option>
                <option value={12}>12 Pairs (24 cards)</option>
              </select>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Start Game
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">Congratulations!</p>
            <p className="text-2xl text-gray-700 mb-8">You completed the game in {moves} moves.</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={initializeGame}
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
              <span>Moves: {moves}</span>
              <span>Matches: {matches}/{numPairs}</span>
            </div>
            <div className={`grid ${getGridColsClass()} gap-4 p-4 bg-gray-100 rounded-lg shadow-inner`}>
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`relative w-full aspect-square rounded-lg shadow-md flex items-center justify-center text-5xl font-bold cursor-pointer
                    ${card.isFlipped || card.isMatched ? 'bg-blue-200' : 'bg-blue-400 hover:bg-blue-500'}
                    ${card.isMatched ? 'opacity-50' : ''}
                    transition-all duration-300 transform hover:scale-105`}
                  onClick={() => handleCardClick(index)}
                >
                  {card.isFlipped || card.isMatched ? card.value : '?'}
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

export default MemoryMatch;
