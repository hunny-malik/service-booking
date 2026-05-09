"use client";

import { useAppStore } from "@/lib/store";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Clock, CalendarIcon, MapPin, CheckCircle2, Navigation } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const bookingSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time slot"),
  location: z.string().min(10, "Please provide a detailed address"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function ServiceBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { services, currentUser, addBooking } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const service = services.find(s => s.id === unwrappedParams.id);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  if (!mounted) return null;

  if (!service) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
        <Link href="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const onSubmit = (data: BookingFormValues) => {
    if (!currentUser || currentUser.role !== 'customer') {
      toast.error("Please login as a customer to book a service");
      router.push("/login");
      return;
    }

    addBooking({
      customerId: currentUser.id,
      serviceId: service.id,
      date: data.date,
      time: data.time,
      location: data.location,
      notes: data.notes,
    });

    setIsSuccess(true);
    toast.success("Service booked successfully!");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsDetecting(true);
    toast.loading("Detecting location...", { id: 'location-toast' });
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.display_name) {
          setValue('location', data.display_name);
          toast.success("Location detected!", { id: 'location-toast' });
        } else {
          throw new Error("Could not fetch address");
        }
      } catch (err) {
        toast.error("Failed to reverse geocode location", { id: 'location-toast' });
      } finally {
        setIsDetecting(false);
      }
    }, (error) => {
      setIsDetecting(false);
      toast.error("Permission denied or failed to get location", { id: 'location-toast' });
    });
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl premium-shadow max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
          <p className="text-text-secondary mb-8">
            Your booking for <span className="font-semibold text-text-primary">{service.title}</span> has been successfully placed. Our professional will be assigned shortly.
          </p>
          <Link
            href="/customer/dashboard"
            className="block w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden premium-shadow grid grid-cols-1 md:grid-cols-2">
          {/* Service Details Left Panel */}
          <div className="relative h-64 md:h-auto">
            <Image 
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
              <div className="text-sm font-semibold uppercase tracking-wider mb-2 text-blue-300">
                {service.category}
              </div>
              <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
              <div className="text-2xl font-bold text-white mb-2">
                ₹{service.price}
              </div>
            </div>
          </div>

          {/* Booking Form Right Panel */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6">Book this Service</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Select Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date"
                    {...register("date")}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Select Time Slot</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    {...register("time")}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                  >
                    <option value="">Choose a time slot...</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-text-secondary">Service Address</label>
                  <button 
                    type="button" 
                    onClick={detectLocation}
                    disabled={isDetecting}
                    className="text-xs text-primary font-semibold flex items-center gap-1 hover:text-primary-hover disabled:opacity-50"
                  >
                    <Navigation className="w-3 h-3" />
                    Auto-detect
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea 
                    {...register("location")}
                    rows={3}
                    placeholder="Enter complete address..."
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Additional Notes (Optional)</label>
                <textarea 
                  {...register("notes")}
                  rows={2}
                  placeholder="Any specific instructions for the professional?"
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-text-secondary">Total Amount</span>
                  <span className="text-2xl font-bold text-text-primary">₹{service.price}</span>
                </div>
                
                {currentUser?.role === 'customer' ? (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all premium-shadow"
                  >
                    Confirm Booking
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-primary bg-blue-50 hover:bg-blue-100 transition-all text-center"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
