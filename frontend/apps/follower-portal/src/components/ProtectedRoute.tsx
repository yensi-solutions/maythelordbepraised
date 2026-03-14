import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // DEV MODE: always render children (auth bypass for local dev & video recording)
  return <>{children}</>;
}
