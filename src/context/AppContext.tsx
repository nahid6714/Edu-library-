import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  EduLevel,
  EduFile,
  Notice,
  FileReport,
  UserNotification,
  DownloadedFile,
  RecycleItem,
  Role,
} from "../types";
import {
  initialUserProfile,
  initialEduLevels,
  initialApprovedFiles,
  initialPendingFiles,
  initialNotices,
  initialReports,
} from "../data/mockData";

interface AppContextType {
  // User & Global
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  role: Role;
  setUserRole: (role: Role) => void;
  lang: "bn" | "en";
  setLanguage: (lang: "bn" | "en") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Data Collections
  eduLevels: EduLevel[];
  setEduLevels?: React.Dispatch<React.SetStateAction<EduLevel[]>>;
  approvedFiles: EduFile[];
  pendingFiles: EduFile[];
  downloadedFiles: DownloadedFile[];
  recycleBin: RecycleItem[];
  notices: Notice[];
  reports: FileReport[];
  notifications: UserNotification[];
  favorites: string[]; // file ids

  // Actions
  uploadFile: (fileData: Omit<EduFile, "id" | "uploadDate" | "downloadCount" | "viewCount" | "reportCount" | "status" | "uploadedByUserId" | "uploadedByUserName">) => void;
  approveUpload: (fileId: string) => void;
  rejectUpload: (fileId: string, reason: string) => void;
  deleteFile: (fileId: string, deletedBy: string) => void;
  restoreFromRecycleBin: (recycleId: string) => void;
  permanentlyDelete: (recycleId: string) => void;
  downloadFile: (file: EduFile) => void;
  deleteDownload: (fileId: string) => void;
  clearDownloadCache: () => void;
  reportFile: (fileId: string, type: FileReport["type"], message: string) => void;
  addNotice: (notice: Omit<Notice, "id" | "publishDate">) => void;
  toggleFavorite: (fileId: string) => void;
  issueWarning: (userId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Selected Category Drilldown Filters
  selectedLevelId: string | null;
  setSelectedLevelId: (id: string | null) => void;
  selectedDeptId: string | null;
  setSelectedDeptId: (id: string | null) => void;
  selectedSemesterId: string | null;
  setSelectedSemesterId: (id: string | null) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("edu_user");
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [role, setRoleState] = useState<Role>(user.role || "user");
  const [lang, setLangState] = useState<"bn" | "en">(() => {
    const saved = localStorage.getItem("edu_lang");
    return (saved as "bn" | "en") || "bn"; // Default Bengali
  });
  const [theme, setThemeState] = useState<"light" | "dark">((): "light" | "dark" => {
    const saved = localStorage.getItem("edu_theme");
    return (saved as "light" | "dark") || "light"; // Default Light Mode as requested
  });

  const [eduLevels, setEduLevels] = useState<EduLevel[]>(() => {
    const saved = localStorage.getItem("edu_levels");
    return saved ? JSON.parse(saved) : initialEduLevels;
  });

  const [approvedFiles, setApprovedFiles] = useState<EduFile[]>(() => {
    const saved = localStorage.getItem("edu_approved_files");
    return saved ? JSON.parse(saved) : initialApprovedFiles;
  });

  const [pendingFiles, setPendingFiles] = useState<EduFile[]>(() => {
    const saved = localStorage.getItem("edu_pending_files");
    return saved ? JSON.parse(saved) : initialPendingFiles;
  });

  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>(() => {
    const saved = localStorage.getItem("edu_downloads");
    return saved
      ? JSON.parse(saved)
      : [
          {
            fileId: "file_101",
            fileTitle: "HSC Physics 1st Paper Vector & Dynamics Handwritten Master Note",
            fileType: "pdf",
            fileSize: "4.8 MB",
            downloadDate: "2026-07-29",
            localPath: "/storage/emulated/0/Download/EduLibrary/Vector_Physics_Notes.pdf",
            contentPreview: "CHAPTER 1: VECTORS\nVector Addition, Dot Product A·B = AB cosθ, Cross Product A×B = AB sinθ n̂.\nSample Question 1: Find torque if r = 2i + 3j and F = 5i - 2k...",
            levelName: "HSC",
            subjectName: "Physics 1st Paper",
          },
        ];
  });

  const [recycleBin, setRecycleBin] = useState<RecycleItem[]>(() => {
    const saved = localStorage.getItem("edu_recycle_bin");
    return saved ? JSON.parse(saved) : [];
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem("edu_notices");
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [reports, setReports] = useState<FileReport[]>(() => {
    const saved = localStorage.getItem("edu_reports");
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: "notif_1",
      userId: user.id,
      title: "Welcome to Edu Library!",
      message: "Your account is active. Explore notes, download materials, and share your study files with the community.",
      type: "system",
      read: false,
      date: "2026-08-01 09:00",
    },
  ]);

  const [favorites, setFavorites] = useState<string[]>(["file_101", "file_102"]);

  // Category drilldown state
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Persist storage updates
  useEffect(() => {
    localStorage.setItem("edu_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("edu_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("edu_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("edu_approved_files", JSON.stringify(approvedFiles));
  }, [approvedFiles]);

  useEffect(() => {
    localStorage.setItem("edu_pending_files", JSON.stringify(pendingFiles));
  }, [pendingFiles]);

  useEffect(() => {
    localStorage.setItem("edu_downloads", JSON.stringify(downloadedFiles));
  }, [downloadedFiles]);

  useEffect(() => {
    localStorage.setItem("edu_recycle_bin", JSON.stringify(recycleBin));
  }, [recycleBin]);

  useEffect(() => {
    localStorage.setItem("edu_notices", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem("edu_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("edu_levels", JSON.stringify(eduLevels));
  }, [eduLevels]);

  const setUserRole = (newRole: Role) => {
    setRoleState(newRole);
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  const setLanguage = (newLang: "bn" | "en") => {
    setLangState(newLang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Actions
  const uploadFile: AppContextType["uploadFile"] = (fileData) => {
    const newFile: EduFile = {
      ...fileData,
      id: `file_pend_${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      viewCount: 1,
      reportCount: 0,
      status: "pending",
      uploadedByUserId: user.id,
      uploadedByUserName: user.fullName,
    };

    setPendingFiles((prev) => [newFile, ...prev]);

    // Create confirmation notification for user
    const newNotif: UserNotification = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: "File Submitted for Review",
      message: `Your upload "${fileData.title}" has been submitted to Moderator Review. You will be notified once approved.`,
      type: "notice",
      read: false,
      date: new Date().toLocaleString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Increment user upload counter
    setUser((prev) => ({ ...prev, uploadCount: prev.uploadCount + 1 }));
  };

  const approveUpload = (fileId: string) => {
    const target = pendingFiles.find((f) => f.id === fileId);
    if (!target) return;

    const approvedFile: EduFile = {
      ...target,
      status: "approved",
    };

    setApprovedFiles((prev) => [approvedFile, ...prev]);
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Send approval notification
    const newNotif: UserNotification = {
      id: `notif_${Date.now()}`,
      userId: target.uploadedByUserId,
      title: "🎉 Upload Approved!",
      message: `Your study file "${target.title}" was approved by a moderator and is now live in Edu Library.`,
      type: "approval",
      read: false,
      date: new Date().toLocaleString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const rejectUpload = (fileId: string, reason: string) => {
    const target = pendingFiles.find((f) => f.id === fileId);
    if (!target) return;

    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Send rejection notification
    const newNotif: UserNotification = {
      id: `notif_${Date.now()}`,
      userId: target.uploadedByUserId,
      title: "❌ Upload Review Update",
      message: `Your file "${target.title}" was not approved. Reason: ${reason}. You may edit information and resubmit.`,
      type: "rejection",
      read: false,
      date: new Date().toLocaleString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteFile = (fileId: string, deletedBy: string) => {
    const target = approvedFiles.find((f) => f.id === fileId) || pendingFiles.find((f) => f.id === fileId);
    if (!target) return;

    // Remove from active files
    setApprovedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Add to Recycle Bin with 15-day expiration countdown as per specification
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 15);

    const recycleItem: RecycleItem = {
      id: `rcy_${Date.now()}`,
      file: target,
      deletedBy,
      deleteDate: new Date().toISOString().split("T")[0],
      expiresDate: expiresDate.toISOString().split("T")[0],
      daysRemaining: 15,
    };

    setRecycleBin((prev) => [recycleItem, ...prev]);
  };

  const restoreFromRecycleBin = (recycleId: string) => {
    const target = recycleBin.find((r) => r.id === recycleId);
    if (!target) return;

    setRecycleBin((prev) => prev.filter((r) => r.id !== recycleId));
    setApprovedFiles((prev) => [target.file, ...prev]);
  };

  const permanentlyDelete = (recycleId: string) => {
    setRecycleBin((prev) => prev.filter((r) => r.id !== recycleId));
  };

  const downloadFile = (file: EduFile) => {
    // Check if already downloaded
    const exists = downloadedFiles.some((df) => df.fileId === file.id);

    if (!exists) {
      const newDownload: DownloadedFile = {
        fileId: file.id,
        fileTitle: file.title,
        fileType: file.fileType,
        fileSize: file.fileSize,
        downloadDate: new Date().toISOString().split("T")[0],
        localPath: `/storage/emulated/0/Download/EduLibrary/${file.title.replace(/[^a-zA-Z0-9]/g, "_")}.${file.fileType}`,
        contentPreview: `=== ${file.title} ===\nSubject: ${file.subjectName}\nLevel: ${file.levelName} (${file.deptName})\n\n[SIMULATED STUDY DOCUMENT PREVIEW]\n\nKey Concepts:\n- ${file.description}\n\n1. Formula Summary & Short Notes:\n   - Important Rule 1: Always check dimensions and units.\n   - Important Rule 2: Solve past 5 years board question paper patterns.\n\n2. Solved Exercises:\n   - Question: What are the primary objectives of this topic?\n   - Solution: Understanding fundamentals, applying short techniques, and preparing for board / job exams.`,
        levelName: file.levelName,
        subjectName: file.subjectName,
      };

      setDownloadedFiles((prev) => [newDownload, ...prev]);
    }

    // Increment download count in approved files
    setApprovedFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
    );

    setUser((prev) => ({ ...prev, downloadCount: prev.downloadCount + 1 }));
  };

  const deleteDownload = (fileId: string) => {
    setDownloadedFiles((prev) => prev.filter((df) => df.fileId !== fileId));
  };

  const clearDownloadCache = () => {
    setDownloadedFiles([]);
  };

  const reportFile = (fileId: string, type: FileReport["type"], message: string) => {
    const file = approvedFiles.find((f) => f.id === fileId);
    const newReport: FileReport = {
      id: `rep_${Date.now()}`,
      fileId,
      fileName: file ? file.title : "Unknown File",
      reporterId: user.id,
      reporterName: user.fullName,
      type,
      message,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };

    setReports((prev) => [newReport, ...prev]);

    // Increment file report count
    setApprovedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, reportCount: f.reportCount + 1 } : f))
    );
  };

  const addNotice = (noticeData: Omit<Notice, "id" | "publishDate">) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not_${Date.now()}`,
      publishDate: new Date().toISOString().split("T")[0],
    };

    setNotices((prev) => [newNotice, ...prev]);
  };

  const toggleFavorite = (fileId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(fileId);
      const updated = isFav ? prev.filter((id) => id !== fileId) : [...prev, fileId];
      setUser((u) => ({ ...u, favouriteCount: updated.length }));
      return updated;
    });
  };

  const issueWarning = (userId: string, reason: string) => {
    if (userId === user.id) {
      setUser((prev) => ({
        ...prev,
        warningLevel: Math.min(3, prev.warningLevel + 1),
      }));
    }

    const newNotif: UserNotification = {
      id: `notif_${Date.now()}`,
      userId,
      title: "⚠️ Warning Issued by Moderator",
      message: `You received a community guideline warning: ${reason}. Please follow upload rules to avoid suspension.`,
      type: "warning",
      read: false,
      date: new Date().toLocaleString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        role,
        setUserRole,
        lang,
        setLanguage,
        theme,
        toggleTheme,
        eduLevels,
        setEduLevels,
        approvedFiles,
        pendingFiles,
        downloadedFiles,
        recycleBin,
        notices,
        reports,
        notifications,
        favorites,
        uploadFile,
        approveUpload,
        rejectUpload,
        deleteFile,
        restoreFromRecycleBin,
        permanentlyDelete,
        downloadFile,
        deleteDownload,
        clearDownloadCache,
        reportFile,
        addNotice,
        toggleFavorite,
        issueWarning,
        markNotificationRead,
        clearAllNotifications,
        selectedLevelId,
        setSelectedLevelId,
        selectedDeptId,
        setSelectedDeptId,
        selectedSemesterId,
        setSelectedSemesterId,
        selectedSubjectId,
        setSelectedSubjectId,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
