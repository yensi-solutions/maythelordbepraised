const pastors = [
  { name: 'Rev. James Mitchell', church: 'Grace Community Church', location: 'Atlanta, GA', specialty: 'Marriage Counseling', image: null },
  { name: 'Pastor Sarah Williams', church: 'Living Hope Ministry', location: 'Dallas, TX', specialty: 'Youth & Family', image: null },
  { name: 'Dr. Michael Thompson', church: 'Faith Bridge Fellowship', location: 'Chicago, IL', specialty: 'Grief & Loss', image: null },
];

export function FeaturedPastors() {
  return (
    <section id="pastors" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark text-center mb-4">Featured Pastors</h2>
        <p className="font-sans text-brown-medium text-center max-w-2xl mx-auto mb-16">Dedicated spiritual leaders ready to walk with you</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pastors.map((pastor) => (
            <div key={pastor.name} className="bg-white rounded-xl shadow-sm p-6 border border-sand-dark hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-full bg-earth-light flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-2xl text-brown-dark font-bold">
                  {pastor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-dark text-center">{pastor.name}</h3>
              <p className="font-sans text-brown-medium text-sm text-center">{pastor.church}</p>
              <p className="font-sans text-brown-light text-xs text-center mt-1">{pastor.location}</p>
              <div className="mt-4 flex justify-center">
                <span className="px-3 py-1 bg-sand text-brown-dark rounded-full text-xs font-sans">{pastor.specialty}</span>
              </div>
              <button className="w-full mt-6 py-2 border-2 border-brown-dark text-brown-dark rounded-lg font-sans text-sm hover:bg-sand transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
