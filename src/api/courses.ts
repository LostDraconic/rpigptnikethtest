import { Course } from '@/store/useCourseStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockCourses: Course[] = [
  {
    id: 'csci-1100',
    code: 'CSCI 1100',
    name: 'Computer Science I',
    department: 'Computer Science',
    professor: 'Dr. Smith',
    semester: 'Fall 2025',
    description: 'Introduction to computer programming and problem solving',
  },
  {
    id: 'csci-2300',
    code: 'CSCI 2300',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    professor: 'Dr. Johnson',
    semester: 'Fall 2025',
  },
  {
    id: 'math-1010',
    code: 'MATH 1010',
    name: 'Calculus I',
    department: 'Mathematical Sciences',
    professor: 'Dr. Williams',
    semester: 'Fall 2025',
  },
  {
    id: 'phys-1100',
    code: 'PHYS 1100',
    name: 'Physics I',
    department: 'Physics, Applied Physics, and Astronomy',
    professor: 'Dr. Brown',
    semester: 'Fall 2025',
  },
  {
    id: 'engr-1600',
    code: 'ENGR 1600',
    name: 'Introduction to Engineering',
    department: 'Mechanical, Aerospace, and Nuclear Engineering',
    professor: 'Dr. Davis',
    semester: 'Fall 2025',
  },
];

export const getCourseList = async (searchTerm?: string): Promise<Course[]> => {
  await delay(500);

  if (searchTerm) {
    return mockCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return mockCourses;
};

export const getCourseDetails = async (courseId: string): Promise<Course | null> => {
  await delay(300);
  return mockCourses.find((c) => c.id === courseId) || null;
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  await delay(800);
  const newCourse: Course = {
    ...courseData,
    id: `course-${Date.now()}`,
  };
  // Add to the mock courses array so it persists
  mockCourses.push(newCourse);
  return newCourse;
};

export const editCourse = async (
  courseId: string,
  updates: Partial<Course>
): Promise<Course> => {
  await delay(600);
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) throw new Error('Course not found');
  return { ...course, ...updates };
};

export const getTeacherCourses = async (teacherId: string): Promise<Course[]> => {
  await delay(500);
  // Return all courses for demo
  return mockCourses;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await delay(400);
  const index = mockCourses.findIndex((c) => c.id === courseId);
  if (index !== -1) {
    mockCourses.splice(index, 1);
  }
};
