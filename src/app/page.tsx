import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Welcome!',
  description: 'Discover our intelligent chatbot experience.',
};

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh bg-gradient-to-br from-background to-muted/50 overflow-hidden p-4">
      {/* Animated shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/20 rounded-full animate-drift-fade"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0, // Initial opacity set to 0, animation handles fade-in
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 bg-card/80 backdrop-blur-sm p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full">
        <MessageSquare className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-primary">
          Welcome to Our Chat Experience
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 font-body max-w-md">
          Engage with our intelligent assistant to get product recommendations and answers to your questions.
        </p>
        <Link href="/chat" legacyBehavior passHref>
          <Button size="lg" className="text-base sm:text-lg px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            Start Chatting
            <MessageSquare className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground font-body pt-4">
          Powered by Next.js, ShadCN UI, and Genkit AI.
        </p>
      </div>
       <footer className="absolute bottom-4 text-center w-full z-10">
        <p className="text-xs text-muted-foreground/70 font-body">
          &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
