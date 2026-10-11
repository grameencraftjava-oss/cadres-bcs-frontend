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
      const response = `https://cadres-bcs-backend.onrender.com${endpoint}`;
      const res = await fetch(response, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.text();

      if (res.ok && data.includes("Success")) {
        const tokenString = data.split("Token: ")[1];
        const actualToken = tokenString ? tokenString.split(" Role:")[0].trim() : "auth-token";
        
        localStorage.setItem("token", actualToken);
        localStorage.setItem("userEmail", emailOrPhone);
        
        setMessage("Success! Redirecting to dashboard...");
        setTimeout(() => { 
            window.location.href = "/dashboard"; 
        }, 1000);
      } else {
        setMessage("Failed: " + data);
      }
    } catch (error) {
      setMessage("Server is waking up (Cold Start). Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {message && (
          <div className="p-3 mb-4 text-sm font-semibold rounded-lg text-center bg-blue-100 text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Raiyan Khan Joy" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="••••••••" />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="••••••••" />
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

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
