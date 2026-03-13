const services = [
  { icon: '\u{1F91D}', title: 'Pastoral Counseling', description: 'One-on-one spiritual guidance and support for life\'s challenges.' },
  { icon: '\u{1F492}', title: 'Ceremonies', description: 'Weddings, baptisms, dedications, and other sacred ceremonies.' },
  { icon: '\u{1F3E0}', title: 'Home & Hospital Visits', description: 'Compassionate in-person visits for those who need comfort.' },
  { icon: '\u{1F491}', title: 'Pre-Marital Counseling', description: 'Build a strong foundation for your marriage journey.' },
];

export function ServicesPreview() {
  return (
    <section id="services" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-4">Services Available</h2>
        <p className="font-sans text-brown-medium text-center max-w-2xl mx-auto mb-16">Professional pastoral care when you need it most</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div key={svc.title} className="bg-white rounded-xl p-6 border border-sand-dark text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{svc.icon}</div>
              <h3 className="font-serif text-lg font-semibold text-brown-dark mb-2">{svc.title}</h3>
              <p className="font-sans text-brown-medium text-sm">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
