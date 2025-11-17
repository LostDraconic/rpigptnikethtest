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
        'flex gap-4 mb-6 animate-fade-in',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          'max-w-3xl rounded-2xl px-5 py-3',
          isAI
            ? 'bg-ai-message text-foreground'
            : 'bg-user-message text-white'
        )}
      >
        {isAI && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-primary">AI</span>
          </div>
        )}
        <div className="text-sm leading-relaxed">{renderContent(message.content)}</div>
      </div>
    </div>
  );
};
