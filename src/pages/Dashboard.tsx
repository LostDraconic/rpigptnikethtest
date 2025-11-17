import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import { getCourseList } from '@/api/courses';
import { useCourseStore } from '@/store/useCourseStore';
import { useAuthStore } from '@/store/useAuthStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { courses, setCourses } = useCourseStore();
  const { user, isProfessor } = useAuthStore();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourseList();
      setCourses(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="animate-fade-in">
          {isProfessor() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/professor')}
              className="mb-4 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Professor Dashboard
            </Button>
          )}
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}
          </h2>
          <p className="text-muted-foreground">
            Select a course to start chatting with your AI assistant
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select a Course</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {recentCourses.length > 0 && !searchTerm && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold">Recent Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 animate-fade-in">
          <h3 className="text-xl font-semibold">All Courses</h3>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No courses found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
