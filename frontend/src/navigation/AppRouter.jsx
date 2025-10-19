// @ts-check
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Layout
import Layout from '@/components/Layout';

// Pages
import HomePage from '@/features/movies/components/HomePage';
import MovieDetailPage from '@/features/movies/components/MovieDetailPage';
import SearchResultsPage from '@/features/movies/components/SearchResultsPage';
import ScreeningListPage from '@/features/screenings/components/ScreeningListPage';
import SeatSelectionPage from '@/features/booking/components/SeatSelectionPage';
import LoginPage from '@/features/auth/components/LoginPage';
import RegisterPage from '@/features/auth/components/RegisterPage';
import BookingPage from '@/features/booking/components/BookingPage';
import CheckoutPage from '@/features/booking/components/CheckoutPage';
import BreadcrumbDemo from '@/components/BreadcrumbDemo';
import MovieDetailDemo from '@/components/MovieDetailDemo';

// 404 Page Component
const NotFoundPage = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    textAlign: 'center',
    padding: '2rem'
  }}>
    <h1 style={{ fontSize: '4rem', margin: '0', color: '#667eea' }}>404</h1>
    <h2 style={{ margin: '1rem 0', color: '#333' }}>Trang không tìm thấy</h2>
    <p style={{ color: '#666', marginBottom: '2rem' }}>
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
    </p>
    <a 
      href="/" 
      style={{ 
        padding: '12px 24px', 
        backgroundColor: '#667eea', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '6px',
        fontWeight: '500'
      }}
    >
      ← Về trang chủ
    </a>
  </div>
);

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
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store current location for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('intendedBookingUrl', currentPath);
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Main App Router component
 * @returns {JSX.Element}
 */
const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="movies/search" element={<SearchResultsPage />} />
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
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Demo Routes */}
            <Route path="breadcrumb-demo" element={<BreadcrumbDemo />} />
            <Route path="movie-hero-demo" element={<MovieDetailDemo />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="404" element={<NotFoundPage />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppRouter;
