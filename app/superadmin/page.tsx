"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // State variables for real data from backend
  const [stats, setStats] = useState({ totalStudents: 0, activeEnrollments: 0, totalReviews: 0, bannedAccounts: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Base URL for your Spring Boot Backend
  const BACKEND_URL = "https://cadres-bcs-backend.onrender.com";

  // Function to fetch all real data from backend
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

      // NOTE: Replace these endpoints with your actual Spring Boot API routes when ready
      const [statsRes, studentsRes, adminsRes, historyRes, reviewsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/students`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/list`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/history`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/reviews`, { headers }).catch(() => null)
      ]);

      if (statsRes?.ok) setStats(await statsRes.json());
      if (studentsRes?.ok) setStudents(await studentsRes.json());
      if (adminsRes?.ok) setAdmins(await adminsRes.json());
      if (historyRes?.ok) setAdminHistory(await historyRes.json());
      if (reviewsRes?.ok) setReviews(await reviewsRes.json());

    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMsg("Failed to connect to the backend server. Make sure APIs are running.");
    } finally {
      setIsLoading(false);
    }
  };

  // Temporarily commented out for testing, but should be enabled for production
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   } else {
  //     fetchDashboardData();
  //   }
  // }, [router]);

  // Fallback fetch call for testing UI without auth block
  useEffect(() => { fetchDashboardData(); }, []);

  const handleManualEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Auto-detect current admin
    data.approvedBy = localStorage.getItem("userEmail") || "Super Admin";

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Student Enrolled Successfully!");
        form.reset();
        fetchDashboardData();
      } else {
        alert("❌ Failed to enroll student. " + await response.text());
      }
    } catch (error) {
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vouchers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Voucher Created Successfully!");
        form.reset();
      } else {
        alert("❌ Failed to create voucher. " + await response.text());
      }
    } catch (error) {
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(`✅ ${data.role} assigned successfully!`);
        form.reset();
        fetchDashboardData();
      } else {
        alert("❌ Failed to assign role. " + await response.text());
      }
    } catch (error) {
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        alert("✅ Review deleted successfully!");
        fetchDashboardData();
      } else {
        alert("❌ Failed to delete review.");
      }
    } catch (error) {
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src="/logo.png" alt="CBC" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">CBC Admin</h2>
            <p className="text-xs text-blue-400 font-semibold">Super Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { id: "overview", name: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
            { id: "courses", name: "Courses & Students", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
            { id: "enrollment", name: "Manual Enroll", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
            { id: "vouchers", name: "Vouchers & Offers", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
            { id: "admins", name: "Admins & History", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { id: "reviews", name: "Total Reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
              <span className="font-semibold text-sm">{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            {isLoading && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold animate-pulse">Syncing with server...</span>}
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-full border border-purple-200">SUPER ADMIN</span>
          </div>
        </header>

        <div className="p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {errorMsg} (Awaiting Backend APIs)
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Students", value: stats.totalStudents, color: "blue" },
                { title: "Active Enrollments", value: stats.activeEnrollments, color: "green" },
                { title: "Total Reviews", value: stats.totalReviews, color: "yellow" },
                { title: "Banned Accounts", value: stats.bannedAccounts, color: "red" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-2">{stat.title}</p>
                  <h3 className={`text-3xl font-black text-${stat.color}-600`}>{stat.value || 0}</h3>
                </div>
              ))}
            </div>
          )}

          {/* COURSES & STUDENTS TAB */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Filter by Course</label>
                  <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px] font-semibold text-slate-700">
                    <option value="all">All Courses</option>
                    {/* Add options dynamically from backend if needed */}
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-semibold">Total Students in this course</p>
                  <p className="text-2xl font-black text-blue-600">{students.length || 0}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                      <th className="p-4 font-bold">Student Name</th>
                      <th className="p-4 font-bold">Phone & Email</th>
                      <th className="p-4 font-bold">Paid Amount</th>
                      <th className="p-4 font-bold">Enrollment Date</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? students.map((student, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-4 font-bold text-slate-800">{student.name}</td>
                        <td className="p-4 text-slate-600 text-sm">
                          <div>{student.phone}</div>
                          <div className="text-xs text-slate-400">{student.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 text-sm font-semibold">৳ {student.paidAmount}</td>
                        <td className="p-4 text-slate-600 text-sm">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PAID</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">No real student data found. Waiting for API.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANUAL ENROLL TAB */}
          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manually Enroll a Student</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Record all payment details carefully. This will be saved in the database under your Admin ID.</p>
              
              <form className="grid grid-cols-2 gap-6" onSubmit={handleManualEnroll}>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Phone (Required) <span className="text-red-500">*</span></label>
                  <input type="tel" name="studentPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Email (Required) <span className="text-red-500">*</span></label>
                  <input type="email" name="studentEmail" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Course <span className="text-red-500">*</span></label>
                  <select name="courseId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Choose a Course</option>
                    <option value="47-preliminary">47th BCS Preliminary</option>
                    {/* Add actual courses dynamically later */}
                  </select>
                </div>
                
                <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Payment Information (All Required)</h4>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Amount Paid (BDT) <span className="text-red-500">*</span></label>
                  <input type="number" name="amountPaid" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method <span className="text-red-500">*</span></label>
                  <select name="paymentMethod" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Transaction Number (TrxID) <span className="text-red-500">*</span></label>
                  <input type="text" name="trxId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase" placeholder="e.g. 9X2A8BCD" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sender Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" name="senderPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="01XXXXXXXXX" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Short Note (Optional)</label>
                  <input type="text" name="shortNote" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Any additional information..." />
                </div>
                
                <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-semibold text-blue-800">Approving Admin: <span className="font-bold">{typeof window !== 'undefined' ? localStorage.getItem("userName") || "Super Admin" : "Super Admin"}</span></p>
                </div>

                <div className="col-span-2">
                  <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md transition-colors">
                    Enroll Student & Save Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VOUCHERS TAB */}
          {activeTab === "vouchers" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Create Discount Voucher</h3>
              <form className="space-y-5" onSubmit={handleCreateVoucher}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Voucher Code <span className="text-red-500">*</span></label>
                  <input type="text" name="voucherCode" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" placeholder="e.g. CBC50" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Discount Amount (Tk) <span className="text-red-500">*</span></label>
                    <input type="number" name="discountAmount" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Validate Date <span className="text-red-500">*</span></label>
                    <input type="date" name="validUntil" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Max Uses (Optional)</label>
                  <input type="number" name="maxUses" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 100" />
                </div>
                <button type="submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors">
                  Create Voucher
                </button>
              </form>
            </div>
          )}

          {/* ADMINS & HISTORY TAB */}
          {activeTab === "admins" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Admin / Manager</h3>
                <form className="space-y-5" onSubmit={handleAddAdmin}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email <span className="text-red-500">*</span></label>
                      <input type="email" name="adminEmail" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Admin Phone <span className="text-red-500">*</span></label>
                      <input type="tel" name="adminPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role <span className="text-red-500">*</span></label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <input type="radio" name="role" value="ADMIN" className="w-4 h-4 text-blue-600" required />
                        <span className="font-bold text-slate-700">General Admin</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <input type="radio" name="role" value="SUPERADMIN" className="w-4 h-4 text-purple-600" required />
                        <span className="font-bold text-purple-700">Super Admin</span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md">Assign Role</button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Real-Time Admin Login History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                        <th className="p-4 font-bold">Admin Details</th>
                        <th className="p-4 font-bold">Role</th>
                        <th className="p-4 font-bold">Login Time</th>
                        <th className="p-4 font-bold">IP Address & Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminHistory.length > 0 ? adminHistory.map((history, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{history.name}</div>
                            <div className="text-xs text-slate-500">{history.email}</div>
                          </td>
                          <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded ${history.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{history.role}</span></td>
                          <td className="p-4 text-slate-600 text-sm">{new Date(history.loginTime).toLocaleString()}</td>
                          <td className="p-4 text-slate-600 text-sm">
                            <div>IP: {history.ipAddress}</div>
                            <div className="text-xs text-slate-400">{history.device}</div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No real history found. Waiting for API.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Total Course Reviews</h3>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review, idx) => (
                  <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{review.studentName}</h4>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{review.courseName}</span>
                      </div>
                      <div className="flex gap-1 text-yellow-400 mb-2">
                        {Array(review.rating).fill('★').join('')}{Array(5 - review.rating).fill('☆').join('')}
                      </div>
                      <p className="text-sm text-slate-700">{review.comment}</p>
                    </div>
                    <div className="shrink-0">
                      <button onClick={() => handleDeleteReview(review.id)} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">No real reviews found. Waiting for API.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
