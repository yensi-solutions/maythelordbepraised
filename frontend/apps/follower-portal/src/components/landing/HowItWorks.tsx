const steps = [
  { number: '1', title: 'Find Your Pastor', description: 'Browse pastors by location, denomination, or specialty to find the right spiritual guide.' },
  { number: '2', title: 'Book a Session', description: 'Schedule counseling, ceremonies, or visits at times that work for both of you.' },
  { number: '3', title: 'Grow Together', description: 'Access sermons, join prayer walls, and build a lasting spiritual connection.' },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-4">How It Works</h2>
        <p className="font-sans text-brown-medium text-center max-w-2xl mx-auto mb-16">Simple steps to begin your spiritual journey</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-earth text-brown-dark flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="font-serif text-xl font-semibold text-brown-dark mb-3">{step.title}</h3>
              <p className="font-sans text-brown-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
