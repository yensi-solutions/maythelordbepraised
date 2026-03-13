const testimonials = [
  { quote: 'This platform transformed how I connect with my congregation. Booking sessions used to take hours of back-and-forth — now it\'s automated.', name: 'Pastor David Chen', church: 'New Life Community Church' },
  { quote: 'The prayer wall feature is incredible. My members feel heard and supported even when I can\'t be there in person.', name: 'Rev. Angela Brooks', church: 'Hope Springs Ministry' },
  { quote: 'We went from juggling spreadsheets to having everything in one place. The giving reports alone saved us 10 hours a month.', name: 'Dr. Robert Williams', church: 'Faith Tabernacle' },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-16">Trusted by Pastors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-6 border border-sand-dark">
              <p className="font-sans text-brown-medium text-sm mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-serif text-brown-dark font-semibold">{t.name}</p>
                <p className="font-sans text-brown-light text-xs">{t.church}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
