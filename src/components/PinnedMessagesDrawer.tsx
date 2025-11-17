import { Pin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Message } from '@/store/useChatStore';
import { format } from 'date-fns';

interface PinnedMessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedMessages: Message[];
  onUnpin: (messageId: string) => void;
  onJumpTo: (messageId: string) => void;
}

export const PinnedMessagesDrawer = ({
  isOpen,
  onClose,
  pinnedMessages,
  onUnpin,
  onJumpTo,
}: PinnedMessagesDrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pin className="w-5 h-5" />
            Pinned Messages
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {pinnedMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Pin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No pinned messages</p>
              <p className="text-sm mt-1">
                Pin important messages to find them quickly
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pinnedMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => onJumpTo(message.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      {message.role === 'assistant' ? 'AI' : 'You'} •{' '}
                      {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnpin(message.id);
                      }}
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm line-clamp-4">{message.content}</p>
                  {message.tags && message.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
