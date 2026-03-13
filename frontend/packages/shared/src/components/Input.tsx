import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-brown-dark mb-1 font-sans">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg font-sans text-brown-dark bg-white focus:outline-none focus:ring-2 focus:ring-earth focus:border-transparent ${error ? 'border-red-500' : 'border-sand-dark'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 font-sans">{error}</p>}
    </div>
  );
}
