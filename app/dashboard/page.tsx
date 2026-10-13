"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchDashboardData = async (email: string, token: string) => {
    try {
      const profileRes = await fetch(`${BACKEND_URL}/api/profile/${email}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        if(profileData.name) localStorage.setItem("userName", profileData.name);
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
    updatedData.email = profile?.email || "";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setIsEditingProfile(false);
        fetchDashboardData(profile?.email || "", token || "");
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleWhatsAppPurchase = (courseTitle: string) => {
    const message = `আমি ${profile?.name || "Student"}, আমার Student ID: ${profile?.studentId || "N/A"}. আমি "${courseTitle}" ব্যাচটি এনরোল করতে চাই।`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/8801787017427?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-bold text-blue-600 animate-pulse">Loading your dashboard...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900">Cadre&apos;s BCS Compass</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">স্বাগতম, {profile?.name || "শিক্ষার্থী"}!</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
                  <p className="text-xs text-blue-500 font-bold uppercase">Student ID</p>
                  <p className="text-lg font-black text-blue-800 tracking-wider">{profile?.studentId || "N/A"}</p>
               </div>
              <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-lg font-bold hover:bg-red-500 hover:text-white transition">
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-gray-800">আমার প্রোফাইল</h2>
               {!isEditingProfile && (
                 <button onClick={() => setIsEditingProfile(true)} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">
                   এডিট প্রোফাইল
                 </button>
               )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">আপনার নাম</label>
                    <input type="text" name="name" defaultValue={profile?.name} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">ফোন নাম্বার</label>
                    <input type="tel" name="phone" defaultValue={profile?.phone} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">বিশ্ববিদ্যালয় / কলেজের নাম</label>
                    <input type="text" name="university" defaultValue={profile?.university} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" placeholder="e.g. Dhaka University" required/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">বর্তমান অবস্থা</label>
                    <select name="studentStatus" defaultValue={profile?.studentStatus || ""} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" required>
                       <option value="">নির্বাচন করুন</option>
                       <option value="RUNNING">অধ্যয়নরত (Running)</option>
                       <option value="PASSED">পাসকৃত (Passed)</option>
                    </select>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">বর্ষ / পাসের সাল</label>
                    <input type="text" name="statusYear" defaultValue={profile?.statusYear} className="w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500" placeholder="e.g. 3rd Year / 2022" required/>
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
                  <p className="font-semibold text-gray-800">{profile?.name || "N/A"}</p>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">ফোন নাম্বার</p>
                  <p className="font-semibold text-gray-800">{profile?.phone || "যোগ করা হয়নি"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">শিক্ষাপ্রতিষ্ঠান</p>
                  <p className="font-semibold text-gray-800">{profile?.university || "যোগ করা হয়নি"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">বর্তমান অবস্থা</p>
                  <p className="font-semibold text-gray-800">
                    {profile?.studentStatus === "RUNNING" ? "অধ্যয়নরত" : profile?.studentStatus === "PASSED" ? "পাসকৃত" : "N/A"} 
                    {profile?.statusYear && ` (${profile.statusYear})`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">আমার এনরোল করা কোর্সসমূহ</h2>
            {courses.length === 0 ? (
              <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 text-center">
                <p className="text-blue-800 font-medium">বর্তমানে আপনার কোনো এনরোল করা কোর্স পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.enrollmentId} className="border border-blue-100 bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-1">{c.courseTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">ইন্সট্রাক্টর: {c.instructorName}</p>
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button onClick={() => router.push(`/course/${c.courseId}`)} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                        ক্লাস শুরু করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">নতুন কোর্সে ভর্তি হোন</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-orange-100 bg-orange-50/30 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">47th BCS Preliminary</h3>
                      <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs">HOT</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">দেশের সেরা ক্যাডার মেন্টরদের সরাসরি গাইডলাইনে সম্পূর্ণ প্রস্তুতি।</p>
                    <p className="text-xl font-black text-blue-700 mb-4">৳ 2500</p>
                    <button onClick={() => handleWhatsAppPurchase("47th BCS Preliminary")} className="w-full bg-[#25D366] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition">
                      WhatsApp এ ভর্তি হোন
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
