import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  FileScan,
  X,
  Upload,
  Sparkles,
  FileText,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";

interface AiDocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiDocumentScannerModal: React.FC<AiDocumentScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pre-loaded sample study document photos for instant testing!
  const sampleImages = [
    {
      title: "HSC Physics Vector Math Note",
      url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "SSC Higher Math Trigonometry Sheet",
      url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "CSE Algorithm Hand Note",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      const response = await fetch("/api/gemini/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt: customPrompt || "Analyze this study note/question paper photo using gemini-3.1-pro-preview. Summarize key formulas, solve equations, and explain the core educational topics clearly in Bengali and English.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setAnalysisResult(data.text || "Analysis finished without text output.");
    } catch (err: any) {
      console.error("Image Analysis error:", err);
      setAnalysisResult("Error analyzing image: " + (err.message || "Server Error"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <FileScan className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h2 className="font-bold text-base flex items-center space-x-2">
                <span>{lang === "bn" ? "Gemini ৩.১ প্রো ডকুমেন্ট স্ক্যানার" : "Gemini 3.1 Pro Doc Analyzer"}</span>
              </h2>
              <p className="text-[11px] text-emerald-200">
                {lang === "bn" ? "হ্যান্ডরাইটিং নোটস ও প্রশ্ন সমাধান এআই এনালাইসিস" : "Image & Question Solution AI"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Sample images selector or File Upload Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {lang === "bn" ? "১. নোট বা প্রশ্নপত্রের ছবি আপলোড বা সিলেক্ট করুন" : "1. Select Note / Question Paper Image"}
            </label>

            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(s.url);
                    setAnalysisResult(null);
                  }}
                  className={`border-2 rounded-xl p-1 text-left text-[11px] transition overflow-hidden group ${
                    selectedImage === s.url
                      ? "border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={s.url}
                    alt={s.title}
                    className="w-full h-16 object-cover rounded-lg mb-1"
                  />
                  <span className="font-semibold text-slate-800 line-clamp-1 block px-1">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom File Upload Box */}
            <div className="mt-2">
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-emerald-50/50">
                <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  {lang === "bn" ? "গ্যালারি থেকে ছবি সিলেক্ট করুন" : "Upload Image File"}
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Active Image Preview */}
          {selectedImage && (
            <div className="bg-slate-900 rounded-2xl p-2 max-h-56 overflow-hidden flex items-center justify-center border border-slate-200">
              <img
                src={selectedImage}
                alt="Selected Document"
                className="max-h-52 object-contain rounded-xl"
              />
            </div>
          )}

          {/* Optional Prompt Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === "bn" ? "২. নির্দিষ্ট ইনস্ট্রাকশন (ঐচ্ছিক)" : "2. Custom Instructions (Optional)"}
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "যেমন: গাণিতিক সূত্রগুলোর ব্যাখ্যা দাও বা সমাধান করে দাও..."
                  : "e.g. Solve the math problems shown in this photo..."
              }
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                <span>Analyzing with Gemini 3.1 Pro...</span>
              </>
            ) : (
              <>
                <FileScan className="w-5 h-5 text-amber-300" />
                <span>{lang === "bn" ? "এআই স্ক্যান ও বিশ্লেষণ শুরু করুন" : "Start AI Gemini 3.1 Pro Analysis"}</span>
              </>
            )}
          </button>

          {/* Analysis Result Output */}
          {analysisResult && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-sm text-emerald-950 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-700" />
                {lang === "bn" ? "এআই এনালাইসিস রেজাল্ট" : "AI Analysis Solution"}
              </h3>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium bg-white p-3 rounded-xl border border-emerald-100 shadow-sm max-h-60 overflow-y-auto">
                {analysisResult}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
