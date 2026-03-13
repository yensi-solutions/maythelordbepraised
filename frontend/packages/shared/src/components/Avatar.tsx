import React from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-earth text-brown-dark flex items-center justify-center font-sans font-semibold ${className}`}>
      {initials}
    </div>
  );
}
