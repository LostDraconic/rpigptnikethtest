import { Book, User, Clock, FileText, Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/store/useCourseStore';

interface CourseInfoPanelProps {
  course: Course;
}

export const CourseInfoPanel = ({ course }: CourseInfoPanelProps) => {
  // Mock data for demo
  const officeHours = 'Tuesday & Thursday, 2:00 PM - 4:00 PM';
  const textbooks = [
    'Introduction to Algorithms (3rd Edition)',
    'Data Structures and Algorithm Analysis in C++',
  ];
  const uploadedFiles = [
    { name: 'Syllabus.pdf', date: '2025-11-01' },
    { name: 'Lecture 1 - Introduction.pdf', date: '2025-11-05' },
    { name: 'Assignment 1.pdf', date: '2025-11-08' },
  ];
  const announcements = [
    { title: 'Midterm scheduled for Nov 25', date: '2025-11-10' },
    { title: 'Office hours cancelled this week', date: '2025-11-08' },
  ];

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">{course.code}</h3>
        <p className="text-sm text-muted-foreground">{course.name}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Professor Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Professor</h4>
            </div>
            <p className="text-sm">{course.professor}</p>
            <p className="text-xs text-muted-foreground">{course.department}</p>
          </div>

          <Separator />

          {/* Office Hours */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Office Hours</h4>
            </div>
            <p className="text-sm">{officeHours}</p>
          </div>

          <Separator />

          {/* Textbooks */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Required Textbooks</h4>
            </div>
            <ul className="space-y-2">
              {textbooks.map((book, index) => (
                <li key={index} className="text-sm pl-4 border-l-2 border-primary/30">
                  {book}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Uploaded Files */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Course Materials</h4>
            </div>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="text-sm flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {file.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Announcements */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Announcements</h4>
            </div>
            <div className="space-y-2">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-primary/5 border border-primary/20"
                >
                  <p className="text-sm font-medium">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {announcement.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
