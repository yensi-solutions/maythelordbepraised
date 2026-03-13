import { useState } from 'react';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-brown-dark">
            <img src="/images/logo-icon.png" alt="" className="w-8 h-8" />
            MayTheLordBePraised
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Features</a>
            <a href="#pricing" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Pricing</a>
            <a href="#testimonials" className="text-brown-medium hover:text-brown-dark font-sans text-sm">Testimonials</a>
            <a href="/login" className="px-4 py-2 border-2 border-brown-dark text-brown-dark rounded-lg font-sans text-sm hover:bg-sand transition-colors">
              Sign In
            </a>
            <a href="/register" className="px-4 py-2 bg-brown-dark text-cream rounded-lg font-sans text-sm hover:bg-brown-medium transition-colors">
              Get Started
            </a>
          </div>
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
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#features" className="block py-2 text-brown-medium font-sans text-sm">Features</a>
            <a href="#pricing" className="block py-2 text-brown-medium font-sans text-sm">Pricing</a>
            <a href="#testimonials" className="block py-2 text-brown-medium font-sans text-sm">Testimonials</a>
            <a href="/login" className="block py-2 text-brown-medium font-sans text-sm">Sign In</a>
            <a href="/register" className="block py-2 px-4 bg-brown-dark text-cream rounded-lg font-sans text-sm text-center">Get Started</a>
          </div>
        )}
      </div>
    </nav>
  );
}
