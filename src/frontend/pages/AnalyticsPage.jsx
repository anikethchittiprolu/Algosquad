import React from 'react';
import { calculateAnalytics, generateFeedback, generateTextGraph } from '../../utils/quizUtils';
import Mascot from '../components/Mascot';
import './AnalyticsPage.css';

const AnalyticsPage = ({ quizHistory, onGoHome }) => {
    const analytics = calculateAnalytics(quizHistory);
    const feedback = generateFeedback(analytics);

    return (
        <div className="container analytics-page-container">
            <h2>Analytics</h2>
            <Mascot message="Here's your progress!" />

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
                <h3>Your Performance</h3>
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

export default AnalyticsPage;
