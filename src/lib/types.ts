import type { GetProductRecommendationsOutput } from '@/ai/flows/product-recommendations';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
  recommendations?: GetProductRecommendationsOutput;
}
