import { Course } from '@/store/useCourseStore';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${course.id}`);
  };

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <BookOpen className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-primary mb-1">{course.code}</div>
          <h3 className="font-bold text-lg mb-1 truncate">{course.name}</h3>
          <p className="text-sm text-muted-foreground">{course.department}</p>
          <p className="text-sm text-muted-foreground">{course.professor}</p>
        </div>
      </div>
    </Card>
  );
};
