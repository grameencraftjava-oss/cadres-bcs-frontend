"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleMockSubmit = (e: React.FormEvent, formName: string) => {
    e.preventDefault();
    alert(`💡 ${formName} Submitted! (Backend API Integration Required)`);
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
          <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-full border border-purple-200">SUPER ADMIN</span>
          </div>
        </header>

        <div className="p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Students", value: "2,450", color: "blue" },
                { title: "Active Enrollments", value: "1,892", color: "green" },
                { title: "Total Reviews", value: "845", color: "yellow" },
                { title: "Banned Accounts", value: "14", color: "red" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-2">{stat.title}</p>
                  <h3 className={`text-3xl font-black text-${stat.color}-600`}>{stat.value}</h3>
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
                    <option>47th BCS Preliminary Batch</option>
                    <option>47th BCS Written Batch</option>
                    <option>Bank Job Preparation</option>
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-semibold">Total Students in this course</p>
                  <p className="text-2xl font-black text-blue-600">850</p>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                    <th className="p-4 font-bold">Student Name</th>
                    <th className="p-4 font-bold">Phone/Email</th>
                    <th className="p-4 font-bold">Enrollment Date</th>
                    <th className="p-4 font-bold">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-800">Raiyan Khan</td>
                    <td className="p-4 text-slate-600 text-sm">017XXXXXX / email@.com</td>
                    <td className="p-4 text-slate-600 text-sm">12 Oct 2026</td>
                    <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PAID</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* MANUAL ENROLL TAB */}
          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manually Enroll a Student</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Record all payment details carefully. This will be saved in the database under your Admin ID.</p>
              
              <form className="grid grid-cols-2 gap-6" onSubmit={(e) => handleMockSubmit(e, "Manual Enrollment")}>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Phone / Email</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Course</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Choose a Course</option>
                    <option>47th BCS Preliminary</option>
                  </select>
                </div>
                
                <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Payment Information</h4>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Amount Paid (BDT)</label>
                  <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash (Hand to Hand)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Transaction Number (TrxID)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 9X2A8BCD" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sender Phone Number</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="01XXXXXXXXX" />
                </div>
                
                <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-semibold text-blue-800">Approved by: <span className="font-bold">Super Admin (Auto-detected)</span></p>
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
              <form className="space-y-5" onSubmit={(e) => handleMockSubmit(e, "Voucher Creation")}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Voucher Code</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" placeholder="e.g. CBC50" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Discount Amount (Tk)</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Max Uses (Optional)</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 100" />
                  </div>
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Admin / Manager</h3>
                <form className="space-y-5" onSubmit={(e) => handleMockSubmit(e, "Admin Role Assignment")}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email or Phone</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role</label>
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
                <h3 className="text-xl font-bold text-slate-800 mb-4">Admin Login History</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-y border-slate-200">
                      <th className="p-4 font-bold">Admin Details</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Login Time</th>
                      <th className="p-4 font-bold">IP Address / Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-4 font-bold text-slate-800">Mamun</td>
                      <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">SUPER ADMIN</span></td>
                      <td className="p-4 text-slate-600 text-sm">Today, 10:30 AM</td>
                      <td className="p-4 text-slate-600 text-sm">192.168.1.5 (Mac OS)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-4 font-bold text-slate-800">Taki</td>
                      <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">ADMIN</span></td>
                      <td className="p-4 text-slate-600 text-sm">Yesterday, 08:15 PM</td>
                      <td className="p-4 text-slate-600 text-sm">103.45.XX.XX (Windows)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Total Course Reviews</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">Student Name {idx + 1}</h4>
                        <p className="text-xs text-slate-500 font-medium">47th BCS Preliminary Batch</p>
                      </div>
                      <div className="flex gap-1 text-yellow-400">
                        ★★★★★
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">"The course structure is really helpful and the mentors are extremely supportive. Highly recommended!"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
