import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  const { user, logout, isProfessor } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (isProfessor()) {
      navigate('/professor');
    } else {
      navigate('/dashboard');
    }
  };

  if (!user) return null;

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <button 
        onClick={handleLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">RPI GPT</h1>
      </button>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {user.email}
              </span>
              <Badge
                variant="secondary"
                className={
                  user.role === 'professor'
                    ? 'bg-badge-professor/10 text-badge-professor border-badge-professor/20 w-fit'
                    : 'bg-badge-student/10 text-badge-student border-badge-student/20 w-fit'
                }
              >
                {user.role.toUpperCase()}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
