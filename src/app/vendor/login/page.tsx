"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if (email === "vendor@demo.com" && password === "vendor123") {
      login({
        id: "v_123",
        name: "Demo Professional",
        phone: "9876543210",
        role: "vendor"
      });
      toast.success("Welcome back, Partner!");
      router.push("/vendor/dashboard");
    } else {
      toast.error("Invalid credentials. Try vendor@demo.com / vendor123");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl premium-shadow"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary">
            Vendor Portal
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your service requests and earnings
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="vendor@demo.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="vendor123"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800">
            <strong>Demo Credentials:</strong><br />
            Email: vendor@demo.com<br />
            Password: vendor123
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all premium-shadow"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-6">
          Looking to book a service?{" "}
          <Link href="/login" className="font-medium text-secondary hover:text-primary transition-colors">
            Customer Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
