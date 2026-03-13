export function CTASection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="font-sans text-brown-medium max-w-xl mx-auto mb-8">
          Join thousands of believers connecting with their pastors and growing in faith together.
        </p>
        <a href="/register" className="px-8 py-4 bg-brown-dark text-cream rounded-xl font-sans font-semibold text-lg hover:bg-brown-medium transition-colors shadow-lg inline-block">
          Create Your Free Account
        </a>
      </div>
    </section>
  );
}
