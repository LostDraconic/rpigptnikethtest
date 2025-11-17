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
  currentUserId: string | null;
  isStreaming: boolean;
  selectedTags: MessageTag[];
  
  // User management
  setCurrentUser: (userId: string) => void;
  
  // Conversation management
  getConversations: (courseId: string, userId: string) => Conversation[];
  createConversation: (courseId: string, userId: string, title?: string) => string;
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
  currentUserId: null,
  isStreaming: false,
  selectedTags: [],
  
  setCurrentUser: (userId) => set({ currentUserId: userId }),
  
  getConversations: (courseId, userId) => {
    const key = `${courseId}-${userId}`;
    return get().conversationsByCourse[key] || [];
  },
  
  createConversation: (courseId, userId, title) => {
    const id = `conv-${Date.now()}-${userId}`;
    const key = `${courseId}-${userId}`;
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
        [key]: [...(state.conversationsByCourse[key] || []), newConv],
      },
      currentConversationId: id,
    }));
    
    return id;
  },
  
  renameConversation: (conversationId, title) => {
    const { conversationsByCourse, currentCourseId, currentUserId } = get();
    if (!currentCourseId || !currentUserId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
    const updated = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, title } : conv
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [key]: updated,
      },
    }));
  },
  
  deleteConversation: (conversationId) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = (conversationsByCourse[key] || []).filter(
      (conv) => conv.id !== conversationId
    );
    
    set((state) => ({
      conversationsByCourse: {
        ...state.conversationsByCourse,
        [key]: conversations,
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
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
      },
    }));
  },
  
  updateMessage: (messageId, updates) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
      },
    }));
  },
  
  deleteMessage: (messageId) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
      },
    }));
  },
  
  togglePinMessage: (messageId) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
      },
    }));
  },
  
  addMessageTag: (messageId, tag) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
      },
    }));
  },
  
  removeMessageTag: (messageId, tag) => {
    const { conversationsByCourse, currentCourseId, currentUserId, currentConversationId } = get();
    if (!currentCourseId || !currentUserId || !currentConversationId) return;
    
    const key = `${currentCourseId}-${currentUserId}`;
    const conversations = conversationsByCourse[key] || [];
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
        [key]: updated,
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
