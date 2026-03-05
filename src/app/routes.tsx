import { createBrowserRouter, Navigate } from 'react-router';
import { isAuthenticated } from './lib/auth';
import RootLayout from './pages/root-layout';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import BookingsPage from './pages/bookings';
import TeacherDetailPage from './pages/teacher-detail';
import ProfilePage from './pages/profile';

// Protected route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Auth route wrapper (redirects to home if already logged in)
function AuthRoute({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'teacher/:teacherId',
        element: <TeacherDetailPage />,
      },
      {
        path: 'bookings',
        element: <BookingsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
