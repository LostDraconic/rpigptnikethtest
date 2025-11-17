import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChatStore, Message } from '@/store/useChatStore';
import { useCourseStore } from '@/store/useCourseStore';
import { sendMessage, getChatHistory } from '@/api/chat';
import { getCourseDetails } from '@/api/courses';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { messages, addMessage, setMessages, setConversations, isStreaming, setIsStreaming } = useChatStore();
  const { selectCourse, selectedCourse } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCourseData = async (id: string) => {
    try {
      const [course, history] = await Promise.all([
        getCourseDetails(id),
        getChatHistory(id),
      ]);

      if (course) {
        selectCourse(course);
        setConversations(history);
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!courseId || isStreaming) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsStreaming(true);

    try {
      const response = await sendMessage(courseId, content);
      addMessage(response);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Course not found</div>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />

        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b px-6 flex items-center justify-between bg-background">
            <div>
              <h2 className="font-bold text-lg">{selectedCourse.code} - {selectedCourse.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedCourse.professor}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <ScrollArea className="flex-1 bg-background">
            <div className="max-w-4xl mx-auto p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">Start a conversation</p>
                  <p className="text-sm">
                    Ask questions about {selectedCourse.name} and get AI-powered
                    assistance
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              {isStreaming && (
                <div className="flex gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
