import React from 'react';
import './Question.css';

const Question = ({ question, onAnswerChange, onHintRequest }) => {
  const handleOptionChange = (event) => {
    onAnswerChange(question.id, event.target.value);
  };

  const handleInputChange = (event) => {
    onAnswerChange(question.id, event.target.value);
  };

  return (
    <div className="question-container">
      <p className="question-text">{question.text}</p>
      {question.type === 'mcq' && (
        <div className="options-container">
          {question.options.map((option, index) => (
            <label key={index} className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                onChange={handleOptionChange}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      )}
      {question.type === 'fill-in-blank' && (
        <input
          type="text"
          className="fill-in-blank-input"
          onChange={handleInputChange}
        />
      )}
      <button type="button" className="hint-button" onClick={onHintRequest}>
        Hint
      </button>
    </div>
  );
};

export default Question;
