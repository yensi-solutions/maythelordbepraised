import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api, Card } from '@mtlbp/shared';

interface Donation {
  id: string;
  donor_id: string;
  amount_cents: number;
  type: string;
  pastor_id: string | null;
  stripe_payment_id: string | null;
  created_at: string;
}

export function GivingPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Donation[]>('/donations/received');
        setDonations(res.data);
      } catch { /* empty */ }
      setIsLoading(false);
    }
    load();
  }, []);

  const totalCents = donations.reduce((sum, d) => sum + d.amount_cents, 0);

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Giving</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card padding="md">
          <p className="font-sans text-brown-medium text-sm">Total Received</p>
          <p className="font-serif text-3xl font-bold text-brown-dark mt-1">
            {isLoading ? '...' : `$${(totalCents / 100).toFixed(2)}`}
          </p>
        </Card>
        <Card padding="md">
          <p className="font-sans text-brown-medium text-sm">Donations</p>
          <p className="font-serif text-3xl font-bold text-brown-dark mt-1">
            {isLoading ? '...' : donations.length}
          </p>
        </Card>
        <Card padding="md">
          <p className="font-sans text-brown-medium text-sm">Average Gift</p>
          <p className="font-serif text-3xl font-bold text-brown-dark mt-1">
            {isLoading || donations.length === 0 ? '...' : `$${(totalCents / donations.length / 100).toFixed(2)}`}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="font-serif text-xl font-semibold text-brown-dark mb-4">Recent Donations</h2>
        {isLoading ? (
          <p className="font-sans text-brown-medium">Loading...</p>
        ) : donations.length === 0 ? (
          <p className="font-sans text-brown-light text-center py-8">No donations received yet.</p>
        ) : (
          <div className="space-y-3">
            {donations.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-sand-dark last:border-0">
                <div>
                  <p className="font-sans text-brown-dark font-medium">${(d.amount_cents / 100).toFixed(2)}</p>
                  <p className="font-sans text-brown-light text-xs">
                    {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-sand text-brown-dark rounded-full text-xs font-sans capitalize">{d.type}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
