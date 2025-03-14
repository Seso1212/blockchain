
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCrypto } from '@/contexts/CryptoContext';
import AuthForm from '@/components/AuthForm';
import ProfileForm from '@/components/ProfileForm';

interface AuthProps {
  showProfileSetup?: boolean;
}

const Auth: React.FC<AuthProps> = ({ showProfileSetup = false }) => {
  const { isAuthenticated, userData } = useCrypto();
  const [showProfile, setShowProfile] = useState(showProfileSetup);

  // If already authenticated and profile is complete, redirect to dashboard
  if (isAuthenticated && userData.userStats.profileCompleted) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but showing profile setup is false and profile is not complete,
  // force showing profile setup
  if (isAuthenticated && !showProfile && !userData.userStats.profileCompleted) {
    return <Navigate to="/auth/profile" replace />;
  }

  // Handle completion of login/register
  const handleAuthComplete = () => {
    setShowProfile(true);
  };

  // Handle completion of profile setup
  const handleProfileComplete = () => {
    window.location.href = '/'; // Hard redirect to dashboard
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-scremy">ScremyCoin</h1>
        <p className="text-muted-foreground mt-2">The future of crypto mining simulation</p>
      </div>

      {!isAuthenticated && !showProfile ? (
        <AuthForm onComplete={handleAuthComplete} />
      ) : (
        <ProfileForm onComplete={handleProfileComplete} />
      )}

      <div className="mt-12 text-center max-w-md">
        <h2 className="text-xl font-semibold mb-2">Why ScremyCoin?</h2>
        <ul className="space-y-2 text-left list-disc list-inside text-muted-foreground">
          <li>Simulate crypto mining without real expenses</li>
          <li>Learn trading strategies with virtual coins</li>
          <li>Build your portfolio and track your progress</li>
          <li>Compete with friends and climb the leaderboard</li>
        </ul>
      </div>
    </div>
  );
};

export default Auth;
