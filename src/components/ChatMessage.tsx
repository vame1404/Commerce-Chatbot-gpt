import type { ChatMessage as ChatMessageType } from '@/lib/types';
import ProductRecommendations from './ProductRecommendations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const avatarIcon = isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />;
  const avatarFallback = isUser ? "U" : "AI";

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-8 h-8 border border-border shadow-sm">
          <AvatarFallback className={isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
            {avatarIcon}
          </AvatarFallback>
        </Avatar>
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${
            isUser ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'
          }`}
        >
          <p className="text-sm font-body whitespace-pre-wrap">{message.text}</p>
          {message.sender === 'system' && message.recommendations && (
            <ProductRecommendations recommendationsData={message.recommendations} />
          )}
        </div>
      </div>
      <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'mr-11 text-right' : 'ml-11 text-left'}`}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}
