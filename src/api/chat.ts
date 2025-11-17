import { Message, Conversation } from '@/store/useChatStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Understanding Binary Search Trees',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-15'),
  },
  {
    id: 'conv-2',
    title: 'Homework 3 Question 2',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-14'),
  },
  {
    id: 'conv-3',
    title: 'Midterm Review Topics',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-13'),
  },
];

const mockResponses = [
  "This relates directly to what Professor mentioned in the recent lecture. The core concept is that we need to balance efficiency with readability. Consider this implementation:\n\n```javascript\nfunction optimizedSolution(arr) {\n  return arr.reduce((acc, val) => acc + val, 0);\n}\n```\n\nThis approach is both clean and performant.",
  "Great question! Let me break this down step by step:\n\n1. First, identify the base case\n2. Then, determine the recursive relationship\n3. Finally, implement with proper bounds checking\n\nWould you like me to provide a specific example?",
  "Based on the course materials, here's what you need to focus on:\n\n- Time complexity analysis\n- Space optimization techniques\n- Edge case handling\n\nThe key insight is understanding the trade-offs between different approaches.",
];

export const sendMessage = async (
  courseId: string,
  message: string
): Promise<Message> => {
  await delay(1500);

  const response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date(),
  };
};

export const streamMessage = async (
  courseId: string,
  message: string,
  onToken: (token: string) => void
): Promise<void> => {
  // Initial delay before streaming starts
  await delay(800);
  
  const response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];
  const words = response.split(' ');

  for (const word of words) {
    await delay(50);
    onToken(word + ' ');
  }
};

export const getChatHistory = async (courseId: string): Promise<Conversation[]> => {
  await delay(400);
  return mockConversations.filter((c) => c.courseId === courseId);
};
