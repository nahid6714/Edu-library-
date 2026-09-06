import React, { useState } from "react";
import logoImg from "../assets/logo.jpg";
import logoPng from "../assets/logo.png";

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
  const [imgFailed, setImgFailed] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const imgSizeClass = sizeClasses[size] || sizeClasses.md;

  // Fallback SVG graphic if custom logo image doesn't load
  const renderFallbackSvg = (sizeClass: string) => (
    <div
      className={`${sizeClass} rounded-xl bg-gradient-to-tr from-[#0d3b66] via-blue-700 to-[#2e9e42] p-1.5 shadow-md flex items-center justify-center shrink-0 border border-sky-400/30 text-white`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>
  );

  const logoSrc = logoPng || logoImg || "/logo.png";

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {!imgFailed ? (
          <img
            src={logoSrc}
            alt="Edu Library Logo"
            onError={() => setImgFailed(true)}
            className={`${imgSizeClass} object-cover rounded-xl shadow-md border border-slate-200/50 dark:border-slate-800/80 bg-white`}
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
        <div className="relative mb-2">
          {!imgFailed ? (
            <img
              src={logoSrc}
              alt="Edu Library Logo"
              onError={() => setImgFailed(true)}
              className={`${sizeClasses.xl} object-cover rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 bg-white`}
            />
          ) : (
            renderFallbackSvg(sizeClasses.xl)
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          <span className="text-[#0d3b66] dark:text-sky-400">Edu </span>
          <span className="text-[#2e9e42] dark:text-emerald-400">Library</span>
        </h1>
        {showSubtitle && (
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
            <span>Learn</span>
            <span className="text-emerald-500 font-bold">•</span>
            <span>Share</span>
            <span className="text-emerald-500 font-bold">•</span>
            <span>Grow</span>
          </p>
        )}
      </div>
    );
  }

  // Horizontal variant (Ideal for Header)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative shrink-0">
        {!imgFailed ? (
          <img
            src={logoSrc}
            alt="Edu Library Logo"
            onError={() => setImgFailed(true)}
            className={`${imgSizeClass} object-cover rounded-xl shadow-md border border-slate-200/60 dark:border-slate-800 bg-white p-0.5`}
          />
        ) : (
          renderFallbackSvg(imgSizeClass)
        )}
      </div>
      <div>
        <div className="flex items-center space-x-1 text-base sm:text-lg font-black tracking-tight leading-none">
          <span className="text-[#0d3b66] dark:text-sky-400">Edu</span>
          <span className="text-[#2e9e42] dark:text-emerald-400">Library</span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] text-slate-500 dark:text-sky-300/80 font-bold tracking-wider uppercase mt-1">
            Learn • Share • Grow
          </p>
        )}
      </div>
    </div>
  );
};


