import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { loginWithSSO } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/store/useAuthStore';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      const user = await loginWithSSO(role);
      login(user);
      
      toast({
        title: 'Welcome to RPI GPT',
        description: `Signed in as ${user.name}`,
      });

      if (role === 'professor') {
        navigate('/professor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">RPI GPT</h1>
          <p className="text-xl text-muted-foreground mb-1">
            Intelligent Course Assistant
          </p>
          <p className="text-sm text-muted-foreground">
            Rensselaer Polytechnic Institute
          </p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Sign in to continue
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Use your RPI credentials to access course materials and AI assistance
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => handleLogin('student')}
              disabled={loading}
              size="lg"
              className="w-full gap-2"
            >
              <Lock className="w-4 h-4" />
              Sign in as Student
            </Button>

            <Button
              onClick={() => handleLogin('professor')}
              disabled={loading}
              size="lg"
              variant="outline"
              className="w-full gap-2"
            >
              <Lock className="w-4 h-4" />
              Sign in as Professor
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            This is a secure authentication portal using RPI's Central Authentication
            Service
          </p>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Protected by RPI authentication and security standards
        </p>
      </div>
    </div>
  );
};

export default Login;
