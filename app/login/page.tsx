export default function Login() {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-blue-700">Cadre&apos;s BCS</h1>
            <p className="text-gray-500 mt-2 font-medium">আপনার অ্যাকাউন্টে সাইন-ইন করুন</p>
          </div>

          <form className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
              <input
                  type="email"
                  placeholder="admin@cadrescompass.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড</label>
              <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800"
              />
            </div>
            <button
                type="button"
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
  );
}