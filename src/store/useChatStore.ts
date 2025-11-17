import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  courseId: string;
  lastMessage: Date;
}

interface ChatState {
  messagesByCourse: Record<string, Message[]>;
  conversations: Conversation[];
  currentConversationId: string | null;
  currentCourseId: string | null;
  isStreaming: boolean;
  getMessages: (courseId: string) => Message[];
  setMessages: (courseId: string, messages: Message[]) => void;
  addMessage: (courseId: string, message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (id: string) => void;
  setCurrentCourse: (courseId: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  clearMessages: (courseId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByCourse: {},
  conversations: [],
  currentConversationId: null,
  currentCourseId: null,
  isStreaming: false,
  getMessages: (courseId) => get().messagesByCourse[courseId] || [],
  setMessages: (courseId, messages) => 
    set((state) => ({ 
      messagesByCourse: { ...state.messagesByCourse, [courseId]: messages } 
    })),
  addMessage: (courseId, message) => 
    set((state) => ({ 
      messagesByCourse: { 
        ...state.messagesByCourse, 
        [courseId]: [...(state.messagesByCourse[courseId] || []), message] 
      } 
    })),
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  setCurrentCourse: (courseId) => set({ currentCourseId: courseId }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  clearMessages: (courseId) => 
    set((state) => ({ 
      messagesByCourse: { ...state.messagesByCourse, [courseId]: [] } 
    })),
}));
