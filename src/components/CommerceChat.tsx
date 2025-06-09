
'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { getProductRecommendations, GetProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CommerceChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedChat = localStorage.getItem('commerceChatHistory');
      if (storedChat) {
        setChatHistory(JSON.parse(storedChat).map((msg: ChatMessageType) => ({...msg, timestamp: new Date(msg.timestamp)})));
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      toast({
        title: "Error",
        description: "Could not load previous chat session.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceChatHistory', JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [chatHistory]);
  

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  const formatChatHistoryForAI = (history: ChatMessageType[]): string => {
    return history
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}${msg.recommendations ? `\nRecommendations: ${JSON.stringify(msg.recommendations.recommendedProducts)}` : ''}`)
      .join('\n');
  };

  const handleSendMessage = async () => {
    if (!currentUserInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentUserInput.trim(),
      timestamp: new Date(),
    };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);
    setCurrentUserInput('');

    try {
      const aiInput = {
        chatHistory: formatChatHistoryForAI(updatedChatHistory),
      };
      
      const recommendations: GetProductRecommendationsOutput = await getProductRecommendations(aiInput); 
      
      const systemMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: `Here are some recommendations based on your query and chat history:`,
        timestamp: new Date(),
        recommendations: recommendations,
      };
      setChatHistory(prev => [...prev, systemMessage]);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: 'Sorry, I encountered an error trying to get recommendations. Please try again.',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
      toast({
        title: "AI Error",
        description: "Failed to get recommendations from the AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setCurrentUserInput('');
    localStorage.removeItem('commerceChatHistory');
    toast({
      title: "Chat Reset",
      description: "The conversation has been cleared.",
    });
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-dvh p-2 sm:p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl rounded-lg flex flex-col flex-1 overflow-hidden">
        <CardHeader className="text-center flex-shrink-0">
          <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">CommerceChat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-hidden min-h-0">
          
          <ScrollArea className="flex-1 border rounded-md p-2 sm:p-4" viewportRef={scrollAreaViewportRef}>
            {chatHistory.length === 0 && (
              <p className="text-center text-muted-foreground font-body text-xs sm:text-sm">
                Ask a question or tell us what you're looking for!
              </p>
            )}
            {chatHistory.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
                <span className="ml-2 text-xs sm:text-sm text-muted-foreground font-body">Getting recommendations...</span>
              </div>
            )}
          </ScrollArea>

          <div className="flex items-end gap-2 flex-shrink-0">
            <Textarea
              value={currentUserInput}
              onChange={(e) => setCurrentUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or query here..."
              className="flex-grow resize-none bg-input text-foreground placeholder:text-muted-foreground text-xs sm:text-sm"
              rows={2}
              aria-label="Chat message input"
            />
            <Button onClick={handleSendMessage} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Send message">
              <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          <Button onClick={handleResetChat} variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 text-xs sm:text-sm flex-shrink-0" aria-label="Reset chat">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Reset Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

