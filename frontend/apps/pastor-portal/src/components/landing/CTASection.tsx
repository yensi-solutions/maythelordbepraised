export function CTASection() {
  return (
    <section className="py-20 bg-brown-dark text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Ministry?</h2>
        <p className="font-sans text-earth-light max-w-xl mx-auto mb-8">
          Join pastors who are using MayTheLordBePraised to serve their communities more effectively.
        </p>
        <a href="/register" className="px-8 py-4 bg-earth text-brown-dark rounded-xl font-sans font-semibold text-lg hover:bg-earth-light transition-colors shadow-lg inline-block">
          Get Started — It's Free
        </a>
      </div>
    </section>
  );
}
