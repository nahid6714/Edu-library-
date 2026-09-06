import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { AppUpdateInfo } from "../types";
import { dismissUpdate } from "../services/updateService";
import {
  DownloadCloud,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface AppUpdateModalProps {
  updateInfo: AppUpdateInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  updateInfo,
  isOpen,
  onClose,
}) => {
  const { lang, theme } = useApp();
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  if (!isOpen || !updateInfo) return null;

  const handleDownload = () => {
    setDownloadInitiated(true);
    // Trigger download
    if (updateInfo.apkDownloadUrl) {
      const link = document.createElement("a");
      link.href = updateInfo.apkDownloadUrl;
      link.setAttribute("download", "EduLibrary-latest.apk");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDismiss = () => {
    dismissUpdate(updateInfo.latestVersion);
    onClose();
  };

  return (
    <div
      id="app-update-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        id="app-update-modal-card"
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden transition-all transform scale-100 ${
          theme === "dark"
            ? "bg-[#121a2d] border-sky-900/50 text-slate-100"
            : "bg-white border-sky-100 text-slate-900"
        }`}
      >
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  {lang === "bn" ? "নতুন ভার্সন" : "New Version"}
                </span>
                <span className="text-xs text-sky-100 opacity-90">
                  {new Date(updateInfo.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-0.5">
                {lang === "bn" ? "অ্যাপের নতুন আপডেট উপলব্ধ!" : "New App Update Available!"}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Version Comparison Card */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-xl border ${
              theme === "dark"
                ? "bg-[#0a0f1d] border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                {lang === "bn" ? "আপনার বর্তমান ভার্সন" : "Current Version"}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                v{updateInfo.currentVersion}
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 font-black text-xs">
              ➔
            </div>

            <div className="text-right">
              <span className="text-[11px] text-sky-500 block font-medium">
                {lang === "bn" ? "নতুন আপডেট ভার্সন" : "Latest Update"}
              </span>
              <span className="text-sm font-extrabold text-sky-500">
                {updateInfo.latestVersion}
              </span>
            </div>
          </div>

          {/* Release Notes */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <span>{lang === "bn" ? "এই আপডেটে নতুন কী আছে:" : "What's New in this update:"}</span>
            </h4>
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans ${
                theme === "dark"
                  ? "bg-[#0a0f1d] border-slate-800/80 text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {updateInfo.releaseNotes ||
                (lang === "bn"
                  ? "নতুন ফিচার সংযোজন, কর্মক্ষমতা বৃদ্ধি এবং বাগের সমাধান করা হয়েছে।"
                  : "New feature additions, performance improvements, and bug fixes.")}
            </div>
          </div>

          {/* Download notice alert */}
          {downloadInitiated ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {lang === "bn"
                  ? "ডাউনলোড শুরু হয়েছে! ডাউনলোড সম্পন্ন হলে নোটিফিকেশন বার থেকে ফাইলটি ওপেন করে ইনস্টল করুন।"
                  : "Download initiated! Open the file from your notifications bar once finished to install."}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {lang === "bn"
                  ? "সরাসরি GitHub Releases থেকে নিরাপদ এবং অফিশিয়াল APK।"
                  : "Safe, official APK directly from GitHub Releases."}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              id="btn-update-now"
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>
                {lang === "bn"
                  ? "এখনই ডাউনলোড ও আপডেট করুন (APK)"
                  : "Download & Install Update (APK)"}
              </span>
            </button>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleDismiss}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1 transition ${
                  theme === "dark"
                    ? "border-slate-800 hover:bg-slate-800 text-slate-400"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "পরে মনে করিয়ে দিন" : "Remind Me Later"}</span>
              </button>

              <a
                href={updateInfo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1 transition ${
                  theme === "dark"
                    ? "border-slate-800 hover:bg-slate-800 text-sky-400"
                    : "border-slate-200 hover:bg-slate-100 text-sky-600"
                }`}
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
