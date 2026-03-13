import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { api, Card, Button, Input } from '@mtlbp/shared';

export function GivingPage() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  async function handleGive() {
    const cents = Math.round(parseFloat(amount) * 100);
    if (isNaN(cents) || cents <= 0) return;
    setIsLoading(true);
    try {
      const res = await api.post<{ checkout_url: string }>('/donations/checkout', {
        amount_cents: cents,
        type,
        success_url: `${window.location.origin}/give?success=true`,
        cancel_url: `${window.location.origin}/give?cancelled=true`,
      });
      window.location.href = res.data.checkout_url;
    } catch { /* handle */ }
    setIsLoading(false);
  }

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">Give</h1>

      <div className="max-w-lg mx-auto">
        <Card>
          <h2 className="font-serif text-xl font-semibold text-brown-dark mb-6 text-center">Support Your Ministry</h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {['25', '50', '100'].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`py-4 rounded-xl font-sans font-semibold text-lg transition-colors ${
                  amount === preset ? 'bg-brown-dark text-cream' : 'bg-sand text-brown-dark hover:bg-sand-dark'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          <Input label="Custom Amount ($)" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />

          <div className="mt-4">
            <label className="block text-sm font-medium text-brown-dark mb-1 font-sans">Giving Type</label>
            <select className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="general">General Offering</option>
              <option value="tithe">Tithe</option>
              <option value="offering">Special Offering</option>
              <option value="missions">Missions</option>
              <option value="building">Building Fund</option>
            </select>
          </div>

          <Button className="w-full mt-6" size="lg" onClick={handleGive} isLoading={isLoading}>
            Give ${amount || '0.00'}
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
}
