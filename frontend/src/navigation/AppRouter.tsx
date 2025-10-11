import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from '@/components/Layout';

// Pages
import HomePage from '@/features/movies/components/HomePage';
import MovieDetailPage from '@/features/movies/components/MovieDetailPage';
import ScreeningListPage from '@/features/screenings/components/ScreeningListPage';
import SeatSelectionPage from '@/features/booking/components/SeatSelectionPage';
import LoginPage from '@/features/auth/components/LoginPage';
import RegisterPage from '@/features/auth/components/RegisterPage';
import BookingPage from '@/features/booking/components/BookingPage';

// Hooks
import { useAuth } from '@/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="movies/:id" element={<MovieDetailPage />} />
            <Route path="movies/:movieId/screenings" element={<ScreeningListPage />} />
            
            {/* Auth Routes */}
            <Route 
              path="login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="booking/:movieId/screening/:screeningId" 
              element={
                <ProtectedRoute>
                  <SeatSelectionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="booking/:movieId" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppRouter;
