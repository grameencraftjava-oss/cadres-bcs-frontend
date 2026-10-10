"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Logging in...");

    try {
      const response = await fetch("https://cadres-bcs-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });

      const data = await response.text();

      if (response.ok && data.includes("Success")) {
        const token = data.split("Token: ")[1]?.trim();
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userEmail", emailOrPhone);
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
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{
        backgroundImage: "url('/bcs-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark Overlay with Blur Effect */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[6px] z-0"></div>

      {/* Login Card */}
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-10 relative z-10 shadow-2xl my-8">
        
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
          <button type="button" className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors relative">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="absolute left-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-gray-800 text-sm sm:text-base ml-8">Continue with Google</span>
            </div>
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">Recommended</span>
          </button>
          
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-900 transition-colors relative">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="absolute left-4">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C9.6 19.33 8.43 17 8.43 14.5c0-3.04 1.9-4.66 4.09-4.75 1.1-.05 2.12.7 2.8.7.67 0 1.9-.84 3.22-.72 1.37.1 2.53.72 3.24 1.77-2.82 1.62-2.36 5.64.44 6.84-.6 1.48-1.39 2.85-2.17 3.94zM14.62 6.02c-.52.65-1.29 1.07-2.08 1.05-.12-1.63.7-3.18 1.96-4.04.53-.62 1.3-1.05 2.1-1.03.14 1.7-.75 3.25-1.98 4.02z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base ml-8">Continue with Apple</span>
          </button>

          <button type="button" className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors relative">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="absolute left-4">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
            </svg>
            <span className="font-semibold text-gray-800 text-sm sm:text-base ml-8">Continue with Facebook</span>
          </button>

          <button type="button" className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors relative">
            <svg className="w-5 h-5 absolute left-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <span className="font-semibold text-gray-800 text-sm sm:text-base ml-8">Continue with Phone</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">or continue with email/phone</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Email/Phone and Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Phone Number</label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="email@example.com or 017XXXXXXXX"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center shadow-md"
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
            By continuing you agree to our <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
          <p>
            Need Help? <Link href="#" className="text-blue-600 hover:underline">Help Desk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
