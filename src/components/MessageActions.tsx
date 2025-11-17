import { Copy, RotateCcw, Sparkles, Pin, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MessageTag } from '@/store/useChatStore';
import { toast } from 'sonner';

interface MessageActionsProps {
  messageId: string;
  content: string;
  isPinned?: boolean;
  tags?: MessageTag[];
  onCopy: () => void;
  onRegenerate?: () => void;
  onImprove?: () => void;
  onPin: () => void;
  onDelete: () => void;
  onAddTag: (tag: MessageTag) => void;
  onRemoveTag: (tag: MessageTag) => void;
}

const TAG_OPTIONS: { value: MessageTag; label: string }[] = [
  { value: 'homework', label: 'Homework' },
  { value: 'definition', label: 'Definition' },
  { value: 'formula', label: 'Formula' },
  { value: 'exam', label: 'Exam' },
  { value: 'important', label: 'Important' },
];

export const MessageActions = ({
  messageId,
  content,
  isPinned,
  tags = [],
  onCopy,
  onRegenerate,
  onImprove,
  onPin,
  onDelete,
  onAddTag,
  onRemoveTag,
}: MessageActionsProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    onCopy();
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="h-7 px-2"
        title="Copy message"
      >
        <Copy className="w-3 h-3" />
      </Button>

      {onRegenerate && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRegenerate}
          className="h-7 px-2"
          title="Regenerate response"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      )}

      {onImprove && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onImprove}
          className="h-7 px-2"
          title="Improve answer"
        >
          <Sparkles className="w-3 h-3" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onPin}
        className={`h-7 px-2 ${isPinned ? 'text-primary' : ''}`}
        title={isPinned ? 'Unpin message' : 'Pin message'}
      >
        <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            title="Add tag"
          >
            <Tag className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {TAG_OPTIONS.map((option) => {
            const hasTag = tags.includes(option.value);
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  hasTag ? onRemoveTag(option.value) : onAddTag(option.value)
                }
                className="cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-2" />
                {option.label}
                {hasTag && <span className="ml-auto text-primary">✓</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenuSeparator className="h-4 mx-1" />

      <Button
        size="sm"
        variant="ghost"
        onClick={onDelete}
        className="h-7 px-2 hover:text-destructive"
        title="Delete message"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};
