"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructorName: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Backend theke public course gulo fetch kora
  useEffect(() => {
    fetch("https://cadres-bcs-backend.onrender.com/api/courses/all")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch((err) => {
        console.error("Error fetching courses", err);
        setLoadingCourses(false);
      });
  }, []);

  // Purchase/Enroll button click handle kora (Auth check)
  const handleBuyNow = (course: Course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("কোর্সটি কিনতে দয়া করে আগে লগইন বা সাইন আপ করুন!");
      router.push("/login");
      return;
    }
    setSelectedCourse(course);
  };

  // Payment Submit kora
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
          userId: 1, // Default testing ID
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
      alert("❌ সার্ভার এরর!");
      setIsProcessing(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-0.5 md:p-1" />
              </div>
              <h1 className="text-sm sm:text-lg md:text-2xl font-extrabold text-gray-800 tracking-tight">
                Cadre&apos;s BCS <span className="hidden sm:inline">Compass-</span><span className="text-blue-700">CBC</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <Link href="#courses" className="text-gray-700 hover:text-blue-600 font-semibold transition">কোর্সসমূহ</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition">মডেল টেস্ট</Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition">আমাদের সম্পর্কে</Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center">
              <Link href="/login" className="px-5 py-2 md:px-8 md:py-3 bg-blue-600 text-white text-sm md:text-base font-bold rounded-lg md:rounded-xl hover:bg-blue-700 shadow-md transition whitespace-nowrap">
                লগইন / সাইন আপ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              <Link href="#courses" className="block w-full px-8 py-3.5 md:py-4 bg-blue-600 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all">
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

      {/* Course Catalog Section */}
      <section id="courses" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Our <span className="text-blue-600">Premium</span> Courses
            </h2>
            <div className="w-16 md:w-24 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 font-medium px-4">
              আপনার স্বপ্ন পূরণের যাত্রায় আমাদের কোর্সগুলো হতে পারে সেরা হাতিয়ার
            </p>
          </div>

          {loadingCourses ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500 font-medium bg-gray-50 py-10 rounded-2xl border border-gray-100">
              এখনও কোনো কোর্স যুক্ত করা হয়নি।
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-40 flex items-center justify-center relative">
                    <span className="text-6xl">🎓</span>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                      Premium
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                      <p className="text-sm font-semibold text-gray-500 mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👨‍🏫</span>
                        ইন্সট্রাক্টর: <span className="text-gray-800">{course.instructorName}</span>
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <span className="text-2xl font-extrabold text-blue-600">৳ {course.price}</span>
                      <button
                        onClick={() => handleBuyNow(course)}
                        className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

      {/* Mock bKash Payment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="bg-[#e2136e] p-5 text-center relative">
              <h3 className="text-white font-bold text-2xl tracking-wider">bKash</h3>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-semibold">মার্চেন্ট: Cadre's BCS Compass</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">৳ {selectedCourse.price}</p>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">আপনার বিকাশ একাউন্ট নাম্বার দিন</label>
                  <input type="text" placeholder="01XXXXXXXXX" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#e2136e] focus:ring-4 focus:ring-[#e2136e]/20 outline-none text-center text-lg tracking-widest transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">বিকাশ পিন (PIN) দিন</label>
                  <input type="password" placeholder="••••" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#e2136e] focus:ring-4 focus:ring-[#e2136e]/20 outline-none text-center text-lg tracking-widest transition-all" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isProcessing} className="w-full bg-[#e2136e] text-white font-bold py-4 rounded-xl hover:bg-[#c90d5f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg shadow-pink-200">
                    {isProcessing ? "Processing..." : "Confirm Payment"}
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
