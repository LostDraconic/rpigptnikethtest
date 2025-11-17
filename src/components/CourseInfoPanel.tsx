import { useState } from 'react';
import { Book, User, Clock, Bell, Edit2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Course } from '@/store/useCourseStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useToast } from '@/hooks/use-toast';

interface CourseInfoPanelProps {
  course: Course;
}

export const CourseInfoPanel = ({ course }: CourseInfoPanelProps) => {
  const { isProfessor } = useAuthStore();
  const { updateCourse } = useCourseStore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    officeHours: course.officeHours || '',
    textbooks: course.textbooks?.join('\n') || '',
  });
  const [announcements, setAnnouncements] = useState(course.announcements || []);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', date: '' });

  const handleSave = () => {
    updateCourse(course.id, {
      officeHours: editData.officeHours,
      textbooks: editData.textbooks.split('\n').filter(Boolean),
      announcements,
    });
    toast({
      title: 'Course info updated',
      description: 'Changes have been saved successfully',
    });
    setIsEditDialogOpen(false);
  };

  const officeHours = course.officeHours || 'Not set';
  const textbooks = course.textbooks || [];
  const currentAnnouncements = course.announcements || [];

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{course.code}</h3>
          <p className="text-sm text-muted-foreground">{course.name}</p>
        </div>
        {isProfessor() && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Course Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input
                    id="officeHours"
                    placeholder="e.g., Tuesday & Thursday, 2:00 PM - 4:00 PM"
                    value={editData.officeHours}
                    onChange={(e) => setEditData({ ...editData, officeHours: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textbooks">Required Textbooks (one per line)</Label>
                  <Textarea
                    id="textbooks"
                    placeholder="Enter textbooks..."
                    value={editData.textbooks}
                    onChange={(e) => setEditData({ ...editData, textbooks: e.target.value })}
                    rows={4}
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

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
            {textbooks.length > 0 ? (
              <ul className="space-y-2">
                {textbooks.map((book, index) => (
                  <li key={index} className="text-sm pl-4 border-l-2 border-primary/30">
                    {book}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No textbooks listed</p>
            )}
          </div>

          <Separator />

          {/* Announcements */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Announcements</h4>
            </div>
            {currentAnnouncements.length > 0 ? (
              <div className="space-y-2">
                {currentAnnouncements.map((announcement, index) => (
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
            ) : (
              <p className="text-sm text-muted-foreground">No announcements</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
