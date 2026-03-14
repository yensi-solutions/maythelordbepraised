const tiers = [
  {
    name: 'Shepherd',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['1 pastor account', 'Up to 5 service types', 'Basic booking management', 'Prayer wall access', 'Accept donations (2.9% + 30¢ per transaction)'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Minister',
    price: '$29',
    period: '/month',
    description: 'For growing ministries',
    features: ['1 pastor account', 'Unlimited service types', 'Advanced booking + reminders', 'Prayer wall with pastor responses', 'Giving reports & analytics', 'Custom profile branding', 'Priority support'],
    cta: 'Start 14-Day Trial',
    highlighted: true,
  },
  {
    name: 'Ministry',
    price: '$79',
    period: '/month',
    description: 'For multi-pastor churches',
    features: ['Up to 10 pastor accounts', 'Everything in Minister', 'Shared church dashboard', 'Staff management', 'Consolidated giving reports', 'Custom domain support', 'Dedicated support'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="font-sans text-brown-medium text-center max-w-2xl mx-auto mb-16">Start free, upgrade when you're ready</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-2xl p-8 ${tier.highlighted ? 'bg-brown-dark text-cream ring-4 ring-earth scale-105' : 'bg-white border border-sand-dark'}`}>
              <h3 className={`font-serif text-xl font-semibold mb-2 ${tier.highlighted ? 'text-cream' : 'text-brown-dark'}`}>{tier.name}</h3>
              <p className={`font-sans text-sm mb-4 ${tier.highlighted ? 'text-earth-light' : 'text-brown-medium'}`}>{tier.description}</p>
              <div className="mb-6">
                <span className={`font-serif text-4xl font-bold ${tier.highlighted ? 'text-cream' : 'text-brown-dark'}`}>{tier.price}</span>
                <span className={`font-sans text-sm ${tier.highlighted ? 'text-earth-light' : 'text-brown-light'}`}>{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2 font-sans text-sm ${tier.highlighted ? 'text-earth-light' : 'text-brown-medium'}`}>
                    <span className="text-earth mt-0.5">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#waitlist" className={`block w-full py-3 rounded-lg font-sans font-semibold text-center transition-colors ${tier.highlighted ? 'bg-earth text-brown-dark hover:bg-earth-light' : 'bg-brown-dark text-cream hover:bg-brown-medium'}`}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
