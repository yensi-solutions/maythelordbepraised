export function PrayerPreview() {
  return (
    <section id="prayer" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark mb-4">Prayer Wall</h2>
            <p className="font-sans text-brown-medium mb-6">
              Share your prayer requests with a caring community. Whether you need healing, guidance, or simply someone to pray with you — you are not alone.
            </p>
            <ul className="space-y-4 font-sans text-brown-dark">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-earth flex items-center justify-center text-white text-xs mt-0.5">&#10003;</span>
                <span>Submit prayer requests — anonymous or public</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-earth flex items-center justify-center text-white text-xs mt-0.5">&#10003;</span>
                <span>Receive responses from pastors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-earth flex items-center justify-center text-white text-xs mt-0.5">&#10003;</span>
                <span>Join others in prayer with "Pray With Me"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-earth flex items-center justify-center text-white text-xs mt-0.5">&#10003;</span>
                <span>Share testimonies of answered prayers</span>
              </li>
            </ul>
            <a href="/register" className="inline-block mt-8 px-6 py-3 bg-brown-dark text-cream rounded-lg font-sans font-medium hover:bg-brown-medium transition-colors">
              Join the Prayer Wall
            </a>
          </div>
          <div className="space-y-4">
            <img src="/images/prayer-hands.png" alt="Hands clasped in prayer" className="w-full h-48 object-cover rounded-xl" />
            <div className="bg-white rounded-xl p-6 shadow-sm border border-sand-dark space-y-4">
            {[
              { text: 'Please pray for my mother\'s recovery from surgery.', count: 24, anonymous: false, name: 'Maria S.' },
              { text: 'Seeking guidance in a career transition. Need wisdom.', count: 18, anonymous: true, name: null },
              { text: 'Prayers for our church youth camp next month.', count: 31, anonymous: false, name: 'Pastor James' },
            ].map((prayer, i) => (
              <div key={i} className="border-b border-sand-dark last:border-0 pb-4 last:pb-0">
                <p className="font-sans text-brown-dark text-sm mb-2">{prayer.text}</p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-brown-light text-xs">{prayer.anonymous ? 'Anonymous' : prayer.name}</span>
                  <span className="font-sans text-earth text-xs">{prayer.count} praying</span>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
