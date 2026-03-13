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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="px-8 py-4 bg-brown-dark text-cream rounded-xl font-sans font-semibold text-lg hover:bg-brown-medium transition-colors shadow-lg hover:shadow-xl">
            Get Started Free
          </a>
          <a href="#pastors" className="px-8 py-4 border-2 border-brown-dark text-brown-dark rounded-xl font-sans font-semibold text-lg hover:bg-sand transition-colors">
            Browse Pastors
          </a>
        </div>
      </div>
    </section>
  );
}
