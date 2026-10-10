"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const router = useRouter();
  
  // Course States
  const [cTitle, setCTitle] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [cInstructor, setCInstructor] = useState("");
  const [cMsg, setCMsg] = useState("");

  // Lesson States
  const [lTitle, setLTitle] = useState("");
  const [lUrl, setLUrl] = useState("");
  const [lCourseId, setLCourseId] = useState("");
  const [lMsg, setLMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Handle Course Add
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCMsg("প্রসেসিং হচ্ছে...");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://cadres-bcs-backend.onrender.com/api/courses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: cTitle,
          description: cDesc,
          price: parseFloat(cPrice),
          instructorName: cInstructor,
        }),
      });
      const text = await res.text();
      if (res.ok) {
        setCMsg("✅ কোর্স সফলভাবে যুক্ত হয়েছে!");
        setCTitle(""); setCDesc(""); setCPrice(""); setCInstructor("");
      } else {
        setCMsg("❌ " + text + " (আপনার কি Admin অ্যাক্সেস আছে?)");
      }
    } catch (err) {
      setCMsg("❌ সার্ভার এরর! Spring Boot চালু আছে কি না চেক করুন।");
    }
  };

  // Handle Lesson Add
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLMsg("প্রসেসিং হচ্ছে...");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://cadres-bcs-backend.onrender.com/api/lessons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: lTitle,
          videoUrl: lUrl,
          courseId: parseInt(lCourseId),
        }),
      });
      const text = await res.text();
      if (res.ok) {
        setLMsg("✅ ভিডিও লেসন সফলভাবে যুক্ত হয়েছে!");
        setLTitle(""); setLUrl(""); setLCourseId("");
      } else {
        setLMsg("❌ " + text + " (আপনার কি Admin অ্যাক্সেস আছে?)");
      }
    } catch (err) {
      setLMsg("❌ সার্ভার এরর! Spring Boot চালু আছে কি না চেক করুন।");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Admin Control Panel</h1>
            <p className="text-sm text-gray-500">কোর্স এবং ভিডিও ম্যানেজমেন্ট সিস্টেম</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            ড্যাশবোর্ডে যান
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Add Course Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">নতুন কোর্স তৈরি করুন</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">কোর্সের নাম</label>
                <input type="text" value={cTitle} onChange={(e) => setCTitle(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="যেমন: BCS Math Masterclass" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ইন্সট্রাক্টর</label>
                <input type="text" value={cInstructor} onChange={(e) => setCInstructor(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="যেমন: Raiyan Khan Joy" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">কোর্সের মূল্য (৳)</label>
                <input type="number" value={cPrice} onChange={(e) => setCPrice(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="2500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">বিবরণ</label>
                <textarea value={cDesc} onChange={(e) => setCDesc(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" rows={3} required placeholder="কোর্সের বিস্তারিত তথ্য..." />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">কোর্স যুক্ত করুন</button>
            </form>
            {cMsg && <p className="mt-4 text-center text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded">{cMsg}</p>}
          </div>

          {/* Add Lesson Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">কোর্সে ভিডিও যুক্ত করুন</h2>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">কোর্স আইডি (Course ID)</label>
                <input type="number" value={lCourseId} onChange={(e) => setLCourseId(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="যেমন: 1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ভিডিও টাইটেল (ক্লাসের নাম)</label>
                <input type="text" value={lTitle} onChange={(e) => setLTitle(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="যেমন: Class 1: Real Numbers" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Google Drive ভিডিও লিংক</label>
                <input type="url" value={lUrl} onChange={(e) => setLUrl(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" required placeholder="https://drive.google.com/file/d/..." />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-6">ভিডিও যুক্ত করুন</button>
            </form>
            {lMsg && <p className="mt-4 text-center text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded">{lMsg}</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
