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

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    if (!userEmail) {
      setLoading(false);
      return;
    }

    // এখন ইউজারের ইমেইল দিয়ে ব্যাকএন্ড থেকে সরাসরি তার কোর্সগুলো আনা হচ্ছে
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollments/dashboard/${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Cadre&apos;s BCS Compass Dashboard</h1>
            <p className="text-sm text-gray-500">আপনার ড্যাশবোর্ডে স্বাগতম</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">আমার এনরোল করা কোর্সসমূহ</h2>
          {loading ? (
            <p className="text-gray-500 font-medium">আপনার কোর্স লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
          ) : courses.length === 0 ? (
            <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100 text-center">
              <p className="text-blue-800 font-medium">বর্তমানে আপনার কোনো এনরোল করা কোর্স পাওয়া যায়নি।</p>
              <p className="text-sm text-blue-600 mt-2">নতুন কোর্সে ভর্তি হতে আমাদের কোর্সসমূহ পেজে ভিজিট করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c.enrollmentId}
                  onClick={() => router.push(`/course/${c.courseId}`)}
                  className="border border-blue-100 bg-blue-50/40 p-5 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-600">{c.courseTitle}</h3>
                  <p className="text-sm text-gray-600 mt-1">ইন্সট্রাক্টর: {c.instructorName}</p>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-100">
                    <span className="text-xs text-gray-500 font-medium">
                      এনরোলমেন্ট তারিখ: {new Date(c.enrollmentDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">ক্লাস শুরু করুন →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
