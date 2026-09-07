import React, { useState, useEffect, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { NoticeBanner } from "./components/NoticeBanner";
import { HomeView } from "./views/HomeView";
import { DownloadsView } from "./views/DownloadsView";
import { UploadView } from "./views/UploadView";
import { NotificationsView } from "./views/NotificationsView";
import { ProfileView } from "./views/ProfileView";
import { FileDetailsModal } from "./components/FileDetailsModal";
import { PdfViewerModal } from "./components/PdfViewerModal";
import { AiDocumentScannerModal } from "./components/AiDocumentScannerModal";
import { AiStudyAssistantModal } from "./components/AiStudyAssistantModal";
import { AuthModal } from "./components/AuthModal";
import { AppUpdateModal } from "./components/AppUpdateModal";
import { AppUpdateBanner } from "./components/AppUpdateBanner";
import { EduFile, AppUpdateInfo } from "./types";
import { checkAppUpdate, isUpdateDismissed } from "./services/updateService";

import {
  Home,
  FileText,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Sparkles,
  FileScan,
  MessageCircle,
} from "lucide-react";

function MainApp() {
  const {
    lang,
    notifications,
    theme,
    selectedLevelId,
    setSelectedLevelId,
    selectedDeptId,
    setSelectedDeptId,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedSubjectId,
    setSelectedSubjectId,
  } = useApp();

  // Active Bottom Tab State
  const [activeTab, setActiveTab] = useState<"home" | "downloads" | "upload" | "notifications" | "profile">("home");

  // Active Selected File for Details Modal
  const [selectedFile, setSelectedFile] = useState<EduFile | null>(null);

  // Active Selected File for PDF Reader Modal
  const [pdfReaderFile, setPdfReaderFile] = useState<EduFile | null>(null);

  // Gemini Modals & Auth Modal
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // In-App Auto Update State
  const [appUpdateInfo, setAppUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Virtual Keyboard & Viewport Shift Prevention on Mobile
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleViewport = () => {
      if (window.visualViewport) {
        const diff = window.innerHeight - window.visualViewport.height;
        setIsKeyboardOpen(diff > 140);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        if (window.innerWidth <= 768) {
          setIsKeyboardOpen(true);
        }
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewport);
    }
    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewport);
      }
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Double Back Press Exit Confirmation State
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressRef = useRef<number>(0);

  // Auto-check GitHub for updates on app start
  useEffect(() => {
    checkAppUpdate().then((info) => {
      if (info && info.hasUpdate) {
        setAppUpdateInfo(info);
        // If not dismissed within last 24h, show prompt
        if (!isUpdateDismissed(info.latestVersion)) {
          const timer = setTimeout(() => {
            setIsUpdateModalOpen(true);
          }, 1200);
          return () => clearTimeout(timer);
        }
      }
    });
  }, []);

  // History & Hardware Back Button Handler
  const isPopstateRef = useRef(false);
  const ignoreNextPopstateRef = useRef(false);
  const prevDepthRef = useRef(0);

  // Calculate navigation depth for browser history management
  const calculateDepth = () => {
    let depth = 0;
    if (activeTab !== "home") depth += 1;
    if (selectedLevelId) depth += 1;
    if (selectedDeptId) depth += 1;
    if (selectedSemesterId) depth += 1;
    if (selectedSubjectId) depth += 1;
    if (pdfReaderFile || selectedFile || isAiScannerOpen || isAiChatOpen || isAiMenuOpen || isAuthModalOpen || isUpdateModalOpen) depth += 1;
    return depth;
  };

  const currentDepth = calculateDepth();

  // Listen to popstate (Hardware / Browser back button)
  useEffect(() => {
    const handlePopState = () => {
      if (ignoreNextPopstateRef.current) {
        ignoreNextPopstateRef.current = false;
        return;
      }

      isPopstateRef.current = true;

      if (isUpdateModalOpen) {
        setIsUpdateModalOpen(false);
      } else if (pdfReaderFile) {
        setPdfReaderFile(null);
      } else if (selectedFile) {
        setSelectedFile(null);
      } else if (isAiScannerOpen) {
        setIsAiScannerOpen(false);
      } else if (isAiChatOpen) {
        setIsAiChatOpen(false);
      } else if (isAiMenuOpen) {
        setIsAiMenuOpen(false);
      } else if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
      } else if (selectedSubjectId) {
        setSelectedSubjectId(null);
      } else if (selectedSemesterId) {
        setSelectedSemesterId(null);
      } else if (selectedDeptId) {
        setSelectedDeptId(null);
      } else if (selectedLevelId) {
        setSelectedLevelId(null);
      } else if (activeTab !== "home") {
        setActiveTab("home");
      } else {
        // We are at root home (Depth 0) -> Double back button exit confirmation
        const now = Date.now();
        if (now - lastBackPressRef.current < 2500) {
          // Second back press within 2.5s: allow exit
        } else {
          lastBackPressRef.current = now;
          setShowExitToast(true);
          // Push history guard so browser/app doesn't close on first press
          window.history.pushState({ exitGuard: true }, "");
          setTimeout(() => {
            setShowExitToast(false);
          }, 2500);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    isUpdateModalOpen,
    pdfReaderFile,
    selectedFile,
    isAiScannerOpen,
    isAiChatOpen,
    isAiMenuOpen,
    isAuthModalOpen,
    selectedSubjectId,
    selectedSemesterId,
    selectedDeptId,
    selectedLevelId,
    activeTab,
    setSelectedSubjectId,
    setSelectedSemesterId,
    setSelectedDeptId,
    setSelectedLevelId,
  ]);


  // Sync History Stack with Depth Changes
  useEffect(() => {
    if (isPopstateRef.current) {
      isPopstateRef.current = false;
      prevDepthRef.current = currentDepth;
      return;
    }

    if (currentDepth > prevDepthRef.current) {
      const pushCount = currentDepth - prevDepthRef.current;
      for (let i = 0; i < pushCount; i++) {
        window.history.pushState({ depth: currentDepth }, "");
      }
    } else if (currentDepth < prevDepthRef.current) {
      const backCount = prevDepthRef.current - currentDepth;
      ignoreNextPopstateRef.current = true;
      window.history.go(-backCount);
    }

    prevDepthRef.current = currentDepth;
  }, [currentDepth]);

  // Always scroll smoothly to top when switching main tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-20 selection:bg-blue-500 selection:text-white transition-colors duration-200 ${
        theme === "dark" ? "bg-[#0a0f1d] text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      
      {/* Top Header */}
      <Header
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogoClick={() => {
          setActiveTab("home");
          setSelectedLevelId(null);
          setSelectedDeptId(null);
          setSelectedSemesterId(null);
          setSelectedSubjectId(null);
        }}
      />

      {/* In-App Auto Update Banner from GitHub Releases */}
      {appUpdateInfo && appUpdateInfo.hasUpdate && !isBannerDismissed && (
        <AppUpdateBanner
          updateInfo={appUpdateInfo}
          onOpenModal={() => setIsUpdateModalOpen(true)}
          onDismiss={() => setIsBannerDismissed(true)}
        />
      )}

      {/* Prominent Notice Banner placed at the top of the app */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        <NoticeBanner
          onNoticeClick={() => {
            setActiveTab("notifications");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pt-1 min-h-[70vh] safe-area-bottom-content">
        {activeTab === "home" && (
          <HomeView
            onSelectFile={(f) => setSelectedFile(f)}
          />
        )}

        {activeTab === "downloads" && (
          <DownloadsView onOpenPdfReader={(f) => setPdfReaderFile(f)} />
        )}

        {activeTab === "upload" && <UploadView />}

        {activeTab === "notifications" && <NotificationsView />}

        {activeTab === "profile" && (
          <ProfileView
            onOpenPdfReader={(f) => setPdfReaderFile(f)}
            onOpenUpdateModal={(update) => {
              setAppUpdateInfo(update);
              setIsUpdateModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <FileDetailsModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onOpenPdfReader={(f) => setPdfReaderFile(f)}
      />

      <PdfViewerModal
        file={pdfReaderFile}
        onClose={() => setPdfReaderFile(null)}
      />

      <AiDocumentScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
      />

      <AiStudyAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* In-App Auto Update Modal */}
      <AppUpdateModal
        updateInfo={appUpdateInfo}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />


      {/* Floating AI Assistant Button — opens a small chooser for the two AI features */}
      <div className="fixed right-4 bottom-24 z-40 flex flex-col items-end gap-2">
        {isAiMenuOpen && (
          <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => {
                setIsAiMenuOpen(false);
                setIsAiChatOpen(true);
              }}
              className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
            >
              <span>{lang === "bn" ? "এআই স্টাডি অ্যাসিস্ট্যান্ট" : "AI Study Assistant"}</span>
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => {
                setIsAiMenuOpen(false);
                setIsAiScannerOpen(true);
              }}
              className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
            >
              <span>{lang === "bn" ? "ডকুমেন্ট স্ক্যানার" : "Document Scanner"}</span>
              <FileScan className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsAiMenuOpen((prev) => !prev)}
          aria-label={lang === "bn" ? "এআই ফিচার মেনু" : "AI features menu"}
          className={`w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center border-2 border-emerald-400/40 transition-transform ${
            isAiMenuOpen ? "rotate-45" : ""
          }`}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Double Back Press Exit Toast */}
      {showExitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white dark:bg-white/95 dark:text-slate-950 px-5 py-3 rounded-full text-xs font-black shadow-2xl backdrop-blur-md flex items-center space-x-2 border border-slate-700 dark:border-slate-300 animate-bounce transition-all">
          <LogOut className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {lang === "bn"
              ? "অ্যাপ থেকে বের হতে পুনরায় ব্যাক প্রেস করুন"
              : "Press back button again to exit app"}
          </span>
        </div>
      )}

      {/* Bottom 5-Tab Navigation Bar */}
      <nav
        id="bottom-navigation-bar"
        className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t transition-all duration-200 safe-area-bottom gpu-stabilized ${
          isKeyboardOpen ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100 shadow-2xl"
        } ${
          theme === "dark"
            ? "bg-[#0d1322]/95 border-slate-800/90 text-slate-400"
            : "bg-white/95 border-slate-200 text-slate-600 shadow-lg"
        }`}
        style={{
          bottom: 0,
          willChange: "transform",
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2 select-none">
          
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center w-16 py-1 transition ${
              activeTab === "home"
                ? "text-sky-500 font-bold"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">
              {lang === "bn" ? "হোম" : "Home"}
            </span>
          </button>

          {/* 2. Library / Exams */}
          <button
            onClick={() => setActiveTab("downloads")}
            className={`flex flex-col items-center justify-center w-16 py-1 transition ${
              activeTab === "downloads"
                ? "text-sky-500 font-bold"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">
              {lang === "bn" ? "লাইব্রেরি" : "Library"}
            </span>
          </button>

          {/* 3. Upload Center */}
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex flex-col items-center justify-center w-16 py-1 transition ${
              activeTab === "upload"
                ? "text-sky-500 font-bold"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg mb-0.5 transition border border-blue-400/40">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px]">
              {lang === "bn" ? "আপলোড" : "Upload"}
            </span>
          </button>

          {/* 4. Notifications */}
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-col items-center justify-center w-16 py-1 transition relative ${
              activeTab === "notifications"
                ? "text-sky-500 font-bold"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5 mb-0.5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </div>
            <span className="text-[10px]">
              {lang === "bn" ? "বিজ্ঞপ্তি" : "Notifs"}
            </span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center w-16 py-1 transition ${
              activeTab === "profile"
                ? "text-sky-500 font-bold"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">
              {lang === "bn" ? "প্রোফাইল" : "Profile"}
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

