import { useState, useRef } from 'react';

interface VideoShowcaseProps {
  variant?: 'pastor' | 'follower';
}

export function VideoShowcase({ variant = 'pastor' }: VideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const headline =
    variant === 'pastor'
      ? 'See Your Ministry Dashboard in Action'
      : 'See What Awaits You Inside';

  const subtext =
    variant === 'pastor'
      ? 'Watch how pastors manage bookings, respond to prayers, and grow their ministry — all from one platform.'
      : 'Take a peek inside the platform — find pastors, book sessions, join the prayer wall, and support your church.';

  return (
    <section className="py-20 bg-brown-dark relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, #d4a574 1px, transparent 1px), radial-gradient(circle at 75% 50%, #d4a574 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-earth font-semibold uppercase tracking-widest text-xs mb-4">
            Platform Preview
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
            {headline}
          </h2>
          <p className="font-sans text-earth-light text-lg max-w-2xl mx-auto">
            {subtext}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-earth/20 group">
          {/* Browser-style header bar */}
          <div className="bg-brown-medium/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-brown-dark/50 rounded-lg px-4 py-1">
                <span className="font-mono text-earth-light/60 text-xs">
                  maythelordbepraised.com
                </span>
              </div>
            </div>
            <div className="w-16" />
          </div>

          {/* Video */}
          <div className="relative bg-cream">
            <video
              ref={videoRef}
              className="w-full cursor-pointer"
              onClick={handleVideoClick}
              onEnded={() => setIsPlaying(false)}
              muted
              playsInline
              preload="metadata"
              poster="/videos/showcase-poster.jpg"
            >
              <source src="/videos/showcase.mp4" type="video/mp4" />
            </video>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-brown-dark/40 cursor-pointer transition-all duration-300 hover:bg-brown-dark/30"
                onClick={handlePlay}
              >
                <div className="relative">
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-earth/30 animate-ping" />
                  {/* Play button */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-earth flex items-center justify-center shadow-xl hover:bg-earth-light transition-colors duration-200">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-brown-dark ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="absolute bottom-8 font-sans text-cream/80 text-sm font-medium tracking-wide">
                  Watch the 2-minute tour
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature callouts below video */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
          {[
            { icon: '📅', label: 'Smart Booking' },
            { icon: '🙏', label: 'Prayer Wall' },
            { icon: '💝', label: 'Secure Giving' },
            { icon: '👤', label: 'Pastor Profiles' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-sans text-earth-light text-sm font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
