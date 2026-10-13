"use client";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase"; 
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://cadres-bcs-backend.onrender.com";

  // বিশাল HTML বা JSON এরর ক্লিন করার ফাংশন
  const cleanErrorMessage = (rawText: string, status: number) => {
    if (!rawText) return "সার্ভার থেকে কোনো সাড়া পাওয়া যায়নি।";
    if (rawText.trim().startsWith("<!DOCTYPE") || rawText.includes("<html") || status === 502 || status === 503 || status === 504) {
      return "⏳ ব্যাকএন্ড সার্ভার ঘুম থেকে উঠছে (Cold Start)। দয়া করে ২০-৩০ সেকেন্ড পর আবার চেষ্টা করুন!";
    }
    if (status === 404) {
      return "❌ API রুট খুঁজে পাওয়া যায়নি (404)। ব্যাকএন্ড ডিপ্লয়মেন্ট চেক করুন।";
    }
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.error) return "❌ " + parsed.error;
      if (parsed.message) return "❌ " + parsed.message;
    } catch {
      // টেক্সট হিসেবেই রাখবো
    }
    return rawText.length > 160 ? "❌ লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড চেক করুন।" : "❌ " + rawText.replace(/^Error:\s*/i, "");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(isLogin ? "লগইন হচ্ছে..." : "অ্যাকাউন্ট তৈরি হচ্ছে...");

    if (!isLogin && password !== confirmPassword) {
      setMessage("❌ পাসওয়ার্ড দুটি মেলেনি!");
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    const payload = isLogin
        ? { email: emailOrPhone.trim(), password }
        : { name: name.trim(), email: emailOrPhone.trim(), password, phone: "" };

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.text();

      if (response.ok && data.includes("Success")) {
        const tokenString = data.split("Token:")[1];
        const actualToken = tokenString ? tokenString.split("Role:")[0].trim() : "auth-token";
        const roleString = data.includes("Role:") ? data.split("Role:")[1].trim() : "STUDENT";

        localStorage.setItem("token", actualToken);
        localStorage.setItem("userEmail", emailOrPhone.trim());
        localStorage.setItem("userRole", roleString);
        if (name) localStorage.setItem("userName", name.trim());

        setMessage("✅ সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...");

        setTimeout(() => {
          if (roleString === "SUPERADMIN") {
            router.push("/superadmin");
          } else {
            router.push("/dashboard");
          }
        }, 800);
      } else {
        setMessage(cleanErrorMessage(data, response.status));
      }
    } catch (error) {
      setMessage("⏳ সার্ভার ঘুম থেকে উঠছে (Cold Start)। দয়া করে ৩০ সেকেন্ড পর আবার ক্লিক করুন!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage("Google এর সাথে সংযোগ করা হচ্ছে...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        name: user.displayName || "Google User",
        email: user.email || "",
        uid: user.uid || "",
        photoUrl: user.photoURL || ""
      };

      const response = await fetch(`${BACKEND_URL}/api/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.text();

      if (response.ok && data.includes("Success")) {
        const tokenString = data.split("Token:")[1];
        const actualToken = tokenString ? tokenString.split("Role:")[0].trim() : "auth-token";
        const roleString = data.includes("Role:") ? data.split("Role:")[1].trim() : "STUDENT";

        localStorage.setItem("token", actualToken);
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userName", user.displayName || "");
        localStorage.setItem("userRole", roleString);

        setMessage("✅ গুগল লগইন সফল! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...");
        
        setTimeout(() => {
          if (roleString === "SUPERADMIN") {
            router.push("/superadmin");
          } else {
            router.push("/dashboard");
          }
        }, 800);
      } else {
        setMessage(cleanErrorMessage(data, response.status));
      }
    } catch (error: any) {
      setMessage("❌ গুগল সাইন-ইন এরর: " + (error?.message || "আবার চেষ্টা করুন"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-blue-600 mb-4 transition">
            <span>←</span> হোম পেজ
          </Link>

          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {message && (
              <div className={`p-3.5 mb-5 text-sm font-bold rounded-xl text-center break-words ${
                message.includes("✅") ? "bg-green-100 text-green-700" : 
                message.includes("⏳") || message.includes(" হচ্ছে...") ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="আপনার পূর্ণ নাম" />
                </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input type="email" required value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-xs font-bold">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-xs font-bold">
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-sm">
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => { setIsLogin(!isLogin); setMessage(""); }} className="ml-2 text-blue-600 font-bold hover:underline">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
  );
}
