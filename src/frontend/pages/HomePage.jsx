import React from 'react';
import Mascot from '../components/Mascot';

const HomePage = ({ onStartQuiz }) => {
  return (
    <div className="container">
      <h1>Welcome to the AI Learning Platform!</h1>
      <Mascot message="Click the button to start your daily quiz!" />
      <button onClick={onStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default HomePage;
