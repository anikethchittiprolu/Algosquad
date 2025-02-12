import React, { useState } from 'react';
import Question from '../components/Question';
import Mascot from '../components/Mascot';

const QuizPage = ({ questions, onSubmitQuiz }) => {
  const [answers, setAnswers] = useState({});
  const [currentHint, setCurrentHint] = useState(null);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    setCurrentHint(null);
  };

  const handleSubmit = () => {
    onSubmitQuiz(answers);
  };

  const getHint = (question) => {
    if (question.type === 'mcq') {
      setCurrentHint("Consider all the options carefully before choosing.");
    } else if (question.type === 'fill-in-blank') {
      setCurrentHint("Think about the key concepts related to the question.");
    } else {
      setCurrentHint("Review the question carefully.");
    }
  };

  return (
    <div className="container quiz-container">
      <h2>Daily Quiz</h2>
      <Mascot message={currentHint || "Good luck!"} />
      {questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          onAnswerChange={handleAnswerChange}
          onHintRequest={() => getHint(question)}
        />
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default QuizPage;
