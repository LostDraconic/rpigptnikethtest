import { Message, Conversation } from '@/store/useChatStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Understanding Binary Search Trees',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-15'),
    messages: [],
  },
  {
    id: 'conv-2',
    title: 'Homework 3 Question 2',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-14'),
    messages: [],
  },
  {
    id: 'conv-3',
    title: 'Midterm Review Topics',
    courseId: 'csci-1100',
    lastMessage: new Date('2025-11-13'),
    messages: [],
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

export const regenerateMessage = async (
  courseId: string,
  messageId: string
): Promise<Message> => {
  await delay(1200);
  
  const response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date(),
  };
};

export const improveMessage = async (
  courseId: string,
  messageId: string,
  originalContent: string
): Promise<Message> => {
  await delay(1500);
  
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `Here's an improved, more detailed explanation:\n\n${originalContent}\n\nAdditionally, let me break this down step-by-step to make it clearer...`,
    timestamp: new Date(),
  };
};

export const summarizeChat = async (
  courseId: string,
  messages: Message[]
): Promise<string> => {
  await delay(2000);
  
  return `**Chat Summary**\n\nThis conversation covered the following key points:\n\n1. Core concepts and definitions\n2. Practical applications and examples\n3. Common pitfalls and best practices\n\nKey takeaways:\n- Understanding the fundamental principles is crucial\n- Practice with real examples helps solidify concepts\n- Always consider edge cases in your solutions`;
};

export const convertToStudyNotes = async (
  courseId: string,
  messages: Message[]
): Promise<string> => {
  await delay(2200);
  
  return `# Study Notes\n\n## Key Concepts\n\n- **Definition 1**: Core concept explanation\n- **Definition 2**: Important principle\n\n## Formulas\n\n\`\`\`\nFormula 1: x = y + z\nFormula 2: a = b * c\n\`\`\`\n\n## Practice Problems\n\n1. Apply concept to solve...\n2. Consider the case where...\n\n## Exam Tips\n\n- Remember to check edge cases\n- Show your work step-by-step\n- Double-check your answers`;
};

export const convertToStepByStep = async (
  courseId: string,
  content: string
): Promise<string> => {
  await delay(1800);
  
  return `## Step-by-Step Explanation\n\n**Step 1**: First, identify the problem requirements\n- Break down what's being asked\n- Note any constraints or special conditions\n\n**Step 2**: Plan your approach\n- Choose the appropriate method or algorithm\n- Consider time and space complexity\n\n**Step 3**: Implement the solution\n- Write clean, readable code\n- Add comments for clarity\n\n**Step 4**: Test and verify\n- Try with different test cases\n- Check edge cases\n\n**Step 5**: Optimize if needed\n- Look for inefficiencies\n- Consider alternative approaches`;
};
