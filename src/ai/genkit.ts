import {genkit} from 'genkit';
import {openai} from '@genkit-ai/openai'; // Import the OpenAI plugin

export const ai = genkit({
  plugins: [
    openai() // Use the OpenAI plugin
  ],
  model: 'openai/gpt-3.5-turbo', // Set a default OpenAI model
});
