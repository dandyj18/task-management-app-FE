import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'Feature' | 'Bug' | 'Issue' | 'Undefined';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'Undefined', className }) => {
  const variants = {
    Feature: 'bg-[var(--label-feature-bg)] text-[var(--label-feature-text)]',
    Bug: 'bg-[var(--label-bug-bg)] text-[var(--label-bug-text)]',
    Issue: 'bg-[var(--label-issue-bg)] text-[var(--label-issue-text)]',
    Undefined: 'bg-[var(--label-undefined-bg)] text-[var(--label-undefined-text)]',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-lg text-[10px] font-bold capitalize',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
