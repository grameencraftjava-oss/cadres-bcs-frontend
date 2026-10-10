"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ইমেইল-পাসওয়ার্ড দিয়ে লগইন হ্যান্ডল করার ফাংশন
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Logging in...");

    try {
      const response = await fetch("https://cadres-bcs-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.text();

      if (response.ok && data.includes("Success")) {
        const token = data.split("Token: ")[1]?.trim();
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userEmail", email);
          setMessage("✅ Login Successful! Redirecting...");
          
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
            setMessage("❌ Token parsing failed.");
            setIsLoading(false);
        }
      } else {
        setMessage("❌ " + data);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-10 relative shadow-2xl">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-6 mt-4">
          <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
            <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-1" />
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm font-medium">Log in or sign up to continue your preparation</p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3 mb-6">
          <button type="button" className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">Continue with Google</span>
            </div>
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">Recommended</span>
          </button>
          
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-900 transition-colors relative">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="absolute left-4">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C9.6 19.33 8.43 17 8.43 14.5c0-3.04 1.9-4.66 4.09-4.75 1.1-.05 2.12.7 2.8.7.67 0 1.9-.84 3.22-.72 1.37.1 2.53.72 3.24 1.77-2.82 1.62-2.36 5.64.44 6.84-.6 1.48-1.39 2.85-2.17 3.94zM14.62 6.02c-.52.65-1.29 1.07-2.08 1.05-.12-1.63.7-3.18 1.96-4.04.53-.62 1.3-1.05 2.1-1.03.14 1.7-.75 3.25-1.98 4.02z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base ml-8">Continue with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">or continue with email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="admin@cadrescompass.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded-lg">{message}</p>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-[13px] text-gray-500 space-y-1.5 font-medium">
          <p>
            By continuing you agree to our <Link href="#" className="text-teal-600 hover:underline">Terms</Link> and <Link href="#" className="text-teal-600 hover:underline">Privacy Policy</Link>.
          </p>
          <p>
            Need Help? <Link href="#" className="text-teal-600 hover:underline">Help Desk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
