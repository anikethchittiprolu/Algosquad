// src/services/ai.js

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || ''; // Default to empty string if not defined

export const getCompletion = async (prompt) => {
    if (!API_KEY) {
        throw new Error("OpenRouter API key is not configured. Please set the VITE_OPENROUTER_API_KEY environment variable.");
    }
    const url = `${BASE_URL}/api/chat/completions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "google/gemini-2.0-flash-thinking-experimental-01-21", //The model name can be found on the OpenRouter website.
            "messages": [
                { "role": "user", "content": prompt }
            ]
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};
