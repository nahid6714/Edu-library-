import React from "react";
import { useApp } from "../context/AppContext";
import { AppUpdateInfo } from "../types";
import { Sparkles, Download, X, ArrowRight } from "lucide-react";

interface AppUpdateBannerProps {
  updateInfo: AppUpdateInfo | null;
  onOpenModal: () => void;
  onDismiss: () => void;
}

export const AppUpdateBanner: React.FC<AppUpdateBannerProps> = ({
  updateInfo,
  onOpenModal,
  onDismiss,
}) => {
  const { lang, theme } = useApp();

  if (!updateInfo || !updateInfo.hasUpdate) return null;

  return (
    <div
      id="inapp-update-banner"
      className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-md animate-fade-in"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="font-semibold">
            {lang === "bn"
              ? `Edu Library-এর নতুন ভার্সন (${updateInfo.latestVersion}) প্রকাশিত হয়েছে!`
              : `A new version of Edu Library (${updateInfo.latestVersion}) is available!`}
          </span>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={onOpenModal}
            className="px-3 py-1 rounded-lg bg-white text-blue-700 hover:bg-blue-50 active:scale-95 font-bold text-[11px] shadow-sm flex items-center space-x-1 transition cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>{lang === "bn" ? "আপডেট করুন" : "Update Now"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onDismiss}
            className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
