"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalSignups: number;
  totalStudents: number;
  activeEnrollments: number;
  totalReviews: number;
  bannedAccounts: number;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({ totalSignups: 0, totalStudents: 0, activeEnrollments: 0, totalReviews: 0, bannedAccounts: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [signups, setSignups] = useState<any[]>([]);
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
  const [youtubeList, setYoutubeList] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollStudentDetails, setEnrollStudentDetails] = useState({ name: "", email: "", phone: "", studentId: "" });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cadres-bcs-backend.onrender.com";

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

      const [statsRes, studentsRes, signupsRes, historyRes, reviewsRes, coursesRes, suggRes, ytRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/students`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/signups`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/history`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/reviews`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/courses`).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/suggestions`).catch(() => null),
        fetch(`${BACKEND_URL}/api/portal/youtube-classes`).catch(() => null),
      ]);

      if (statsRes?.ok) setStats(await statsRes.json());
      if (studentsRes?.ok) setStudents(await studentsRes.json());
      if (signupsRes?.ok) setSignups(await signupsRes.json());
      if (historyRes?.ok) setAdminHistory(await historyRes.json());
      if (reviewsRes?.ok) setReviews(await reviewsRes.json());
      if (coursesRes?.ok) setCoursesList(await coursesRes.json());
      if (suggRes?.ok) setSuggestionsList(await suggRes.json());
      if (ytRes?.ok) setYoutubeList(await ytRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

    if (!token) {
      router.push("/login");
      return;
    }
    if (role !== "SUPERADMIN") {
      alert("❌ Access Denied! You don't have Super Admin privileges.");
      router.push("/");
      return;
    }
    fetchDashboardData();
  }, [router]);

  const handleStudentSearch = async () => {
    if (!enrollStudentId.trim()) return;
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${BACKEND_URL}/api/admin/student-by-id?id=${encodeURIComponent(enrollStudentId.trim())}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollStudentDetails({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          studentId: data.studentId || enrollStudentId.trim()
        });
      } else {
        alert("❌ এই Student ID দিয়ে কোনো শিক্ষার্থী পাওয়া যায়নি!");
        setEnrollStudentDetails({ name: "", email: "", phone: "", studentId: "" });
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleManualEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEnrolling) return;
    setIsEnrolling(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.approvedBy = localStorage.getItem("userEmail") || "Super Admin";
    data.courseTitle = data.courseId;

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BACKEND_URL}/api/admin/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Student Enrolled Successfully!");
        form.reset();
        setEnrollStudentId("");
        setEnrollStudentDetails({ name: "", email: "", phone: "", studentId: "" });
        fetchDashboardData();
      } else {
        const errData = await response.json();
        alert("❌ " + (errData.error || "Failed to enroll student."));
      }
    } catch (error) {
      alert("❌ Server Error.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get("title"),
      courseFee: Number(formData.get("courseFee")),
      fullInfo: formData.get("fullInfo"),
      routine: formData.get("routine"),
      modules: formData.get("modules"),
      studyPlan: formData.get("studyPlan"),
      mentors: formData.get("mentors"),
    };

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${BACKEND_URL}/api/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("✅ নতুন কোর্স সফলভাবে যোগ করা হয়েছে!");
        form.reset();
        fetchDashboardData();
      } else {
        alert("❌ কোর্স যোগ করা যায়নি।");
      }
    } catch (err) {
      alert("❌ সার্ভার এরর।");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই কোর্সটি ডিলিট করতে চান?")) return;
    const token = localStorage.getItem("token") || "";
    await fetch(`${BACKEND_URL}/api/admin/courses/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchDashboardData();
  };

  const handleCreatePortalContent = async (e: React.FormEvent<HTMLFormElement>, category: "SUGGESTION" | "YOUTUBE_CLASS") => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      category,
      subject: formData.get("subject"),
      topic: formData.get("topic"),
      contentText: formData.get("contentText") || "",
      pdfUrl: formData.get("pdfUrl") || "",
      youtubeUrl: formData.get("youtubeUrl") || "",
    };

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${BACKEND_URL}/api/admin/portal-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("✅ সফলভাবে যুক্ত করা হয়েছে!");
        form.reset();
        fetchDashboardData();
      } else {
        alert("❌ যুক্ত করা যায়নি।");
      }
    } catch (err) {
      alert("❌ সার্ভার এরর।");
    }
  };

  const handleDeletePortalContent = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) return;
    const token = localStorage.getItem("token") || "";
    await fetch(`${BACKEND_URL}/api/admin/portal-content/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg leading-tight">CBC Super Admin</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: "overview", name: "Overview" },
            { id: "signups", name: "All Signups & IDs" },
            { id: "manage-courses", name: "Manage Courses (Add)" },
            { id: "suggestions", name: "Free Suggestions" },
            { id: "youtube-classes", name: "Our YouTube Classes" },
            { id: "enrollment", name: "Manual Enroll" },
            { id: "courses", name: "Enrolled Students" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}
            >
              <span className="font-semibold text-sm">{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold text-sm">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace("-", " ")}</h1>
          {isLoading && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">Syncing...</span>}
        </header>

        <div className="p-8">
          {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">{errorMsg}</div>}

          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-2">Total Signups</p>
                <h3 className="text-3xl font-black text-purple-600">{stats.totalSignups || 0}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-2">Active Enrollments</p>
                <h3 className="text-3xl font-black text-green-600">{stats.activeEnrollments || 0}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-2">Published Courses</p>
                <h3 className="text-3xl font-black text-blue-600">{coursesList.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-2">Suggestions & Classes</p>
                <h3 className="text-3xl font-black text-orange-600">{suggestionsList.length + youtubeList.length}</h3>
              </div>
            </div>
          )}

          {/* TAB: ALL SIGNUPS WITH STUDENT ID */}
          {activeTab === "signups" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">All Registered Students (With Fixed Student ID)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-y border-slate-200">
                      <th className="p-4 font-bold">Student ID</th>
                      <th className="p-4 font-bold">Name & Email</th>
                      <th className="p-4 font-bold">Phone</th>
                      <th className="p-4 font-bold">University & Status</th>
                      <th className="p-4 font-bold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((u, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-black rounded-md text-xs tracking-wider">
                            {u.studentId || "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{u.phone || "N/A"}</td>
                        <td className="p-4 text-xs text-slate-600">
                          <div>{u.university || "N/A"}</div>
                          {u.studentStatus && <div className="font-bold">{u.studentStatus} ({u.statusYear})</div>}
                        </td>
                        <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MANAGE COURSES (ADD FULL COURSE DETAILS) */}
          {activeTab === "manage-courses" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Course (Full Details)</h3>
                <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Course / Batch Name *</label>
                    <input type="text" name="title" placeholder="যেমন: 47th BCS Preliminary Batch" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Course Fee (BDT) *</label>
                    <input type="number" name="courseFee" placeholder="যেমন: 2500" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Course Info *</label>
                    <textarea name="fullInfo" rows={3} placeholder="কোর্সের সম্পূর্ণ বিবরণ লিখুন..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Class Routine</label>
                    <textarea name="routine" rows={3} placeholder="ক্লাস রুটিন বা সময়সূচি..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Modules</label>
                    <textarea name="modules" rows={3} placeholder="কোন কোন মডিউল থাকছে..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Study Plan</label>
                    <textarea name="studyPlan" rows={3} placeholder="স্টাডি প্ল্যান ও পরীক্ষা পদ্ধতি..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Mentors Panel</label>
                    <textarea name="mentors" rows={3} placeholder="মেন্টরদের নাম ও ক্যাডার পরিচিতি..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700">
                      Publish Course
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Published Courses ({coursesList.length})</h3>
                <div className="space-y-3">
                  {coursesList.map((c) => (
                    <div key={c.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-800">{c.title}</h4>
                        <p className="text-sm text-blue-600 font-bold">৳ {c.courseFee}</p>
                      </div>
                      <button onClick={() => handleDeleteCourse(c.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FREE SUGGESTIONS MANAGEMENT */}
          {activeTab === "suggestions" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add Free Suggestion</h3>
                <form onSubmit={(e) => handleCreatePortalContent(e, "SUGGESTION")} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Subject *</label>
                      <input type="text" name="subject" placeholder="যেমন: বাংলাদেশ বিষয়াবলি" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Topic *</label>
                      <input type="text" name="topic" placeholder="যেমন: সংবিধান ও মুক্তিযুদ্ধ" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Suggestion Text (Optional)</label>
                    <textarea name="contentText" rows={4} placeholder="সাজেশনের বিস্তারিত টেক্সট লিখুন (ঐচ্ছিক)..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">PDF Link (Google Drive / Direct Link)</label>
                      <input type="url" name="pdfUrl" placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">YouTube Video Link</label>
                      <input type="url" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700">
                    Publish Suggestion
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Published Suggestions ({suggestionsList.length})</h3>
                <div className="space-y-3">
                  {suggestionsList.map((s) => (
                    <div key={s.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-blue-600">{s.subject}</span>
                        <h4 className="font-bold text-slate-800">{s.topic}</h4>
                      </div>
                      <button onClick={() => handleDeletePortalContent(s.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: YOUTUBE CLASSES MANAGEMENT */}
          {activeTab === "youtube-classes" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add YouTube Class</h3>
                <form onSubmit={(e) => handleCreatePortalContent(e, "YOUTUBE_CLASS")} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Subject *</label>
                      <input type="text" name="subject" placeholder="যেমন: ইংরেজি সাহিত্য" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Topic *</label>
                      <input type="text" name="topic" placeholder="যেমন: Romantic Period Lecture 01" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Class Description / Text (Optional)</label>
                    <textarea name="contentText" rows={3} placeholder="ক্লাস সম্পর্কিত নোট বা টেক্সট (ঐচ্ছিক)..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Class PDF Link</label>
                      <input type="url" name="pdfUrl" placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">YouTube Video Link *</label>
                      <input type="url" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700">
                    Publish YouTube Class
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Published YouTube Classes ({youtubeList.length})</h3>
                <div className="space-y-3">
                  {youtubeList.map((y) => (
                    <div key={y.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-purple-600">{y.subject}</span>
                        <h4 className="font-bold text-slate-800">{y.topic}</h4>
                      </div>
                      <button onClick={() => handleDeletePortalContent(y.id)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANUAL ENROLL (Search by CBC-XXXXXX Student ID) */}
          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manually Enroll a Student</h3>
              <p className="text-xs text-slate-500 mb-4">স্টুডেন্টের Fixed Student ID (যেমন: CBC-180145) দিয়ে সার্চ করলে নাম, ফোন ও ইমেইল অটোমেটিক বসে যাবে।</p>
              
              <div className="mb-6 flex gap-2 items-end bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Search by Student ID</label>
                  <input
                    type="text"
                    value={enrollStudentId}
                    onChange={(e) => setEnrollStudentId(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-lg outline-none uppercase"
                    placeholder="e.g. CBC-180145"
                  />
                </div>
                <button type="button" onClick={handleStudentSearch} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  Search
                </button>
              </div>

              <form className="grid grid-cols-2 gap-6" onSubmit={handleManualEnroll}>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Name *</label>
                  <input type="text" name="studentName" value={enrollStudentDetails.name} onChange={(e) => setEnrollStudentDetails({ ...enrollStudentDetails, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Phone *</label>
                  <input type="tel" name="studentPhone" value={enrollStudentDetails.phone} onChange={(e) => setEnrollStudentDetails({ ...enrollStudentDetails, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Email *</label>
                  <input type="email" name="studentEmail" value={enrollStudentDetails.email} onChange={(e) => setEnrollStudentDetails({ ...enrollStudentDetails, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Course / Batch *</label>
                  <input type="text" name="courseId" list="courseOptions" placeholder="কোর্সের নাম সিলেক্ট বা টাইপ করুন" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <datalist id="courseOptions">
                    {coursesList.map((c) => (
                      <option key={c.id} value={c.title} />
                    ))}
                    <option value="47th BCS Preliminary" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Amount Paid (BDT) *</label>
                  <input type="number" name="amountPaid" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select name="paymentMethod" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Transaction Number (TrxID) *</label>
                  <input type="text" name="trxId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sender Phone Number *</label>
                  <input type="text" name="senderPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>

                <div className="col-span-2">
                  <button type="submit" disabled={isEnrolling} className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:opacity-50">
                    {isEnrolling ? "Enrolling..." : "Enroll Student & Save Record"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: ENROLLED STUDENTS */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Enrolled Students</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-y border-slate-200">
                      <th className="p-4 font-bold">Student Name</th>
                      <th className="p-4 font-bold">Phone & Email</th>
                      <th className="p-4 font-bold">Course</th>
                      <th className="p-4 font-bold">Paid Amount</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-4 font-bold text-slate-800">{student.studentName || "N/A"}</td>
                        <td className="p-4 text-slate-600">
                          <div>{student.studentPhone || "N/A"}</div>
                          <div className="text-xs text-slate-400">{student.studentEmail}</div>
                        </td>
                        <td className="p-4 font-semibold text-blue-700">{student.courseTitle}</td>
                        <td className="p-4 font-semibold">৳ {student.amountPaid || 0}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PAID</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
