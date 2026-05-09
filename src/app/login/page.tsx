"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/customer/dashboard";
    }
  }, [status]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setStep(2);
      toast.success("OTP sent! Please also check your spam folder.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        otp,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Logged in successfully!");
      window.location.href = "/customer/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/customer/dashboard" });
  };

  return (
    <div className="flex-1 flex min-h-[calc(100vh-5rem)]">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <Image 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
          alt="Premium Home Services"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <span className="font-bold text-2xl">S</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
              Premium services for <br />your premium home.
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              Join thousands of homeowners who trust ServiceHub for their maintenance, repair, and cleaning needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-left">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              {step === 1 ? "Welcome Back" : "Verify Email"}
            </h2>
            <p className="mt-2 text-text-secondary">
              {step === 1 
                ? "Sign in to book premium services" 
                : `OTP sent to ${email}. Please check your spam folder.`}
            </p>
          </div>

        {step === 1 && (
          <div className="mt-8 space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all premium-shadow"
            >
              <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
              Continue with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>
        )}

        {step === 1 ? (
          <form className="mt-4 space-y-6" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email Address</label>
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
                placeholder="Email Address"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all premium-shadow disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Get OTP"}
              {!isLoading && <ArrowRight className="absolute right-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">Enter OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none text-center tracking-widest rounded-xl relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-lg font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all premium-shadow disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-primary hover:text-primary-hover"
              >
                Change email address
              </button>
            </div>
          </form>
        )}

          <div className="mt-8 text-center text-sm text-text-secondary border-t border-gray-100 pt-8">
            Are you a service professional?{" "}
            <Link href="/vendor/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Login here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
