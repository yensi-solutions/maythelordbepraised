import { WaitlistForm } from '@mtlbp/shared';

export function HeroSection() {
  return (
    <section id="waitlist" className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-follower.png')" }} />
      <div className="absolute inset-0 bg-cream/85" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brown-dark leading-tight mb-6">
          Connect with Your Pastor,{' '}
          <span className="text-earth">Grow in Faith</span>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-brown-medium max-w-2xl mx-auto mb-10">
          Book counseling sessions, join prayer communities, access sermons, and deepen your spiritual journey — all in one place.
        </p>
        <div className="flex justify-center">
          <WaitlistForm source="follower-portal" />
        </div>
        <p className="font-sans text-brown-light text-sm mt-4">Be the first to know when we launch.</p>
      </div>
    </section>
  );
}
