import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ReactionTime from './ReactionTime';
import ColorPerception from './ColorPerception';
import MemoryMatch from './MemoryMatch';
import TypingSpeed from './TypingSpeed';
import NumberSequence from './NumberSequence';
import DecisionMaker from './DecisionMaker';
import AimTrainer from './AimTrainer';
import ColorBlindnessTest from './ColorBlindnessTest';
import AudioReactionTime from './AudioReactionTime';
import ShapeRecognition from './ShapeRecognition';

const HomePage: React.FC = () => {
  const apps = [
    { id: 'app1', name: 'Reaction Time', description: 'Test your reflexes with a simple reaction time challenge.', icon: '⚡' },
    { id: 'app2', name: 'Color Perception', description: 'How well can you distinguish between subtle color differences?', icon: '🌈' },
    { id: 'app3', name: 'Memory Match', description: 'A classic memory game to challenge your recall.', icon: '🧠' },
    { id: 'app4', name: 'Typing Speed', description: 'Measure your words per minute and accuracy.', icon: '⌨️' },
    { id: 'app5', name: 'Number Sequence', description: 'Can you remember and repeat the sequence of numbers?', icon: '🔢' },
    { id: 'app6', name: 'Decision Maker', description: 'A quick tool to help you make simple choices.', icon: '🤔' },
    { id: 'app7', name: 'Aim Trainer', description: 'Test your mouse accuracy and reaction time.', icon: '🎯' },
    { id: 'app8', name: 'Color Blindness Test', description: 'Check your color vision with a simple test.', icon: '🎨' },
    { id: 'app9', name: 'Audio Reaction Time', description: 'Test reaction speed to sound.', icon: '👂' },
    { id: 'app10', name: 'Shape Recognition', description: 'Identify and match various shapes quickly.', icon: '🔺' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans">
      <header className="text-center mb-16 pt-12">
        <h1 className="text-6xl font-extrabold text-white leading-tight drop-shadow-lg">Test Everything</h1>
        <p className="text-2xl text-blue-100 mt-4 opacity-90">A collection of simple, fun tests for your amusement</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {apps.map((app) => (
          <Link to={`/app/${app.id}`} key={app.id} className="block group">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center min-h-[180px]">
              <div className="text-6xl mb-4 transition-transform duration-300 group-hover:rotate-6">{app.icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 leading-snug">{app.name}</h2>
              <p className="text-gray-600 text-lg flex-grow">{app.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="text-center mt-20 text-white text-lg opacity-80">
        <p>&copy; 2025 Test Everything. All rights reserved.</p>
      </footer>
    </div>
  );
};



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app/:id" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

const AppRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  switch (id) {
    case 'app1':
      return <ReactionTime />;
    case 'app2':
      return <ColorPerception />;
    case 'app3':
      return <MemoryMatch />;
    case 'app4':
      return <TypingSpeed />;
    case 'app5':
      return <NumberSequence />;
    case 'app6':
      return <DecisionMaker />;
    case 'app7':
      return <AimTrainer />;
    case 'app8':
      return <ColorBlindnessTest />;
    case 'app9':
      return <AudioReactionTime />;
    case 'app10':
      return <ShapeRecognition />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8 font-sans text-white">
          <div className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 mt-12">
            <h1 className="text-5xl font-bold mb-6">App Detail Page - {id}</h1>
            <p className="text-xl mb-8">This is a placeholder for an individual application page. Imagine detailed features, screenshots, and more here!</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H16a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      );
  }
};

export default App;