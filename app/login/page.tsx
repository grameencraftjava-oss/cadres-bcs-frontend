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
      // keep raw text
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
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top Header with Logo & Title (হুবহু image_9891e4.png এর মতো) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src="/logo.png" alt="CBC Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
            <span className="text-[13px] sm:text-lg md:text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
              Cadre&apos;s BCS Compass-<span className="text-blue-600">CBC</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="flex-grow flex items-center justify-center p-4 py-12 sm:py-16">
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
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pr-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 text-xs font-bold">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 pr-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 text-xs font-bold">
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

      {/* Footer Section */}
      <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800 scroll-mt-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            
            {/* Brand Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center p-1">
                  <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
                  Cadre&apos;s BCS <span className="text-blue-500">Compass</span>
                </h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                দেশের সেরা ইন্সট্রাক্টরদের গাইডলাইনে ঘরে বসেই নিন পূর্ণাঙ্গ বিসিএস প্রস্তুতি। আজই যুক্ত হোন আমাদের এক্সক্লুসিভ কোর্সে।
              </p>
            </div>

            {/* Direct Contact Numbers */}
            <div>
              <h3 className="text-lg font-bold mb-5 border-b border-slate-700 pb-2 inline-block text-white">জরুরি যোগাযোগ</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="text-white font-semibold">Md. Abdullah Al Mamun</p>
                    <a href="tel:+8801612029324" className="hover:text-blue-400 transition">+880 1612-029324</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <p className="text-white font-semibold">Taki Yasir Tomal</p>
                    <a href="tel:+8801720335771" className="hover:text-blue-400 transition">+880 1720-335771</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social Links with Logos */}
            <div>
              <h3 className="text-lg font-bold mb-5 border-b border-slate-700 pb-2 inline-block text-white">আমাদের সাথে যুক্ত থাকুন</h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">বিসিএস সম্পর্কিত সকল আপডেট, ফ্রি গাইডলাইন এবং আমাদের স্পেশাল কমিউনিটিতে যুক্ত হতে নিচের অফিসিয়াল চ্যানেলগুলোতে জয়েন করুন:</p>
              <div className="flex flex-wrap gap-4">
                {/* Facebook */}
                <a href="https://www.facebook.com/share/1ERfS7rgK8/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-blue-500/30" title="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {/* YouTube */}
                <a href="https://youtube.com/@cadres_bcs_compass?si=ITxgFwjEygObJ4T8" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-red-500/30" title="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {/* WhatsApp */}
                <a href="https://chat.whatsapp.com/DraE44qbMBZ3xPhWh5uEFI?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-green-500/30" title="WhatsApp">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/+S7nT5CwsTXM5ODg9" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#0088cc] hover:text-white transition-all shadow-lg hover:-translate-y-1 hover:shadow-[#0088cc]/30" title="Telegram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Cadre&apos;s BCS Compass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
