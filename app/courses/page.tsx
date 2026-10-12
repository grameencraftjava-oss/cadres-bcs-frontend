"use client";
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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
  );
}
