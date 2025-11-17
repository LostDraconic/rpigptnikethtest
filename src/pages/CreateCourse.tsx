import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { createCourse } from '@/api/courses';
import { useCourseStore } from '@/store/useCourseStore';
import { useToast } from '@/hooks/use-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { addCourse } = useCourseStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    semester: '',
    description: '',
    tags: '',
    officeHours: '',
    textbooks: '',
  });
  const [announcements, setAnnouncements] = useState<{ title: string; date: string }[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', date: '' });

  const departments = [
    'Biomedical Engineering',
    'Chemical and Biological Engineering',
    'Civil and Environmental Engineering',
    'Electrical, Computer, and Systems Engineering',
    'Industrial and Systems Engineering',
    'Materials Science and Engineering',
    'Mechanical, Aerospace, and Nuclear Engineering',
    'Biological Sciences',
    'Chemistry and Chemical Biology',
    'Computer Science',
    'Earth and Environmental Sciences',
    'Mathematical Sciences',
    'Physics, Applied Physics, and Astronomy',
    'Arts',
    'Cognitive Science',
    'Communication and Media',
    'Economics',
    'Games and Simulation Arts and Sciences',
    'Science and Technology Studies',
    'Architecture',
    'Lighting (Graduate program)',
    'Business / Management Programs (Lally)',
  ];

  const semesters = ['Fall 2025', 'Spring 2026', 'Summer 2026'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newCourse = await createCourse({
        ...formData,
        professor: 'Dr. Smith', // Would come from auth in real app
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        textbooks: formData.textbooks ? formData.textbooks.split('\n').map((t) => t.trim()).filter(Boolean) : [],
        announcements,
      });

      addCourse(newCourse);
      
      toast({
        title: 'Course created',
        description: 'Your course has been successfully created',
      });

      navigate('/professor/courses');
    } catch (error) {
      toast({
        title: 'Failed to create course',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/professor')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create a New Course</h1>
            <p className="text-muted-foreground">
              Set up a new course with custom materials and settings
            </p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CSCI 1200"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semester: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures and Algorithms"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the course..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., programming, algorithms, data structures"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeHours">Office Hours</Label>
              <Input
                id="officeHours"
                placeholder="e.g., Tuesday & Thursday, 2:00 PM - 4:00 PM"
                value={formData.officeHours}
                onChange={(e) =>
                  setFormData({ ...formData, officeHours: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textbooks">Required Textbooks (one per line)</Label>
              <Textarea
                id="textbooks"
                placeholder="e.g., Introduction to Algorithms (3rd Edition)"
                value={formData.textbooks}
                onChange={(e) =>
                  setFormData({ ...formData, textbooks: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Announcements</Label>
              <div className="space-y-2">
                {announcements.map((ann, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ann.title}</p>
                      <p className="text-xs text-muted-foreground">{ann.date}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAnnouncements(announcements.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newAnnouncement.date}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                    className="w-40"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newAnnouncement.title && newAnnouncement.date) {
                        setAnnouncements([...announcements, newAnnouncement]);
                        setNewAnnouncement({ title: '', date: '' });
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} size="lg" className="flex-1">
                Create Course
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/professor')}
                disabled={loading}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateCourse;
