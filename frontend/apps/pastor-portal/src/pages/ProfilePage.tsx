import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api, Button, Card, Input } from '@mtlbp/shared';
import type { PastorProfile } from '@mtlbp/shared';

export function ProfilePage() {
  const [profile, setProfile] = useState<PastorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '', church_name: '', denomination: '', location: '', specialties: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get<PastorProfile>('/pastors/me');
      setProfile(res.data);
      setForm({
        bio: res.data.bio || '',
        church_name: res.data.church_name || '',
        denomination: res.data.denomination || '',
        location: res.data.location || '',
        specialties: (res.data.specialties || []).join(', '),
      });
    } catch { /* first time, no profile */ }
    setIsLoading(false);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await api.put<PastorProfile>('/pastors/me', {
        bio: form.bio,
        church_name: form.church_name,
        denomination: form.denomination,
        location: form.location,
        specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setProfile(res.data);
    } catch { /* handle error */ }
    setIsSaving(false);
  }

  if (isLoading) return <DashboardLayout><p className="font-sans text-brown-medium">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl font-bold text-brown-dark mb-8">My Profile</h1>
      <Card>
        <div className="space-y-4 max-w-xl">
          <Input label="Church Name" value={form.church_name} onChange={(e) => setForm({ ...form, church_name: e.target.value })} />
          <Input label="Denomination" value={form.denomination} onChange={(e) => setForm({ ...form, denomination: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Specialties (comma-separated)" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-brown-dark mb-1 font-sans">Bio</label>
            <textarea
              className="w-full px-3 py-2 border border-sand-dark rounded-lg font-sans text-brown-dark bg-white focus:outline-none focus:ring-2 focus:ring-earth focus:border-transparent"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} isLoading={isSaving}>Save Profile</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
