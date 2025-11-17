import { Message } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAI = message.role === 'assistant';

  // Simple markdown-like rendering for code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const lines = code.split('\n');
        const language = lines[0].trim();
        const codeContent = lines.slice(1).join('\n');

        return (
          <pre
            key={index}
            className="bg-code-bg text-white p-4 rounded-lg my-3 overflow-x-auto"
          >
            <code className="text-sm font-mono">{codeContent || code}</code>
          </pre>
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 mb-6 animate-fade-in',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      {isAI && (
        <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm font-bold text-primary-foreground">AI</span>
        </div>
      )}
      <div
        className={cn(
          'max-w-3xl rounded-2xl px-5 py-3',
          isAI
            ? 'bg-transparent text-foreground'
            : 'bg-[hsl(0,0%,27%)] text-white'
        )}
      >
        <div className="text-sm leading-relaxed">{renderContent(message.content)}</div>
      </div>
      {!isAI && (
        <div className="w-9 h-9 rounded-md bg-[hsl(0,0%,27%)] flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm font-semibold text-white">U</span>
        </div>
      )}
    </div>
  );
};
