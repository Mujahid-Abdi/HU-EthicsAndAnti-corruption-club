import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface VotingProtectedRouteProps {
  children: ReactNode;
}

export function VotingProtectedRoute({ children }: VotingProtectedRouteProps) {
  const { isVotingEnabled } = useSystemSettings();

  if (!isVotingEnabled) {
    // Redirect to home page if voting is disabled
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}