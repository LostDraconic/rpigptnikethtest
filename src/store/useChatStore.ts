import { create } from 'zustand';

export type MessageTag = 'homework' | 'definition' | 'formula' | 'exam' | 'important';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tags?: MessageTag[];
  isPinned?: boolean;
  attachments?: {
    type: 'image' | 'pdf' | 'code';
    url?: string;
    content?: string;
    language?: string;
  }[];
}

export interface Conversation {
  id: string;
  title: string;
  courseId: string;
  lastMessage: Date;
  messages: Message[];
}

interface ChatState {
  conversationsByCourse: Record<string, Conversation[]>;
  currentConversationId: string | null;
  currentCourseId: string | null;
  isStreaming: boolean;
  selectedTags: MessageTag[];
  
  // Conversation management
  getConversations: (courseId: string) => Conversation[];
  createConversation: (courseId: string, title?: string) => string;
  renameConversation: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  setCurrentConversation: (id: string | null) => void;
  
  // Message management
  getCurrentMessages: () => Message[];
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  togglePinMessage: (messageId: string) => void;
  addMessageTag: (messageId: string, tag: MessageTag) => void;
  removeMessageTag: (messageId: string, tag: MessageTag) => void;
  
  // Filters
  setSelectedTags: (tags: MessageTag[]) => void;
  getPinnedMessages: () => Message[];
  
  // State
  setCurrentCourse: (courseId: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversationsByCourse: {},
  currentConversationId: null,
  currentCourseId: null,
  isStreaming: false,
  selectedTags: [],
  
  getConversations: (courseId) => get().conversationsByCourse[courseId] || [],
  
  createConversation: (courseId, title) => {
    const id = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id,
      title: title || 'New Chat',
      courseId,
      lastMessage: new Date(),
      messages: [],
    };
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [courseId]: [...(state.conversationsByCourse[courseId] || []), newConv],
      },
      currentConversationId: id,
    }));
    
    return id;
  },
  
  renameConversation: (conversationId, title) => {
    const { conversationsByCourse, currentCourseId } = get();
    if (!currentCourseId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, title } : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  deleteConversation: (conversationId) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId) return;
    
    const conversations = (conversationsByCourse[currentCourseId] || []).filter(
      (conv) => conv.id !== conversationId
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: conversations,
      },
      currentConversationId:
        currentConversationId === conversationId ? null : currentConversationId,
    }));
  },
  
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  
  getCurrentMessages: () => {
    const { conversationsByCourse, currentCourseId, currentConversationId, selectedTags } = get();
    if (!currentCourseId || !currentConversationId) return [];
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const conversation = conversations.find((c) => c.id === currentConversationId);
    
    if (!conversation) return [];
    
    let messages = conversation.messages;
    
    // Filter by tags if any selected
    if (selectedTags.length > 0) {
      messages = messages.filter((msg) =>
        msg.tags?.some((tag) => selectedTags.includes(tag))
      );
    }
    
    return messages;
  },
  
  addMessage: (message) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: new Date(),
            title: conv.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 50)
              : conv.title,
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  updateMessage: (messageId, updates) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  deleteMessage: (messageId) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: conv.messages.filter((msg) => msg.id !== messageId),
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  togglePinMessage: (messageId) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
            ),
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  addMessageTag: (messageId, tag) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId
                ? { ...msg, tags: [...(msg.tags || []), tag] }
                : msg
            ),
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  removeMessageTag: (messageId, tag) => {
    const { conversationsByCourse, currentCourseId, currentConversationId } = get();
    if (!currentCourseId || !currentConversationId) return;
    
    const conversations = conversationsByCourse[currentCourseId] || [];
    const updated = conversations.map((conv) =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId
                ? { ...msg, tags: (msg.tags || []).filter((t) => t !== tag) }
                : msg
            ),
          }
        : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [currentCourseId]: updated,
      },
    }));
  },
  
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  
  getPinnedMessages: () => {
    const messages = get().getCurrentMessages();
    return messages.filter((msg) => msg.isPinned);
  },
  
  setCurrentCourse: (courseId) => set({ currentCourseId: courseId }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
