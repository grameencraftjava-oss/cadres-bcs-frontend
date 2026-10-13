"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Mobile Responsive Top Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src="/logo.png" alt="CBC Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
            <span className="text-[13px] sm:text-lg md:text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
              Cadre&apos;s BCS Compass-<span className="text-blue-600">CBC</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-700 shrink-0">
            <Link href="/courses" className="hover:text-blue-600 transition">কোর্সসমূহ</Link>
            <Link href="/#about" className="hover:text-blue-600 transition">আমাদের সম্পর্কে</Link>
            <Link href="#contact" className="hover:text-blue-600 transition">যোগাযোগ</Link>
          </nav>

          <div className="shrink-0">
            <Link href="/login" className="inline-block whitespace-nowrap bg-blue-600 text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm">
              লগইন / সাইন আপ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-16 sm:py-20">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-4">আমাদের কোর্সসমূহ</h1>
          
          <div className="bg-blue-50/50 p-6 sm:p-8 rounded-xl border border-blue-100 mb-8">
            <p className="text-blue-800 font-medium text-base sm:text-lg">
              দুঃখিত, বর্তমানে কোনো কোর্স এভেইলেবল নেই।
            </p>
            <p className="text-xs sm:text-sm text-blue-600 mt-2">
              নতুন কোর্স আসলে এখানে আপডেট করা হবে। আমাদের সাথেই থাকুন!
            </p>
          </div>

          <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>

      {/* Footer Section with Social Icons */}
      <footer id="contact" className="bg-slate-900 text-white py-12 sm:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center p-1 shrink-0">
                  <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Cadre&apos;s BCS <span className="text-blue-500">Compass</span></h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ কোর্সে।
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 border-b border-slate-800 pb-2 inline-block">জরুরি যোগাযোগ</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Md. Abdullah Al Mamun</p>
                    <a href="tel:+8801612029324" className="text-slate-400 text-sm hover:text-blue-400 transition">+880 1612-029324</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Taki Yasir Tomal</p>
                    <a href="tel:+8801720335771" className="text-slate-400 text-sm hover:text-blue-400 transition">+880 1720-335771</a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 border-b border-slate-800 pb-2 inline-block">আমাদের সাথে যুক্ত থাকুন</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                বিসিএস সম্পর্কিত সকল আপডেট, ফ্রি গাইডলাইন এবং আমাদের স্পেশাল কমিউনিটিতে যুক্ত হতে নিচের অফিসিয়াল চ্যানেলগুলোতে জয়েন করুন:
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1ERfS7rgK8/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://youtube.com/@cadres_bcs_compass?si=ITxgFwjEygObJ4T8" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-11 h-11 bg-slate-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://chat.whatsapp.com/DraE44qbMBZ3xPhWh5uEFI?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-11 h-11 bg-slate-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="https://t.me/+S7nT5CwsTXM5ODg9" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-11 h-11 bg-slate-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.19 3.44-.49.34-.93.5-1.33.49-.44-.01-1.28-.25-1.91-.45-.77-.25-1.38-.38-1.32-.8.03-.22.33-.44.89-.67 3.49-1.52 5.82-2.53 6.99-3.02 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.46.14.12.09.15.22.16.33 0 .07-.01.21-.02.34z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Cadre&apos;s BCS Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
