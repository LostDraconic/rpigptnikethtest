import { create } from 'zustand';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  professor: string;
  semester?: string;
  description?: string;
  tags?: string[];
  officeHours?: string;
  textbooks?: string[];
  announcements?: { title: string; date: string }[];
}

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  setCourses: (courses: Course[]) => void;
  selectCourse: (course: Course) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  selectedCourse: null,
  setCourses: (courses) => set({ courses }),
  selectCourse: (course) => set({ selectedCourse: course }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, updates) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}));
