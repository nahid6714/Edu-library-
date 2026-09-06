import React, { useState } from "react";
import { EduFile } from "../types";
import { useApp } from "../context/AppContext";
import {
  X,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

interface PdfViewerModalProps {
  file: EduFile | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ file, onClose }) => {
  const { lang, downloadFile } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isNightMode, setIsNightMode] = useState(false);

  // Gemini TTS states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  if (!file) return null;

  const handleSpeakPage = async () => {
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      const pageText = `Page ${currentPage} of ${file.title}. ${file.description}`;
      const response = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText, voiceName: "Kore" }),
      });

      if (!response.ok) throw new Error("TTS error");

      const data = await response.json();
      const newAudio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      setAudioObj(newAudio);

      newAudio.onended = () => setIsPlayingAudio(false);
      newAudio.play();
      setIsPlayingAudio(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 text-white w-full max-w-4xl h-[92vh] rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        
        {/* Reader Top Toolbar */}
        <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold line-clamp-1">{file.title}</h2>
              <span className="text-[10px] text-slate-400">
                {file.levelName} • {file.subjectName}
              </span>
            </div>
          </div>

          {/* Viewer Controls */}
          <div className="flex items-center space-x-2 text-xs">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1 hover:text-amber-400"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 hover:text-amber-400"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Night / Light Mode Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              title="Toggle Night Reading Mode"
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* AI Audio Reader */}
            <button
              onClick={handleSpeakPage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-[11px]"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isPlayingAudio ? "Stop" : "AI Speech"}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-700 hover:bg-rose-600 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Reader Document Canvas */}
        <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-950">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className={`w-full max-w-2xl min-h-[600px] rounded-2xl p-6 sm:p-8 shadow-2xl transition-all border ${
              isNightMode
                ? "bg-slate-900 text-slate-100 border-slate-800"
                : "bg-white text-slate-900 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/40 text-xs text-slate-400 font-semibold">
              <span>PAGE {currentPage} OF {totalPages}</span>
              <span>EDU LIBRARY DOCUMENT VIEWER</span>
            </div>

            <h3 className="text-lg font-bold mb-4">{file.title}</h3>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
              <p className="font-semibold text-emerald-700">
                {file.levelName} • {file.deptName} • {file.subjectName}
              </p>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-200 text-xs">
                <strong>[DOCUMENT PREVIEW SUMMARY]:</strong> {file.description}
              </div>

              <h4 className="font-bold text-base mt-4">Section {currentPage}: Core Formulas & Past Questions</h4>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Important Formula 1: Fundamental equations and unit vectors derivation.</li>
                <li>Important Formula 2: Applying dot product and cross product in physical kinematics.</li>
                <li>Board Question 2024: Solved step-by-step with graphical illustration.</li>
                <li>Short Technique: Memorize trigonometric angle ratios for quick exam solving.</li>
              </ul>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 mt-6 text-center text-xs text-slate-500">
                --- End of Page {currentPage} Preview ---
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Toolbar */}
        <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => downloadFile(file)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ডাউনলোড করুন" : "Download File"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
