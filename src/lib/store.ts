import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'customer' | 'vendor' | null;
export type BookingStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Delivered' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  vendorId?: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  services: Service[];
  bookings: Booking[];
  login: (user: User) => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus, vendorId?: string) => void;
  cancelBooking: (id: string) => void;
  initializeMockData: () => void;
}

const mockServices: Service[] = [
  {
    id: 's1',
    title: 'Deep Home Cleaning',
    description: 'Complete deep cleaning of your home including bathrooms and kitchen.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    category: 'Cleaning',
  },
  {
    id: 's2',
    title: 'Plumbing Repair',
    description: 'Expert plumbing services for leaks, pipe repairs, and installations.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800',
    category: 'Repairs',
  },
  {
    id: 's3',
    title: 'Electrical Services',
    description: 'Professional electrical wiring, fixture installation, and repairs.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    category: 'Repairs',
  },
  {
    id: 's4',
    title: 'AC Servicing',
    description: 'Comprehensive AC maintenance and gas refilling service.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1527628217451-b2414a1ee733?auto=format&fit=crop&q=80&w=800',
    category: 'Maintenance',
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      services: [],
      bookings: [],
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      addBooking: (bookingData) => set((state) => ({
        bookings: [
          ...state.bookings,
          {
            ...bookingData,
            id: `b_${Date.now()}`,
            status: 'Pending',
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      updateBookingStatus: (id, status, vendorId) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, status, ...(vendorId && { vendorId }) } : b
        )
      })),
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => 
          b.id === id ? { ...b, status: 'Cancelled' } : b
        )
      })),
      initializeMockData: () => set((state) => {
        if (state.services.length === 0) {
          return { services: mockServices };
        }
        return state;
      }),
    }),
    {
      name: 'service-booking-storage',
    }
  )
);
