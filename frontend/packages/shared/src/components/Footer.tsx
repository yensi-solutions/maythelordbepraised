import React from 'react';

export function Footer() {
  return (
    <footer className="bg-brown-dark text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-serif text-lg mb-2">MayTheLordBePraised</p>
          <p className="text-earth-light text-sm">
            Connecting pastors with their communities through faith and service.
          </p>
          <div className="mt-8 pt-8 border-t border-brown-medium">
            <p className="text-earth-light text-xs">
              Powered by{' '}
              <a href="https://yensi.solutions" className="text-earth hover:text-cream underline" target="_blank" rel="noopener noreferrer">
                yensi.solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
