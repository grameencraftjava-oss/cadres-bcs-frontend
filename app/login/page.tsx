"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("লগইন করা হচ্ছে...");
    try {
      const response = await fetch("https://cadres-bcs-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.text();
      if (response.ok && data.includes("Success")) {
        const token = data.split("Token: ")[1]?.trim();
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        setMessage("✅ লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage("❌ " + data);
      }
    } catch (error) {
      setMessage("❌ সার্ভার এরর! Spring Boot ব্যাকএন্ড কি চালু আছে?");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-blue-900">
          Cadre's BCS Compass
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">আপনার অ্যাকাউন্টে সাইন-ইন করুন</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="admin@cadrescompass.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-base font-bold text-white transition-all hover:bg-blue-700 shadow-md"
          >
            Sign In
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-gray-800">{message}</p>
        )}
      </div>
    </div>
  );
}
