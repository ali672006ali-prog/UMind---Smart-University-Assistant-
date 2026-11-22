
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with an object containing the apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeContent = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize the following lecture notes/content concisely for a university student. Focus on key concepts and definitions: \n\n ${text}`,
  });
  return response.text;
};

export const explainConcept = async (concept: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the concept of "${concept}" in simple, easy-to-understand language for a university student. Use analogies if possible.`,
  });
  return response.text;
};

export const generateQuiz = async (content: string, type: 'mcq' | 'tf' | 'essay') => {
  const typeLabels = {
    mcq: 'Multiple Choice Questions (MCQ)',
    tf: 'True/False Questions',
    essay: 'Short Answer/Essay Questions'
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert examiner. Based on the following educational content, generate 3 high-quality ${typeLabels[type]}. 
    
    For MCQ: Provide 4 options and the correct answer.
    For True/False: Provide the statement and the correct answer (True or False).
    For Essay: Provide the question and a model answer.
    
    Content: ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Required only for MCQ'
            },
            answer: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["question", "answer", "type"]
        }
      }
    }
  });
  
  try {
    // Access response.text property directly to get the generated string
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const chatWithAssistant = async (history: {role: string, content: string}[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are UniMind, a smart academic companion for university students. Help them organize studies, explain concepts, and stay motivated.',
    }
  });
  
  // Use sendMessage which accepts a message string parameter
  const response = await chat.sendMessage({ message });
  return response.text;
};
