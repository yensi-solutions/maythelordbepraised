export function GivingSection() {
  return (
    <section id="give" className="py-20 bg-brown-dark text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <img src="/images/giving-offering.png" alt="Offering plate on wooden pew" className="w-full h-48 object-cover rounded-xl mb-10 opacity-60" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Support Your Ministry</h2>
        <p className="font-sans text-earth-light max-w-2xl mx-auto mb-10">
          Your generosity makes a difference. Give tithes, offerings, and donations securely to support your pastor and church community.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { amount: '$25', label: 'Seed Offering' },
            { amount: '$50', label: 'Monthly Tithe' },
            { amount: '$100', label: 'Mission Support' },
          ].map((tier) => (
            <button key={tier.label} className="py-6 px-4 bg-brown-medium rounded-xl hover:bg-brown-light transition-colors">
              <p className="font-serif text-3xl font-bold text-cream mb-1">{tier.amount}</p>
              <p className="font-sans text-earth-light text-sm">{tier.label}</p>
            </button>
          ))}
        </div>
        <a href="#waitlist" className="px-8 py-4 bg-earth text-brown-dark rounded-xl font-sans font-semibold text-lg hover:bg-earth-light transition-colors inline-block">
          Join the Waitlist
        </a>
      </div>
    </section>
  );
}
