import { Plus, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/useChatStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { ConversationItem } from './ConversationItem';

export const ChatSidebar = () => {
  const {
    getConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    currentConversationId,
    setCurrentConversation,
    currentCourseId,
  } = useChatStore();
  const { selectedCourse } = useCourseStore();
  const { isProfessor } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = currentCourseId ? getConversations(currentCourseId) : [];

  const handleNewChat = () => {
    if (currentCourseId) {
      const newId = createConversation(currentCourseId);
      setCurrentConversation(newId);
    }
  };

  const handleUpload = () => {
    if (selectedCourse) {
      navigate(`/upload/${selectedCourse.id}`);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-chat-sidebar-bg text-chat-sidebar-fg flex flex-col min-h-screen border-r border-chat-sidebar-hover">
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

      <div className="px-4 py-3 border-b border-chat-sidebar-hover">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chat-sidebar-fg/60" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-chat-sidebar-hover/50 border-chat-sidebar-hover text-chat-sidebar-fg placeholder:text-chat-sidebar-fg/40"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-xs text-chat-sidebar-fg/40 py-4">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                id={conv.id}
                title={conv.title}
                lastMessage={conv.lastMessage}
                isActive={conv.id === currentConversationId}
                onClick={() => setCurrentConversation(conv.id)}
                onRename={(newTitle) => renameConversation(conv.id, newTitle)}
                onDelete={() => deleteConversation(conv.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
