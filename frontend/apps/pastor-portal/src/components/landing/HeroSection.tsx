import { WaitlistForm } from '@mtlbp/shared';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-cream pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
        <div>
          <p className="font-sans text-earth font-semibold mb-4 uppercase tracking-wide text-sm">For Pastors & Ministry Leaders</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark leading-tight mb-6">
            Manage Your Ministry,{' '}
            <span className="text-earth">Serve Your People</span>
          </h1>
          <p className="font-sans text-lg text-brown-medium mb-8 max-w-lg">
            The all-in-one platform to manage bookings, counsel your flock, track prayer requests, and receive donations — so you can focus on what matters most.
          </p>
          <WaitlistForm source="pastor-portal" />
          <p className="font-sans text-brown-light text-sm mt-4">Join the waitlist — launching soon.</p>
        </div>
        <div className="hidden lg:block">
          <img
            src="/images/hero-pastor.png"
            alt="Pastor managing ministry from their office"
            className="rounded-2xl shadow-xl object-cover w-full"
          />
        </div>
      </div>
    </section>
  );
}
