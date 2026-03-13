import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { api, Card, Avatar, Tag, Button, Input } from '@mtlbp/shared';
import type { PastorProfile, Service, AvailabilitySlot } from '@mtlbp/shared';

export function PastorDetailPage() {
  const { pastorId } = useParams<{ pastorId: string }>();
  const [pastor, setPastor] = useState<PastorProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ service_id: '', date: '', start_time: '', mode: 'virtual' });
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes, aRes] = await Promise.all([
          api.get<PastorProfile>(`/pastors/${pastorId}`),
          api.get<Service[]>(`/booking/pastors/${pastorId}/services`),
          api.get<AvailabilitySlot[]>(`/booking/pastors/${pastorId}/availability`),
        ]);
        setPastor(pRes.data);
        setServices(sRes.data);
        setAvailability(aRes.data);
        if (sRes.data.length > 0) setBookingForm((f) => ({ ...f, service_id: sRes.data[0].id }));
      } catch { /* empty */ }
      setIsLoading(false);
    }
    load();
  }, [pastorId]);

  async function handleBook() {
    try {
      await api.post('/booking/bookings', { ...bookingForm, pastor_id: pastorId });
      setBookingStatus('Booking requested! The pastor will confirm soon.');
    } catch (e: any) {
      setBookingStatus(e.response?.data?.detail || 'Booking failed');
    }
  }

  if (isLoading) return <AppLayout><p className="font-sans text-brown-medium">Loading...</p></AppLayout>;
  if (!pastor) return <AppLayout><p className="font-sans text-brown-medium">Pastor not found.</p></AppLayout>;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <Avatar name={`${pastor.first_name} ${pastor.last_name}`} src={pastor.photo_url} size="lg" className="mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold text-brown-dark">{pastor.first_name} {pastor.last_name}</h1>
              <p className="font-sans text-brown-medium">{pastor.church_name}</p>
              <p className="font-sans text-brown-light text-sm">{pastor.denomination} &middot; {pastor.location}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {pastor.specialties.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
            {pastor.bio && <p className="font-sans text-brown-medium text-sm mt-6">{pastor.bio}</p>}
            {availability.length > 0 && (
              <div className="mt-6">
                <h3 className="font-serif text-sm font-semibold text-brown-dark mb-2">Availability</h3>
                <div className="space-y-1">
                  {availability.map((a) => (
                    <p key={a.id} className="font-sans text-brown-medium text-xs capitalize">{a.day_of_week}: {a.start_time} - {a.end_time}</p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-serif text-xl font-semibold text-brown-dark mb-4">Services</h2>
            {services.length === 0 ? (
              <p className="font-sans text-brown-light text-sm">No services available.</p>
            ) : (
              <div className="space-y-3">
                {services.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between py-3 border-b border-sand-dark last:border-0">
                    <div>
                      <p className="font-sans text-brown-dark font-medium">{svc.name}</p>
                      <p className="font-sans text-brown-light text-xs">{svc.duration_minutes} min &middot; {svc.price_cents === 0 ? 'Free' : `$${(svc.price_cents / 100).toFixed(2)}`}</p>
                    </div>
                    <Tag>{svc.category}</Tag>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-serif text-xl font-semibold text-brown-dark mb-4">Book a Session</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1 font-sans">Service</label>
                <select className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white" value={bookingForm.service_id} onChange={(e) => setBookingForm({ ...bookingForm, service_id: e.target.value })}>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <Input label="Date" type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
              <Input label="Start Time" type="time" value={bookingForm.start_time} onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1 font-sans">Mode</label>
                <select className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white" value={bookingForm.mode} onChange={(e) => setBookingForm({ ...bookingForm, mode: e.target.value })}>
                  <option value="virtual">Virtual</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
              <Button onClick={handleBook}>Request Booking</Button>
              {bookingStatus && <p className="font-sans text-sm text-earth">{bookingStatus}</p>}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
