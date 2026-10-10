"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructorName: string;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // ব্যাকএন্ড থেকে সব কোর্স ফেচ করা (পাবলিক API)
  useEffect(() => {
    fetch("https://cadres-bcs-backend.onrender.com/api/courses/all")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses", err);
        setLoading(false);
      });
  }, []);

  const handleBuyNow = (course: Course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("কোর্সটি কিনতে দয়া করে আগে লগইন বা রেজিস্টার করুন!");
      router.push("/login");
      return;
    }
    setSelectedCourse(course);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://cadres-bcs-backend.onrender.com/api/enrollments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: 1, // টেস্টিংয়ের জন্য ডিফল্ট আইডি
          courseId: selectedCourse?.id,
        }),
      });
      
      if (response.ok) {
        alert("✅ পেমেন্ট এবং এনরোলমেন্ট সফল হয়েছে!");
        router.push("/dashboard");
      } else {
        alert("❌ আপনি সম্ভবত এই কোর্সে আগে থেকেই এনরোল করা আছেন অথবা সার্ভার এরর।");
        setIsProcessing(false);
      }
    } catch (error) {
      alert("সার্ভার এরর!");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-900">Cadre's BCS Compass</h1>
          <button onClick={() => router.push("/login")} className="font-semibold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition">
            Login / Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">আপনার বিসিএস প্রস্তুতির<br/>সেরা গাইডলাইন</h2>
        <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto mb-8">
          দেশের সেরা ইন্সট্রাক্টরদের সাথে ঘরে বসেই নিশ্চিত করুন আপনার ক্যাডার হওয়ার স্বপ্ন। আজই এনরোল করুন আমাদের এক্সক্লুসিভ কোর্সে।
        </p>
      </section>

      {/* Course Catalog */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">আমাদের কোর্সসমূহ</h3>
        
        {loading ? (
          <p className="text-center text-gray-500">কোর্স লোড হচ্ছে...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500">এখনও কোনো কোর্স যুক্ত করা হয়নি। অ্যাডমিন প্যানেল থেকে কোর্স যুক্ত করুন।</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">🎓</span>
                </div>
                <div className="p-6 flex flex-col justify-between h-[250px]">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <p className="text-sm font-semibold text-gray-500 mb-4">ইন্সট্রাক্টর: {course.instructorName}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-extrabold text-blue-600">৳{course.price}</span>
                    <button 
                      onClick={() => handleBuyNow(course)}
                      className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mock bKash Payment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#e2136e] p-5 text-center">
              <h3 className="text-white font-bold text-2xl tracking-wider">bKash</h3>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-semibold">মার্চেন্ট: Cadre's BCS Compass</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">৳ {selectedCourse.price}</p>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">আপনার বিকাশ একাউন্ট নাম্বার দিন</label>
                  <input type="text" placeholder="01XXXXXXXXX" required className="w-full border-2 border-gray-200 p-3 rounded-lg text-center font-mono text-lg focus:border-[#e2136e] focus:ring-0 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">বিকাশ পিন (PIN)</label>
                  <input type="password" placeholder="••••" required className="w-full border-2 border-gray-200 p-3 rounded-lg text-center font-mono text-xl focus:border-[#e2136e] focus:ring-0 outline-none transition" />
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setSelectedCourse(null)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-lg hover:bg-gray-200 transition">বাতিল</button>
                  <button type="submit" disabled={isProcessing} className="flex-1 bg-[#e2136e] text-white font-bold py-3.5 rounded-lg hover:bg-[#c90d5f] transition disabled:opacity-50">
                    {isProcessing ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
