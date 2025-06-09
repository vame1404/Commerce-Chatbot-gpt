'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { getProductRecommendations, GetProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CommerceChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [currentProductView, setCurrentProductView] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedChat = localStorage.getItem('commerceChatHistory');
      const storedProductView = localStorage.getItem('commerceChatProductView');
      if (storedChat) {
        setChatHistory(JSON.parse(storedChat).map((msg: ChatMessageType) => ({...msg, timestamp: new Date(msg.timestamp)})));
      }
      if (storedProductView) {
        setCurrentProductView(storedProductView);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      toast({
        title: "Error",
        description: "Could not load previous session.",
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
    try {
      localStorage.setItem('commerceChatProductView', currentProductView);
    } catch (error)
    {
      console.error("Failed to save product view to localStorage", error);
    }
  }, [currentProductView]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  const formatChatHistoryForAI = (history: ChatMessageType[]): string => {
    return history
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}${msg.recommendations ? `\nRecommendations: ${JSON.stringify(msg.recommendations.recommendedProducts)}` : ''}`)
      .join('\n');
  };

  const handleSendMessage = async () => {
    if (!currentUserInput.trim() && !currentProductView.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a message or specify a product you are viewing.",
        variant: "destructive",
      });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentUserInput.trim() || "Based on the current product...",
      timestamp: new Date(),
    };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);
    setCurrentUserInput('');

    try {
      const aiInput = {
        chatHistory: formatChatHistoryForAI(updatedChatHistory),
        currentProductView: currentProductView.trim() || "general inquiry",
      };
      const recommendations: GetProductRecommendationsOutput = await getProductRecommendations(aiInput);
      
      const systemMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: `Here are some recommendations based on your interest in "${currentProductView || 'your query'}" and chat history:`,
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
    setCurrentProductView('');
    setCurrentUserInput('');
    localStorage.removeItem('commerceChatHistory');
    localStorage.removeItem('commerceChatProductView');
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">CommerceChat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="productView" className="block text-sm font-medium text-foreground font-headline">
              Currently Viewing Product (Optional)
            </label>
            <Input
              id="productView"
              type="text"
              value={currentProductView}
              onChange={(e) => setCurrentProductView(e.target.value)}
              placeholder="e.g., 'Men's Running Shoes'"
              className="bg-input text-foreground placeholder:text-muted-foreground"
              aria-label="Currently viewing product"
            />
          </div>

          <ScrollArea className="h-[400px] border rounded-md p-4 bg-muted/50" ref={scrollAreaRef}>
            {chatHistory.length === 0 && (
              <p className="text-center text-muted-foreground font-body">
                Ask a question or tell us what you're looking for!
              </p>
            )}
            {chatHistory.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-body">Getting recommendations...</span>
              </div>
            )}
          </ScrollArea>

          <div className="flex items-end gap-2">
            <Textarea
              value={currentUserInput}
              onChange={(e) => setCurrentUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or query here..."
              className="flex-grow resize-none bg-input text-foreground placeholder:text-muted-foreground"
              rows={2}
              aria-label="Chat message input"
            />
            <Button onClick={handleSendMessage} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground" aria-label="Send message">
              <SendHorizonal className="w-5 h-5" />
            </Button>
          </div>
          
          <Button onClick={handleResetChat} variant="outline" className="w-full border-accent text-accent hover:bg-accent/10" aria-label="Reset chat">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
