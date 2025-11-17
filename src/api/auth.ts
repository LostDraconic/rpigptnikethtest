import { User, UserRole } from '@/store/useAuthStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginWithSSO = async (role: UserRole): Promise<User> => {
  await delay(1000);

  const mockUsers: Record<UserRole, User> = {
    student: {
      id: 'student-1',
      name: 'John Doe',
      email: 'doej@rpi.edu',
      role: 'student',
    },
    professor: {
      id: 'prof-1',
      name: 'Dr. Smith',
      email: 'smithd@rpi.edu',
      role: 'professor',
    },
  };

  return mockUsers[role];
};

export const getCurrentUser = async (): Promise<User | null> => {
  await delay(300);
  // In a real app, this would validate the session
  return null;
};

export const logout = async (): Promise<void> => {
  await delay(300);
  // Clear session
};
