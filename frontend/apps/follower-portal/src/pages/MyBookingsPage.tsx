import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { api, Card, Tag } from '@mtlbp/shared';
import type { Booking } from '@mtlbp/shared';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Booking[]>('/booking/bookings/me');
        setBookings(res.data);
      } catch { /* empty */ }
      setIsLoading(false);
    }
    load();
  }, []);

  const statusVariant = (s: string) => {
    if (s === 'confirmed') return 'success' as const;
    if (s === 'cancelled') return 'error' as const;
    if (s === 'pending') return 'warning' as const;
    return 'default' as const;
  };

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">My Bookings</h1>
      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : bookings.length === 0 ? (
        <Card><p className="font-sans text-brown-light text-center py-8">No bookings yet. Browse pastors to book your first session.</p></Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-brown-dark font-medium">{b.date}</p>
                  <p className="font-sans text-brown-light text-sm">{b.start_time} - {b.end_time} &middot; {b.mode}</p>
                </div>
                <Tag variant={statusVariant(b.status)}>{b.status}</Tag>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
