"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  // Basic Auth Check (To be replaced with real backend token validation)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src="/logo.png" alt="CBC" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">CBC Admin</h2>
            <p className="text-xs text-blue-400 font-semibold">Super Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="font-semibold">Overview</span>
          </button>
          <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-semibold">Manage Users</span>
          </button>
          <button onClick={() => setActiveTab("enrollment")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "enrollment" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <span className="font-semibold">Manual Enroll</span>
          </button>
          <button onClick={() => setActiveTab("admins")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "admins" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="font-semibold">Admin Roles</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-semibold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-full border border-purple-200">SUPER ADMIN</span>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff`} alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Students</p><h3 className="text-2xl font-black text-slate-800">1,248</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="text-sm font-medium text-slate-500">Active Enrollments</p><h3 className="text-2xl font-black text-slate-800">892</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
                  <div><p className="text-sm font-medium text-slate-500">Banned Accounts</p><h3 className="text-2xl font-black text-slate-800">14</h3></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">User Management</h3>
                <input type="text" placeholder="Search by email or phone..." className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                      <th className="p-4 font-semibold">User Details</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-800">Raiyan Khan Joy</p>
                        <p className="text-xs text-slate-500">raiyan@example.com</p>
                      </td>
                      <td className="p-4"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">STUDENT</span></td>
                      <td className="p-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md flex w-max items-center gap-1"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>Active</span></td>
                      <td className="p-4 text-right space-x-2">
                        <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors">Edit</button>
                        <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md transition-colors">Ban User</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "enrollment" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Manually Enroll a Student</h3>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Backend API Not Connected Yet!'); }}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Student Email / Phone</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter student identifier" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Course</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">-- Choose a Course --</option>
                    <option value="47">47th BCS Preliminary Batch</option>
                    <option value="47-written">47th BCS Written Batch</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors">
                  Enroll Student
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "admins" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Add New Admin / Super Admin</h3>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Backend API Not Connected Yet!'); }}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">User Email</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Role</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="role" value="ADMIN" className="w-4 h-4 text-blue-600 focus:ring-blue-500" required />
                      <span className="font-medium text-slate-700">Admin</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="role" value="SUPERADMIN" className="w-4 h-4 text-purple-600 focus:ring-purple-500" required />
                      <span className="font-medium text-purple-700">Super Admin</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-colors">
                  Assign Role
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
