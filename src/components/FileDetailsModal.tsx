import React, { useState } from "react";
import { EduFile } from "../types";
import { useApp } from "../context/AppContext";
import {
  X,
  Download,
  Flag,
  FileText,
  UserCheck,
  Calendar,
  Eye,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface FileDetailsModalProps {
  file: EduFile | null;
  onClose: () => void;
  onOpenPdfReader: (file: EduFile) => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  file,
  onClose,
  onOpenPdfReader,
}) => {
  const { downloadFile, reportFile, lang, theme } = useApp();

  const [activeScreenshot, setActiveScreenshot] = useState<number>(0);
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const [reportType, setReportType] = useState<"copyright" | "inappropriate" | "broken" | "wrong_category" | "other">("copyright");
  const [reportMsg, setReportMsg] = useState<string>("");
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [zoomLightbox, setZoomLightbox] = useState<string | null>(null);

  if (!file) return null;

  const isDark = theme === "dark";

  const handleDownload = () => {
    downloadFile(file);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMsg) return;
    reportFile(file.id, reportType, reportMsg);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportForm(false);
      setReportSubmitted(false);
      setReportMsg("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[90vh] flex flex-col ${
        isDark ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white p-4 sm:p-5 flex items-start justify-between shadow-md">
          <div>
            <div className="text-xs font-semibold text-emerald-100 flex items-center space-x-1.5 mb-1">
              <span>{file.levelName}</span>
              <span>•</span>
              <span>{file.deptName}</span>
              <span>•</span>
              <span>{file.subjectName}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold pr-6 line-clamp-2">
              {file.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Screenshot Gallery */}
          {file.screenshots && file.screenshots.length > 0 && (
            <div className="space-y-3">
              <p className={`text-xs font-bold uppercase tracking-wider flex items-center ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <Eye className="w-4 h-4 mr-1 text-sky-500" />
                {lang === "bn" ? "ফাইলের স্যাম্পল পেজ প্রিভিউ" : "Screenshot Page Previews"}
              </p>
              
              {/* Main Active Screenshot */}
              <div
                onClick={() => setZoomLightbox(file.screenshots[activeScreenshot])}
                className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border border-slate-700/60 cursor-pointer group shadow-inner"
              >
                <img
                  src={file.screenshots[activeScreenshot]}
                  alt="Screenshot Preview"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 text-white text-xs font-bold">
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>{lang === "bn" ? "বড় করে দেখতে ক্লিক করুন" : "Click to view full size"}</span>
                </div>
              </div>

              {/* Thumbnails list */}
              {file.screenshots.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {file.screenshots.map((shot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenshot(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        activeScreenshot === idx
                          ? "border-sky-500 ring-2 ring-sky-500/30"
                          : isDark ? "border-slate-800 opacity-60 hover:opacity-100" : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={shot}
                        alt={`Thumb ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description & Summary */}
          <div className={`rounded-2xl p-4 border space-y-3 ${
            isDark ? "bg-[#0b1220] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold flex items-center ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                <FileText className="w-4 h-4 mr-1.5 text-sky-500" />
                {lang === "bn" ? "ফাইলের বিস্তারিত বিবরণ" : "Description & Summary"}
              </h3>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              {file.description}
            </p>

            {/* Meta statistics & info */}
            <div className={`pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
              isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-600"
            }`}>
              <div>
                <span className="text-[10px] block opacity-70">
                  {lang === "bn" ? "আপলোড করেছেন" : "Uploaded By"}
                </span>
                <span className={`font-semibold flex items-center ${isDark ? "text-white" : "text-slate-900"}`}>
                  <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  {file.uploadedByUserName}
                </span>
              </div>

              <div>
                <span className="text-[10px] block opacity-70">
                  {lang === "bn" ? "তারিখ" : "Upload Date"}
                </span>
                <span className={`font-semibold flex items-center ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {file.uploadDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] block opacity-70">
                  {lang === "bn" ? "ফাইল সাইজ" : "File Size"}
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{file.fileSize}</span>
              </div>

              <div>
                <span className="text-[10px] block opacity-70">
                  {lang === "bn" ? "স্ট্যাটাস" : "Status"}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  {lang === "bn" ? "অনলাইন ভেরিফাইড" : "Verified & Live"}
                </span>
              </div>
            </div>
          </div>

          {/* Report Modal Section */}
          {showReportForm && (
            <div className={`border rounded-2xl p-4 text-xs space-y-3 ${
              isDark ? "bg-rose-950/20 border-rose-900/50 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-900"
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-rose-500" />
                  {lang === "bn" ? "ফাইলটি রিপোর্ট করুন" : "Report Inappropriate File"}
                </span>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-rose-500 hover:underline"
                >
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
              </div>

              {reportSubmitted ? (
                <p className="text-emerald-600 dark:text-emerald-400 font-bold py-2">
                  ✓ {lang === "bn" ? "আপনার রিপোর্ট জমা হয়েছে। মডারেটর খতিয়ে দেখবে।" : "Report submitted to moderators."}
                </p>
              ) : (
                <form onSubmit={handleSendReport} className="space-y-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      {lang === "bn" ? "রিপোর্টের কারণ" : "Reason"}
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className={`w-full rounded-xl border p-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                        isDark ? "bg-slate-900 border-rose-800/80 text-white" : "bg-white border-rose-300 text-slate-800"
                      }`}
                    >
                      <option value="copyright">Copyright Issue / Piracy</option>
                      <option value="inappropriate">Inappropriate / Non-Educational Content</option>
                      <option value="broken">Corrupted / Unreadable PDF</option>
                      <option value="wrong_category">Wrong Category / Subject</option>
                      <option value="other">Other Reason</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      value={reportMsg}
                      onChange={(e) => setReportMsg(e.target.value)}
                      placeholder={
                        lang === "bn"
                          ? "বিস্তারিত লিখুন কীভাবে ফাইলটি অসামঞ্জস্যপূর্ণ..."
                          : "Describe the issue..."
                      }
                      rows={2}
                      className={`w-full rounded-xl border p-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                        isDark ? "bg-slate-900 border-rose-800/80 text-white" : "bg-white border-rose-300 text-slate-800"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition"
                  >
                    {lang === "bn" ? "রিপোর্ট জমা দিন" : "Submit Report"}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? "bg-[#0b1220] border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              isDark
                ? "bg-slate-800/60 hover:bg-rose-950/30 text-rose-400 border-rose-900/40"
                : "bg-white hover:bg-rose-50 text-rose-600 border-rose-200"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "রিপোর্ট করুন" : "Report File"}</span>
          </button>

          <div className="flex items-center space-x-2">
            
            {/* Open Reader Simulation Button */}
            <button
              onClick={() => {
                onClose();
                onOpenPdfReader(file);
              }}
              className={`flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                isDark
                  ? "bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/30"
                  : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>{lang === "bn" ? "সরাসরি পড়ুন" : "Open Reader"}</span>
            </button>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{lang === "bn" ? "ফাইল ডাউনলোড করুন" : "Download File"}</span>
            </button>

          </div>
        </div>

      </div>

      {/* Lightbox Modal for Large Preview */}
      {zoomLightbox && (
        <div
          onClick={() => setZoomLightbox(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setZoomLightbox(null)}
              className="absolute -top-10 right-0 text-white hover:text-rose-400 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomLightbox}
              alt="Zoomed Screenshot"
              className="max-h-[85vh] w-auto object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
