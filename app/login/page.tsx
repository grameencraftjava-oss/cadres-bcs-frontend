"use client";

import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-10 relative shadow-2xl">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-6 mt-4">
          <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-100 shadow-sm">
             <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-1" />
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm font-medium">Log in or sign up to continue your preparation</p>
        </div>

        {/* Authentication Buttons */}
        <div className="space-y-3">
          
          {/* Continue with Google */}
          <button className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">Continue with Google</span>
            </div>
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">Recommended</span>
          </button>

          {/* Continue with Apple */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-800 transition justify-center relative">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="absolute left-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.87.84 3.67 2.08-3.12 1.83-2.58 5.86.32 7.02-.63 1.54-1.57 3.03-2.64 3.91zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="font-semibold text-sm sm:text-base">Continue with Apple</span>
          </button>

          {/* Continue with Email */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition justify-center relative">
            <svg className="w-5 h-5 absolute left-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Continue with Email</span>
          </button>

          {/* Continue with Phone */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition justify-center relative">
            <svg className="w-5 h-5 absolute left-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Continue with Phone</span>
          </button>
          
        </div>

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
