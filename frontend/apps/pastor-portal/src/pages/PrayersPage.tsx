import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api, Card, Button, Input } from '@mtlbp/shared';
import type { Prayer } from '@mtlbp/shared';

export function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  useEffect(() => { loadPrayers(); }, []);

  async function loadPrayers() {
    try {
      const res = await api.get<Prayer[]>('/prayers?status=active');
      setPrayers(res.data);
    } catch { /* empty */ }
    setIsLoading(false);
  }

  async function respond(prayerId: string) {
    const text = responseText[prayerId];
    if (!text) return;
    await api.post(`/prayers/${prayerId}/respond`, { text });
    setResponseText({ ...responseText, [prayerId]: '' });
    loadPrayers();
  }

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Prayer Requests</h1>
      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : prayers.length === 0 ? (
        <Card><p className="font-sans text-brown-light text-center py-8">No active prayer requests.</p></Card>
      ) : (
        <div className="space-y-4">
          {prayers.map((p) => (
            <Card key={p.id}>
              <p className="font-sans text-brown-dark">{p.text}</p>
              <p className="font-sans text-earth text-sm mt-2">{p.pray_count} people praying</p>
              {p.pastor_responses.length > 0 && (
                <div className="mt-3 space-y-2">
                  {p.pastor_responses.map((r, i) => (
                    <div key={i} className="bg-sand rounded-lg p-3">
                      <p className="font-sans text-brown-dark text-sm">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Write a response..."
                  className="flex-1"
                  value={responseText[p.id] || ''}
                  onChange={(e) => setResponseText({ ...responseText, [p.id]: e.target.value })}
                />
                <Button size="sm" onClick={() => respond(p.id)}>Respond</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
