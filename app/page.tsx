import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight">
            Cadre&apos;s BCS Compass
          </h1>
          <p className="text-2xl text-gray-800 font-semibold">
            আপনার বিসিএস প্রস্তুতির সেরা গাইডলাইন
          </p>
          <p className="text-lg text-gray-500">
            দেশের সেরা ইন্সট্রাক্টরদের সাথে ঘরে বসেই নিশ্চিত করুন আপনার ক্যাডার হওয়ার স্বপ্ন।
            আজই এনরোল করুন আমাদের এক্সক্লুসিভ কোর্সে।
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/login" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">
              লগইন করুন
            </Link>
            <Link href="/dashboard" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 transition">
              ড্যাশবোর্ড
            </Link>
          </div>
        </div>
      </div>
  )
}