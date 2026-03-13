import { useState } from 'react';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="font-serif text-xl font-bold text-brown-dark">
            MayTheLordBePraised
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#pastors" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Find a Pastor</a>
            <a href="#services" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Services</a>
            <a href="#prayer" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Prayer Wall</a>
            <a href="#give" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Give</a>
            <a href="/login" className="px-4 py-2 bg-brown-dark text-cream rounded-lg font-sans text-sm hover:bg-brown-medium transition-colors">
              Sign In
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-brown-dark" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#pastors" className="block py-2 text-brown-medium font-sans text-sm">Find a Pastor</a>
            <a href="#services" className="block py-2 text-brown-medium font-sans text-sm">Services</a>
            <a href="#prayer" className="block py-2 text-brown-medium font-sans text-sm">Prayer Wall</a>
            <a href="#give" className="block py-2 text-brown-medium font-sans text-sm">Give</a>
            <a href="/login" className="block py-2 px-4 bg-brown-dark text-cream rounded-lg font-sans text-sm text-center">Sign In</a>
          </div>
        )}
      </div>
    </nav>
  );
}
