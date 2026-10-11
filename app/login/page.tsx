"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Ensure these imports match EXACTLY what is exported from lib/firebase.ts
import { auth, googleProvider, signInWithRedirect, getRedirectResult } from '../../lib/firebase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const BACKEND_URL = "https://cadres-bcs-backend.onrender.com";

  const saveUserToDatabase = async (userData: any, isGoogle: boolean = false) => {
    try {
      const endpoint = isGoogle ? "/api/users/google-login" : (isLogin ? "/api/users/login" : "/api/users/register");
      
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.text();

      if (response.ok) {
        const token = data.includes("Token:") ? data.split("Token:")[1].split(" ")[0].trim() : "demo-token";
        const role = data.includes("Role:") ? data.split("Role:")[1].trim() : "STUDENT";
        
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", userData.email || userData.phone || "");
        localStorage.setItem("userName", userData.name || "");
        
        return { success: true, message: isLogin || isGoogle ? "✅ Login Successful!" : "✅ Account Created!" };
      } else {
        return { success: false, message: "❌ " + data };
      }
    } catch (error) {
      console.error("Database connection error:", error);
      if (isGoogle) {
         localStorage.setItem("token", "google-firebase-token");
         localStorage.setItem("userEmail", userData.email);
         localStorage.setItem("userName", userData.name);
         return { success: true, message: "✅ Firebase Login Successful (Backend Offline)" };
      }
      return { success: false, message: "❌ Server error. Cannot save to database." };
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setIsLoading(true);
          setMessage("Saving to database...");
          const user = result.user;
          
          const dbResult = await saveUserToDatabase({
             name: user.displayName || "Unknown User",
             email: user.email || "",
             uid: user.uid,
             photoUrl: user.photoURL || "",
             phone: user.phoneNumber || ""
          }, true);

          setMessage(dbResult.message);
          if (dbResult.success) {
            setTimeout(() => { router.push("/dashboard"); }, 1000);
          }
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setMessage(`❌ ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkRedirectResult();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(isLogin ? "Authenticating..." : "Saving to database...");

    if (!isLogin && password !== confirmPassword) {
      setMessage("❌ Password does not match!");
      setIsLoading(false);
      return;
    }

    const payload = isLogin 
      ? { email: emailOrPhone, password }
      : { name, email: emailOrPhone, password, phone: emailOrPhone };

    const dbResult = await saveUserToDatabase(payload, false);
    
    setMessage(dbResult.message);
    
    if (dbResult.success) {
      if (isLogin) {
        setTimeout(() => { router.push("/dashboard"); }, 1000);
      } else {
        setTimeout(() => {
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
          setMessage("");
        }, 2000);
      }
    }
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      setMessage("Redirecting to Google...");
      signInWithRedirect(auth, googleProvider);
    } else {
      alert(`💡 ${provider} er kaj cholche!`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-300/40 to-blue-100/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-indigo-300/30 to-purple-200/10 blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-10 relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] my-8 border border-white">
        <Link href="/" className="absolute top-6 left-6 w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </Link>
        <div className="flex justify-center mb-6 mt-4">
          <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
            <img src="/logo.png" alt="CBC Logo" className="w-full h-full object-contain p-1" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-gray-500 text-sm font-medium">{isLogin ? "Log in to continue" : "Sign up to start"}</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none" required={!isLogin} disabled={isLoading} />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Phone</label>
            <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none pr-12" required disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none" required={!isLogin} disabled={isLoading} />
            </div>
          )}
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? (isLogin ? "Authenticating..." : "Saving...") : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-semibold">{message}</p>}
        <div className="mt-6 text-center text-sm font-medium text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setMessage(""); }} className="text-blue-600 font-bold hover:underline">
            {isLogin ? "Sign up now" : "Log in here"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button type="button" onClick={() => handleSocialLogin("Google")} className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50" disabled={isLoading}>
            <span className="font-semibold text-gray-800 text-sm">Google</span>
          </button>
          <button type="button" onClick={() => handleSocialLogin("Phone (OTP)")} className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50" disabled={isLoading}>
            <span className="font-semibold text-gray-800 text-sm">OTP Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
