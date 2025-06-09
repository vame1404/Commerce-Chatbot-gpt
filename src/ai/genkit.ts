// utils/openai.ts (or openai.js)
import OpenAI from 'openai';


export const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Set your key in .env.local
});
const completion = await ai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: "system", content: "You are a helpful e-commerce assistant." },
    { role: "user", content: "Show me mobile phones under ₹20,000" }
  ],
});

