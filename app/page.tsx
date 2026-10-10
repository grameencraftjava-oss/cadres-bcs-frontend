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
      image: "/taki.jpg"
    },
    {
      id: 2,
      name: "মেহেদী হাসান নাইম",
      cadre1: "BCS লাইভস্টক ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/mehedi.jpg"
    },
    {
      id: 3,
      name: "নিশা মজুমদার",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "মেরিট: ১৭তম, 47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/nisha.jpg"
    },
    {
      id: 4,
      name: "মো. আব্দুল্লাহ আল মামুন",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/mamun.jpg"
    },
    {
      id: 5,
      name: "ডা. মো. নাইম আলী",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/naim.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar (মেনুবার) - Fixed for Mobile */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 cursor-pointer">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-0.5 md:p-1" />
              </div>
              <h1 className="text-sm sm:text-lg md:text-2xl font-extrabold text-gray-800 tracking-tight">
                Cadre&apos;s BCS <span className="hidden sm:inline">Compass-</span><span className="text-blue-700">CBC</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">কোর্সসমূহ</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">মডেল টেস্ট</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">আমাদের সম্পর্কে</Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:space-x-4">
              <Link href="/login" className="hidden md:inline-flex px-6 py-2.5 text-blue-700 font-bold hover:bg-blue-50 rounded-xl transition">
                লগইন
              </Link>
              <Link href="/dashboard" className="px-3 py-1.5 md:px-6 md:py-2.5 bg-blue-600 text-white text-[11px] md:text-base font-bold rounded-lg md:rounded-xl hover:bg-blue-700 shadow-md transition whitespace-nowrap">
                ফ্রি শুরু করুন
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Fixed for Mobile */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side (Text) */}
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
              <Link href="#" className="block w-full px-8 py-3.5 md:py-4 bg-blue-600 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all">
                কোর্সগুলো দেখুন
              </Link>
            </div>
          </div>

          {/* Right Side (Hero Graphic with team.png) */}
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
      <section className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Golden <span className="text-orange-500">Mentors</span> Panel
            </h2>
            <div className="w-16 md:w-24 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 font-medium px-4">
              যাঁরা নিজেরা সফল হয়েছেন, তাঁদের গাইডলাইনেই হোক আপনার প্রস্তুতি
            </p>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group flex flex-col h-full">
                {/* Image Area */}
                <div className="h-40 md:h-48 bg-blue-50 flex items-end justify-center pt-6 px-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
                  {/* Photo Placeholder */}
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
                
                {/* Info Area */}
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
  );
}
