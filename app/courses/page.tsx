"use client";
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-20">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-4">আমাদের কোর্সসমূহ</h1>
          
          <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 mb-8">
              <p className="text-blue-800 font-medium text-lg">
                  দুঃখিত, বর্তমানে কোনো কোর্স এভেইলেবল নেই।
              </p>
              <p className="text-sm text-blue-600 mt-2">
                  নতুন কোর্স আসলে এখানে আপডেট করা হবে। আমাদের সাথেই থাকুন!
              </p>
          </div>

          <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>

      <footer className="bg-slate-900 text-white py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                   <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Cadre&apos;s BCS <span className="text-blue-500">Compass</span></h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ কোর্সে।
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">জরুরি যোগাযোগ</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </div>
                   <div>
                     <p className="font-bold text-slate-200">Md. Abdullah Al Mamun</p>
                     <p className="text-slate-400 text-sm">+880 1612-029324</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </div>
                   <div>
                     <p className="font-bold text-slate-200">Taki Yasir Tomal</p>
                     <p className="text-slate-400 text-sm">+880 1720-335771</p>
                   </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">আমাদের সাথে যুক্ত থাকুন</h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                বিসিএস সম্পর্কিত সকল আপডেট, ফ্রি গাইডলাইন এবং আমাদের স্পেশাল কমিউনিটিতে যুক্ত হতে নিচের অফিসিয়াল চ্যানেলগুলোতে জয়েন করুন:
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Cadre&apos;s BCS Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
