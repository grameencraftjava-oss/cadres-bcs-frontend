"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  instructorName: string;
  enrollmentDate: string;
}

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    fetch("https://cadres-bcs-backend.onrender.com/api/enrollments/dashboard/1", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Cadre's BCS Compass Dashboard</h1>
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
            <p className="text-gray-500">কোর্স লোড হচ্ছে...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-500">বর্তমানে কোনো এনরোল করা কোর্স পাওয়া যায়নি।</p>
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
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      এনরোলমেন্ট তারিখ: {new Date(c.enrollmentDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">ক্লাস শুরু করুন →</span>
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
