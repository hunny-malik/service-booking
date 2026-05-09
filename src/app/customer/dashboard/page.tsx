"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Clock, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { useSession } from "next-auth/react";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const { currentUser, bookings, services } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!mounted || status === "loading" || !currentUser || currentUser.role !== "customer") return null;

  const myBookings = bookings.filter(b => b.customerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock3 className="w-5 h-5 text-orange-500" />;
      case 'Accepted': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return "bg-orange-50 text-orange-700 border-orange-200";
      case 'Accepted': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'In Progress': return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case 'Delivered': return "bg-green-50 text-green-700 border-green-200";
      case 'Cancelled': return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Dashboard</h1>
          <p className="text-text-secondary mt-2">Welcome back, {currentUser.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl premium-shadow">
              <h2 className="text-xl font-bold text-text-primary">Recent Bookings</h2>
              <Link 
                href="/#services" 
                className="text-sm font-medium text-primary hover:text-primary-hover bg-blue-50 px-4 py-2 rounded-lg"
              >
                Book New Service
              </Link>
            </div>

            {myBookings.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl premium-shadow text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">No bookings yet</h3>
                <p className="text-text-secondary mb-6">Looks like you haven't booked any services.</p>
                <Link 
                  href="/#services"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary-hover premium-shadow"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking, idx) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  if (!service) return null;

                  return (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-6 rounded-2xl premium-shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-lg font-bold text-text-primary">{service.title}</h3>
                          <p className="text-sm text-text-muted">Booking ID: {booking.id}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{booking.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar - Profile Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl premium-shadow">
              <h3 className="text-lg font-bold text-text-primary mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Name</label>
                  <p className="font-medium text-text-primary">{currentUser.name}</p>
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Mobile</label>
                  <p className="font-medium text-text-primary">{currentUser.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Total Bookings</label>
                  <p className="font-medium text-text-primary">{myBookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl premium-shadow text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">ServiceHub Pro</h3>
                <p className="text-sm text-blue-100 mb-4">Get 10% off on all home services with our pro membership.</p>
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
