"use client";

import { useAppStore } from "@/lib/store";
import { ArrowRight, ShieldCheck, Clock, Star, Search, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { services } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-background-start">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-start/90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tighter mb-6 leading-tight">
              Premium Home Services, <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">At Your Doorstep</span>
            </h1>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto tracking-tight">
              Book expert cleaners, repairmen, and maintenance professionals instantly. Secure, reliable, and hassle-free.
            </p>
            
            {/* Mock Search Bar */}
            <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl sm:rounded-full premium-shadow flex flex-col sm:flex-row items-center border border-gray-100">
              <div className="flex-1 w-full flex items-center px-6 py-3 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="What do you need help with?" 
                  className="w-full bg-transparent border-none focus:ring-0 text-text-primary placeholder-gray-400 outline-none"
                />
              </div>
              <div className="flex-[0.6] w-full flex items-center px-6 py-3">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <select className="w-full bg-transparent border-none focus:ring-0 text-text-primary outline-none cursor-pointer appearance-none">
                  <option>Current Location</option>
                  <option>New Delhi</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                </select>
              </div>
              <Link 
                href="#services"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl sm:rounded-full font-semibold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 m-1"
              >
                Search
              </Link>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-text-muted">
              <span>Popular:</span>
              <Link href="#services" className="hover:text-primary transition-colors hover:underline">Deep Cleaning</Link>
              <Link href="#services" className="hover:text-primary transition-colors hover:underline">AC Repair</Link>
              <Link href="#services" className="hover:text-primary transition-colors hover:underline">Plumbing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: "Verified Professionals", desc: "Every vendor undergoes strict background checks." },
              { icon: Clock, title: "On-Time Service", desc: "We value your time. Guaranteed punctual arrivals." },
              { icon: Star, title: "Premium Quality", desc: "Top-tier service quality with satisfaction guaranteed." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Popular Services</h2>
            <p className="text-text-secondary text-lg">Choose from our most requested home services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden premium-shadow group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary">
                    ₹{service.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    {service.category}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1">{service.title}</h3>
                  <p className="text-text-muted text-sm mb-6 line-clamp-2">{service.description}</p>
                  
                  <Link
                    href={`/service/${service.id}`}
                    className="block w-full text-center py-3 bg-gray-50 text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
