"use client";

import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, CheckCircle2, IndianRupee, Target, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function VendorDashboard() {
  const { currentUser, bookings, services, updateBookingStatus } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed'>('requests');

  useEffect(() => {
    setMounted(true);
    if (!currentUser || currentUser.role !== "vendor") {
      router.push("/vendor/login");
    }
  }, [currentUser, router]);

  if (!mounted || !currentUser) return null;

  const vendorBookings = bookings.filter(b => b.status === 'Pending' || b.vendorId === currentUser.id);

  const pendingRequests = vendorBookings.filter(b => b.status === 'Pending').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const activeTasks = vendorBookings.filter(b => b.status === 'Accepted' || b.status === 'In Progress').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedTasks = vendorBookings.filter(b => b.status === 'Delivered' || b.status === 'Cancelled').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAccept = (id: string) => {
    updateBookingStatus(id, 'Accepted', currentUser.id);
    toast.success("Service request accepted!");
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Accepted' ? 'In Progress' : 'Delivered';
    updateBookingStatus(id, nextStatus as 'In Progress' | 'Delivered');
    toast.success(`Task marked as ${nextStatus}!`);
  };

  const earnings = completedTasks.filter(b => b.status === 'Delivered').reduce((sum, b) => {
    const s = services.find(srv => srv.id === b.serviceId);
    return sum + (s?.price || 0);
  }, 0);

  const renderBookingCard = (booking: any, type: 'request' | 'active' | 'completed') => {
    const service = services.find(s => s.id === booking.serviceId);
    if (!service) return null;

    return (
      <motion.div 
        key={booking.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-6 rounded-2xl premium-shadow mb-4 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
          <div>
            <h3 className="text-lg font-bold text-text-primary">{service.title}</h3>
            <p className="text-sm text-text-muted">ID: {booking.id} • Customer: {booking.customerId}</p>
          </div>
          <div className="text-lg font-bold text-primary flex items-center gap-1">
            <IndianRupee className="w-5 h-5" />
            {service.price}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-text-secondary mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{booking.location}</span>
          </div>
          {booking.notes && (
            <div className="sm:col-span-2 mt-2 p-3 bg-gray-50 rounded-lg text-xs">
              <span className="font-semibold block mb-1">Notes:</span>
              {booking.notes}
            </div>
          )}
        </div>

        {type === 'request' && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAccept(booking.id)}
              className="flex-1 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors flex justify-center items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept Request
            </button>
          </div>
        )}

        {type === 'active' && (
          <div className="flex items-center justify-between gap-4 p-4 bg-blue-50 rounded-xl">
            <span className="font-semibold text-blue-800">
              Current Status: {booking.status}
            </span>
            <button
              onClick={() => handleUpdateStatus(booking.id, booking.status)}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Mark as {booking.status === 'Accepted' ? 'In Progress' : 'Delivered'}
            </button>
          </div>
        )}

        {type === 'completed' && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
            booking.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {booking.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {booking.status}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Vendor Portal</h1>
          <p className="text-text-secondary mt-2">Manage your tasks and earnings.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl premium-shadow flex items-center gap-4 border-l-4 border-orange-500">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Pending Requests</p>
              <p className="text-2xl font-bold text-text-primary">{pendingRequests.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl premium-shadow flex items-center gap-4 border-l-4 border-blue-500">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Active Tasks</p>
              <p className="text-2xl font-bold text-text-primary">{activeTasks.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl premium-shadow flex items-center gap-4 border-l-4 border-green-500">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Earnings</p>
              <p className="text-2xl font-bold text-text-primary">₹{earnings}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl premium-shadow overflow-hidden mb-8 flex border-b border-gray-100">
          {[
            { id: 'requests', label: `New Requests (${pendingRequests.length})` },
            { id: 'active', label: `Active Tasks (${activeTasks.length})` },
            { id: 'completed', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary bg-blue-50/50' 
                  : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          <AnimatePresence mode="popLayout">
            {activeTab === 'requests' && (
              <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl premium-shadow">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary">All caught up!</h3>
                    <p className="text-text-secondary">There are no pending requests right now.</p>
                  </div>
                ) : (
                  pendingRequests.map(b => renderBookingCard(b, 'request'))
                )}
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {activeTasks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl premium-shadow">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary">No active tasks</h3>
                    <p className="text-text-secondary">Accept a new request to get started.</p>
                  </div>
                ) : (
                  activeTasks.map(b => renderBookingCard(b, 'active'))
                )}
              </motion.div>
            )}

            {activeTab === 'completed' && (
              <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {completedTasks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl premium-shadow">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary">No history yet</h3>
                    <p className="text-text-secondary">Completed tasks will appear here.</p>
                  </div>
                ) : (
                  completedTasks.map(b => renderBookingCard(b, 'completed'))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
