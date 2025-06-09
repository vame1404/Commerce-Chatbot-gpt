import {genkit} from 'genkit';
// Example: import {openai} from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    // Add your AI provider plugin here, e.g., openai()
    // Make sure to install the corresponding package, e.g., npm install @genkit-ai/openai
  ],
  // model: 'your-chosen-model', // Set a default model if desired
});
