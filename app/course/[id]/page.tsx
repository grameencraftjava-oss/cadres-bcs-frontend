"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  courseId: number;
}

export default function CourseLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeVideo, setActiveVideo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (courseId) {
      fetch(`https://cadres-bcs-backend.onrender.com/api/lessons/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load lessons");
          return res.json();
        })
        .then((data: Lesson[]) => {
          setLessons(data);
          if (data.length > 0) {
            setActiveVideo(data[0].videoUrl);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [courseId, router]);

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com") && url.includes("/view")) {
      return url.replace("/view", "/preview");
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← ড্যাশবোর্ডে ফিরে যান
          </button>
          <h1 className="text-xl font-bold text-gray-800">কোর্স ক্লাস রুম</h1>
        </div>

        {loading ? (
          <p className="text-gray-500">ভিডিও লোড হচ্ছে...</p>
        ) : lessons.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">
            এই কোর্সে এখনও কোনো ভিডিও ক্লাস যুক্ত করা হয়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                {activeVideo ? (
                  <iframe
                    src={getEmbedUrl(activeVideo)}
                    className="w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    ভিডিও সিলেক্ট করুন
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">সকল ক্লাস সমূহ</h2>
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveVideo(lesson.videoUrl)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
                      activeVideo === lesson.videoUrl
                        ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <p className="text-sm">ক্লাস {idx + 1}: {lesson.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
