import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api, Button, Card, Input, Modal } from '@mtlbp/shared';
import type { Service } from '@mtlbp/shared';
import { useAuthStore } from '../stores/useAuthStore';

export function ServicesPage() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'counseling', duration_minutes: '60', price_cents: '0', mode: 'both' });

  useEffect(() => {
    if (user) loadServices();
  }, [user]);

  async function loadServices() {
    try {
      const res = await api.get<Service[]>(`/booking/pastors/${user!.id}/services`);
      setServices(res.data);
    } catch { /* empty */ }
    setIsLoading(false);
  }

  async function handleCreate() {
    try {
      await api.post('/booking/services', {
        ...form,
        duration_minutes: parseInt(form.duration_minutes),
        price_cents: parseInt(form.price_cents),
      });
      setShowModal(false);
      setForm({ name: '', description: '', category: 'counseling', duration_minutes: '60', price_cents: '0', mode: 'both' });
      loadServices();
    } catch { /* handle error */ }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-brown-dark">Services</h1>
        <Button onClick={() => setShowModal(true)}>Add Service</Button>
      </div>

      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : services.length === 0 ? (
        <Card><p className="font-sans text-brown-light text-center py-8">No services yet. Create your first service to get started.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <Card key={svc.id}>
              <h3 className="font-serif text-lg font-semibold text-brown-dark">{svc.name}</h3>
              <p className="font-sans text-brown-medium text-sm mt-1">{svc.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-2 py-1 bg-sand text-brown-dark rounded-full text-xs font-sans">{svc.category}</span>
                <span className="font-sans text-brown-light text-xs">{svc.duration_minutes} min</span>
                <span className="font-sans text-brown-light text-xs">{svc.price_cents === 0 ? 'Free' : `$${(svc.price_cents / 100).toFixed(2)}`}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Service">
        <div className="space-y-4">
          <Input label="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-dark mb-1 font-sans">Category</label>
              <select className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="counseling">Counseling</option>
                <option value="ceremony">Ceremony</option>
                <option value="visit">Visit</option>
                <option value="pre_marital">Pre-Marital</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Duration (min)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Service</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
