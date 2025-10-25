// JavaScript file - no TypeScript checking
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserRole, removeToken, isTokenExpired, getToken, isTokenExpiringSoon } from '@/lib/auth.js';
import { tokenRefreshService } from '@/services/tokenRefreshService.js';

/**
 * AdminRoute component - protects admin routes by checking authentication and admin role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement}
 */
const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user has token
        let token = await getToken();
        if (!token) {
          console.log('[AdminRoute] No token found, redirecting to login');
          setIsAuthorized(false);
          return;
        }

        // If token expired or expiring soon, try refresh FIRST
        if (isTokenExpired(token) || isTokenExpiringSoon(token, 60)) {
          console.log('[AdminRoute] Token expired/expiring, refreshing before role check...');
          const refreshSuccess = await tokenRefreshService.refreshToken();
          
          if (!refreshSuccess) {
            console.log('[AdminRoute] Token refresh failed, logging out');
            await removeToken();
            setIsAuthorized(false);
            return;
          }
          
          // Get new token after refresh
          token = await getToken();
          console.log('[AdminRoute] Token refreshed successfully');
        }

        // Now check role with valid token
        const role = await getUserRole();
        if (role !== 'ADMIN') {
          console.log('[AdminRoute] User is not admin, role:', role);
          // Store intended admin URL for redirect after login
          localStorage.setItem('intendedAdminUrl', location.pathname);
          // Remove tokens to force logout
          await removeToken();
          setIsAuthorized(false);
          return;
        }

        // User is authenticated and is admin
        console.log('[AdminRoute] Admin access granted');
        setIsAuthorized(true);
      } catch (error) {
        console.error('[AdminRoute] Error checking admin access:', error);
        // On error, remove tokens and deny access
        await removeToken();
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for token refresh events
    const handleTokenRefresh = async () => {
      console.log('Token refreshed in AdminRoute, re-checking access');
      await checkAdminAccess();
    };

    checkAdminAccess();
    
    // Add event listener for token refresh
    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
    };
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // If not authorized, redirect to login with message
  if (!isAuthorized) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          message: 'Bạn cần đăng nhập với tài khoản admin để truy cập trang này.',
          returnTo: location.pathname 
        }} 
      />
    );
  }

  // User is authenticated and is admin, render children
  return <>{children}</>;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminRoute;
