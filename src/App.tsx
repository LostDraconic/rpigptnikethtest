import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import CreateCourse from "./pages/CreateCourse";
import ProfessorCourses from "./pages/ProfessorCourses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Shared Routes */}
            <Route
              path="/chat/:courseId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload/:courseId"
              element={
                <ProtectedRoute requireRole="professor">
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            
            {/* Professor Routes */}
            <Route
              path="/professor"
              element={
                <ProtectedRoute requireRole="professor">
                  <ProfessorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/create-course"
              element={
                <ProtectedRoute requireRole="professor">
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/courses"
              element={
                <ProtectedRoute requireRole="professor">
                  <ProfessorCourses />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
