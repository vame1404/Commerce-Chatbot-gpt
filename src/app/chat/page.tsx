import type { Metadata } from 'next';
import CommerceChat from '@/components/CommerceChat';

export const metadata: Metadata = {
  title: 'CommerceChat',
  description: 'Intelligent E-commerce Chatbot',
};

export default function ChatPage() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center">
      <CommerceChat />
    </main>
  );
}
