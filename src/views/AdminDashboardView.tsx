import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { EduFile, Notice } from "../types";
import {
  ShieldAlert,
  Check,
  X,
  Eye,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Megaphone,
  User,
  XCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface AdminDashboardViewProps {
  onClose: () => void;
  onSelectFile: (file: EduFile) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onClose,
  onSelectFile,
}) => {
  const {
    pendingFiles,
    approveUpload,
    rejectUpload,
    recycleBin,
    restoreFromRecycleBin,
    permanentlyDelete,
    reports,
    deleteFile,
    issueWarning,
    notices,
    addNotice,
    role,
    lang,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pending" | "recycle" | "reports" | "notices">("pending");

  // Rejection modal state
  const [rejectingFileId, setRejectingFileId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [isNoticePinned, setIsNoticePinned] = useState(true);

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingFileId || !rejectReason.trim()) return;

    rejectUpload(rejectingFileId, rejectReason);
    setRejectingFileId(null);
    setRejectReason("");
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDesc.trim()) return;

    addNotice({
      title: noticeTitle,
      titleBn: noticeTitle,
      description: noticeDesc,
      descriptionBn: noticeDesc,
      createdBy: `${role.toUpperCase()} Admin`,
      priority: "high",
      pinned: isNoticePinned,
    });

    setNoticeTitle("");
    setNoticeDesc("");
    alert("Notice published successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg flex items-center space-x-2">
                <span>{lang === "bn" ? "মডারেশন ও এডমিন ড্যাশবোর্ড" : "Moderator & Admin Control Panel"}</span>
              </h2>
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                Active Role: {role.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 flex space-x-2 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === "pending"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>⏳ {lang === "bn" ? "পেন্ডিং আপলোডসমূহ" : "Pending Queue"}</span>
            <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px]">
              {pendingFiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === "reports"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>🚩 {lang === "bn" ? "রিপোর্টসমূহ" : "File Reports"}</span>
            <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px]">
              {reports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("recycle")}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === "recycle"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>🗑️ {lang === "bn" ? "রিসাইকেল বিন" : "Recycle Bin"}</span>
            <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px]">
              {recycleBin.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shrink-0 ${
              activeTab === "notices"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>📢 {lang === "bn" ? "নোটিশ তৈরি" : "Notice Manager"}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* 1. Pending Queue */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                {lang === "bn"
                  ? "অনুমোদনের অপেক্ষায় থাকা কন্ট্রিবিউটর ফাইল"
                  : "Files Pending Review & Approval"}
              </h3>

              {pendingFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  ✓ {lang === "bn" ? "পেন্ডিং লিস্ট ফাঁকা! সকল ফাইল রিভিউ সম্পন্ন হয়েছে।" : "No pending files. All uploads reviewed!"}
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase">
                          {file.levelName} • {file.deptName} • {file.subjectName}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{file.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{file.description}</p>
                        <div className="text-[11px] text-slate-400">
                          Uploaded by: <span className="font-semibold text-slate-800">{file.uploadedByUserName}</span> ({file.uploadDate})
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => onSelectFile(file)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border text-xs font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => approveUpload(file.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectingFileId(file.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rejection Reason Modal */}
          {rejectingFileId && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 w-full max-w-md space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Specify Rejection Reason</h4>
                <p className="text-xs text-slate-500">
                  Provide feedback to the uploader so they can revise and resubmit.
                </p>
                <form onSubmit={handleConfirmReject} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Blurry screenshots, wrong subject category, or incomplete handwritten page notes..."
                    className="w-full rounded-2xl border border-slate-300 p-3 text-xs bg-slate-50"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setRejectingFileId(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 2. File Reports */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">User Reported Content</h3>
              {reports.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No active reports.</div>
              ) : (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Reported File: {rep.fileName}</span>
                        <span className="text-[10px] text-rose-700 uppercase font-extrabold">{rep.type}</span>
                      </div>
                      <p className="text-slate-700">{rep.message}</p>
                      <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Reporter: {rep.reporterName}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => issueWarning(rep.reporterId, "Reviewing report for file")}
                            className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg font-bold text-[10px]"
                          >
                            Warn Uploader
                          </button>
                          <button
                            onClick={() => deleteFile(rep.fileId, `${role.toUpperCase()} Admin`)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Move to Recycle Bin
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Recycle Bin */}
          {activeTab === "recycle" && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Recycle Bin (15 Days Auto-Delete)</h3>
              {recycleBin.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Recycle bin is empty.</div>
              ) : (
                <div className="space-y-3">
                  {recycleBin.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{item.file.title}</span>
                        <span className="text-[10px] text-slate-400">
                          Deleted by: {item.deletedBy} • Expires in {item.daysRemaining} days
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => restoreFromRecycleBin(item.id)}
                          className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-xl"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => permanentlyDelete(item.id)}
                          className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Notice Manager */}
          {activeTab === "notices" && (
            <div className="space-y-5 max-w-xl">
              <h3 className="font-bold text-sm text-slate-900">Post Announcement Banner Notice</h3>

              <form onSubmit={handleCreateNotice} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. HSC 2026 Special Notes Uploaded!"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Description</label>
                  <textarea
                    required
                    rows={3}
                    value={noticeDesc}
                    onChange={(e) => setNoticeDesc(e.target.value)}
                    placeholder="Describe announcement details..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pinNotice"
                    checked={isNoticePinned}
                    onChange={(e) => setIsNoticePinned(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <label htmlFor="pinNotice" className="text-xs font-semibold text-slate-700">
                    Pin notice to top of Home Screen
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition text-xs"
                >
                  Publish Notice Banner
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
