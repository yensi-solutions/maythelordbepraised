import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@mtlbp/shared';
import type { Booking, Prayer } from '@mtlbp/shared';

interface DashboardState {
  bookings: Booking[];
  prayers: Prayer[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchPrayers: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      bookings: [],
      prayers: [],
      isLoading: false,
      error: null,

      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<Booking[]>('/booking/bookings/me');
          set({ bookings: response.data, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch bookings', isLoading: false });
        }
      },

      fetchPrayers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<Prayer[]>('/prayers');
          set({ prayers: response.data, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch prayers', isLoading: false });
        }
      },
    }),
    { name: 'dashboard-store' },
  ),
);
