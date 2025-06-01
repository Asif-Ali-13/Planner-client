
import React from 'react';
import { AvatarUpload } from './AvatarUpload';
import { useUser } from '@/hooks/useUser';

export function UserGreeting() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        Please sign in to view your profile
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10">
        <AvatarUpload
          currentAvatar={user.avatar}
          userName={user.name}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">
          {getGreeting()}, {user.name.split(' ')[0]}!
        </p>
        <p className="text-xs text-gray-500">
          Ready to tackle your tasks?
        </p>
      </div>
    </div>
  );
}
