import { useState } from 'react';
import { api } from '@mtlbp/shared';

interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  ip_address: string | null;
  user_agent: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  created_at: string;
}

interface WaitlistData {
  total: number;
  by_source: Record<string, number>;
  entries: WaitlistEntry[];
}

export function WaitlistAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<WaitlistData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/waitlist', {
        auth: { username, password },
      });
      setData(res.data);
    } catch {
      setError('Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ['Email', 'Source', 'IP Address', 'Country', 'Region', 'City', 'Signed Up'];
    const rows = data.entries.map((e) => [
      e.email,
      e.source,
      e.ip_address || '',
      e.country || '',
      e.region || '',
      e.city || '',
      new Date(e.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-sand-dark p-8 w-full max-w-md">
          <h1 className="font-serif text-2xl font-bold text-brown-dark mb-2">Waitlist Admin</h1>
          <p className="font-sans text-brown-light mb-6">Sign in to view waitlist entries.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-sand-dark font-sans text-brown-dark placeholder-brown-light focus:border-earth focus:outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-sand-dark font-sans text-brown-dark placeholder-brown-light focus:border-earth focus:outline-none"
            />
            {error && <p className="font-sans text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-brown-dark text-cream rounded-xl font-sans font-semibold hover:bg-brown-medium transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-sand-dark px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold text-brown-dark">Waitlist Dashboard</h1>
          <p className="font-sans text-brown-light text-sm">{data.total} total signups</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-earth text-brown-dark rounded-lg font-sans font-medium text-sm hover:bg-earth-light transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setData(null)}
            className="px-4 py-2 border border-brown-light text-brown-medium rounded-lg font-sans font-medium text-sm hover:bg-sand transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-sand-dark p-6">
            <p className="font-sans text-brown-light text-sm">Total Signups</p>
            <p className="font-serif text-3xl font-bold text-brown-dark">{data.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-sand-dark p-6">
            <p className="font-sans text-brown-light text-sm">From Pastor Portal</p>
            <p className="font-serif text-3xl font-bold text-brown-dark">{data.by_source['pastor-portal'] || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-sand-dark p-6">
            <p className="font-sans text-brown-light text-sm">From Follower Portal</p>
            <p className="font-serif text-3xl font-bold text-brown-dark">{data.by_source['follower-portal'] || 0}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-sand-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand">
                <tr>
                  <th className="px-4 py-3 text-left font-sans text-brown-dark text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-sans text-brown-dark text-sm font-semibold">Source</th>
                  <th className="px-4 py-3 text-left font-sans text-brown-dark text-sm font-semibold">IP Address</th>
                  <th className="px-4 py-3 text-left font-sans text-brown-dark text-sm font-semibold">Location</th>
                  <th className="px-4 py-3 text-left font-sans text-brown-dark text-sm font-semibold">Signed Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {data.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-cream transition-colors">
                    <td className="px-4 py-3 font-sans text-brown-dark text-sm">{entry.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-sans font-medium ${
                        entry.source === 'pastor-portal'
                          ? 'bg-earth-light text-brown-dark'
                          : 'bg-sand text-brown-medium'
                      }`}>
                        {entry.source === 'pastor-portal' ? 'Pastor' : 'Follower'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-brown-light text-sm font-mono">{entry.ip_address || '—'}</td>
                    <td className="px-4 py-3 font-sans text-brown-light text-sm">
                      {[entry.city, entry.region, entry.country].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 font-sans text-brown-light text-sm">
                      {new Date(entry.created_at).toLocaleDateString()} {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {data.entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center font-sans text-brown-light">
                      No waitlist entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
