"use client";
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content Area */}
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

      {/* Footer Section */}
      <footer className="bg-slate-900 text-white py-16">
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
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.19 3.44-.49.34-.93.5-1.33.49-.44-.01-1.28-.25-1.91-.45-.77-.25-1.38-.38-1.32-.8.03-.22.33-.44.89-.67 3.49-1.52 5.82-2.53 6.99-3.02 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.46.14.12.09.15.22.16.33 0 .07-.01.21-.02.34z"/></svg>
                </a>
              </div>
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
