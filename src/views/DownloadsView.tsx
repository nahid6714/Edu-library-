import React from "react";
import { useApp } from "../context/AppContext";
import { EduFile } from "../types";
import {
  Download,
  Trash2,
  BookOpen,
  HardDrive,
  FileText,
} from "lucide-react";

interface DownloadsViewProps {
  onOpenPdfReader: (file: EduFile) => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({ onOpenPdfReader }) => {
  const { downloadedFiles, deleteDownload, clearDownloadCache, approvedFiles, lang, theme } = useApp();

  // Estimate total size
  const totalMb = downloadedFiles.reduce((acc, df) => {
    const val = parseFloat(df.fileSize) || 2.5;
    return acc + val;
  }, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Storage Card */}
      <div className={`rounded-2xl border p-5 shadow-xl space-y-4 ${
        theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className={`text-lg font-extrabold flex items-center ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              <Download className="w-5 h-5 mr-2 text-sky-500" />
              {lang === "bn" ? "ডাউনলোডকৃত ফাইলসমূহ" : "Downloaded Files & Storage"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === "bn"
                ? "আপনার ডিভাইসে লোকাল স্টোরেজে সংরক্ষিত নোটস"
                : "Files downloaded to local app storage"}
            </p>
          </div>

          {downloadedFiles.length > 0 && (
            <button
              onClick={clearDownloadCache}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-bold transition flex items-center space-x-1.5 border border-rose-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ক্যাশে খালি করুন" : "Clear Cache"}</span>
            </button>
          )}
        </div>

        {/* Storage Bar Indicator */}
        <div className={`rounded-xl p-4 border space-y-2 ${
          theme === "dark" ? "bg-[#0a0f1d] border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={`flex items-center ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
              <HardDrive className="w-4 h-4 mr-1.5 text-sky-500" />
              {lang === "bn" ? "অ্যাপ মেমোরি ব্যবহার" : "App Memory Usage"}
            </span>
            <span className="text-sky-500">{totalMb.toFixed(1)} MB / 500 MB</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalMb / 500) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Downloads List */}
      {downloadedFiles.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center space-y-3 shadow-xl ${
          theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Download className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className={`font-bold text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {lang === "bn" ? "কোনো ডাউনলোড করা ফাইল নেই" : "No Downloaded Files Yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {lang === "bn"
              ? "হোম স্ক্রিন থেকে পছন্দের যেকোনো নোটস সরাসরি ডাউনলোড করে অফলাইনে দেখতে পারবেন।"
              : "Download notes from the Home screen to access them offline anytime."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloadedFiles.map((df) => {
            // Match with approved files or generate fallback EduFile
            const matchedFile: EduFile = approvedFiles.find((f) => f.id === df.fileId) || {
              id: df.fileId,
              title: df.fileTitle,
              description: df.contentPreview,
              fileUrl: df.localPath,
              fileType: df.fileType,
              fileSize: df.fileSize,
              levelId: "lvl_hsc",
              levelName: df.levelName || "HSC",
              deptId: "dept_sci",
              deptName: "Science",
              semesterId: "sem_1",
              semesterName: "1st Year",
              subjectId: "sbj_1",
              subjectName: df.subjectName || "General",
              tags: ["Downloaded", "Offline"],
              screenshots: [],
              uploadedByUserId: "usr_system",
              uploadedByUserName: "Verified Uploader",
              uploadDate: df.downloadDate,
              downloadCount: 1,
              viewCount: 1,
              reportCount: 0,
              status: "approved",
              version: "v1.0",
            };

            return (
              <div
                key={df.fileId}
                className={`rounded-2xl border p-4 shadow-lg flex items-center justify-between flex-wrap gap-3 transition ${
                  theme === "dark"
                    ? "bg-[#121a2d] border-slate-800/90 hover:border-sky-500/40"
                    : "bg-white border-slate-200 hover:border-sky-400"
                }`}
              >
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                      {df.levelName} • {df.subjectName}
                    </div>
                    <h4 className={`font-bold text-sm truncate ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      {df.fileTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Downloaded: {df.downloadDate} • {df.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onOpenPdfReader(matchedFile)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-md"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "পড়ুন" : "Open Reader"}</span>
                  </button>

                  <button
                    onClick={() => deleteDownload(df.fileId)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition border border-slate-200 dark:border-slate-700"
                    title="Delete Downloaded File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

