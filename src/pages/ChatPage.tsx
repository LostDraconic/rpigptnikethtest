import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChatStore, Message } from '@/store/useChatStore';
import { useCourseStore } from '@/store/useCourseStore';
import {
  sendMessage,
  regenerateMessage,
  improveMessage,
  summarizeChat,
  convertToStudyNotes,
  convertToStepByStep,
} from '@/api/chat';
import { getCourseDetails } from '@/api/courses';
import { Button } from '@/components/ui/button';
import { Home, Pin, FileText, List, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinnedMessagesDrawer } from '@/components/PinnedMessagesDrawer';
import { CourseInfoPanel } from '@/components/CourseInfoPanel';
import { TagFilter } from '@/components/TagFilter';
import { MessageActions } from '@/components/MessageActions';
import { toast } from 'sonner';

const ChatPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    getCurrentMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    togglePinMessage,
    addMessageTag,
    removeMessageTag,
    setCurrentCourse,
    createConversation,
    setCurrentConversation,
    currentConversationId,
    isStreaming,
    setIsStreaming,
    selectedTags,
    setSelectedTags,
    getPinnedMessages,
  } = useChatStore();
  const { selectCourse, selectedCourse } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [showPinned, setShowPinned] = useState(false);
  const [showCourseInfo, setShowCourseInfo] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = getCurrentMessages();
  const pinnedMessages = getPinnedMessages();

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
      setCurrentCourse(courseId);
      
      // Create initial conversation if none exists
      if (!currentConversationId) {
        const newId = createConversation(courseId);
        setCurrentConversation(newId);
      }
    }
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCourseData = async (id: string) => {
    try {
      const course = await getCourseDetails(id);
      if (course) {
        selectCourse(course);
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
      toast.error('Failed to send message');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (!courseId || isStreaming) return;

    setIsStreaming(true);
    try {
      const response = await regenerateMessage(courseId, messageId);
      updateMessage(messageId, { content: response.content });
      toast.success('Response regenerated');
    } catch (error) {
      toast.error('Failed to regenerate response');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleImprove = async (messageId: string, content: string) => {
    if (!courseId || isStreaming) return;

    setIsStreaming(true);
    try {
      const response = await improveMessage(courseId, messageId, content);
      addMessage(response);
      toast.success('Generated improved answer');
    } catch (error) {
      toast.error('Failed to improve answer');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSummarize = async () => {
    if (!courseId || processingAction) return;

    setProcessingAction(true);
    try {
      const summary = await summarizeChat(courseId, messages);
      const summaryMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: summary,
        timestamp: new Date(),
        tags: ['important'],
      };
      addMessage(summaryMessage);
      toast.success('Chat summarized');
    } catch (error) {
      toast.error('Failed to summarize chat');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleConvertToNotes = async () => {
    if (!courseId || processingAction) return;

    setProcessingAction(true);
    try {
      const notes = await convertToStudyNotes(courseId, messages);
      const notesMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: notes,
        timestamp: new Date(),
        tags: ['important'],
      };
      addMessage(notesMessage);
      toast.success('Study notes created');
    } catch (error) {
      toast.error('Failed to create study notes');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleStepByStep = async (content: string) => {
    if (!courseId || processingAction) return;

    setProcessingAction(true);
    try {
      const stepByStep = await convertToStepByStep(courseId, content);
      const stepMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: stepByStep,
        timestamp: new Date(),
      };
      addMessage(stepMessage);
      toast.success('Step-by-step explanation generated');
    } catch (error) {
      toast.error('Failed to generate explanation');
    } finally {
      setProcessingAction(false);
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPinned(true)}
                className="gap-2"
              >
                <Pin className="w-4 h-4" />
                Pinned ({pinnedMessages.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCourseInfo(!showCourseInfo)}
                className="gap-2"
              >
                <Info className="w-4 h-4" />
                Course Info
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>

          <div className="px-6 py-3 border-b bg-muted/30 flex items-center justify-between">
            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                disabled={processingAction || messages.length === 0}
              >
                <FileText className="w-4 h-4 mr-2" />
                Summarize Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToNotes}
                disabled={processingAction || messages.length === 0}
              >
                <List className="w-4 h-4 mr-2" />
                Create Study Notes
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
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
                    <div key={message.id} className="group mb-6">
                      <ChatMessage message={message} />
                      <MessageActions
                        messageId={message.id}
                        content={message.content}
                        isPinned={message.isPinned}
                        tags={message.tags}
                        onCopy={() => {}}
                        onRegenerate={
                          message.role === 'assistant'
                            ? () => handleRegenerate(message.id)
                            : undefined
                        }
                        onImprove={
                          message.role === 'assistant'
                            ? () => handleImprove(message.id, message.content)
                            : undefined
                        }
                        onPin={() => togglePinMessage(message.id)}
                        onDelete={() => deleteMessage(message.id)}
                        onAddTag={(tag) => addMessageTag(message.id, tag)}
                        onRemoveTag={(tag) => removeMessageTag(message.id, tag)}
                      />
                    </div>
                  ))
                )}
                {isStreaming && (
                  <div className="flex gap-3 mb-6 animate-fade-in">
                    <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">AI</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {showCourseInfo && <CourseInfoPanel course={selectedCourse} />}
          </div>

          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>
      </div>

      <PinnedMessagesDrawer
        isOpen={showPinned}
        onClose={() => setShowPinned(false)}
        pinnedMessages={pinnedMessages}
        onUnpin={togglePinMessage}
        onJumpTo={(messageId) => {
          const element = document.getElementById(`msg-${messageId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setShowPinned(false);
        }}
      />
    </div>
  );
};

export default ChatPage;
