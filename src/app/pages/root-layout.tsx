import { Outlet, Navigate } from 'react-router';
import { BottomNav } from '../components/bottom-nav';
import { isAuthenticated } from '../lib/auth';

export default function RootLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Outlet />
      <BottomNav />
    </div>
  );
}
