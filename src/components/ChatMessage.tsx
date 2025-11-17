import { Message } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAI = message.role === 'assistant';
  const [isExpanded, setIsExpanded] = useState(true);
  const contentLength = message.content.length;
  const shouldTruncate = contentLength > 1000;

  // Simple markdown-like rendering for code blocks
  const renderContent = (content: string, truncate: boolean = false) => {
    const displayContent = truncate && !isExpanded ? content.slice(0, 500) + '...' : content;
    const parts = displayContent.split(/(```[\s\S]*?```)/g);

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
            {language && (
              <div className="text-xs text-muted-foreground mb-2">{language}</div>
            )}
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
      id={`msg-${message.id}`}
      className={cn(
        'flex gap-3 animate-fade-in',
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
        <div className="text-sm leading-relaxed">
          {renderContent(message.content, shouldTruncate)}
        </div>
        
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 h-7 text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}

        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {message.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {!isAI && (
        <div className="w-9 h-9 rounded-md bg-[hsl(0,0%,27%)] flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm font-semibold text-white">U</span>
        </div>
      )}
    </div>
  );
};
