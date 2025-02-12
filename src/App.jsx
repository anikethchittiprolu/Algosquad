import React, { useState, useEffect } from 'react';
import HomePage from './frontend/pages/HomePage';
import QuizPage from './frontend/pages/QuizPage';
import AnswersPage from './frontend/pages/AnswersPage'; // Import AnswersPage
import AnalyticsPage from './frontend/pages/AnalyticsPage'; // Import AnalyticsPage
import { getDailyQuestions, saveQuizResults, loadQuizHistory, saveLastQuizDate, getLastQuizDate } from './utils/quizUtils';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const history = loadQuizHistory();
    setQuizHistory(history);
  }, []);

  const startQuiz = async () => {
    const lastQuizDate = getLastQuizDate();
    const today = new Date().toDateString();

    if (lastQuizDate !== today) {
      try {
        const questions = await getDailyQuestions();
        setQuizData({ questions, score: 0 });
        setUserAnswers({});
        setCurrentPage('quiz');
        saveLastQuizDate(today);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuizData({ questions: [], score: 0 });
      }
    } else {
      const questions = await getDailyQuestions();
      setQuizData({ questions, score: 0 });
      setUserAnswers({});
      setCurrentPage('quiz');
    }
  };

  const submitQuiz = (answers) => {
    let score = 0;
    const updatedQuestions = quizData.questions.map((question) => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      return {
        ...question,
        isCorrect: isCorrect,
      };
    });

    const quizResults = {
      date: new Date().toDateString(),
      score: score,
      answers: answers,
      questions: updatedQuestions,
    };

    saveQuizResults(quizResults);
    setQuizHistory([...quizHistory, quizResults]);
    setQuizData({ ...quizData, score: score, questions: updatedQuestions });
    setUserAnswers(answers);
    setCurrentPage('answers'); // Navigate to AnswersPage
  };

  const goToAnalytics = () => {
    setCurrentPage('analytics');
  };

    const goHome = () => {
        setCurrentPage('home');
    };

  return (
    <>
      {currentPage === 'home' && <HomePage onStartQuiz={startQuiz} />}
      {currentPage === 'quiz' && (
        <QuizPage questions={quizData ? quizData.questions : []} onSubmitQuiz={submitQuiz} />
      )}
      {currentPage === 'answers' && (
        <AnswersPage quizData={quizData} userAnswers={userAnswers} onGoToAnalytics={goToAnalytics} />
      )}
      {currentPage === 'analytics' && (
        <AnalyticsPage quizHistory={quizHistory} onGoHome={goHome} />
      )}
    </>
  );
}

export default App;
