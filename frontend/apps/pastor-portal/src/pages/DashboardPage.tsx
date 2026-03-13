import { useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useDashboardStore } from '../stores/useDashboardStore';
import { Card } from '@mtlbp/shared';

export function DashboardPage() {
  const { bookings, prayers, isLoading, fetchBookings, fetchPrayers } = useDashboardStore();

  useEffect(() => {
    fetchBookings();
    fetchPrayers();
  }, [fetchBookings, fetchPrayers]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activePrayers = prayers.filter((p) => p.status === 'active');

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Bookings', value: pendingBookings.length, color: 'bg-earth' },
          { label: 'Total Bookings', value: bookings.length, color: 'bg-brown-medium' },
          { label: 'Active Prayers', value: activePrayers.length, color: 'bg-earth-light' },
          { label: 'Total Prayers', value: prayers.length, color: 'bg-sand' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="font-sans text-brown-medium text-sm">{stat.label}</p>
            <p className="font-serif text-3xl font-bold text-brown-dark mt-1">{isLoading ? '...' : stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-serif text-xl font-semibold text-brown-dark mb-4">Upcoming Bookings</h2>
          {pendingBookings.length === 0 ? (
            <p className="font-sans text-brown-light text-sm">No pending bookings</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-sand-dark last:border-0">
                  <div>
                    <p className="font-sans text-brown-dark text-sm">{booking.date}</p>
                    <p className="font-sans text-brown-light text-xs">{booking.start_time} - {booking.end_time}</p>
                  </div>
                  <span className="px-2 py-1 bg-sand text-brown-dark rounded-full text-xs font-sans">{booking.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-serif text-xl font-semibold text-brown-dark mb-4">Recent Prayer Requests</h2>
          {activePrayers.length === 0 ? (
            <p className="font-sans text-brown-light text-sm">No active prayer requests</p>
          ) : (
            <div className="space-y-3">
              {activePrayers.slice(0, 5).map((prayer) => (
                <div key={prayer.id} className="py-2 border-b border-sand-dark last:border-0">
                  <p className="font-sans text-brown-dark text-sm line-clamp-2">{prayer.text}</p>
                  <p className="font-sans text-earth text-xs mt-1">{prayer.pray_count} praying</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
