import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchMe();
    }
  }, [isAuthenticated, fetchMe]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-earth border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-sans text-brown-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="font-serif text-2xl text-brown-dark mb-4">Sign In Required</h2>
          <p className="font-sans text-brown-medium mb-6">Please sign in to access your pastor dashboard.</p>
          <a href="/login" className="px-6 py-3 bg-brown-dark text-cream rounded-lg font-sans hover:bg-brown-medium transition-colors inline-block">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
