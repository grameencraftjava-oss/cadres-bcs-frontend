"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // State variables for real data from backend
  const [stats, setStats] = useState({ totalStudents: 0, activeEnrollments: 0, totalReviews: 0, bannedAccounts: 0, totalSignups: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // States for Manual Enroll Student Search
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollStudentDetails, setEnrollStudentDetails] = useState({ name: "", email: "", phone: "" });

  const BACKEND_URL = "https://cadres-bcs-backend.onrender.com";

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

      const [statsRes, studentsRes, historyRes, reviewsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/students`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/history`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/reviews`, { headers }).catch(() => null)
      ]);

      if (statsRes?.ok) setStats(await statsRes.json());
      if (studentsRes?.ok) setStudents(await studentsRes.json());
      if (historyRes?.ok) setAdminHistory(await historyRes.json());
      if (reviewsRes?.ok) setReviews(await reviewsRes.json());

    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMsg("Failed to connect to the backend server. Make sure APIs are running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // Function to search student by ID
  const handleStudentSearch = async () => {
      if(!enrollStudentId) return;
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${BACKEND_URL}/api/admin/student-by-id?id=${enrollStudentId}`, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          if(res.ok) {
              const data = await res.json();
              setEnrollStudentDetails({ name: data.name, email: data.email, phone: data.phone });
          } else {
              alert("Student not found!");
              setEnrollStudentDetails({ name: "", email: "", phone: "" });
          }
      } catch(e) {
          console.error("Search failed", e);
      }
  }


  const handleManualEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    data.approvedBy = localStorage.getItem("userEmail") || "Super Admin";
    data.studentName = enrollStudentDetails.name; // Include auto-fetched name

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Student Enrolled Successfully!");
        form.reset();
        setEnrollStudentDetails({ name: "", email: "", phone: "" });
        fetchDashboardData();
      } else {
        alert("❌ Failed to enroll student. " + await response.text());
      }
    } catch (error) {
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent<HTMLFormElement>) => { /* ... existing code ... */ e.preventDefault(); };

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

  const handleDeleteReview = async (reviewId: string) => { /* ... existing code ... */ };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - (Keeping existing structure) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <h2 className="text-white font-bold text-lg leading-tight">CBC Admin</h2>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { id: "overview", name: "Overview" },
            { id: "courses", name: "Courses & Students" },
            { id: "enrollment", name: "Manual Enroll" },
            { id: "vouchers", name: "Vouchers & Offers" },
            { id: "admins", name: "Admins & History" },
            { id: "reviews", name: "Total Reviews" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}>
              <span className="font-semibold text-sm">{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
        </header>

        <div className="p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { title: "Total Signups", value: stats.totalSignups, color: "purple" },
                { title: "Total Students", value: stats.totalStudents, color: "blue" },
                { title: "Active Enrollments", value: stats.activeEnrollments, color: "green" },
                { title: "Total Reviews", value: stats.totalReviews, color: "yellow" },
                { title: "Banned", value: stats.bannedAccounts, color: "red" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-2">{stat.title}</p>
                  <h3 className={`text-3xl font-black text-${stat.color}-600`}>{stat.value || 0}</h3>
                </div>
              ))}
            </div>
          )}

          {/* COURSES TAB (Unchanged) */}
          {activeTab === "courses" && ( <div>Courses Content...</div> )}

          {/* MANUAL ENROLL TAB */}
          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manually Enroll a Student</h3>
              
              <div className="mb-6 flex gap-2 items-end bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Search by Student ID</label>
                      <input type="text" value={enrollStudentId} onChange={(e)=>setEnrollStudentId(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter ID to auto-fill details" />
                  </div>
                  <button type="button" onClick={handleStudentSearch} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700">Search</button>
              </div>

              <form className="grid grid-cols-2 gap-6" onSubmit={handleManualEnroll}>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Name (Auto-filled)</label>
                  <input type="text" value={enrollStudentDetails.name} readOnly className="w-full px-4 py-2.5 bg-gray-100 border border-slate-200 rounded-xl outline-none" placeholder="Will be auto-filled" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Phone <span className="text-red-500">*</span></label>
                  <input type="tel" name="studentPhone" value={enrollStudentDetails.phone} onChange={(e)=>setEnrollStudentDetails({...enrollStudentDetails, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Email <span className="text-red-500">*</span></label>
                  <input type="email" name="studentEmail" value={enrollStudentDetails.email} onChange={(e)=>setEnrollStudentDetails({...enrollStudentDetails, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Course <span className="text-red-500">*</span></label>
                  <select name="courseId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                    <option value="">Choose a Course</option>
                    <option value="47-preliminary">47th BCS Preliminary</option>
                  </select>
                </div>
                
                <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h4 className="text-sm font-black text-slate-800 mb-4">Payment Information</h4>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Amount Paid (BDT) <span className="text-red-500">*</span></label>
                  <input type="number" name="amountPaid" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method <span className="text-red-500">*</span></label>
                  <select name="paymentMethod" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                 <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Receiver Account Name <span className="text-red-500">*</span></label>
                  <input type="text" name="receiverAccountName" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Name of the account that received money" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Transaction Number (TrxID) <span className="text-red-500">*</span></label>
                  <input type="text" name="trxId" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sender Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" name="senderPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                
                <div className="col-span-2">
                  <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700">
                    Enroll Student & Save Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VOUCHERS TAB (Unchanged) */}
          {activeTab === "vouchers" && ( <div>Vouchers Content...</div> )}

          {/* ADMINS & HISTORY TAB */}
          {activeTab === "admins" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Admin / Manager</h3>
                <form className="space-y-5" onSubmit={handleAddAdmin}>
                   <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Admin Name <span className="text-red-500">*</span></label>
                      <input type="text" name="adminName" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email <span className="text-red-500">*</span></label>
                      <input type="email" name="adminEmail" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Admin Phone <span className="text-red-500">*</span></label>
                      <input type="tel" name="adminPhone" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role <span className="text-red-500">*</span></label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="ADMIN" required /> <span>General Admin</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="role" value="SUPERADMIN" required /> <span>Super Admin</span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl">Assign Role</button>
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
                          <td className="p-4"><span className="px-2 py-1 text-xs font-bold rounded bg-purple-100 text-purple-700">{history.role}</span></td>
                          <td className="p-4 text-slate-600 text-sm">{history.loginTime}</td>
                          <td className="p-4 text-slate-600 text-sm">{history.ipDetails}</td>
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

           {/* REVIEWS TAB (Unchanged) */}
           {activeTab === "reviews" && ( <div>Reviews Content...</div> )}
        </div>
      </main>
    </div>
  );
}
