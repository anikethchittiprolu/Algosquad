import React from 'react';
import { calculateAnalytics, generateFeedback, generateTextGraph } from '../../utils/quizUtils';
import Mascot from '../components/Mascot';
import './ResultsPage.css'; // Import the CSS

const ResultsPage = ({ quizData, userAnswers, onGoHome, quizHistory }) => {
  if (!quizData) {
    return <div>Loading...</div>;
  }

  const analytics = calculateAnalytics(quizHistory);
  const feedback = generateFeedback(analytics);

  return (
    <div className="container results-container">
      <h2>Quiz Results</h2>
      <Mascot message="Here are your results!" />
      <p>Your Score: {quizData.score} / {quizData.questions.length}</p>

      <h3>Answers:</h3>
      {quizData.questions.map((question) => (
        <div key={question.id} className="result-item">
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

      <h3>Quiz History</h3>
      {quizHistory.length > 0 ? (
        <ul className="quiz-history-list">
          {quizHistory.map((result, index) => (
            <li key={index} className="history-item">
              Date: {result.date}, Score: {result.score} / {result.questions ? result.questions.length : 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No quiz history yet.</p>
      )}

      <div className="analytics-section">
        <h3>Analytics</h3>
        <p>Total Quizzes Taken: {analytics.totalQuizzes}</p>
        <p>Average Score: {analytics.averageScore.toFixed(2)}% {generateTextGraph(analytics.averageScore)}</p>
        <p>Best Score: {analytics.bestScore}</p>
        <p>Worst Score: {analytics.worstScore}</p>
        <p>MCQ Accuracy: {analytics.mcqAccuracy.toFixed(2)}% {generateTextGraph(analytics.mcqAccuracy)}</p>
        <p>Fill-in-the-Blank Accuracy: {analytics.fillInBlankAccuracy.toFixed(2)}% {generateTextGraph(analytics.fillInBlankAccuracy)}</p>
        <p>Current Streak: {analytics.streak} {analytics.streak === 1 ? 'day' : 'days'}</p>
      </div>

      <div className="feedback-section">
        <h3>Feedback</h3>
        <p>{feedback}</p>
      </div>

      <button onClick={onGoHome}>Go to Home</button>
    </div>
  );
};

export default ResultsPage;
