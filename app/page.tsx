import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-screen bg-white font-sans">

        {/* Navbar (মেনুবার) */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Cadre&apos;s<span className="text-orange-500">BCS</span></h1>
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

        {/* Hero Section (প্রধান অংশ) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side (Text) */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm border border-orange-200">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="/login" className="px-8 py-4 bg-white text-gray-800 text-center font-bold rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition text-lg">
                  ফ্রি ক্লাস করুন
                </Link>
              </div>
            </div>

            {/* Right Side (Image/Graphics Placeholder) */}
            <div className="relative mt-10 lg:mt-0">
              <div className="aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden relative">
                <div className="text-center z-10 p-8">
                  <div className="text-8xl mb-4">👨‍🏫</div>
                  <h3 className="text-3xl font-extrabold text-blue-900">Instructor Image</h3>
                  <p className="text-blue-700 mt-2 font-medium">পরে এখানে আমরা একটি সুন্দর ছবি বসাবো</p>
                </div>
              </div>

              {/* Floating Badge (সাফল্যের স্টিকার) */}
              <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl">🎯</div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold">সফল শিক্ষার্থী</p>
                    <p className="text-2xl font-black text-gray-900">৫,০০০+</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

      </div>
  );
}