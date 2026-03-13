const features = [
  { title: 'Booking Management', description: 'Let followers book sessions online. Set your availability, manage your calendar, and confirm appointments — all from one dashboard.', icon: '📅' },
  { title: 'Prayer Wall', description: 'Receive and respond to prayer requests from your community. Track answered prayers and share encouragement.', icon: '🙏' },
  { title: 'Secure Giving', description: 'Accept tithes, offerings, and donations securely through Stripe. Track giving history and generate reports.', icon: '💝' },
  { title: 'Service Catalog', description: 'Define your services — counseling, ceremonies, visits. Set pricing, duration, and availability for each.', icon: '📋' },
  { title: 'Pastor Profile', description: 'Showcase your background, denomination, specialties, and church. Help followers find the right spiritual match.', icon: '👤' },
  { title: 'Community Tools', description: 'Build deeper connections with your congregation through groups, events, and shared devotionals.', icon: '🤝' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-4">Everything You Need</h2>
        <p className="font-sans text-brown-medium text-center max-w-2xl mx-auto mb-16">Powerful tools designed specifically for pastoral ministry</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl p-6 border border-sand-dark hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-brown-dark mb-2">{feature.title}</h3>
              <p className="font-sans text-brown-medium text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
