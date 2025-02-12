// src/backend/ai.js (with Together AI integration)

import Together from "together-ai";

// Use environment variables for API key.  Vite prefixes env vars with VITE_.
const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;

// Check if the API key is available
if (!apiKey) {
  console.error("VITE_TOGETHER_API_KEY is not set. Please set it in your .env file.");
  // You might want to throw an error here or handle it gracefully in your UI.
  throw new Error("API Key not found.  See console for details.");
}

const together = new Together({
  apiKey: apiKey,
});

export const getCompletion = async (prompt) => {
  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Corrected model name
      max_tokens: 512, // Increased max_tokens for longer responses
      temperature: 0.7, // Adjust for creativity (0.7 is a good starting point)
      top_p: 0.7,
      top_k: 50,
    });

    return response;
  } catch (error) {
    console.error("Error in getCompletion:", error);
    console.error("Error message:", error.message);
    if (error.cause) {
      console.error("Error cause:", error.cause);
    }
    throw error; // Re-throw for UI handling
  }
};
