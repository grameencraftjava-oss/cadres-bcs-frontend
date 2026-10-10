"use client";

import Link from 'next/link';

export default function Home() {
  const mentors = [
    {
      id: 1,
      name: "তকী ইয়াসীর তমাল",
      cadre1: "BCS পুলিশ ক্যাডার, 47th BCS",
      cadre2: "BCS রেলওয়ে পরিবহণ, 46th BCS",
      university: "BUET",
      image: "/Taki.png"
    },
    {
      id: 2,
      name: "মেহেদী হাসান নাইম",
      cadre1: "BCS লাইভস্টক ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/Mehedi.png"
    },
    {
      id: 3,
      name: "নিশা মজুমদার",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "মেরিট: ১৭তম, 47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/Nisha.png"
    },
    {
      id: 4,
      name: "মো. আব্দুল্লাহ আল মামুন",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/Mamun.png"
    },
    {
      id: 5,
      name: "ডা. মো. নাইম আলী",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/Naim.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full overflow-hidden flex items-center justify-center border border-gray-100">
                <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-0.5 md:p-1" />
              </div>
              <h1 className="text-sm sm:text-lg md:text-2xl font-extrabold text-gray-800 tracking-tight">
                Cadre&apos;s BCS <span className="hidden sm:inline">Compass-</span><span className="text-blue-700">CBC</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-semibold transition">কোর্সসমূহ</Link>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition">আমাদের সম্পর্কে</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition">যোগাযোগ</a>
            </div>

            <div className="flex items-center">
              <Link href="/login" className="px-5 py-2 md:px-8 md:py-3 bg-blue-600 text-white text-sm md:text-base font-bold rounded-lg md:rounded-xl hover:bg-blue-700 shadow-md transition whitespace-nowrap">
                লগইন / সাইন আপ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm shadow-sm border border-orange-200">
                🚀 বাংলাদেশের সেরা বিসিএস প্রস্তুতি
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2]">
                আপনার <span className="text-blue-600">ক্যাডার</span> হওয়ার স্বপ্ন পূরণের বিশ্বস্ত সঙ্গী
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg font-medium">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ লাইভ ও রেকর্ডেড কোর্সে।
              </p>
              
              <div className="w-full sm:w-auto pt-2 md:pt-4">
                <Link href="/courses" className="block w-full px-8 py-3.5 md:py-4 bg-blue-600 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all">
                  কোর্সগুলো দেখুন
                </Link>
              </div>
            </div>

            <div className="relative mt-4 md:mt-0 flex justify-center">
              <div className="w-full max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100/50">
                <img 
                  src="/team.png" 
                  alt="Cadre's BCS Compass Team" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Golden Mentors Panel Section */}
        <section id="about" className="bg-gray-50 py-16 border-t border-gray-100 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Golden <span className="text-orange-500">Mentors</span> Panel
              </h2>
              <div className="w-16 md:w-24 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
              <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 font-medium px-4">
                যাঁরা নিজেরা সফল হয়েছেন, তাঁদের গাইডলাইনেই হোক আপনার প্রস্তুতি
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col h-full">
                  <div className="h-40 md:h-48 bg-blue-50 flex items-end justify-center pt-6 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
                    <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-full border-4 border-white shadow-md overflow-hidden translate-y-6 group-hover:-translate-y-2 transition-transform duration-500">
                      <img 
                        src={mentor.image} 
                        alt={mentor.name} 
                        className="w-full h-full object-cover bg-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(mentor.name) + "&background=2563eb&color=fff&size=200";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-5 text-center flex-1 flex flex-col justify-between bg-white z-10 pt-10 md:pt-12">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2">{mentor.name}</h3>
                      <p className="text-xs md:text-sm font-bold text-blue-700">{mentor.cadre1}</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-600 mt-1">{mentor.cadre2}</p>
                    </div>
                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                      <p className="text-[11px] md:text-xs font-medium text-gray-500 flex items-center justify-center gap-1">
                        <span>🎓</span> {mentor.university}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer & Contact Section */}
      <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800 scroll-mt-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            
            {/* Brand Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center p-1">
                  <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
                  Cadre&apos;s BCS <span className="text-blue-500">Compass</span>
                </h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ কোর্সে।
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-5 border-b border-slate-700 pb-2 inline-block text-white">প্রয়োজনীয় লিংক</h3>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li><Link href="/courses" className="hover:text-blue-400 transition flex items-center gap-2"><span className="text-blue-500">›</span> আমাদের কোর্সসমূহ</Link></li>
                <li><a href="#about" className="hover:text-blue-400 transition flex items-center gap-2"><span className="text-blue-500">›</span> আমাদের সম্পর্কে</a></li>
                <li><Link href="/login" className="hover:text-blue-400 transition flex items-center gap-2"><span className="text-blue-500">›</span> লগইন / সাইন আপ</Link></li>
              </ul>
            </div>

            {/* Social Links with Logos */}
            <div>
              <h3 className="text-lg font-bold mb-5 border-b border-slate-700 pb-2 inline-block text-white">আমাদের সাথে যুক্ত থাকুন</h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">বিসিএস সম্পর্কিত সকল আপডেট, ফ্রি গাইডলাইন এবং আমাদের স্পেশাল কমিউনিটিতে যুক্ত হতে নিচের অফিসিয়াল চ্যানেলগুলোতে জয়েন করুন:</p>
              <div className="flex flex-wrap gap-4">
                {/* Facebook */}
                <a href="https://www.facebook.com/share/1ERfS7rgK8/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-blue-500/30" title="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {/* YouTube */}
                <a href="https://youtube.com/@cadres_bcs_compass?si=ITxgFwjEygObJ4T8" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-red-500/30" title="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {/* WhatsApp */}
                <a href="https://chat.whatsapp.com/DraE44qbMBZ3xPhWh5uEFI?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-green-500/30" title="WhatsApp">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/+S7nT5CwsTXM5ODg9" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#0088cc] hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-[#0088cc]/30" title="Telegram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Cadre&apos;s BCS Compass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
