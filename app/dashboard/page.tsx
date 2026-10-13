"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
  enrollmentId: number;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrollmentDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  university: string;
  studentStatus: string;
  statusYear: string;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cadres-bcs-backend.onrender.com";

  const fetchDashboardData = async (email: string, token: string) => {
    try {
      const profileRes = await fetch(`${BACKEND_URL}/api/profile/${email}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        if (profileData.name) localStorage.setItem("userName", profileData.name);
      }

      const coursesRes = await fetch(`${BACKEND_URL}/api/enrollments/dashboard/${email}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (coursesRes.ok) {
        setCourses(await coursesRes.json());
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!storedToken || !userEmail) {
      router.push("/login");
      return;
    }

    fetchDashboardData(userEmail, storedToken);
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = Object.fromEntries(formData.entries());
    updatedData.email = profile?.email || localStorage.getItem("userEmail") || "";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        alert("✅ প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        setIsEditingProfile(false);
        fetchDashboardData(updatedData.email as string, token || "");
      } else {
        alert("❌ প্রোফাইল আপডেট করা যায়নি।");
      }
    } catch (err) {
      console.error(err);
      alert("❌ সার্ভার এরর।");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleWhatsAppPurchase = (courseTitle: string) => {
    const message = `আমি ${profile?.name || "একজন শিক্ষার্থী"}, আমার Student ID: ${profile?.studentId || "N/A"}. আমি "${courseTitle}" ব্যাচটি এনরোল করতে চাই।`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://chat.whatsapp.com/DraE44qbMBZ3xPhWh5uEFI?s=cl&p=a&mlu=4&ilr=4?text=${encodedMessage}`, '_blank');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="CBC Logo" className="w-10 h-10 object-contain" />
            <span className="text-sm sm:text-lg md:text-xl font-extrabold text-gray-900 truncate">
              Cadre&apos;s BCS Compass-<span className="text-blue-600">CBC</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-700">
            <Link href="/" className="hover:text-blue-600 transition">হোম</Link>
            <Link href="/courses" className="hover:text-blue-600 transition">কোর্সসমূহ</Link>
            <Link href="#contact" className="hover:text-blue-600 transition">যোগাযোগ</Link>
          </nav>

          <button onClick={handleLogout} className="whitespace-nowrap shrink-0 bg-red-500 text-white text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2 rounded-lg font-bold hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Welcome & Student ID Banner */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900">Cadre&apos;s BCS Compass Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">স্বাগতম, {profile?.name || "শিক্ষার্থী"}!</p>
            </div>
            <div className="bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-100 text-center">
              <p className="text-xs text-blue-500 font-bold uppercase">Student ID (Fixed)</p>
              <p className="text-lg font-black text-blue-800 tracking-wider">{profile?.studentId || "Generating..."}</p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">আমার প্রোফাইল</h2>
              {!isEditingProfile && (
                <button onClick={() => setIsEditingProfile(true)} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                  এডিট প্রোফাইল
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">আপনার নাম *</label>
                  <input type="text" name="name" defaultValue={profile?.name} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ফোন নাম্বার *</label>
                  <input type="tel" name="phone" defaultValue={profile?.phone} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">বিশ্ববিদ্যালয় / কলেজের নাম *</label>
                  <input type="text" name="university" defaultValue={profile?.university} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">বর্তমান অবস্থা *</label>
                  <select name="studentStatus" defaultValue={profile?.studentStatus || ""} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required>
                    <option value="">নির্বাচন করুন</option>
                    <option value="RUNNING">অধ্যয়নরত (Running Student)</option>
                    <option value="PASSED">পাসকৃত (Passed)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">কোন বর্ষ (Running হলে) / পাসের সাল (Passed হলে) *</label>
                  <input type="text" name="statusYear" defaultValue={profile?.statusYear} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" placeholder="যেমন: 4th Year অথবা 2023" required />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="px-5 py-2 font-bold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300">বাতিল</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">সেভ করুন</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">নাম ও ইমেইল</p>
                  <p className="font-semibold text-gray-800">{profile?.name || "যোগ করা হয়নি"}</p>
                  <p className="text-sm text-gray-600">{profile?.email || localStorage.getItem("userEmail")}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">ফোন নাম্বার</p>
                  <p className="font-semibold text-gray-800">{profile?.phone || "যোগ করা হয়নি"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">বিশ্ববিদ্যালয় / শিক্ষাপ্রতিষ্ঠান</p>
                  <p className="font-semibold text-gray-800">{profile?.university || "যোগ করা হয়নি"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">বর্তমান অবস্থা ও সাল/বর্ষ</p>
                  <p className="font-semibold text-gray-800">
                    {profile?.studentStatus === "RUNNING" ? "অধ্যয়নরত" : profile?.studentStatus === "PASSED" ? "পাসকৃত" : "যোগ করা হয়নি"}
                    {profile?.statusYear ? ` (${profile.statusYear})` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Courses Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">আমার এনরোল করা কোর্সসমূহ</h2>
            {loading ? (
              <p className="text-gray-500 font-medium">আপনার কোর্স লোড হচ্ছে...</p>
            ) : courses.length === 0 ? (
              <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 text-center">
                <p className="text-blue-800 font-medium">বর্তমানে আপনার কোনো এনরোল করা কোর্স পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.enrollmentId} className="border border-blue-100 bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-1">{c.courseTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">ইন্সট্রাক্টর: {c.instructorName}</p>
                    <button onClick={() => router.push(`/course/${c.courseId}`)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                      ক্লাস শুরু করুন →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer Section with Social Icons */}
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

            {/* Direct Contact Numbers */}
            <div>
              <h3 className="text-lg font-bold mb-5 border-b border-slate-700 pb-2 inline-block text-white">জরুরি যোগাযোগ</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="text-white font-semibold">Md. Abdullah Al Mamun</p>
                    <a href="tel:+8801612029324" className="hover:text-blue-400 transition">+880 1612-029324</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="text-white font-semibold">Taki Yasir Tomal</p>
                    <a href="tel:+8801720335771" className="hover:text-blue-400 transition">+880 1720-335771</a>
                  </div>
                </li>
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
