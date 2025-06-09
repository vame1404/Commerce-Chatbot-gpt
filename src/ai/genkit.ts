import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Import the Google AI plugin

export const ai = genkit({
  plugins: [
    googleAI() // Use the Google AI plugin
  ],
  model: 'googleai/gemini-1.5-flash-latest', // Set a default Google AI model
});
