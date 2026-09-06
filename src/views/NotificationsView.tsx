import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Bell,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Megaphone,
  Pin,
  Calendar,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  X,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { Notice, UserNotification } from "../types";

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    notices,
    markNotificationRead,
    clearAllNotifications,
    lang,
    theme,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"notices" | "notifications">("notices");

  // Full Page Detail View State
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedNotif, setSelectedNotif] = useState<UserNotification | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isDark = theme === "dark";

  const handleOpenNotice = (notice: Notice) => {
    setSelectedNotice(notice);
  };

  const handleOpenNotif = (notif: UserNotification) => {
    markNotificationRead(notif.id);
    setSelectedNotif(notif);
  };

  const handleShare = (title: string, desc: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: desc,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${title}\n\n${desc}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // -------------------------------------------------------------
  // FULL PAGE VIEW 1: OFFICIAL NOTICE DETAILS
  // -------------------------------------------------------------
  if (selectedNotice) {
    const title = lang === "bn" ? selectedNotice.titleBn || selectedNotice.title : selectedNotice.title;
    const desc = lang === "bn" ? selectedNotice.descriptionBn || selectedNotice.description : selectedNotice.description;

    return (
      <div className="space-y-4 pb-20 max-w-3xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation Bar with Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedNotice(null)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "bn" ? "সকল নোটিশে ফিরে যান" : "Back to Notices"}</span>
          </button>

          <button
            onClick={() => handleShare(title, desc)}
            className="px-3.5 py-2.5 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-300 hover:bg-sky-500/25 text-xs font-bold transition flex items-center space-x-1.5 border border-sky-500/30"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === "bn" ? "শেয়ার করুন" : "Share"}</span>
          </button>
        </div>

        {/* Full Dedicated Page Card */}
        <div
          className={`rounded-3xl border p-5 sm:p-8 shadow-2xl space-y-6 ${
            isDark ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Header Banner */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-4 translate-y-4">
              <GraduationCap className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-md text-white font-bold border border-white/30">
                  <Megaphone className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  Edu Library Official Notice
                </span>
                {selectedNotice.pinned && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-500 text-slate-950 font-black">
                    <Pin className="w-3.5 h-3.5 mr-1" />
                    {lang === "bn" ? "পিন করা" : "Pinned"}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow ring-2 ring-sky-400/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-sm text-slate-900 dark:text-white flex items-center">
                  <span>{selectedNotice.createdBy}</span>
                  <CheckCircle2 className="w-4 h-4 text-sky-500 ml-1.5 fill-sky-500/20" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {selectedNotice.publishDate}
                </div>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedNotice.priority === "high"
                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                  : "bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30"
              }`}
            >
              {selectedNotice.priority === "high"
                ? lang === "bn" ? "জরুরি" : "High Priority"
                : lang === "bn" ? "সাধারণ" : "General"}
            </span>
          </div>

          {/* Full Notice Content */}
          <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {desc}
          </div>

          {copiedLink && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{lang === "bn" ? "নোটিশ তথ্য কপি করা হয়েছে!" : "Notice details copied!"}</span>
            </div>
          )}

          {/* Bottom Back Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setSelectedNotice(null)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black shadow-lg hover:opacity-90 transition"
            >
              {lang === "bn" ? "বন্ধ করুন এবং ফিরুন" : "Close & Go Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL PAGE VIEW 2: PERSONAL NOTIFICATION DETAILS
  // -------------------------------------------------------------
  if (selectedNotif) {
    return (
      <div className="space-y-4 pb-20 max-w-2xl mx-auto animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedNotif(null)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-black text-xs hover:bg-sky-600 transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "bn" ? "বিজ্ঞপ্তির তালিকায় ফিরুন" : "Back to Notifications"}</span>
        </button>

        <div
          className={`rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6 ${
            isDark ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedNotif.title}
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedNotif.date}
              </span>
            </div>
          </div>

          <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {selectedNotif.message}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setSelectedNotif(null)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md hover:bg-sky-600 transition"
            >
              {lang === "bn" ? "পড়া শেষ (ফিরে যান)" : "Done (Go Back)"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN LIST VIEW (NOTICES & PERSONAL NOTIFICATIONS)
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto">
      {/* Header & Sub-tab Switcher */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 shadow-xl transition-colors duration-200 ${
          isDark
            ? "bg-[#121a2d] border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-base sm:text-xl font-black flex items-center space-x-2 text-slate-900 dark:text-white">
            <Megaphone className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            <span className="truncate">
              {lang === "bn" ? "নোটিশ বোর্ড ও নোটিফিকেশন" : "Notice Board & Notifications"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {lang === "bn"
              ? "অফিসিয়াল নোটিশ ও আপনার অ্যাকাউন্টের গুরুত্বপূর্ণ আপডেট"
              : "Official notices and account moderation updates"}
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab("notices")}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition min-h-[42px] ${
              activeSubTab === "notices"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span className="truncate">{lang === "bn" ? "অফিসিয়াল নোটিশ বোর্ড" : "Notice Board"}</span>
          </button>

          <button
            onClick={() => setActiveSubTab("notifications")}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition min-h-[42px] ${
              activeSubTab === "notifications"
                ? "bg-sky-500 text-white font-black shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span className="truncate">{lang === "bn" ? "ব্যক্তিগত নোটিফিকেশন" : "Notifications"}</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* SUB TAB CONTENT */}
      <div className="min-h-[420px]">
        {/* SUB TAB 1: OFFICIAL NOTICE BOARD (CLEAN MINIMAL LIST) */}
        {activeSubTab === "notices" && (
          <div className="space-y-2.5">
            {notices.length === 0 ? (
              <div
                className={`rounded-2xl border p-10 text-center space-y-3 shadow-xl ${
                  isDark ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <Megaphone className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-base text-slate-800 dark:text-white">
                  {lang === "bn" ? "কোনো নোটিশ প্রকাশ করা হয়নি" : "No Notices Available"}
                </h3>
              </div>
            ) : (
              notices.map((notice) => {
                const title = lang === "bn" ? notice.titleBn || notice.title : notice.title;

                return (
                  <div
                    key={notice.id}
                    onClick={() => handleOpenNotice(notice)}
                    className={`group rounded-2xl border p-3.5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center space-x-3.5 ${
                      notice.pinned
                        ? isDark
                          ? "bg-[#162238] border-amber-500/50 hover:border-amber-400"
                          : "bg-amber-50/90 border-amber-300 hover:border-amber-400"
                        : isDark
                        ? "bg-[#121a2d] border-slate-800 hover:border-slate-700"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Admin Avatar Icon */}
                    <div className="shrink-0 relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Notice Short Info (Concise & Clean) */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className="text-xs font-black text-sky-600 dark:text-sky-400 flex items-center truncate">
                            Edu Library Admin
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 ml-1 inline-block shrink-0 fill-sky-500/20" />
                          </span>
                          {notice.pinned && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-black shrink-0">
                              {lang === "bn" ? "পিন করা" : "Pinned"}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                          {notice.publishDate}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {title}
                      </h3>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SUB TAB 2: PERSONAL NOTIFICATIONS (CLEAN MINIMAL LIST) */}
        {activeSubTab === "notifications" && (
          <div>
            {notifications.length === 0 ? (
              <div
                className={`rounded-2xl border p-10 text-center space-y-3 shadow-xl ${
                  isDark ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <Bell className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  {lang === "bn" ? "কোনো নতুন বিজ্ঞপ্তি নেই" : "No Notifications Found"}
                </h3>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? "আপনার ব্যক্তিগত বিজ্ঞপ্তি" : "Your Notifications"}
                  </span>
                  <button
                    onClick={clearAllNotifications}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-bold transition flex items-center space-x-1 border border-rose-500/30 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "সব মুছুন" : "Clear All"}</span>
                  </button>
                </div>

                {notifications.map((n) => {
                  const getIcon = () => {
                    if (n.type === "approval")
                      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                    if (n.type === "rejection") return <XCircle className="w-4 h-4 text-rose-500" />;
                    if (n.type === "warning")
                      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
                    return <Info className="w-4 h-4 text-sky-500" />;
                  };

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleOpenNotif(n)}
                      className={`group rounded-2xl border p-3.5 shadow-sm hover:shadow-lg transition flex items-center space-x-3.5 cursor-pointer ${
                        n.read
                          ? isDark
                            ? "bg-[#121a2d] border-slate-800 text-slate-300"
                            : "bg-white border-slate-200 text-slate-700"
                          : isDark
                          ? "bg-[#16213a] border-sky-500/40 text-white font-medium"
                          : "bg-sky-50/90 border-sky-300 text-slate-900 font-medium"
                      }`}
                    >
                      <div className="shrink-0 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            n.type === "approval"
                              ? "bg-emerald-500/20"
                              : n.type === "rejection"
                              ? "bg-rose-500/20"
                              : n.type === "warning"
                              ? "bg-amber-500/20"
                              : "bg-sky-500/20"
                          }`}
                        >
                          {getIcon()}
                        </div>
                        {!n.read && (
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-sky-500 transition-colors">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0 ml-1">
                            {n.date}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


