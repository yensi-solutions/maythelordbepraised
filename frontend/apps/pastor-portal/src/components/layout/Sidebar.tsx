import { useAuthStore } from '../../stores/useAuthStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/dashboard/profile', label: 'My Profile', icon: '👤' },
  { path: '/dashboard/services', label: 'Services', icon: '📋' },
  { path: '/dashboard/availability', label: 'Availability', icon: '📅' },
  { path: '/dashboard/bookings', label: 'Bookings', icon: '🤝' },
  { path: '/dashboard/prayers', label: 'Prayers', icon: '🙏' },
  { path: '/dashboard/giving', label: 'Giving', icon: '💝' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const currentPath = window.location.pathname;

  return (
    <aside className="w-64 bg-brown-dark min-h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-brown-medium">
        <h1 className="font-serif text-lg font-bold text-cream">MayTheLordBePraised</h1>
        <p className="font-sans text-earth-light text-xs mt-1">Pastor Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm transition-colors ${
              currentPath === item.path
                ? 'bg-brown-medium text-cream'
                : 'text-earth-light hover:bg-brown-medium hover:text-cream'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-brown-medium">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-earth flex items-center justify-center text-brown-dark text-xs font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-cream text-sm truncate">{user?.first_name} {user?.last_name}</p>
            <p className="font-sans text-earth-light text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full py-2 text-earth-light hover:text-cream font-sans text-xs text-left transition-colors">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
