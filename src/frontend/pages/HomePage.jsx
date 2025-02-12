import React from 'react';
import Mascot from '../components/Mascot';
import './HomePage.css';

const HomePage = ({ onSelectSubject, weakestSubject }) => {
  let suggestionMessage = "Choose a subject to start your daily quiz!";
  if (weakestSubject) {
    suggestionMessage = `You might want to focus on ${weakestSubject} today.`; // Use template literal correctly
  }

  return (
    <div className="container">
      <h1>Welcome to the AI Learning Platform!</h1>
      <Mascot message={suggestionMessage} />
      <div className="subject-buttons">
        <button onClick={() => onSelectSubject('Physics')}>Physics</button>
        <button onClick={() => onSelectSubject('Chemistry')}>Chemistry</button>
        <button onClick={() => onSelectSubject('Math')}>Math</button>
      </div>
    </div>
  );
};

export default HomePage;
