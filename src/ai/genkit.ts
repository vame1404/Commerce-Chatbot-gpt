import {genkit} from 'genkit';
// import {openai} from '@genkit-ai/openai'; // Import the OpenAI plugin - Removed due to installation issues

export const ai = genkit({
  plugins: [
    // openai() // Use the OpenAI plugin - Removed due to installation issues
  ],
  // model: 'openai/gpt-3.5-turbo', // Set a default OpenAI model - Removed as OpenAI plugin is not available
});
