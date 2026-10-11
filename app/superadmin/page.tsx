"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalSignups: number;
  totalStudents: number;
  activeEnrollments: number;
  totalReviews: number;
  bannedAccounts: number;
}

interface StudentData {
  id?: string | number;
  name: string;
  phone: string;
  email: string;
  paidAmount?: number;
  role?: string;
}

interface AdminHistoryData {
  name: string;
  email: string;
  role: string;
  loginTime: string;
  ipDetails: string;
}

interface ReviewData {
  id: string;
  studentName: string;
  comment: string;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState<DashboardStats>({ totalSignups: 0, totalStudents: 0, activeEnrollments: 0, totalReviews: 0, bannedAccounts: 0 });
  const [students, setStudents] = useState<StudentData[]>([]);
  const [signups, setSignups] = useState<StudentData[]>([]);
  const [adminHistory, setAdminHistory] = useState<AdminHistoryData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollStudentDetails, setEnrollStudentDetails] = useState<StudentData>({ name: "", email: "", phone: "" });

  const BACKEND_URL = "https://cadres-bcs-backend.onrender.com";

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

      const [statsRes, studentsRes, signupsRes, historyRes, reviewsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/students`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/signups`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/history`, { headers }).catch(() => null),
        fetch(`${BACKEND_URL}/api/admin/reviews`, { headers }).catch(() => null)
      ]);

      if (statsRes?.ok) setStats(await statsRes.json());
      if (studentsRes?.ok) setStudents(await studentsRes.json());
      if (signupsRes?.ok) setSignups(await signupsRes.json());
      if (historyRes?.ok) setAdminHistory(await historyRes.json());
      if (reviewsRes?.ok) setReviews(await reviewsRes.json());

    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleStudentSearch = async () => {
      if(!enrollStudentId) return;
      try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
          const res = await fetch(`${BACKEND_URL}/api/admin/student-by-id?id=${enrollStudentId}`, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          if(res.ok) {
              const data = await res.json();
              setEnrollStudentDetails({ name: data.name, email: data.email, phone: data.phone || "" });
          } else {
              alert("Student not found!");
              setEnrollStudentDetails({ name: "", email: "", phone: "" });
          }
      } catch(error) {
          console.error("Search failed", error);
      }
  };

  const handleManualEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    data.approvedBy = typeof window !== 'undefined' ? localStorage.getItem("userEmail") || "Super Admin" : "Super Admin";
    data.studentName = enrollStudentDetails.name;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${BACKEND_URL}/api/admin/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Student Enrolled Successfully!");
        form.reset();
        setEnrollStudentDetails({ name: "", email: "", phone: "" });
        fetchDashboardData();
      } else {
        alert("❌ Failed to enroll student.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error: Cannot connect to backend API.");
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${BACKEND_URL}/api/admin/vouchers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Voucher Created Successfully!");
        form.reset();
      } else {
        alert("❌ Failed to create voucher.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error.");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${BACKEND_URL}/api/admin/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(`✅ Role assigned successfully!`);
        form.reset();
        fetchDashboardData();
      } else {
        alert("❌ Failed to assign role.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${BACKEND_URL}/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        alert("✅ Review deleted successfully!");
        fetchDashboardData();
      } else {
        alert("❌ Failed to delete review.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <h2 className="text-white font-bold text-lg leading-tight">CBC Admin</h2>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { id: "overview", name: "Overview" },
            { id: "signups", name: "All Signups" },
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            {isLoading && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold animate-pulse">Syncing...</span>}
          </div>
        </header>

        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
              {errorMsg}
            </div>
          )}

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

          {activeTab === "signups" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-slate-800">All Registered Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                      <th className="p-4 font-bold">User Details</th>
                      <th className="p-4 font-bold">Phone Number</th>
                      <th className="p-4 font-bold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.length > 0 ? signups.map((user, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{user.phone || "N/A"}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded uppercase">{user.role || "STUDENT"}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-500">Waiting for API data.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Courses & Students</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                      <th className="p-4 font-bold">Student Name</th>
                      <th className="p-4 font-bold">Phone & Email</th>
                      <th className="p-4 font-bold">Paid Amount</th>
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
                        <td className="p-4 text-slate-600 text-sm font-semibold">৳ {student.paidAmount || 0}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PAID</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">Waiting for API data.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manually Enroll a Student</h3>
              
              <div className="mb-6 flex gap-2 items-end bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Search by Student ID</label>
                      <input type="text" value={enrollStudentId} onChange={(e)=>setEnrollStudentId(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter Database ID" />
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
                 <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Receiver Account Name <span className="text-red-500">*</span></label>
                  <input type="text" name="receiverAccountName" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Account Holder Name" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Receiver Number <span className="text-red-500">*</span></label>
                  <input type="text" name="receiverNumber" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="e.g. 017XXXXXX" required />
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

          {activeTab === "vouchers" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Create Discount Voucher</h3>
              <form className="space-y-5" onSubmit={handleCreateVoucher}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Voucher Code <span className="text-red-500">*</span></label>
                  <input type="text" name="voucherCode" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Discount Amount (Tk) <span className="text-red-500">*</span></label>
                    <input type="number" name="discountAmount" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Validate Date <span className="text-red-500">*</span></label>
                    <input type="date" name="validUntil" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">Create Voucher</button>
              </form>
            </div>
          )}

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
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">Waiting for API data.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

           {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Total Course Reviews</h3>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review, idx) => (
                  <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800">{review.studentName}</h4>
                      <p className="text-sm text-slate-700">{review.comment}</p>
                    </div>
                    <button onClick={() => handleDeleteReview(review.id)} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm font-bold">Delete</button>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500">Waiting for API data.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
