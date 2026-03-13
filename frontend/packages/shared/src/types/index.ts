export interface User {
  id: string;
  email: string;
  role: 'pastor' | 'follower' | 'admin';
  first_name: string;
  last_name: string;
}

export interface PastorProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  church_name: string;
  denomination: string;
  location: string;
  photo_url: string | null;
  specialties: string[];
  is_visible: boolean;
}

export interface Service {
  id: string;
  pastor_id: string;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  price_cents: number;
  mode: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  pastor_id: string;
  follower_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  mode: string;
  status: string;
  meeting_link: string | null;
}

export interface Prayer {
  id: string;
  author_id: string | null;
  is_anonymous: boolean;
  text: string;
  status: string;
  pray_count: number;
  testimony: string | null;
  pastor_responses: { pastor_id: string; text: string }[];
}

export interface Donation {
  id: string;
  donor_id: string;
  amount_cents: number;
  type: string;
  pastor_id: string | null;
  stripe_payment_id: string | null;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  pastor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}
