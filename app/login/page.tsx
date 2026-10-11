"use client";
import { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(isLogin ? "Authenticating..." : "Creating account...");

    if (!isLogin && password !== confirmPassword) {
      setMessage("Password does not match!");
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    const payload = isLogin 
      ? { email: emailOrPhone, password } 
      : { name, email: emailOrPhone, password, phone: "" };

    try {
      const response = await fetch(`https://cadres-bcs-backend.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.text();

      if (response.ok && data.includes("Success")) {
        // টোকেন সেভ করা
        const tokenString = data.split("Token: ")[1];
        const actualToken = tokenString ? tokenString.split(" Role:")[0].trim() : "auth-token";
        
        localStorage.setItem("token", actualToken);
        localStorage.setItem("userEmail", emailOrPhone);
        
        setMessage("Success! Redirecting to dashboard...");
        
        // Next.js এর router cache এড়াতে হার্ড রিডাইরেক্ট করা হচ্ছে
        setTimeout(() => { 
            window.location.href = "/dashboard"; 
        }, 1000);
      } else {
        setMessage("Failed: " + data);
      }
    } catch (error) {
      setMessage("Server is waking up (Cold Start). Please try again in 30 seconds!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     setMessage("Google Firebase auth will trigger this. Connect Firebase logic here.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {message && (
          <div className={`p-3 mb-4 text-sm font-semibold rounded-lg text-center ${message.includes("Success") ? "bg-green-100 text-green-700" : (message.includes("Cold Start") ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Raiyan Khan Joy" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
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
