import React from 'react';

interface AvatarProps {
  src: string;
  size?: 'sm' | 'md';
}

export const Avatar: React.FC<AvatarProps> = ({ src, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
  };

  return (
    <img
      src={src}
      alt="Assignee"
      className={`${sizeClasses[size]} rounded-full border-2 border-white shadow-sm -ml-2 first:ml-0`}
    />
  );
};

export const AvatarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex items-center">{children}</div>;
};
