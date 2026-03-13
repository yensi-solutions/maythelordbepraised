import { WaitlistForm } from '@mtlbp/shared';

export function CTASection() {
  return (
    <section className="py-20 bg-brown-dark text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Ministry?</h2>
        <p className="font-sans text-earth-light max-w-xl mx-auto mb-8">
          Join pastors who are using MayTheLordBePraised to serve their communities more effectively.
        </p>
        <div className="flex justify-center">
          <WaitlistForm
            source="pastor-portal"
            inputClass="flex-1 px-4 py-3 rounded-xl border-2 border-earth font-sans text-brown-dark placeholder-brown-light focus:border-earth-light focus:outline-none min-w-0"
            buttonClass="px-6 py-3 bg-earth text-brown-dark rounded-xl font-sans font-semibold hover:bg-earth-light transition-colors shadow-lg whitespace-nowrap"
          />
        </div>
      </div>
    </section>
  );
}
