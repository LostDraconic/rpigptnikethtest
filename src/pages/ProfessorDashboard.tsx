import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Upload, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const actions = [
    {
      title: 'Create a Course',
      description: 'Set up a new course with custom materials and settings',
      icon: Plus,
      onClick: () => navigate('/professor/create-course'),
      color: 'bg-primary',
    },
    {
      title: 'View My Courses',
      description: 'Manage and access all your courses',
      icon: List,
      onClick: () => navigate('/professor/courses'),
      color: 'bg-primary',
    },
    {
      title: 'Browse All Courses',
      description: 'Explore available courses and materials',
      icon: BookOpen,
      onClick: () => navigate('/dashboard'),
      color: 'bg-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}
          </h2>
          <p className="text-muted-foreground">
            Professor Dashboard - Manage your courses and teaching materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 hover:scale-105 group"
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-2xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProfessorDashboard;
