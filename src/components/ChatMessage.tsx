
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import ProductRecommendations from './ProductRecommendations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const avatarIcon = isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />;
  const avatarFallback = isUser ? "U" : "AI";

  return (
    <div className={`flex flex-col mb-2 sm:mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border border-border shadow-sm flex-shrink-0">
          <AvatarFallback className={`flex items-center justify-center w-full h-full ${isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
            {avatarIcon}
          </AvatarFallback>
        </Avatar>
        <div
          className={`p-2 sm:p-3 rounded-lg shadow-md ${
            isUser
              ? 'bg-primary text-primary-foreground max-w-[80%] sm:max-w-sm'
              : 'bg-card text-card-foreground max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-lg'
          }`}
        >
          <p className="text-xs sm:text-sm font-body whitespace-pre-wrap">{message.text}</p>
          {message.sender === 'system' && message.recommendations && (
            <ProductRecommendations recommendationsData={message.recommendations} />
          )}
        </div>
      </div>
      <p className={`text-[10px] sm:text-xs text-muted-foreground mt-1 ${isUser ? 'mr-8 sm:mr-11 text-right' : 'ml-8 sm:ml-11 text-left'}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
