import { useState } from 'react';
import { api } from '../api';

interface WaitlistFormProps {
  source: 'pastor-portal' | 'follower-portal';
  buttonClass?: string;
  inputClass?: string;
  placeholder?: string;
}

export function WaitlistForm({
  source,
  buttonClass = 'px-6 py-3 bg-brown-dark text-cream rounded-xl font-sans font-semibold hover:bg-brown-medium transition-colors shadow-lg whitespace-nowrap',
  inputClass = 'flex-1 px-4 py-3 rounded-xl border-2 border-sand-dark font-sans text-brown-dark placeholder-brown-light focus:border-earth focus:outline-none min-w-0',
  placeholder = 'Enter your email address',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await api.post('/waitlist', { email, source });
      setStatus('success');
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 px-6 py-4 bg-green-50 border border-green-200 rounded-xl">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-sans text-green-800 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className={inputClass}
      />
      <button type="submit" disabled={status === 'loading'} className={buttonClass}>
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {status === 'error' && (
        <p className="font-sans text-red-600 text-sm mt-1 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
