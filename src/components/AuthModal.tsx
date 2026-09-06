import React, { useState } from "react";
import { X, Mail, Lock, User, LogIn, UserPlus, LogOut, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { EduLogo } from "./EduLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, lang, theme } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      if (!email || !password || (isSignUp && !fullName)) {
        setError(lang === "bn" ? "সকল তথ্য সঠিকভাবে পূরণ করুন।" : "Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (password.length < 4) {
        setError(lang === "bn" ? "পাসওয়ার্ড অন্তত ৪ টি অক্ষরের হতে হবে।" : "Password must be at least 4 characters.");
        setLoading(false);
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        fullName: isSignUp ? fullName : email.split("@")[0] || "Student User",
        email: email,
        role: "user" as const,
        points: 100,
        uploadCount: 0,
        downloadCount: 0,
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };

      setUser(newUser);
      localStorage.setItem("edu_user", JSON.stringify(newUser));
      setSuccess(lang === "bn" ? "সফলভাবে লগইন হয়েছে!" : "Logged in successfully!");
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 600);
    }, 400);
  };

  const handleDemoStudentLogin = () => {
    const demoUser = {
      id: "usr_demo_101",
      fullName: lang === "bn" ? "মোঃ নাহিদ ইসলাম (শিক্ষার্থী)" : "Md. Nahid Islam (Student)",
      email: "nahid@edulibrary.org",
      role: "user" as const,
      points: 250,
      uploadCount: 3,
      downloadCount: 12,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    };
    setUser(demoUser);
    localStorage.setItem("edu_user", JSON.stringify(demoUser));
    onClose();
  };

  const handleSignOut = () => {
    const guestUser = {
      id: "usr_guest",
      fullName: lang === "bn" ? "মেহমান শিক্ষার্থী" : "Guest Student",
      email: "guest@edulibrary.org",
      role: "user" as const,
      points: 50,
      uploadCount: 0,
      downloadCount: 0,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    };
    setUser(guestUser);
    localStorage.setItem("edu_user", JSON.stringify(guestUser));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-5">
          <EduLogo variant="full" size="lg" className="mx-auto my-2" />
          <h2 className="text-lg font-black">
            {user.email !== "guest@edulibrary.org" && user.email !== ""
              ? lang === "bn"
                ? "আমার অ্যাকাউন্ট"
                : "My Account"
              : isSignUp
              ? lang === "bn"
                ? "নতুন অ্যাকাউন্ট তৈরি করুন"
                : "Create New Account"
              : lang === "bn"
              ? "অ্যাকাউন্টে প্রবেশ করুন"
              : "Sign In to Edu Library"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === "bn"
              ? "শিক্ষা উপকরণ ডাউনলোড এবং শেয়ার করতে আপনার অ্যাকাউন্ট ব্যবহার করুন"
              : "Manage notes, downloads, and upload study materials"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {user.email !== "guest@edulibrary.org" && user.email !== "" ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <p className="font-bold text-sky-600 dark:text-sky-400">{user.fullName}</p>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === "bn" ? "অ্যাকাউন্ট সক্রিয় রয়েছে" : "Account Active"}</span>
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold text-xs transition flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === "bn" ? "লগআউট করুন" : "Sign Out"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleDemoStudentLogin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{lang === "bn" ? "ইনস্ট্যান্ট ডেমো স্টুডেন্ট লগইন" : "Instant Student Login"}</span>
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-[#121a2d] text-[10px] text-slate-400 font-bold tracking-wider">
                {lang === "bn" ? "অথবা ইমেইল দিয়ে সাইন ইন" : "OR Sign In with Email"}
              </span>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {lang === "bn" ? "পূর্ণ নাম *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Md. Tanvir Ahmed"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {lang === "bn" ? "ইমেইল অ্যাড্রেস *" : "Email Address *"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {lang === "bn" ? "পাসওয়ার্ড *" : "Password *"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                {isSignUp ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                <span>
                  {loading
                    ? "Processing..."
                    : isSignUp
                    ? lang === "bn"
                      ? "ইমেইল দিয়ে রেজিস্টার"
                      : "Register Account"
                    : lang === "bn"
                    ? "ইমেইল দিয়ে সাইন ইন"
                    : "Sign In"}
                </span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline"
                >
                  {isSignUp
                    ? lang === "bn"
                      ? "ইতিমধ্যেই অ্যাকাউন্ট আছে? সাইন ইন করুন"
                      : "Already have an account? Sign In"
                    : lang === "bn"
                    ? "নতুন ইউজার? রেজিস্ট্রেশন করুন"
                    : "Don't have an account? Register"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
