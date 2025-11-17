import { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  id: string;
  title: string;
  lastMessage: Date;
  isActive: boolean;
  onClick: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

export const ConversationItem = ({
  id,
  title,
  lastMessage,
  isActive,
  onClick,
  onRename,
  onDelete,
}: ConversationItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSave = () => {
    if (editValue.trim()) {
      onRename(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="px-3 py-2 space-y-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="h-8 text-sm bg-chat-sidebar-hover border-chat-sidebar-fg/20"
          autoFocus
        />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 p-0"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group px-3 py-2 rounded transition-colors cursor-pointer relative',
        isActive
          ? 'bg-chat-sidebar-hover text-chat-sidebar-fg'
          : 'hover:bg-chat-sidebar-hover/50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{title}</div>
          <div className="text-xs text-chat-sidebar-fg/60">
            {format(new Date(lastMessage), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
      
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="h-6 w-6 p-0 hover:bg-chat-sidebar-bg"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
