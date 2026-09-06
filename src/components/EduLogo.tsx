import React, { useState } from "react";
import logoPng from "../assets/logo.png";
import logoJpg from "../assets/logo.jpg";
import rawNewLogoImg from "../assets/images/edu_library_logo_1788697896446.jpg";

interface EduLogoProps {
  variant?: "full" | "icon" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export const EduLogo: React.FC<EduLogoProps> = ({
  variant = "horizontal",
  size = "md",
  className = "",
  showSubtitle = true,
}) => {
  // Source candidate hierarchy for maximum reliability in Web, PWA and Android WebView
  const sources = [
    logoPng,
    "/logo.png",
    rawNewLogoImg,
    logoJpg,
    "/logo.jpg",
  ].filter(Boolean) as string[];

  const [srcIndex, setSrcIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const imgSizeClass = sizeClasses[size] || sizeClasses.md;

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  // High-fidelity branded SVG graphic fallback matching the official logo
  const renderFallbackSvg = (sizeClass: string) => (
    <div
      className={`${sizeClass} rounded-2xl bg-gradient-to-br from-[#061938] via-[#0d2a58] to-[#0284c7] p-2 shadow-lg flex flex-col items-center justify-center shrink-0 border border-sky-400/40 text-white select-none`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full drop-shadow text-sky-300"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>
  );

  const currentSrc = sources[srcIndex] || "/logo.png";

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {!allFailed ? (
          <img
            src={currentSrc}
            alt="Edu Library Icon"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className={`${imgSizeClass} object-cover rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80 bg-[#071731]`}
          />
        ) : (
          renderFallbackSvg(imgSizeClass)
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative mb-2 shrink-0">
          {!allFailed ? (
            <img
              src={currentSrc}
              alt="Edu Library Logo"
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className={`${sizeClasses.xl} object-cover rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-700 bg-[#071731] p-1`}
            />
          ) : (
            renderFallbackSvg(sizeClasses.xl)
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-1.5">
          <span className="text-[#0d2a58] dark:text-white">Edu</span>
          <span className="text-[#0284c7] dark:text-[#38bdf8]">Library</span>
        </h1>
        {showSubtitle && (
          <p className="text-[11px] font-bold text-slate-500 dark:text-sky-300/90 tracking-widest mt-1 flex items-center space-x-1.5 uppercase">
            <span>LEARN</span>
            <span className="text-sky-500 font-black">•</span>
            <span>EXPLORE</span>
            <span className="text-sky-500 font-black">•</span>
            <span>GROW</span>
          </p>
        )}
      </div>
    );
  }

  // Horizontal variant (Ideal for Header)
  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 shrink-0 ${className}`}>
      <div className="relative shrink-0">
        {!allFailed ? (
          <img
            src={currentSrc}
            alt="Edu Library Logo"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className={`${imgSizeClass} object-cover rounded-xl sm:rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/80 bg-[#071731] p-0.5`}
          />
        ) : (
          renderFallbackSvg(imgSizeClass)
        )}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center space-x-1 text-base sm:text-lg font-black tracking-tight leading-tight">
          <span className="text-[#0d2a58] dark:text-white">Edu</span>
          <span className="text-[#0284c7] dark:text-[#38bdf8]">Library</span>
        </div>
        {showSubtitle && (
          <p className="text-[9px] text-slate-500 dark:text-sky-300/80 font-extrabold tracking-wider uppercase leading-none mt-0.5">
            LEARN • EXPLORE • GROW
          </p>
        )}
      </div>
    </div>
  );
};


