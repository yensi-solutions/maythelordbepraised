import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { api, Card, Button, Input } from '@mtlbp/shared';
import type { Prayer } from '@mtlbp/shared';

export function PrayerWallPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPrayer, setNewPrayer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => { loadPrayers(); }, []);

  async function loadPrayers() {
    try {
      const res = await api.get<Prayer[]>('/prayers');
      setPrayers(res.data);
    } catch { /* empty */ }
    setIsLoading(false);
  }

  async function submitPrayer() {
    if (!newPrayer.trim()) return;
    await api.post('/prayers', { text: newPrayer, is_anonymous: isAnonymous });
    setNewPrayer('');
    setIsAnonymous(false);
    loadPrayers();
  }

  async function prayFor(id: string) {
    await api.post(`/prayers/${id}/pray`);
    loadPrayers();
  }

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Prayer Wall</h1>

      <Card className="mb-8">
        <h2 className="font-serif text-lg font-semibold text-brown-dark mb-3">Submit a Prayer Request</h2>
        <textarea
          className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white focus:outline-none focus:ring-2 focus:ring-earth mb-3"
          rows={3}
          placeholder="Share your prayer request..."
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-sans text-sm text-brown-medium">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded" />
            Post anonymously
          </label>
          <Button onClick={submitPrayer}>Submit Prayer</Button>
        </div>
      </Card>

      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : (
        <div className="space-y-4">
          {prayers.map((p) => (
            <Card key={p.id}>
              <p className="font-sans text-brown-dark">{p.text}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-sans text-brown-light text-xs">{p.is_anonymous ? 'Anonymous' : 'Community Member'}</span>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-earth text-sm">{p.pray_count} praying</span>
                  <Button size="sm" variant="secondary" onClick={() => prayFor(p.id)}>Pray With Me</Button>
                </div>
              </div>
              {p.pastor_responses.length > 0 && (
                <div className="mt-3 space-y-2">
                  {p.pastor_responses.map((r, i) => (
                    <div key={i} className="bg-sand rounded-lg p-3">
                      <p className="font-sans text-brown-dark text-sm">{r.text}</p>
                      <p className="font-sans text-brown-light text-xs mt-1">Pastor Response</p>
                    </div>
                  ))}
                </div>
              )}
              {p.testimony && (
                <div className="mt-3 bg-earth-light/30 rounded-lg p-3">
                  <p className="font-sans text-brown-dark text-sm font-medium">Testimony</p>
                  <p className="font-sans text-brown-medium text-sm">{p.testimony}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
