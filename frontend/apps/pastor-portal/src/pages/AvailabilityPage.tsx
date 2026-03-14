import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api, Button, Card } from '@mtlbp/shared';
import { useAuthStore } from '../stores/useAuthStore';

interface AvailabilitySlot {
  id: string;
  pastor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function AvailabilityPage() {
  const { user } = useAuthStore();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editSlots, setEditSlots] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({});

  useEffect(() => {
    if (user) loadAvailability();
  }, [user]);

  async function loadAvailability() {
    try {
      const res = await api.get<AvailabilitySlot[]>(`/booking/pastors/${user!.id}/availability`);
      setSlots(res.data);
      const slotMap: Record<string, { enabled: boolean; start: string; end: string }> = {};
      for (const day of DAYS) {
        const existing = res.data.find((s) => s.day_of_week === day);
        slotMap[day] = existing
          ? { enabled: true, start: existing.start_time, end: existing.end_time }
          : { enabled: false, start: '09:00', end: '17:00' };
      }
      setEditSlots(slotMap);
    } catch { /* empty */ }
    setIsLoading(false);
  }

  async function handleSave() {
    setIsSaving(true);
    const activeSlots = DAYS
      .filter((d) => editSlots[d]?.enabled)
      .map((d) => ({ day_of_week: d, start_time: editSlots[d].start, end_time: editSlots[d].end }));
    try {
      const res = await api.put<AvailabilitySlot[]>('/booking/availability', { slots: activeSlots });
      setSlots(res.data);
    } catch { /* empty */ }
    setIsSaving(false);
  }

  function toggleDay(day: string) {
    setEditSlots((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }

  function updateTime(day: string, field: 'start' | 'end', value: string) {
    setEditSlots((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-brown-dark">Availability</h1>
        <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
      </div>

      {isLoading ? (
        <p className="font-sans text-brown-medium">Loading...</p>
      ) : (
        <div className="space-y-3">
          {DAYS.map((day) => {
            const slot = editSlots[day];
            if (!slot) return null;
            return (
              <Card key={day}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        onChange={() => toggleDay(day)}
                        className="w-4 h-4 rounded border-sand-dark text-earth focus:ring-earth"
                      />
                      <span className="font-sans text-brown-dark font-medium capitalize w-24">{day}</span>
                    </label>
                    {slot.enabled && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTime(day, 'start', e.target.value)}
                          className="px-2 py-1 border border-sand-dark rounded font-sans text-sm text-brown-dark"
                        />
                        <span className="font-sans text-brown-light text-sm">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTime(day, 'end', e.target.value)}
                          className="px-2 py-1 border border-sand-dark rounded font-sans text-sm text-brown-dark"
                        />
                      </div>
                    )}
                  </div>
                  {slot.enabled && (
                    <span className="font-sans text-earth text-xs">Available</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
