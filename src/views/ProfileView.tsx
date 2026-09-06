import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Role, EduFile, AppUpdateInfo } from "../types";
import { EduLogo } from "../components/EduLogo";
import {
  CURRENT_APP_VERSION,
  getStoredGithubRepo,
  setStoredGithubRepo,
  checkAppUpdate,
} from "../services/updateService";
import {
  Shield,
  Upload,
  Download,
  Star,
  Globe,
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
  Sun,
  Moon,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Edit2,
  Check,
  Smartphone,
} from "lucide-react";

interface ProfileViewProps {
  onOpenPdfReader: (file: EduFile) => void;
  onOpenUpdateModal?: (update: AppUpdateInfo) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenPdfReader,
  onOpenUpdateModal,
}) => {
  const {
    user,
    setUser,
    role,
    setUserRole,
    lang,
    setLanguage,
    theme,
    toggleTheme,
    recycleBin,
    restoreFromRecycleBin,
    permanentlyDelete,
    favorites,
  } = useApp();

  const [showRecycleBinModal, setShowRecycleBinModal] = useState(false);
  const [photoSavedToast, setPhotoSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // App Update State in Profile
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [checkStatusMsg, setCheckStatusMsg] = useState<string | null>(null);
  const [checkStatusType, setCheckStatusType] = useState<"success" | "update" | "error">("success");
  const [isEditingRepo, setIsEditingRepo] = useState(false);
  const [repoInput, setRepoInput] = useState(getStoredGithubRepo());

  const handleSaveRepo = () => {
    if (repoInput.trim()) {
      setStoredGithubRepo(repoInput.trim());
      setIsEditingRepo(false);
      setCheckStatusMsg(
        lang === "bn"
          ? "GitHub রিপোজিটরি সফলভাবে সেভ করা হয়েছে।"
          : "GitHub repository saved successfully."
      );
      setCheckStatusType("success");
      setTimeout(() => setCheckStatusMsg(null), 3000);
    }
  };

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setCheckStatusMsg(null);
    try {
      const update = await checkAppUpdate(getStoredGithubRepo(), true);
      setIsCheckingUpdate(false);
      if (update.hasUpdate) {
        setCheckStatusMsg(
          lang === "bn"
            ? `নতুন ভার্সন (${update.latestVersion}) প্রকাশিত হয়েছে!`
            : `New version (${update.latestVersion}) is available!`
        );
        setCheckStatusType("update");
        if (onOpenUpdateModal) {
          onOpenUpdateModal(update);
        }
      } else {
        setCheckStatusMsg(
          lang === "bn"
            ? `অভিনন্দন! আপনি সর্বশেষ ভার্সন (v${CURRENT_APP_VERSION}) ব্যবহার করছেন।`
            : `You are using the latest version (v${CURRENT_APP_VERSION})!`
        );
        setCheckStatusType("success");
        setTimeout(() => setCheckStatusMsg(null), 5000);
      }
    } catch {
      setIsCheckingUpdate(false);
      setCheckStatusMsg(
        lang === "bn"
          ? "আপডেট চেক করা সম্ভব হয়নি। রিপোজিটরি নাম ও ইন্টারনেট চেক করুন।"
          : "Could not check for updates. Check repo name & internet."
      );
      setCheckStatusType("error");
    }
  };

  const handleTestUpdatePreview = () => {
    if (onOpenUpdateModal) {
      onOpenUpdateModal({
        hasUpdate: true,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: "v1.1.0",
        releaseTitle: "Edu Library v1.1.0 (Auto APK Release)",
        releaseNotes:
          lang === "bn"
            ? "✨ নতুন বৈশিষ্ট্য:\n• স্বয়ংক্রিয় এপিকে রিলিজ সিস্টেম\n• অ্যাপের মধ্যে সরাসরি অটো-আপডেট অপশন\n• উন্নত পারফরম্যান্স ও দ্রুত ফাইল ওপেনিং\n• ডার্ক মোড এবং রিসাইকেল বিন ফিক্স"
            : "✨ What's New:\n• Automatic APK Release System\n• In-app auto update notifications\n• Improved performance & faster PDF opening\n• Dark mode & recycle bin enhancements",
        apkDownloadUrl: `https://github.com/${getStoredGithubRepo()}/releases`,
        publishedAt: new Date().toISOString(),
        htmlUrl: `https://github.com/${getStoredGithubRepo()}/releases`,
      });
    }
  };


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === "bn" ? "ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।" : "Image size must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Photo = reader.result as string;
        const updatedUser = { ...user, photoUrl: base64Photo };
        setUser(updatedUser);
        localStorage.setItem("edu_user", JSON.stringify(updatedUser));
        setPhotoSavedToast(true);
        setTimeout(() => setPhotoSavedToast(false), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      
      {photoSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {lang === "bn"
                ? "প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে এবং আপনার ডিভাইসে সেভ করা হয়েছে!"
                : "Profile photo updated and saved locally on your device!"}
            </span>
          </div>
          <button onClick={() => setPhotoSavedToast(false)}>
            <X className="w-4 h-4 text-emerald-500" />
          </button>
        </div>
      )}

      {/* Hidden file input for custom profile photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header Card */}
      <div className={`rounded-2xl border p-6 shadow-xl space-y-5 text-center sm:text-left sm:flex sm:items-center sm:space-x-5 sm:space-y-0 ${
        theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
      }`}>
        
        {/* Photo Avatar with Camera upload button */}
        <div className="relative mx-auto sm:mx-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-sky-500 shadow-lg group shrink-0">
          <img
            src={user.photoUrl}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-bold space-y-1"
            title={lang === "bn" ? "নিজের ছবি পরিবর্তন করুন" : "Change Profile Photo"}
          >
            <Camera className="w-5 h-5 text-sky-400" />
            <span>{lang === "bn" ? "ছবি নির্বাচন" : "Change"}</span>
          </button>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start space-x-2 flex-wrap gap-y-1">
            <h2 className={`text-xl font-extrabold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {user.fullName}
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30"
            >
              {lang === "bn" ? "শিক্ষার্থী" : "Student"}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {user.email} • {user.educationLevel || "Honours"} ({user.department || "English Literature"})
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic max-w-md">
            "{user.bio}"
          </p>

          <div className="pt-1 flex items-center justify-center sm:justify-start space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-bold transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "নিজের ছবি পরিবর্তন করুন (ডিভাইসে সেভ হবে)" : "Upload Photo (Saved Locally)"}</span>
            </button>
          </div>

          {/* Warning status badge if warning level > 0 */}
          {user.warningLevel > 0 && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Warning Level: {user.warningLevel}/3</span>
            </div>
          )}
        </div>

      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className={`rounded-2xl border p-4 shadow-lg ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Upload className="w-5 h-5 text-sky-500 mx-auto mb-1" />
          <span className={`text-lg font-extrabold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {user.uploadCount}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {lang === "bn" ? "জমাকৃত আপলোড" : "Uploads"}
          </span>
        </div>

        <div className={`rounded-2xl border p-4 shadow-lg ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Download className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <span className={`text-lg font-extrabold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {user.downloadCount}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {lang === "bn" ? "ডাউনলোড সংখ্যা" : "Downloads"}
          </span>
        </div>

        <div className={`rounded-2xl border p-4 shadow-lg ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <span className={`text-lg font-extrabold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {favorites.length}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {lang === "bn" ? "ফেভারিট নোটস" : "Favorites"}
          </span>
        </div>
      </div>

      {/* Settings & Recycle Bin Actions */}
      <div className={`rounded-2xl border p-5 shadow-xl space-y-3 ${
        theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <h3 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          {lang === "bn" ? "অতিরিক্ত অপশন ও টুলস" : "Settings & Utilities"}
        </h3>

        <div className="space-y-2">
          
          {/* Recycle Bin Modal Trigger */}
          <button
            onClick={() => setShowRecycleBinModal(true)}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition ${
              theme === "dark"
                ? "bg-[#0a0f1d] hover:bg-slate-800 border-slate-800 text-slate-200"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>{lang === "bn" ? "রিসাইকেল বিন (১৫ দিন মেয়াদ)" : "Recycle Bin (15 Days Grace Period)"}</span>
            </div>
            <span className="bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md text-[10px]">
              {recycleBin.length} items
            </span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition ${
              theme === "dark"
                ? "bg-[#0a0f1d] hover:bg-slate-800 border-slate-800 text-slate-200"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{lang === "bn" ? "অ্যাপ থিম (Theme)" : "App Theme"}</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                theme === "dark"
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                  : "bg-amber-500/10 text-amber-700 border-amber-500/30"
              }`}
            >
              {theme === "dark"
                ? lang === "bn"
                  ? "ডার্ক মোড 🌙"
                  : "Dark Mode 🌙"
                : lang === "bn"
                ? "লাইট মোড ☀️"
                : "Light Mode ☀️"}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(lang === "bn" ? "en" : "bn")}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition ${
              theme === "dark"
                ? "bg-[#0a0f1d] hover:bg-slate-800 border-slate-800 text-slate-200"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>{lang === "bn" ? "ভাষা পরিবর্তন করুন" : "Switch Language"}</span>
            </div>
            <span className="bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
              {lang === "bn" ? "বাংলা (BN)" : "English (EN)"}
            </span>
          </button>

          {/* GitHub Auto Updates & Version Control Card */}
          <div
            id="github-app-updates-card"
            className={`p-4 rounded-xl border space-y-3 ${
              theme === "dark" ? "bg-[#0a0f1d] border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <EduLogo variant="icon" size="md" />
                <div>
                  <span className="font-bold text-xs block">
                    {lang === "bn" ? "Edu Library অ্যাপ সংস্করণ ও অটো আপডেট" : "Edu Library App & Auto Updates"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {lang === "bn" ? "অফিসিয়াল রিলিজ ও আইকন" : "Official Release & Icon"}
                  </span>
                </div>
              </div>
              <span className="bg-sky-500/10 text-sky-500 border border-sky-500/30 px-2.5 py-0.5 rounded-md text-[10px] font-black">
                v{CURRENT_APP_VERSION}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span>{lang === "bn" ? "GitHub রিপোজিটরি:" : "GitHub Repository:"}</span>
                {isEditingRepo ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      placeholder="username/repository"
                      className="px-2 py-1 text-[11px] rounded-lg border border-sky-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-44"
                    />
                    <button
                      onClick={handleSaveRepo}
                      className="p-1 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-[10px] font-bold"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingRepo(false)}
                      className="p-1 bg-slate-400 text-white rounded-md text-[10px]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 font-mono text-[10px] text-sky-500">
                    <span className="bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/20">
                      {getStoredGithubRepo()}
                    </span>
                    <button
                      onClick={() => {
                        setRepoInput(getStoredGithubRepo());
                        setIsEditingRepo(true);
                      }}
                      className="p-1 rounded hover:bg-sky-500/10 text-sky-500 transition"
                      title={lang === "bn" ? "রিপোজিটরি পরিবর্তন করুন" : "Edit repository"}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                {lang === "bn"
                  ? "স্ট্যাটিক version.json এবং গিটহাব রিলিজের মাধ্যমে চেক করা হয়। কোনো API Limit শেষ হওয়ার ঝুঁকি নেই, কোটি ব্যবহারকারীও আনলিমিটেড সময়ে রিয়েল-টাইম আপডেট পাবেন।"
                  : "Checked via static version.json and GitHub Releases. No API rate-limit restrictions—unlimited real-time updates for all users."}
              </p>
            </div>

            {/* Check update status message */}
            {checkStatusMsg && (
              <div
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-fade-in ${
                  checkStatusType === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : checkStatusType === "update"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}
              >
                {checkStatusType === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                {checkStatusType === "update" && <Sparkles className="w-4 h-4 shrink-0" />}
                {checkStatusType === "error" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{checkStatusMsg}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <button
                id="btn-check-update-manual"
                onClick={handleManualCheckUpdate}
                disabled={isCheckingUpdate}
                className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? "animate-spin" : ""}`} />
                <span>
                  {isCheckingUpdate
                    ? lang === "bn"
                      ? "চেক করা হচ্ছে..."
                      : "Checking..."
                    : lang === "bn"
                    ? "নতুন আপডেট চেক করুন"
                    : "Check for Updates"}
                </span>
              </button>

              <button
                id="btn-test-update-preview"
                onClick={handleTestUpdatePreview}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  theme === "dark"
                    ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
                title={lang === "bn" ? "আপডেট ডায়ালগ কেমন দেখাবে টেস্ট করুন" : "Preview how update modal looks"}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "bn" ? "টেস্ট প্রিভিউ" : "Test Preview"}</span>
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Recycle Bin Modal */}
      {showRecycleBinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className={`w-full max-w-xl rounded-2xl shadow-2xl border p-5 space-y-4 max-h-[85vh] overflow-y-auto ${
            theme === "dark" ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${
              theme === "dark" ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">
                  {lang === "bn" ? "রিসাইকেল বিন (Recycle Bin)" : "Recycle Bin Manager"}
                </h3>
              </div>
              <button
                onClick={() => setShowRecycleBinModal(false)}
                className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === "bn"
                ? "মুছে ফেলা ফাইলগুলো ১৫ দিন রিসাইকেল বিনে থাকে। চাইলে রিস্টোর করা যাবে বা স্থায়ীভাবে ডিলিট করা যাবে।"
                : "Deleted files stay in the recycle bin for 15 days before permanent deletion."}
            </p>

            {recycleBin.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                {lang === "bn" ? "রিসাইকেল বিন ফাঁকা।" : "Recycle bin is empty."}
              </div>
            ) : (
              <div className="space-y-3">
                {recycleBin.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between flex-wrap gap-2 text-xs ${
                      theme === "dark" ? "bg-[#0a0f1d] border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <span className={`font-bold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                        {item.file.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Deleted by {item.deletedBy} • Expires in {item.daysRemaining} days
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => restoreFromRecycleBin(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>

                      <button
                        onClick={() => permanentlyDelete(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

