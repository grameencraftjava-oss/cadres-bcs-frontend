"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EnrolledCourse {
  enrollmentId: number;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  amountPaid?: number;
  paymentMethod?: string;
  trxId?: string;
  enrollmentDate: string;
}

interface CourseItem {
  id: number;
  title: string;
  courseFee: number;
  fullInfo: string;
  routine: string;
  modules: string;
  studyPlan: string;
  mentors: string;
}

interface PortalContent {
  id: number;
  category: string;
  subject: string;
  topic: string;
  contentText: string;
  pdfUrl: string;
  youtubeUrl: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  university: string;
  studentStatus: string;
  statusYear: string;
  photoUrl?: string;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
  const [suggestions, setSuggestions] = useState<PortalContent[]>([]);
  const [youtubeClasses, setYoutubeClasses] = useState<PortalContent[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    university: "",
    studentStatus: "",
    statusYear: "",
    photoUrl: ""
  });

  const [portalTab, setPortalTab] = useState<"all-courses" | "suggestions" | "youtube">("all-courses");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const [activeModal, setActiveModal] = useState<null | "profile" | "enrolled" | "history">(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cadres-bcs-backend.onrender.com";

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : "";
  };

  const syncFormWithProfile = (p: UserProfile) => {
    setProfileForm({
      name: p.name || "",
      phone: p.phone || "",
      university: p.university || "",
      studentStatus: p.studentStatus || "",
      statusYear: p.statusYear || "",
      photoUrl: p.photoUrl || ""
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 260;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setProfileForm((prev) => ({ ...prev, photoUrl: compressedDataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const fetchDashboardData = async (email: string, token: string) => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };

      const [profileRes, enrolledRes, coursesRes, suggRes, ytRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/profile/${email}`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/enrollments/dashboard/${email}`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/courses`).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/suggestions`).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/youtube-classes`).catch(() => null),
      ]);

      if (profileRes?.ok) {
        const profileData: UserProfile = await profileRes.json();
        const cachedStr = localStorage.getItem("savedUserProfile_" + email);
        const cached = cachedStr ? JSON.parse(cachedStr) : null;
        if (!profileData.photoUrl && cached?.photoUrl) {
          profileData.photoUrl = cached.photoUrl;
        }

        setProfile(profileData);
        syncFormWithProfile(profileData);
        if (profileData.name) localStorage.setItem("userName", profileData.name);
        localStorage.setItem("savedUserProfile_" + email, JSON.stringify(profileData));

        if (!profileData.phone || !profileData.university || !profileData.studentStatus || !profileData.statusYear) {
          setActiveModal("profile");
          setIsEditingProfile(true);
        }
      } else {
        const cached = localStorage.getItem("savedUserProfile_" + email);
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          syncFormWithProfile(parsed);
        }
      }

      if (enrolledRes?.ok) setEnrolledCourses(await enrolledRes.json());
      if (coursesRes?.ok) setAllCourses(await coursesRes.json());
      if (suggRes?.ok) setSuggestions(await suggRes.json());
      if (ytRes?.ok) setYoutubeClasses(await ytRes.json());
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const email = profile?.email || localStorage.getItem("userEmail") || "";

    const updatedData = {
      email,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      university: profileForm.university.trim(),
      studentStatus: profileForm.studentStatus,
      statusYear: profileForm.statusYear.trim(),
      photoUrl: profileForm.photoUrl
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const savedUser: UserProfile = await res.json();
        if (!savedUser.photoUrl && profileForm.photoUrl) {
          savedUser.photoUrl = profileForm.photoUrl;
        }
        setProfile(savedUser);
        syncFormWithProfile(savedUser);
        if (savedUser.name) localStorage.setItem("userName", savedUser.name);
        localStorage.setItem("savedUserProfile_" + email, JSON.stringify(savedUser));
        setIsEditingProfile(false);
        alert("✅ আপনার প্রোফাইল ও ছবি স্থায়ীভাবে সেভ হয়েছে!");
      } else {
        alert("❌ প্রোফাইল আপডেট করা যায়নি।");
      }
    } catch (err) {
      console.error(err);
      alert("❌ সার্ভার এরর।");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const handleWhatsAppPurchase = (courseTitle: string) => {
    const message = `আমি ${courseTitle} ব্যাচ এনরোল করতে চাই`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/8801787017427?text=${encodedMessage}`, "_blank");
  };

  if (!mounted) return null;

  const userInitial = (profile?.name || localStorage.getItem("userName") || "S").charAt(0).toUpperCase();
  const userPhoto = profile?.photoUrl || profileForm.photoUrl || null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Dashboard-e Logo te click korle Dashboard ei thakbe */}
          <button type="button" onClick={() => { setPortalTab("all-courses"); setSelectedCourse(null); setActiveModal(null); }} className="flex items-center gap-2 sm:gap-3 min-w-0 text-left focus:outline-none cursor-pointer">
            <img src="/logo.png" alt="CBC Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
            <span className="text-[13px] sm:text-lg md:text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
              Cadre&apos;s BCS Compass-<span className="text-blue-600">CBC</span>
            </span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                }}
                className="relative p-2.5 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition border border-gray-200/80 focus:outline-none"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-extrabold text-gray-800 text-sm">নোটিফিকেশন</h3>
                    <span className="text-[11px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">নতুন</span>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500 font-medium">বর্তমানে নতুন কোনো নোটিফিকেশন নেই।</p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 transition focus:outline-none"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white shadow-sm" />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    {userInitial}
                  </div>
                )}
                <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex items-center gap-3">
                    {userPhoto ? (
                      <img src={userPhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm truncate">{profile?.name || "শিক্ষার্থী"}</p>
                      <p className="text-[11px] text-gray-500 truncate mb-1">{profile?.email || localStorage.getItem("userEmail")}</p>
                      <span className="inline-block bg-blue-100/80 text-blue-800 px-2 py-0.5 rounded text-[10px] font-black tracking-wider">
                        ID: {profile?.studentId || "..."}
                      </span>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <button
                      onClick={() => {
                        if (profile) syncFormWithProfile(profile);
                        setIsEditingProfile(false);
                        setActiveModal("profile");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal("enrolled");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Your Enrolled Courses
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal("history");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Course Purchase History
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
            <div className="flex items-center gap-4">
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shadow-sm shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-sm shrink-0">
                  {userInitial}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900">স্বাগতম, {profile?.name || "শিক্ষার্থী"}! 👋</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">আপনার বিসিএস প্রস্তুতির সকল কোর্স, ফ্রি সাজেশন এবং ক্লাস নিচে সাজানো রয়েছে।</p>
              </div>
            </div>
            <div className="bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 text-left sm:text-center shrink-0">
              <p className="text-[10px] text-blue-500 font-bold uppercase">Student ID</p>
              {/* Generating এর জায়গায় Loading... দেওয়া হলো */}
              <p className="text-base sm:text-lg font-black text-blue-800 tracking-wider">{profile?.studentId || "Loading..."}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setPortalTab("all-courses"); setSelectedCourse(null); }}
              className={`p-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition border ${
                portalTab === "all-courses"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-800 border-gray-100 hover:bg-blue-50/50"
              }`}
            >
              <span>📚</span> আমাদের কোর্সসমূহ
            </button>

            <button
              onClick={() => setPortalTab("suggestions")}
              className={`p-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition border ${
                portalTab === "suggestions"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-800 border-gray-100 hover:bg-blue-50/50"
              }`}
            >
              <span>📝</span> Free Suggestions
            </button>

            <button
              onClick={() => setPortalTab("youtube")}
              className={`p-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition border ${
                portalTab === "youtube"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-800 border-gray-100 hover:bg-blue-50/50"
              }`}
            >
              <span>▶️</span> Our YouTube Class
            </button>
          </div>

          {portalTab === "all-courses" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 mb-6">আমাদের কোর্সসমূহ</h2>

              {loading ? (
                <p className="text-gray-500 font-medium text-center py-8">কোর্স লোড হচ্ছে...</p>
              ) : allCourses.length === 0 ? (
                <div className="bg-blue-50/50 p-10 rounded-xl border border-blue-100 text-center">
                  <p className="text-blue-800 font-bold text-lg">দুঃখিত, বর্তমানে কোনো কোর্স এভেইলেবল নেই।</p>
                  <p className="text-sm text-blue-600 mt-2">নতুন কোর্স আসলে এখানে আপডেট করা হবে। আমাদের সাথেই থাকুন!</p>
                </div>
              ) : selectedCourse ? (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
                  >
                    ← সকল কোর্সে ফিরে যান
                  </button>

                  <div className="border border-blue-100 bg-blue-50/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{selectedCourse.title}</h3>
                      <p className="text-xl font-extrabold text-blue-600 mt-1">কোর্স ফি: ৳ {selectedCourse.courseFee}</p>
                    </div>
                    <button
                      onClick={() => handleWhatsAppPurchase(selectedCourse.title)}
                      className="w-full md:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <span>ভর্তি হোন (WhatsApp)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCourse.fullInfo && (
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 md:col-span-2">
                        <h4 className="font-extrabold text-gray-900 mb-2 text-base">📌 কোর্সের বিস্তারিত তথ্য (Full Info)</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedCourse.fullInfo}</p>
                      </div>
                    )}
                    {selectedCourse.routine && (
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-extrabold text-gray-900 mb-2 text-base">📅 ক্লাস রুটিন (Routine)</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedCourse.routine}</p>
                      </div>
                    )}
                    {selectedCourse.modules && (
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-extrabold text-gray-900 mb-2 text-base">📚 কোর্স মডিউল (Modules)</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedCourse.modules}</p>
                      </div>
                    )}
                    {selectedCourse.studyPlan && (
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-extrabold text-gray-900 mb-2 text-base">🎯 স্টাডি প্ল্যান (Study Plan)</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedCourse.studyPlan}</p>
                      </div>
                    )}
                    {selectedCourse.mentors && (
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-extrabold text-gray-900 mb-2 text-base">👨‍🏫 মেন্টর প্যানেল (Mentors)</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedCourse.mentors}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 hover:border-blue-300 bg-white p-6 rounded-2xl shadow-sm transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <h3 className="text-xl font-extrabold text-gray-900">{course.title}</h3>
                          <span className="bg-blue-50 text-blue-700 font-black px-3 py-1 rounded-lg text-sm shrink-0">
                            ৳ {course.courseFee}
                          </span>
                        </div>
                        {course.fullInfo && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4 whitespace-pre-line">{course.fullInfo}</p>
                        )}
                        {course.mentors && (
                          <p className="text-xs font-bold text-slate-500 mb-4">👨‍🏫 মেন্টর: {course.mentors}</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-4 rounded-xl text-sm transition"
                        >
                          বিস্তারিত দেখুন
                        </button>
                        <button
                          onClick={() => handleWhatsAppPurchase(course.title)}
                          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition"
                        >
                          ভর্তি হোন (Purchase)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {portalTab === "suggestions" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 mb-6">Free Suggestions</h2>
              {suggestions.length === 0 ? (
                <div className="bg-blue-50/50 p-10 rounded-xl border border-blue-100 text-center">
                  <p className="text-blue-800 font-bold text-lg">বর্তমানে কোনো ফ্রি সাজেশন এভেইলেবল নেই।</p>
                  <p className="text-sm text-blue-600 mt-1">অ্যাডমিন নতুন সাজেশন যুক্ত করলে এখানে দেখতে পাবেন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestions.map((item) => {
                    const embedUrl = getYoutubeEmbedUrl(item.youtubeUrl);
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-extrabold rounded-full">
                            {item.subject}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900">{item.topic}</h3>
                        {item.contentText && (
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {item.contentText}
                          </p>
                        )}
                        {embedUrl && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                            <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={item.topic} />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {item.pdfUrl && (
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition"
                            >
                              📄 PDF ডাউনলোড / দেখুন
                            </a>
                          )}
                          {item.youtubeUrl && !embedUrl && (
                            <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition"
                            >
                              ▶️ YouTube ভিডিও দেখুন
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {portalTab === "youtube" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 mb-6">Our YouTube Class</h2>
              {youtubeClasses.length === 0 ? (
                <div className="bg-blue-50/50 p-10 rounded-xl border border-blue-100 text-center">
                  <p className="text-blue-800 font-bold text-lg">বর্তমানে কোনো ইউটিউব ক্লাস এভেইলেবল নেই।</p>
                  <p className="text-sm text-blue-600 mt-1">অ্যাডমিন নতুন ক্লাস যুক্ত করলে এখানে দেখতে পাবেন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {youtubeClasses.map((item) => {
                    const embedUrl = getYoutubeEmbedUrl(item.youtubeUrl);
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-extrabold rounded-full inline-block">
                          {item.subject}
                        </span>
                        <h3 className="text-lg font-extrabold text-gray-900">{item.topic}</h3>
                        {item.contentText && (
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {item.contentText}
                          </p>
                        )}
                        {embedUrl && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                            <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={item.topic} />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {item.pdfUrl && (
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition"
                            >
                              📄 ক্লাস নোট (PDF)
                            </a>
                          )}
                          {item.youtubeUrl && !embedUrl && (
                            <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition"
                            >
                              ▶️ YouTube এ ক্লাস দেখুন
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={() => { setActiveModal(null); setIsEditingProfile(false); }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
            >
              ✕
            </button>

            {activeModal === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6 pr-10">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">আমার প্রোফাইল</h2>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">Student ID: {profile?.studentId || "Loading..."}</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        if (profile) syncFormWithProfile(profile);
                        setIsEditingProfile(true);
                      }}
                      className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
                    >
                      এডিট প্রোফাইল
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} autoComplete="off" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-1">
                      <div className="relative">
                        {profileForm.photoUrl ? (
                          <img src={profileForm.photoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-sm">
                            {userInitial}
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                          >
                            📷 ছবি যুক্ত / পরিবর্তন করুন
                          </button>
                          {profileForm.photoUrl && (
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, photoUrl: "" })}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                            >
                              মুছে ফেলুন
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1.5">আপনার ফোন বা পিসি থেকে যেকোনো ছবি সিলেক্ট করে &quot;সেভ করুন&quot; বাটনে চাপুন।</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text"
                        name="name"
                        autoComplete="off"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ফোন নাম্বার *</label>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="off"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">বিশ্ববিদ্যালয় / কলেজের নাম *</label>
                      <input
                        type="text"
                        name="university"
                        autoComplete="off"
                        value={profileForm.university}
                        onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">বর্তমান অবস্থা (Passed / Running) *</label>
                      <select
                        name="studentStatus"
                        value={profileForm.studentStatus}
                        onChange={(e) => setProfileForm({ ...profileForm, studentStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-sm bg-white"
                        required
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="RUNNING">অধ্যয়নরত (Running Student)</option>
                        <option value="PASSED">পাসকৃত (Passed)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {profileForm.studentStatus === "PASSED"
                          ? "পাসের সাল (Passed Year) *"
                          : profileForm.studentStatus === "RUNNING"
                          ? "কোন বর্ষ (Running Year) *"
                          : "কোন বর্ষ (Running হলে) / পাসের সাল (Passed হলে) *"}
                      </label>
                      <input
                        type="text"
                        name="statusYear"
                        autoComplete="off"
                        value={profileForm.statusYear}
                        onChange={(e) => setProfileForm({ ...profileForm, statusYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-sm bg-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          if (!profile?.phone || !profile?.university) {
                            setActiveModal(null);
                          }
                        }}
                        className="px-5 py-2.5 font-bold text-gray-600 bg-gray-100 rounded-xl text-sm"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-6 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 text-sm disabled:opacity-50"
                      >
                        {isSavingProfile ? "সেভ হচ্ছে..." : "সেভ করুন"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50/40 rounded-xl border border-blue-100">
                      {userPhoto ? (
                        <img src={userPhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {userInitial}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-gray-900 text-base">{profile?.name || "N/A"}</p>
                        <p className="text-xs text-gray-600">{profile?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1">ফোন নাম্বার</p>
                        <p className="font-bold text-gray-800">{profile?.phone || "যোগ করা হয়নি"}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-1">বর্তমান অবস্থা ও বর্ষ/সাল</p>
                        <p className="font-bold text-gray-800">
                          {profile?.studentStatus === "RUNNING" ? "অধ্যয়নরত" : profile?.studentStatus === "PASSED" ? "পাসকৃত" : "যোগ করা হয়নি"}
                          {profile?.statusYear ? ` (${profile.statusYear})` : ""}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 sm:col-span-2">
                        <p className="text-xs text-gray-500 font-bold mb-1">বিশ্ববিদ্যালয় / শিক্ষাপ্রতিষ্ঠান</p>
                        <p className="font-bold text-gray-800">{profile?.university || "যোগ করা হয়নি"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeModal === "enrolled" && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 pr-10">আমার এনরোল করা কোর্সসমূহ</h2>
                {enrolledCourses.length === 0 ? (
                  <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 text-center">
                    <p className="text-blue-800 font-semibold">বর্তমানে আপনার কোনো এনরোল করা কোর্স পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((c) => (
                      <div key={c.enrollmentId} className="border border-blue-100 bg-blue-50/20 p-4 rounded-xl flex justify-between items-center gap-4">
                        <div>
                          <h3 className="font-extrabold text-blue-900">{c.courseTitle}</h3>
                          <p className="text-xs text-gray-500">ইন্সট্রাক্টর: {c.instructorName}</p>
                        </div>
                        <button onClick={() => router.push(`/course/${c.courseId}`)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 shrink-0">
                          ক্লাস শুরু করুন →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeModal === "history" && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 pr-10">কোর্স পারচেজ হিস্ট্রি</h2>
                {enrolledCourses.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                    <p className="text-gray-600 font-medium">আপনার কোনো পেমেন্ট হিস্ট্রি পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 border-y border-slate-200">
                          <th className="p-3 font-bold">কোর্স</th>
                          <th className="p-3 font-bold">মেথড ও TrxID</th>
                          <th className="p-3 font-bold">পরিমাণ</th>
                          <th className="p-3 font-bold">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledCourses.map((c) => (
                          <tr key={c.enrollmentId} className="border-b border-slate-100">
                            <td className="p-3 font-bold text-slate-800">{c.courseTitle}</td>
                            <td className="p-3 text-slate-600">
                              <span className="uppercase font-semibold">{c.paymentMethod || "Manual"}</span>
                              {c.trxId && <span className="block text-xs text-slate-400">TrxID: {c.trxId}</span>}
                            </td>
                            <td className="p-3 font-bold text-slate-800">৳ {c.amountPaid || 0}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">PAID</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Section */}
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
