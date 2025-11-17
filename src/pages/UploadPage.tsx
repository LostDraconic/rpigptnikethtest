import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getCourseDetails } from '@/api/courses';
import { uploadFiles } from '@/api/uploads';
import { Course } from '@/store/useCourseStore';
import { useToast } from '@/hooks/use-toast';

const UploadPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    const data = await getCourseDetails(id);
    setCourse(data);
  };

  const handleUpload = async (files: File[]) => {
    if (!courseId) return;

    try {
      await uploadFiles(courseId, files);
      toast({
        title: 'Upload successful',
        description: `${files.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/professor/courses')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upload Course Materials</h1>
            <p className="text-muted-foreground">
              {course.code} - {course.name}
            </p>
          </div>
        </div>

        <FileUploader onUpload={handleUpload} />
      </main>
    </div>
  );
};

export default UploadPage;
