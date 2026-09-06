import React from "react";
import { useApp } from "../context/AppContext";
import { Megaphone, Pin } from "lucide-react";

interface NoticeBannerProps {
  onNoticeClick?: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ onNoticeClick }) => {
  const { notices, lang, theme } = useApp();

  const activeNotice = notices.find((n) => n.pinned) || notices[0];

  if (!activeNotice) return null;

  const noticeTitle = lang === "bn" ? activeNotice.titleBn || activeNotice.title : activeNotice.title;
  const noticeDesc = lang === "bn" ? activeNotice.descriptionBn || activeNotice.description : activeNotice.description;

  return (
    <div
      onClick={onNoticeClick}
      title={lang === "bn" ? "সকল নোটিশ দেখতে এখানে ক্লিক করুন" : "Click to view all notices"}
      className="flex items-center space-x-2.5 overflow-hidden my-1 py-1 max-w-full cursor-pointer group transition-opacity hover:opacity-95"
    >
      {/* Fixed Notice Label Badge */}
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs sm:text-sm shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200">
        <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
        <span>{lang === "bn" ? "নোটিশ" : "Notice"}</span>
      </div>

      {/* Marquee Ticker Container with Soft Right Edge Gradient Fade */}
      <div
        className="relative flex-1 overflow-hidden whitespace-nowrap pl-1"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black calc(100% - 28px), transparent 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black calc(100% - 28px), transparent 100%)",
        }}
      >
        <div className="inline-block animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
          <span
            className={`inline-flex items-center space-x-2.5 text-base sm:text-lg md:text-xl font-extrabold pr-12 ${
              theme === "dark" ? "text-amber-200" : "text-slate-900"
            }`}
          >
            {activeNotice.pinned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-500 text-slate-950 font-black">
                <Pin className="w-3 h-3 mr-1" />
                {lang === "bn" ? "পিন করা" : "Pinned"}
              </span>
            )}
            <span className={`font-black ${theme === "dark" ? "text-amber-400" : "text-amber-700"}`}>[{activeNotice.publishDate}]</span>
            <span className={`font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{noticeTitle}:</span>
            <span className={theme === "dark" ? "text-slate-200" : "text-slate-800"}>{noticeDesc}</span>
          </span>

          {/* Repeat for continuous loop effect */}
          <span
            className={`inline-flex items-center space-x-2.5 text-base sm:text-lg md:text-xl font-extrabold pr-12 ${
              theme === "dark" ? "text-amber-200" : "text-slate-900"
            }`}
          >
            {activeNotice.pinned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-500 text-slate-950 font-black">
                <Pin className="w-3 h-3 mr-1" />
                {lang === "bn" ? "পিন করা" : "Pinned"}
              </span>
            )}
            <span className={`font-black ${theme === "dark" ? "text-amber-400" : "text-amber-700"}`}>[{activeNotice.publishDate}]</span>
            <span className={`font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{noticeTitle}:</span>
            <span className={theme === "dark" ? "text-slate-200" : "text-slate-800"}>{noticeDesc}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

