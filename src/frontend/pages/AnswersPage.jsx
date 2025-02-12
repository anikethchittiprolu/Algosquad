import React from 'react';
import './AnswersPage.css';
import Mascot from '../components/Mascot';

const AnswersPage = ({ quizData, userAnswers, onGoToAnalytics, selectedSubject }) => {
  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container answers-container">
      <h2>Quiz Results ({selectedSubject})</h2> {/* Display selected subject */}
      <Mascot message={`You scored ${quizData.score} / ${quizData.questions.length}!`} />
      <p>Your Score: {quizData.score} / {quizData.questions.length}</p>

      <h3>Answers:</h3>
      {quizData.questions.map((question) => (
        <div key={question.id} className="answer-item">
          <p>
            <strong>Question:</strong> {question.text}
          </p>
          <p>
            <strong>Your Answer:</strong> {userAnswers[question.id] || 'Not Answered'}
          </p>
          <p>
            <strong>Correct Answer:</strong> {question.correctAnswer}
          </p>
          <p>
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      ))}
      <button onClick={onGoToAnalytics}>View Analytics</button>
    </div>
  );
};

export default AnswersPage;
