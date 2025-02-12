import { getCompletion } from '../backend/ai';

// --- Prompt Engineering Functions (Subject Specific) ---

const generateMCQPrompt = (difficulty, subject) => {
  return `Generate a multiple-choice question of ${difficulty} difficulty on the topic of *${subject}*.
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

const generateFillInBlankPrompt = (difficulty, subject) => {
  return `Generate a fill-in-the-blank question of ${difficulty} difficulty on the topic of *${subject}*.
Include the correct answer and a brief explanation.
Format your response as a JSON object:
{
  "question": "Question text with ___ for the blank.",
  "correctAnswer": "Answer here",
  "explanation": "Explanation here"
}`;
};

// --- API Call and Question Generation ---

export const getDailyQuestions = async (subject) => { // Add subject parameter
  if (!subject) {
    console.error("No subject selected.");
    return [];
  }

  try {
    const difficulties = ['easy', 'medium', 'hard'];
    const questions = [];

    // Generate 3 MCQs
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const prompt = generateMCQPrompt(difficulty, subject); // Pass subject to prompt function
      const response = await getCompletion(prompt);
      try {
        const parsedQuestion = JSON.parse(response.choices[0].message.content);
        if (!parsedQuestion.question || !parsedQuestion.options || !parsedQuestion.correctAnswer || !parsedQuestion.explanation) {
          throw new Error("Invalid question format from AI.");
        }
        questions.push({
          id: questions.length + 1,
          type: 'mcq',
          text: parsedQuestion.question,
          options: Object.values(parsedQuestion.options),
          correctAnswer: parsedQuestion.options[parsedQuestion.correctAnswer],
          explanation: parsedQuestion.explanation,
        });
      } catch (parseError) {
        console.error("Error parsing MCQ response:", parseError);
      }
    }

    // Generate 2 Fill-in-the-Blank questions
    for (let i = 0; i < 2; i++) {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const prompt = generateFillInBlankPrompt(difficulty, subject); // Pass subject to prompt function
      const response = await getCompletion(prompt);
      try {
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
        console.error("Error parsing Fill-in-the-Blank response:", parseError);
      }
    }

    return questions;
  } catch (error) {
    console.error('Error generating daily questions:', error);
    return [];
  }
};

// --- Local Storage Functions (Subject Specific) ---

export const saveQuizResults = (results, subject) => {
  if (!subject) {
    console.error("No subject selected.");
    return;
  }
  const history = loadQuizHistory();
  if (!history[subject]) {
    history[subject] = []; // Initialize if it doesn't exist
  }
  history[subject].push(results);
  localStorage.setItem('quizHistory', JSON.stringify(history));
};

export const loadQuizHistory = () => {
  const history = localStorage.getItem('quizHistory');
  return history ? JSON.parse(history) : {}; // Return an empty object
};

export const saveLastQuizDate = (date, subject) => {
  if (!subject) {
    console.error("No subject selected.");
    return;
  }
  localStorage.setItem(`lastQuizDate_${subject}`, date);
};

export const getLastQuizDate = (subject) => {
  if (!subject) {
    console.error("No subject selected.");
    return null;
  }
  return localStorage.getItem(`lastQuizDate_${subject}`);
};

// --- Analytics Functions (Subject Specific) ---

export const calculateAnalytics = (quizHistory) => {
    if (!quizHistory || quizHistory.length === 0) {
        return {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            worstScore: 0,
            mcqAccuracy: 0,
            fillInBlankAccuracy: 0,
            streak: 0,
            weakAreas: [],
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

        const quizDate = new Date(quiz.date);
        if (lastQuizDate) {
            const diffInDays = (quizDate.getTime() - lastQuizDate.getTime()) / (1000 * 3600 * 24);
            if (diffInDays === 1) {
                currentStreak++;
            } else if (diffInDays > 1) {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }
        lastQuizDate = quizDate;

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
            console.warn("Skipping quiz entry due to missing or invalid questions data:", quiz);
        }
    });

    const averageScore = (totalMCQ + totalFillInBlank) > 0 ? totalCorrect / (totalMCQ + totalFillInBlank) : 0;
    const mcqAccuracy = totalMCQ > 0 ? (totalMCQCorrect / totalMCQ) * 100 : 0;
    const fillInBlankAccuracy = totalFillInBlank > 0 ? (totalFillInBlankCorrect / totalFillInBlank) * 100 : 0;

    const weakAreas = [];
    if (mcqAccuracy < 60) {
        weakAreas.push("Multiple Choice Questions");
    }
    if (fillInBlankAccuracy < 60) {
        weakAreas.push("Fill-in-the-Blank Questions");
    }

    return {
        totalQuizzes,
        averageScore: averageScore * 100,
        bestScore,
        worstScore,
        mcqAccuracy,
        fillInBlankAccuracy,
        streak: currentStreak,
        weakAreas,
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

        if (analytics.weakAreas.length > 0) {
            feedbackMessage += "Here are some areas to focus on: ";
            feedbackMessage += analytics.weakAreas.join(", ") + ". ";
        }

        if (analytics.mcqAccuracy > analytics.fillInBlankAccuracy) {
            feedbackMessage += "You're doing better on multiple-choice questions than fill-in-the-blank questions.  ";
        } else if (analytics.fillInBlankAccuracy > analytics.mcqAccuracy) {
            feedbackMessage += "You're doing better on fill-in-the-blank questions than multiple-choice questions.  ";
        }

        if (analytics.averageScore >= 80) {
            feedbackMessage += "Excellent work!";
        } else if (analytics.averageScore >= 60) {
            feedbackMessage += "Good job! You're making good progress.";
        } else if (analytics.averageScore >= 40) {
            feedbackMessage += "Keep practicing! You're improving.";
        } else {
            feedbackMessage += "You might want to review the fundamentals. Don't give up!";
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

// New function to get subject-specific average scores
export const getSubjectAverages = (quizHistory) => {
  const subjectAverages = {};

  for (const subject in quizHistory) {
    if (quizHistory.hasOwnProperty(subject)) {
      const subjectHistory = quizHistory[subject];
      if (subjectHistory && subjectHistory.length > 0) {
        const totalScore = subjectHistory.reduce((sum, quiz) => sum + quiz.score, 0);
        const totalPossibleScore = subjectHistory.reduce((sum, quiz) => sum + (quiz.questions ? quiz.questions.length : 0), 0);
        subjectAverages[subject] = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
      } else {
        subjectAverages[subject] = 0; // No quizzes taken for this subject
      }
    }
  }

  return subjectAverages;
};

// Modified function to determine the weakest subject - Returns subject NAME
export const getWeakestSubject = (quizHistory) => {
  const subjectAverages = getSubjectAverages(quizHistory);
  let weakestSubject = null;
  let lowestAverage = Infinity;

  for (const subject in subjectAverages) {
    if (subjectAverages.hasOwnProperty(subject)) {
      const average = subjectAverages[subject];
      if (average < lowestAverage) {
        lowestAverage = average;
        weakestSubject = subject; // Store the subject NAME
      }
    }
  }

  return weakestSubject; // Return the subject NAME
};
