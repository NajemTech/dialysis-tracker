import { Navigate } from 'react-router-dom';
import { useTracking } from '@/hooks/useTracking';
import Landing from '@/pages/landing';

export default function HomeRedirect() {
  const { isLoggedIn, loading } = useTracking();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show landing page
  return <Landing />;
}
