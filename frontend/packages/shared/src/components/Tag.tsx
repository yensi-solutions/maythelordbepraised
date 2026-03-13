import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variants = {
    default: 'bg-sand text-brown-dark',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
