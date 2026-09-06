import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { EduFile } from "../types";
import {
  Upload,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FilePlus,
  Smartphone,
  HardDrive,
  Layers,
  Building2,
  GraduationCap,
  BookOpen,
  ChevronRight,
  Folder,
  Sparkles,
  Check,
  Award,
  X,
  RotateCcw,
  Maximize2,
  FileText,
  Plus,
  Image as ImageIcon,
  Eye,
  AlertCircle,
} from "lucide-react";

export const UploadView: React.FC = () => {
  const {
    eduLevels,
    uploadFile,
    pendingFiles,
    approvedFiles,
    user,
    lang,
    theme,
  } = useApp();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [levelId, setLevelId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tags, setTags] = useState("Handwritten, FormulaSheet, BoardQuestions");
  const [fileType, setFileType] = useState<EduFile["fileType"]>("pdf");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const activeLevel = eduLevels.find((l) => l.id === levelId);
  const activeDept = activeLevel?.departments?.find((d) => d.id === deptId);

  const activeSemesters = activeDept?.semesters || [];
  const activeSemesterObj = activeSemesters.find((s) => s.id === semesterId);

  const availableSubjects = activeDept?.subjects
    ? semesterId && semesterId !== "ALL"
      ? activeDept.subjects.filter((s) => s.semesterId === semesterId)
      : activeDept.subjects
    : [];

  const activeSubjectObj =
    availableSubjects.find((s) => s.id === subjectId) ||
    activeDept?.subjects?.find((s) => s.id === subjectId);

  const handleSelectLevel = (lId: string) => {
    setLevelId(lId);
    setDeptId("");
    setSemesterId("");
    setSubjectId("");
  };

  const handleSelectDept = (dId: string) => {
    setDeptId(dId);
    setSemesterId("");
    setSubjectId("");
  };

  const handleSelectSemester = (sId: string) => {
    setSemesterId(sId);
    setSubjectId("");
  };

  const handleSelectSubject = (sbjId: string) => {
    setSubjectId(sbjId);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setScreenshots((prev) => {
              if (prev.length >= 5) return prev;
              return [...prev, ev.target!.result as string];
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    e.target.value = "";
  };

  const handleRemoveScreenshot = (idx: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError(lang === "bn" ? "দয়া করে ফাইলের একটি স্পষ্ট শিরোনাম লিখুন।" : "Please enter a clear file title.");
      return;
    }

    if (!activeLevel) {
      setFormError(lang === "bn" ? "দয়া করে শিক্ষার স্তর (Level) নির্বাচন করুন।" : "Please select an educational level.");
      return;
    }

    if (!activeDept) {
      setFormError(lang === "bn" ? "দয়া করে বিভাগ (Department) নির্বাচন করুন।" : "Please select a department.");
      return;
    }

    if (!description.trim()) {
      setFormError(lang === "bn" ? "দয়া করে ফাইলের বিস্তারিত বিবরণ লিখুন।" : "Please provide a brief description.");
      return;
    }

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const targetSubject = activeDept?.subjects?.find((s) => s.id === subjectId) || activeDept?.subjects?.[0];

    uploadFile({
      title: title.trim(),
      description: description.trim(),
      fileUrl: "#uploaded-document",
      fileType,
      fileSize: "3.5 MB",
      levelId: activeLevel.id,
      levelName: activeLevel.code,
      deptId: activeDept.id,
      deptName: activeDept.name,
      semesterId: semesterId || "ALL",
      semesterName: activeSemesterObj ? activeSemesterObj.name : "All Semesters",
      subjectId: targetSubject ? targetSubject.id : "sbj_gen",
      subjectName: targetSubject ? targetSubject.name : "General",
      tags: parsedTags.length > 0 ? parsedTags : ["Notes", activeLevel.code],
      screenshots,
      version: "v1.0",
    });

    setSubmittedSuccess(true);
    setTitle("");
    setDescription("");
    setScreenshots([]);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  // User's own uploads (Pending & Approved)
  const myPending = pendingFiles.filter((f) => f.uploadedByUserId === user.id);
  const myApproved = approvedFiles.filter((f) => f.uploadedByUserId === user.id);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      
      {/* Moderation & P2P Metadata Notice */}
      <div className={`rounded-2xl p-4 border flex items-start space-x-3 shadow-lg ${
        theme === "dark"
          ? "bg-amber-500/10 border-amber-500/30"
          : "bg-amber-50 border-amber-300"
      }`}>
        <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h3 className={`font-bold text-sm ${theme === "dark" ? "text-amber-300" : "text-amber-900"}`}>
            {lang === "bn" ? "P2P ফাইল শেয়ারিং ও মেটাডাটা রেজিস্ট্রি নীতি" : "P2P File Sharing & Metadata Registry Notice"}
          </h3>
          <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
            {lang === "bn"
              ? "মেইন সার্ভারে সরাসরি মূল ফাইল আপলোড হয় না। এখানে শুধু ফাইলের মেটাডাটা (বিভাগ, সেকশন, বিষয়, হ্যাশ কি ও বিবরণ) ডিরেক্টরিতে রেজিস্টার করা হয়। যখন অন্য কোন শিক্ষার্থী এটি ডাউনলোড করবে, তখন সরাসরি ফাইলটি আপনার বা অন্যান্য অনলাইন সিডার ডিভাইসের অ্যাপ থেকে P2P ট্রান্সফারের মাধ্যমে ডাউনলোড হবে।"
              : "Heavy files are not uploaded to central servers. Only file metadata (Department, Section, Subject, Info Hash & Details) is registered. Downloads occur directly P2P from seeder student devices."}
          </p>
        </div>
      </div>

      {/* Upload Submission Form */}
      <div className={`rounded-2xl border p-5 sm:p-7 shadow-xl space-y-5 ${
        theme === "dark" ? "bg-[#121a2d] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className={`flex items-center space-x-2 border-b pb-3 ${
          theme === "dark" ? "border-slate-800" : "border-slate-200"
        }`}>
          <FilePlus className="w-5 h-5 text-sky-500" />
          <h2 className={`font-bold text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {lang === "bn" ? "নতুন শিক্ষাসামগ্রী আপলোড করুন" : "Upload New Study Material"}
          </h2>
        </div>

        {formError && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {submittedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-pulse">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              {lang === "bn"
                ? "✓ আপনার ফাইলটি সফলভাবে জমা হয়েছে এবং মডারেশন প্যান্ডিংয়ে যুক্ত হয়েছে!"
                : "✓ Upload submitted successfully and added to moderator review queue!"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title Input */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
              {lang === "bn" ? "ফাইলের শিরোনাম / টাইটেল *" : "File Title *"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "যেমন: এইচএসসি পদার্থবিজ্ঞান ১ম পত্র ভেক্টর ও গতিবিদ্যা মাস্টার নোট"
                  : "e.g. HSC Physics Vector Chapter Master Handwritten Notes"
              }
              className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                theme === "dark"
                  ? "border-slate-700 bg-[#0a0f1d] text-white"
                  : "border-slate-300 bg-slate-50 text-slate-900"
              }`}
            />
          </div>

          {/* CASCADING FORM DROPDOWNS FOR CATEGORY SELECTION */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <span>{lang === "bn" ? "ক্যাটাগরি নির্বাচন করুন" : "Category Selection"}</span>
                </h3>
              </div>

              {(levelId || deptId || semesterId || subjectId) && (
                <button
                  type="button"
                  onClick={() => {
                    setLevelId("");
                    setDeptId("");
                    setSemesterId("");
                    setSubjectId("");
                  }}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 flex items-center space-x-1 hover:bg-rose-500/20 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === "bn" ? "পুনরায় সিলেক্ট" : "Reset"}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Education Level Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span>১. {lang === "bn" ? "শিক্ষা স্তর (Education Level)" : "1. Education Level"}</span>
                </label>
                <select
                  value={levelId}
                  onChange={(e) => handleSelectLevel(e.target.value)}
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    theme === "dark"
                      ? "border-slate-700 bg-[#0a0f1d] text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  <option value="">
                    {lang === "bn" ? "-- শিক্ষা স্তর সিলেক্ট করুন --" : "-- Select Education Level --"}
                  </option>
                  {eduLevels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lang === "bn" ? lvl.nameBn : lvl.name} ({lvl.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Department / Group Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>২. {lang === "bn" ? "বিভাগ / গ্রুপ (Department / Group)" : "2. Department / Group"}</span>
                </label>
                <select
                  value={deptId}
                  onChange={(e) => handleSelectDept(e.target.value)}
                  disabled={!levelId}
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === "dark"
                      ? "border-slate-700 bg-[#0a0f1d] text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  {!levelId ? (
                    <option value="">
                      {lang === "bn" ? "-- প্রথমে শিক্ষা স্তর সিলেক্ট করুন --" : "-- Select Education Level First --"}
                    </option>
                  ) : (
                    <>
                      <option value="">
                        {lang === "bn" ? "-- বিভাগ / গ্রুপ সিলেক্ট করুন --" : "-- Select Department / Group --"}
                      </option>
                      {activeLevel?.departments?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {lang === "bn" ? d.nameBn : d.name} ({d.code})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* 3. Year / Semester Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>৩. {lang === "bn" ? "বর্ষ / সেমিস্টার (Year / Semester)" : "3. Year / Semester"}</span>
                </label>
                <select
                  value={semesterId}
                  onChange={(e) => handleSelectSemester(e.target.value)}
                  disabled={!deptId}
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === "dark"
                      ? "border-slate-700 bg-[#0a0f1d] text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  {!deptId ? (
                    <option value="">
                      {lang === "bn" ? "-- প্রথমে বিভাগ সিলেক্ট করুন --" : "-- Select Department First --"}
                    </option>
                  ) : (
                    <>
                      <option value="">
                        {lang === "bn" ? "-- বর্ষ / সেমিস্টার সিলেক্ট করুন --" : "-- Select Year / Semester --"}
                      </option>
                      <option value="ALL">
                        {lang === "bn" ? "সকল বর্ষ / সাধারণ (All Years)" : "All Years / General"}
                      </option>
                      {activeDept?.semesters?.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {lang === "bn" ? sem.nameBn : sem.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* 4. Subject Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span>৪. {lang === "bn" ? "বিষয় (Subject)" : "4. Subject"}</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  disabled={!semesterId}
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === "dark"
                      ? "border-slate-700 bg-[#0a0f1d] text-white"
                      : "border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  {!semesterId ? (
                    <option value="">
                      {lang === "bn" ? "-- প্রথমে বর্ষ সিলেক্ট করুন --" : "-- Select Semester First --"}
                    </option>
                  ) : (
                    <>
                      <option value="">
                        {lang === "bn" ? "-- বিষয় সিলেক্ট করুন --" : "-- Select Subject --"}
                      </option>
                      {availableSubjects?.map((sbj) => (
                        <option key={sbj.id} value={sbj.id}>
                          {lang === "bn" ? sbj.nameBn : sbj.name} ({sbj.code})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Active Selection Summary Banner if selected */}
            {subjectId && activeSubjectObj && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-fadeIn text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span>
                    {lang === "bn"
                      ? `ক্যাটাগরি প্রস্তুত: ${activeLevel ? (lang === "bn" ? activeLevel.nameBn : activeLevel.name) : ""} → ${activeDept ? (lang === "bn" ? activeDept.nameBn : activeDept.name) : ""} → ${activeSubjectObj ? (lang === "bn" ? activeSubjectObj.nameBn : activeSubjectObj.name) : ""}`
                      : `Category ready: ${activeLevel?.name} → ${activeDept?.name} → ${activeSubjectObj?.name}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* File Format & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === "bn" ? "ফাইল ফরম্যাট" : "File Format"}
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                  theme === "dark"
                    ? "border-slate-700 bg-[#0a0f1d] text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="word">Word Document (.docx)</option>
                <option value="ppt">PowerPoint (.pptx)</option>
                <option value="image">Educational Image (.png / .jpg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === "bn" ? "ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)" : "Tags (Comma separated)"}
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. HSC2026, Physics, Vector, Handwritten"
                className={`w-full rounded-xl border p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                  theme === "dark"
                    ? "border-slate-700 bg-[#0a0f1d] text-white"
                    : "border-slate-300 bg-slate-50 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
              {lang === "bn" ? "বিস্তারিত বিবরণ *" : "Description & Summary *"}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "ফাইলটিতে কী কী অধ্যায়, সূত্র বা বোর্ডের প্রশ্ন সমাধান আছে সংক্ষেপে লিখুন..."
                  : "Describe what formulas, past questions or chapters are included..."
              }
              className={`w-full rounded-xl border p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                theme === "dark"
                  ? "border-slate-700 bg-[#0a0f1d] text-white"
                  : "border-slate-300 bg-slate-50 text-slate-900"
              }`}
            />
          </div>

          {/* Main File Upload Box */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span>{lang === "bn" ? "মূল ফাইল নির্বাচন করুন (PDF / Word / Zip)" : "Select Main File (PDF / Word / Zip)"}</span>
            </label>

            <div className="border-2 border-dashed border-sky-500/40 rounded-xl p-4 text-center space-y-1.5 hover:bg-sky-500/5 transition cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const docName = f.name.replace(/\.[^/.]+$/, "");
                    setTitle(docName);
                  }
                }}
              />
              <HardDrive className="w-7 h-7 text-sky-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {lang === "bn" ? "মোবাইল মেমোরি থেকে ফাইল ব্রাউজ করতে এখানে ক্লিক করুন" : "Click to select main file from mobile memory"}
              </p>
              <p className="text-[10px] font-mono text-sky-600 dark:text-sky-400">
                storage/emulated/0/Download/{title ? `${title}.pdf` : "filename.pdf"}
              </p>
            </div>
          </div>

          {/* Screenshot Upload Block (Direct Mobile / Gallery Upload) */}
          <div className={`space-y-3.5 p-4 rounded-2xl border ${
            theme === "dark" 
              ? "border-slate-800 bg-[#0a0f1d]" 
              : "border-slate-200 bg-slate-50"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  <span>
                    {lang === "bn"
                      ? "ফাইলের পেজ স্ক্রিনশট / ছবি (১ থেকে ৫ টি)"
                      : "Document Screenshots or Photos (1 to 5)"}
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === "bn"
                    ? "আপনার পিডিএফ বা ওয়ার্ড ফাইলের পৃষ্ঠাগুলোর স্ক্রিনশট বা মোবাইল ক্যামেরা থেকে তোলা ছবি সিলেক্ট করুন।"
                    : "Upload screenshots or photos of your PDF/Word document pages directly from your device."}
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30 shrink-0">
                {screenshots.length} / 5
              </span>
            </div>

            {/* Upload Button Box */}
            {screenshots.length < 5 && (
              <label className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer space-y-1.5">
                <Upload className="w-6 h-6 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {lang === "bn"
                    ? "মোবাইল গ্যালারি থেকে স্ক্রিনশট ছবি নির্বাচন করুন"
                    : "Select Screenshot Photos from Phone Gallery"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {lang === "bn"
                    ? "একসাথে একাধিক ছবির ফাইল সিলেক্ট করা যাবে (.jpg, .png)"
                    : "Multiple image files can be selected at once (.jpg, .png)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleCustomImageUpload}
                />
              </label>
            )}

            {/* Empty State warning if 0 */}
            {screenshots.length === 0 && (
              <div className="p-3 text-center text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-500/10 rounded-xl border border-amber-500/20">
                ⚠️ {lang === "bn" ? "কমপক্ষে ১ টি পেজের স্ক্রিনশট আপলোড করা আবশ্যক।" : "At least 1 page screenshot is required."}
              </div>
            )}

            {/* Screenshot Thumbnail Grid */}
            {screenshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                {screenshots.map((shot, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group shadow-md hover:border-sky-500 transition flex flex-col"
                  >
                    <div className="bg-sky-500/10 dark:bg-sky-950/90 text-sky-700 dark:text-sky-300 text-[10px] font-black px-2 py-1 border-b border-sky-500/20 flex items-center justify-between">
                      <span>{lang === "bn" ? `স্ক্রিনশট #${idx + 1}` : `Screenshot #${idx + 1}`}</span>
                    </div>

                    <div
                      className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden cursor-pointer"
                      onClick={() => setPreviewModalImg(shot)}
                    >
                      <img
                        src={shot}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col items-center justify-center text-white space-y-1 p-2 text-center">
                        <Eye className="w-5 h-5 text-sky-400" />
                        <span className="text-[10px] font-bold">{lang === "bn" ? "বড় করে দেখুন" : "View Image"}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveScreenshot(idx);
                      }}
                      className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1 shadow-lg transition z-10"
                      title={lang === "bn" ? "মুছে ফেলুন" : "Remove"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add More Button if < 5 */}
                {screenshots.length < 5 && (
                  <label className="rounded-xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 flex flex-col items-center justify-center p-3 text-emerald-600 dark:text-emerald-400 transition min-h-[130px] space-y-1 cursor-pointer">
                    <Plus className="w-5 h-5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-center leading-snug">
                      {lang === "bn" ? "+ আরও ছবি যোগ" : "+ Add More"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleCustomImageUpload}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === "bn" ? "রিভিউয়ের জন্য জমা দিন" : "Submit for Moderator Review"}</span>
          </button>
        </form>
      </div>

      {/* User's Upload Status Tracker */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl space-y-4 ${
        theme === "dark" ? "bg-[#121a2d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <h3 className={`font-bold text-base flex items-center ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>
          <Clock className="w-5 h-5 mr-2 text-amber-400" />
          {lang === "bn" ? "আমার জমাকৃত আপলোড স্ট্যাটাস" : "My Upload Submissions"}
        </h3>

        {myPending.length === 0 && myApproved.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            {lang === "bn" ? "আপনি এখনো কোনো ফাইল জমা দেননি।" : "You haven't submitted any files yet."}
          </p>
        ) : (
          <div className="space-y-2">
            {myPending.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className={`font-bold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{f.title}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold">
                    ⏳ Status: Pending Review • Submitted: {f.uploadDate}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px]">
                  Pending
                </span>
              </div>
            ))}

            {myApproved.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className={`font-bold block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{f.title}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold">
                    ✓ Status: Approved & Public • Downloads: {f.downloadCount}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px]">
                  Live
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Preview Lightbox Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-3 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-white">
              <span className="text-xs font-bold flex items-center space-x-1.5">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>{lang === "bn" ? "স্যাম্পল পেজ প্রিভিউ (ফুল স্ক্রিন)" : "Sample Page Full View"}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto rounded-xl bg-black flex justify-center p-2">
              <img
                src={previewModalImg}
                alt="Full Sample Page Preview"
                className="w-full object-contain max-h-[70vh] rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

