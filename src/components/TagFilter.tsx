import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageTag } from '@/store/useChatStore';

interface TagFilterProps {
  selectedTags: MessageTag[];
  onTagsChange: (tags: MessageTag[]) => void;
}

const TAG_OPTIONS: { value: MessageTag; label: string; color: string }[] = [
  { value: 'homework', label: 'Homework', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'definition', label: 'Definition', color: 'bg-green-500/10 text-green-500' },
  { value: 'formula', label: 'Formula', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'exam', label: 'Exam', color: 'bg-red-500/10 text-red-500' },
  { value: 'important', label: 'Important', color: 'bg-orange-500/10 text-orange-500' },
];

export const TagFilter = ({ selectedTags, onTagsChange }: TagFilterProps) => {
  const toggleTag = (tag: MessageTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearTags = () => {
    onTagsChange([]);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            Filter by Tag
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {TAG_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedTags.includes(option.value)}
              onCheckedChange={() => toggleTag(option.value)}
            >
              <span className={`px-2 py-0.5 rounded text-xs ${option.color}`}>
                {option.label}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTags.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => {
              const option = TAG_OPTIONS.find((o) => o.value === tag);
              return (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`gap-1 ${option?.color}`}
                >
                  {option?.label}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:bg-background/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTags}
            className="text-xs"
          >
            Clear
          </Button>
        </>
      )}
    </div>
  );
};
