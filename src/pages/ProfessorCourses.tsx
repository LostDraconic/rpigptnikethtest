import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { getCourseList, deleteCourse } from '@/api/courses';
import { useCourseStore, Course } from '@/store/useCourseStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ProfessorCourses = () => {
  const navigate = useNavigate();
  const { courses, setCourses, updateCourse } = useCourseStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
  });

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

  const handleEdit = (course: Course) => {
    if (course.professor !== user?.name) {
      toast.error('You can only edit your own courses');
      return;
    }
    setEditingCourse(course);
    setEditForm({
      name: course.name,
      code: course.code,
      description: course.description || '',
      semester: course.semester || '',
    });
  };

  const handleSaveEdit = () => {
    if (editingCourse) {
      updateCourse(editingCourse.id, editForm);
      toast.success('Course updated successfully');
      setEditingCourse(null);
    }
  };

  const handleDelete = async (courseId: string, courseProfessor: string) => {
    if (courseProfessor !== user?.name) {
      toast.error('You can only delete your own courses');
      return;
    }
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        const data = await getCourseList();
        setCourses(data);
        toast.success('Course deleted successfully');
      } catch (error) {
        toast.error('Failed to delete course');
      }
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
                      onClick={() => handleEdit(course)}
                      className="transition-all hover:scale-105"
                      disabled={course.professor !== user?.name}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id, course.professor)}
                      className="transition-all hover:scale-105 hover:bg-destructive hover:text-destructive-foreground"
                      disabled={course.professor !== user?.name}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
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

      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-code">Course Code</Label>
              <Input
                id="edit-code"
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Course Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-semester">Semester</Label>
              <Input
                id="edit-semester"
                value={editForm.semester}
                onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCourse(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessorCourses;
