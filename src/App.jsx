import React, { useState } from 'react';
import Mascot from './components/Mascot';
import Quiz from './components/Quiz';
import { getCompletion } from './services/ai';

function App() {
  const [aiResponse, setAiResponse] = useState('');

  // Mock AI for development
  const mockAI = async (prompt) => {
    console.log("Mock AI received prompt:", prompt);
    return {
      choices: [{
        message: {
          role: "assistant",
          content: "This is a mock AI response to: " + prompt
        }
      }]
    };
  };

  const callAI = async (prompt) => {
    try {
      const useMockAI = import.meta.env.VITE_APP_MOCK_AI === 'true';
      const completion = useMockAI ? await mockAI(prompt) : await getCompletion(prompt);
      setAiResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error calling AI:", error);
      setAiResponse("Sorry, I couldn't process that. Error: " + error.message);
    }
  };

  const handleExample = async () => {
    const examplePrompt = "Generate a short quiz question about the solar system.";
    await callAI(examplePrompt);
  };

  return (
    <div className="container">
      <h1>AI Learning Platform</h1>
      <Mascot />
      <h2>Quiz</h2>
      <div className="quiz-placeholder">
        Quiz questions and answers will appear here.
      </div>
      <button onClick={handleExample}>Test AI</button>
      {aiResponse && <div className="ai-response">AI Response: {aiResponse}</div>}
    </div>
  );
}

export default App;
