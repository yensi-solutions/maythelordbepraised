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
          <div className="bg-white rounded-2xl shadow-xl border border-sand-dark p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="font-sans text-brown-light text-xs ml-2">Dashboard Preview</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Upcoming Sessions', value: '8' },
                { label: 'Prayer Requests', value: '24' },
                { label: 'This Month\'s Giving', value: '$2,340' },
              ].map((stat) => (
                <div key={stat.label} className="bg-sand rounded-lg p-4 text-center">
                  <p className="font-serif text-2xl font-bold text-brown-dark">{stat.value}</p>
                  <p className="font-sans text-brown-light text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { time: '10:00 AM', name: 'Sarah M.', type: 'Marriage Counseling' },
                { time: '2:00 PM', name: 'David & Lisa K.', type: 'Pre-Marital Session' },
                { time: '4:30 PM', name: 'Marcus J.', type: 'Career Guidance' },
              ].map((session) => (
                <div key={session.time} className="flex items-center justify-between bg-cream rounded-lg p-3">
                  <div>
                    <p className="font-sans text-brown-dark text-sm font-medium">{session.name}</p>
                    <p className="font-sans text-brown-light text-xs">{session.type}</p>
                  </div>
                  <span className="font-sans text-earth text-sm font-medium">{session.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
