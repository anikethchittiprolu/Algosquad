import React, { useState, useEffect } from 'react';
import HomePage from './frontend/pages/HomePage';
import QuizPage from './frontend/pages/QuizPage';
import AnswersPage from './frontend/pages/AnswersPage';
import AnalyticsPage from './frontend/pages/AnalyticsPage';
import { getDailyQuestions, saveQuizResults, loadQuizHistory, saveLastQuizDate, getLastQuizDate, getWeakestSubject } from './utils/quizUtils'; // Import getWeakestSubject
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizHistory, setQuizHistory] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [weakestSubject, setWeakestSubject] = useState(null); // Add weakestSubject state

  useEffect(() => {
    const history = loadQuizHistory();
    setQuizHistory(history);
    // Find the weakest subject when the app loads
    setWeakestSubject(getWeakestSubject(history));
  }, []);

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    startQuiz(subject);
  };

  const startQuiz = async (subject) => {
    const lastQuizDate = getLastQuizDate(subject);
    const today = new Date().toDateString();

    if (lastQuizDate !== today) {
      try {
        const questions = await getDailyQuestions(subject);
        setQuizData({ questions, score: 0 });
        setUserAnswers({});
        setCurrentPage('quiz');
        saveLastQuizDate(today, subject);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuizData({ questions: [], score: 0 });
      }
    } else {
      const questions = await getDailyQuestions(subject);
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

    saveQuizResults(quizResults, selectedSubject);
    setQuizHistory((prevHistory) => {
        const updatedHistory = {
          ...prevHistory,
          [selectedSubject]: [...(prevHistory[selectedSubject] || []), quizResults],
        };
        // Update weakestSubject whenever quiz history changes
        setWeakestSubject(getWeakestSubject(updatedHistory));
        return updatedHistory;
      });
    setQuizData({ ...quizData, score: score, questions: updatedQuestions });
    setUserAnswers(answers);
    setCurrentPage('answers');
  };

  const goToAnalytics = () => {
    setCurrentPage('analytics');
  };

  const goHome = () => {
    setCurrentPage('home');
    setSelectedSubject(null);
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          onSelectSubject={handleSelectSubject}
          weakestSubject={weakestSubject} // Pass weakestSubject
        />
      )}
      {currentPage === 'quiz' && (
        <QuizPage questions={quizData ? quizData.questions : []} onSubmitQuiz={submitQuiz} />
      )}
      {currentPage === 'answers' && (
        <AnswersPage
          quizData={quizData}
          userAnswers={userAnswers}
          onGoToAnalytics={goToAnalytics}
          selectedSubject={selectedSubject}
        />
      )}
      {currentPage === 'analytics' && (
        <AnalyticsPage quizHistory={quizHistory[selectedSubject] || []} onGoHome={goHome} selectedSubject={selectedSubject}/>
      )}
    </>
  );
}

export default App;
