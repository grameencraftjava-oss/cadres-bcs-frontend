"use client";

import Link from 'next/link';

export default function Home() {
  // মেন্টরদের ডেটা
  const mentors = [
    {
      id: 1,
      name: "তকী ইয়াসীর তমাল",
      cadre1: "BCS পুলিশ ক্যাডার, 47th BCS",
      cadre2: "BCS রেলওয়ে পরিবহণ, 46th BCS",
      university: "BUET",
      image: "/taki.jpg"
    },
    {
      id: 2,
      name: "মেহেদী হাসান নাইম",
      cadre1: "BCS লাইভস্টক ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/mehedi.jpg"
    },
    {
      id: 3,
      name: "নিশা মজুমদার",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "মেরিট: ১৭তম, 47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/nisha.jpg"
    },
    {
      id: 4,
      name: "মো. আব্দুল্লাহ আল মামুন",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "রাজশাহী বিশ্ববিদ্যালয়",
      image: "/mamun.jpg"
    },
    {
      id: 5,
      name: "ডা. মো. নাইম আলী",
      cadre1: "BCS প্রশাসন ক্যাডার",
      cadre2: "47th BCS",
      university: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      image: "/naim.jpg"
    }
  ];

  return (
      <div className="min-h-screen bg-gray-50 font-sans">

        {/* Navbar (মেনুবার) */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo Section */}
              <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-100 shadow-sm">
                  <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-1" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
                  Cadre&apos;s BCS Compass-<span className="text-blue-700">CBC</span>
                </h1>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">কোর্সসমূহ</Link>
                <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">মডেল টেস্ট</Link>
                <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">আমাদের সম্পর্কে</Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hidden md:inline-flex px-6 py-2.5 text-blue-700 font-bold hover:bg-blue-50 rounded-xl transition">
                  লগইন
                </Link>
                <Link href="/dashboard" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition">
                  ফ্রি শুরু করুন
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side (Text) */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm border border-orange-200 shadow-sm">
                🚀 বাংলাদেশের সেরা বিসিএস প্রস্তুতি
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.2]">
                আপনার <span className="text-blue-600">ক্যাডার</span> হওয়ার স্বপ্ন পূরণের বিশ্বস্ত সঙ্গী
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg font-medium">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ লাইভ ও রেকর্ডেড কোর্সে।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="#" className="px-8 py-4 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition text-lg flex items-center justify-center gap-2">
                  কোর্সগুলো দেখুন
                </Link>
              </div>
            </div>

            {/* Right Side (Hero Graphic Placeholder) */}
            <div className="relative mt-10 lg:mt-0">
              <div className="aspect-video md:aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center border-8 border-white shadow-2xl overflow-hidden relative">
                <div className="text-center z-10 p-8">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-extrabold text-blue-900">Cadre&apos;s BCS Compass</h3>
                  <p className="text-blue-700 mt-2 font-medium">এখানে কোর্সের প্রমোশনাল ছবি বা ভিডিও বসবে</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Golden Mentors Panel Section */}
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Golden <span className="text-orange-500">Mentors</span> Panel
              </h2>
              <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-600 font-medium">
                যাঁরা নিজেরা সফল হয়েছেন, তাঁদের গাইডলাইনেই হোক আপনার প্রস্তুতি
              </p>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {mentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">

                    {/* Image Area */}
                    <div className="h-48 bg-blue-50 flex items-end justify-center pt-6 px-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>

                      {/* Photo Placeholder */}
                      <div className="relative w-32 h-32 md:w-36 md:h-36 bg-white rounded-full border-4 border-white shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                        <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover bg-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(mentor.name) + "&background=0D8ABC&color=fff&size=150";
                            }}
                        />
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="p-5 text-center flex-1 flex flex-col justify-between bg-white z-10">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{mentor.name}</h3>
                        <p className="text-sm font-bold text-blue-700">{mentor.cadre1}</p>
                        <p className="text-sm font-semibold text-gray-600 mt-1">{mentor.cadre2}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 flex items-center justify-center gap-1">
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