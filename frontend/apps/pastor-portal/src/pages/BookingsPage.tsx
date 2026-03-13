import { useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useDashboardStore } from '../stores/useDashboardStore';
import { api, Card, Button, Tag } from '@mtlbp/shared';

export function BookingsPage() {
  const { bookings, isLoading, fetchBookings } = useDashboardStore();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(bookingId: string, status: string) {
    await api.patch(`/booking/bookings/${bookingId}`, { status });
    fetchBookings();
  }

  const statusVariant = (s: string) => {
    if (s === 'confirmed') return 'success' as const;
    if (s === 'cancelled' || s === 'no_show') return 'error' as const;
    if (s === 'pending') return 'warning' as const;
    return 'default' as const;
  };

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Bookings</h1>
      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : bookings.length === 0 ? (
        <Card><p className="font-sans text-brown-light text-center py-8">No bookings yet.</p></Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-brown-dark font-medium">{b.date} at {b.start_time} - {b.end_time}</p>
                  <p className="font-sans text-brown-light text-sm">{b.mode} session</p>
                </div>
                <div className="flex items-center gap-3">
                  <Tag variant={statusVariant(b.status)}>{b.status}</Tag>
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, 'cancelled')}>Decline</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
