import { getCompletion } from '../backend/ai';

// --- Prompt Engineering Functions (Kinematics Focused) ---

const generateMCQPrompt = (difficulty) => {
  return `Generate a multiple-choice question of ${difficulty} difficulty on the topic of *kinematics in physics*.
Provide 4 options (A, B, C, and D) and indicate the correct answer. Include a brief explanation.
Format your response as a JSON object:
{
  "question": "Question text here",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "A",
  "explanation": "Explanation here"
}`;
};

const generateFillInBlankPrompt = (difficulty) => {
  return `Generate a fill-in-the-blank question of ${difficulty} difficulty on the topic of *kinematics in physics*.
Include the correct answer and a brief explanation.
Format your response as a JSON object:
{
  "question": "Question text with ___ for the blank.",
  "correctAnswer": "Answer here",
  "explanation": "Explanation here"
}`;
};

// --- API Call and Question Generation ---

export const getDailyQuestions = async () => {
    try {
        const difficulties = ['easy', 'medium', 'hard'];
        const questions = [];

        // Generate 3 MCQs
        for (let i = 0; i < 3; i++) {
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            const prompt = generateMCQPrompt(difficulty);
            const response = await getCompletion(prompt);
            // console.log("MCQ Response:", response); // Log the raw response
            try {
                const parsedQuestion = JSON.parse(response.choices[0].message.content);

                // Basic validation
                if (!parsedQuestion.question || !parsedQuestion.options || !parsedQuestion.correctAnswer || !parsedQuestion.explanation) {
                    throw new Error("Invalid question format from AI.");
                }
                questions.push({
                    id: questions.length + 1,
                    type: 'mcq',
                    text: parsedQuestion.question,
                    options: Object.values(parsedQuestion.options), // Convert options object to array
                    correctAnswer: parsedQuestion.options[parsedQuestion.correctAnswer],
                    explanation: parsedQuestion.explanation,
                });
            } catch (parseError) {
                console.error("Error parsing MCQ response:", parseError);
                // Handle the error (e.g., skip this question, log it, etc.)
            }
        }

        // Generate 2 Fill-in-the-Blank questions
        for (let i = 0; i < 2; i++) {
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            const prompt = generateFillInBlankPrompt(difficulty);
            const response = await getCompletion(prompt);
            // console.log("Fill-in-Blank Response:", response); // Log the raw response

            try{
                const parsedQuestion = JSON.parse(response.choices[0].message.content);
                if (!parsedQuestion.question || !parsedQuestion.correctAnswer || !parsedQuestion.explanation) {
                    throw new Error("Invalid question format from AI.");
                }
                questions.push({
                    id: questions.length + 1,
                    type: 'fill-in-blank',
                    text: parsedQuestion.question,
                    correctAnswer: parsedQuestion.correctAnswer,
                    explanation: parsedQuestion.explanation,
                });
            } catch (parseError) {
                console.error("Error parsing Fill-in-the-Blank response:", parseError, response.choices[0].message.content);
            }
        }

        return questions;
    } catch (error) {
        console.error('Error generating daily questions:', error);
        // In a real application, you might want to return a fallback set of questions
        // or display an error message to the user.
        return []; // Return an empty array for now
    }
};

// --- Local Storage Functions ---

export const saveQuizResults = (results) => {
  const history = loadQuizHistory();
  history.push(results);
  localStorage.setItem('quizHistory', JSON.stringify(history));
};

export const loadQuizHistory = () => {
  const history = localStorage.getItem('quizHistory');
  return history ? JSON.parse(history) : [];
};

export const saveLastQuizDate = (date) => {
  localStorage.setItem('lastQuizDate', date);
};

export const getLastQuizDate = () => {
  return localStorage.getItem('lastQuizDate');
};
// --- Analytics Functions ---

export const calculateAnalytics = (quizHistory) => {
  if (quizHistory.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      mcqAccuracy: 0,
      fillInBlankAccuracy: 0,
      streak: 0,
    };
  }

  const totalQuizzes = quizHistory.length;
  let totalCorrect = 0;
  let totalMCQCorrect = 0;
  let totalMCQ = 0;
  let totalFillInBlankCorrect = 0;
  let totalFillInBlank = 0;
  let bestScore = 0;
  let worstScore = Infinity;
  let currentStreak = 0;
  let lastQuizDate = null;

  quizHistory.forEach((quiz) => {
    const quizScore = quiz.score;
    totalCorrect += quizScore;
    bestScore = Math.max(bestScore, quizScore);
    worstScore = Math.min(worstScore, quizScore);

    // Calculate streak
    const quizDate = new Date(quiz.date);
    if (lastQuizDate) {
      const diffInDays = (quizDate.getTime() - lastQuizDate.getTime()) / (1000 * 3600 * 24);
      if (diffInDays === 1) {
        currentStreak++;
      } else if (diffInDays > 1) {
        currentStreak = 1; // Reset streak if gap > 1 day
      }
    } else {
      currentStreak = 1; // First quiz
    }
    lastQuizDate = quizDate;

    // Check if quiz.questions exists before iterating
    if (quiz.questions && Array.isArray(quiz.questions)) {
      quiz.questions.forEach((question) => {
        const userAnswer = quiz.answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        if (question.type === 'mcq') {
          totalMCQ++;
          if (isCorrect) {
            totalMCQCorrect++;
          }
        } else if (question.type === 'fill-in-blank') {
          totalFillInBlank++;
          if (isCorrect) {
            totalFillInBlankCorrect++;
          }
        }
      });
    } else {
      // Handle the case where quiz.questions is missing or not an array
      console.warn("Skipping quiz entry due to missing or invalid questions data:", quiz);
    }
  });

  const averageScore = (totalMCQ + totalFillInBlank) > 0 ? totalCorrect / (totalMCQ + totalFillInBlank) : 0;
  const mcqAccuracy = totalMCQ > 0 ? (totalMCQCorrect / totalMCQ) * 100 : 0;
  const fillInBlankAccuracy = totalFillInBlank > 0 ? (totalFillInBlankCorrect / totalFillInBlank) * 100 : 0;

  return {
    totalQuizzes,
    averageScore: averageScore * 100,
    bestScore,
    worstScore,
    mcqAccuracy,
    fillInBlankAccuracy,
    streak: currentStreak,
  };
};

  export const generateFeedback = (analytics) => {
    let feedbackMessage = "";

    if (analytics.totalQuizzes === 0) {
        feedbackMessage = "Take a quiz to see your progress!";
    } else {
        feedbackMessage += `You've taken ${analytics.totalQuizzes} quizzes.  `;
        feedbackMessage += `Your average score is ${analytics.averageScore.toFixed(2)}%.  `;
        feedbackMessage += `Your best score is ${analytics.bestScore} and your worst score is ${analytics.worstScore}.  `;

        if (analytics.mcqAccuracy > analytics.fillInBlankAccuracy) {
            feedbackMessage += `You're doing better on multiple-choice questions than fill-in-the-blank questions.  Focus on practicing fill-in-the-blank questions.  `;
        } else if (analytics.fillInBlankAccuracy > analytics.mcqAccuracy) {
            feedbackMessage += `You're doing better on fill-in-the-blank questions than multiple-choice questions.  Focus on practicing multiple-choice questions.  `;
        }

        if (analytics.averageScore >= 80) {
            feedbackMessage += "Excellent work! You have a strong understanding of kinematics.";
        } else if (analytics.averageScore >= 60) {
            feedbackMessage += "Good job! You're making good progress in kinematics.";
        } else if (analytics.averageScore >= 40) {
            feedbackMessage += "Keep practicing! You're improving your understanding of kinematics.";
        } else {
            feedbackMessage += "You might want to review the fundamentals of kinematics. Don't give up!";
        }
        if (analytics.streak > 1) {
            feedbackMessage += ` You're on a ${analytics.streak}-day quiz streak!`;
        }
    }

    return feedbackMessage;
};

// Text-based bar graph function
export const generateTextGraph = (percentage, width = 20) => {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '[' + '#'.repeat(filled) + '-'.repeat(empty) + ']';
};
