import { WaitlistForm } from '@mtlbp/shared';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sand via-cream to-cream pt-16">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEySDM2eiIgZmlsbD0iI2Q0YTU3NCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
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
