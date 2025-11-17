import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, MessageSquare } from 'lucide-react';
import { getCourseList } from '@/api/courses';
import { useCourseStore } from '@/store/useCourseStore';

const ProfessorCourses = () => {
  const navigate = useNavigate();
  const { courses, setCourses } = useCourseStore();
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/professor')}
            className="hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">
              Manage your courses and teaching materials
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 animate-fade-in">Loading courses...</div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <p className="text-muted-foreground mb-4">
              You haven't created any courses yet
            </p>
            <Button onClick={() => navigate('/professor/create-course')}>
              Create Your First Course
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 animate-fade-in">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="p-6 transition-all hover:shadow-lg hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm font-semibold text-primary">
                        {course.code}
                      </div>
                      {course.semester && (
                        <div className="text-xs text-muted-foreground">
                          {course.semester}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.department}
                    </p>
                    {course.description && (
                      <p className="text-sm mt-2">{course.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/upload/${course.id}`)}
                      className="transition-all hover:scale-105"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/chat/${course.id}`)}
                      className="transition-all hover:scale-105"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfessorCourses;
