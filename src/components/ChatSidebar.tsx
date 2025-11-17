import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/useChatStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export const ChatSidebar = () => {
  const { conversations, clearMessages, currentCourseId } = useChatStore();
  const { selectedCourse } = useCourseStore();
  const { isProfessor } = useAuthStore();
  const navigate = useNavigate();

  const handleNewChat = () => {
    if (currentCourseId) {
      clearMessages(currentCourseId);
    }
  };

  const handleUpload = () => {
    if (selectedCourse) {
      navigate(`/upload/${selectedCourse.id}`);
    }
  };

  return (
    <div className="w-64 bg-chat-sidebar-bg text-chat-sidebar-fg flex flex-col h-screen border-r border-chat-sidebar-hover">
      <div className="p-4 space-y-2">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-transparent border border-chat-sidebar-hover hover:bg-chat-sidebar-hover text-chat-sidebar-fg"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        {isProfessor() && selectedCourse && (
          <Button
            onClick={handleUpload}
            className="w-full justify-start gap-2 bg-transparent border border-chat-sidebar-hover hover:bg-chat-sidebar-hover text-chat-sidebar-fg"
            variant="outline"
          >
            <Upload className="w-4 h-4" />
            Upload Materials
          </Button>
        )}
      </div>

      {selectedCourse && (
        <div className="px-4 py-3 border-b border-chat-sidebar-hover">
          <div className="text-xs text-chat-sidebar-fg/60 mb-1">Current Course</div>
          <div className="font-semibold text-sm">{selectedCourse.code}</div>
          <div className="text-xs text-chat-sidebar-fg/80">
            {selectedCourse.name}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left px-3 py-2 rounded hover:bg-chat-sidebar-hover transition-colors text-sm"
            >
              <div className="font-medium truncate">{conv.title}</div>
              <div className="text-xs text-chat-sidebar-fg/60">
                {format(new Date(conv.lastMessage), 'MM/dd/yyyy')}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
