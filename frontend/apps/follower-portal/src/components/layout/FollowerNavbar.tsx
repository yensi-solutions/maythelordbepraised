import { useAuthStore } from '../../stores/useAuthStore';

export function FollowerNavbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="font-serif text-xl font-bold text-brown-dark">Connect</a>
        <div className="flex items-center space-x-6">
          <a href="/pastors" className="font-sans text-sm text-brown-medium hover:text-brown-dark">Pastors</a>
          <a href="/prayers" className="font-sans text-sm text-brown-medium hover:text-brown-dark">Prayers</a>
          <a href="/bookings" className="font-sans text-sm text-brown-medium hover:text-brown-dark">My Bookings</a>
          <a href="/give" className="font-sans text-sm text-brown-medium hover:text-brown-dark">Give</a>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-earth flex items-center justify-center text-brown-dark text-xs font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <button onClick={logout} className="font-sans text-brown-light text-xs hover:text-brown-dark">Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
