import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-brown-dark/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-semibold text-brown-dark">{title}</h2>
          <button onClick={onClose} className="text-brown-light hover:text-brown-dark text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
