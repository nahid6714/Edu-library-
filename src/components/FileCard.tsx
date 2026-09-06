import React, { useState } from "react";
import { EduFile } from "../types";
import { useApp } from "../context/AppContext";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Download,
  Eye,
  Star,
  User,
  CheckCircle2,
  Calendar,
  Heart,
} from "lucide-react";

interface FileCardProps {
  file: EduFile;
  onSelect: (file: EduFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onSelect }) => {
  const { downloadFile, toggleFavorite, favorites, lang, theme } = useApp();
  const [likes, setLikes] = useState(70);
  const [liked, setLiked] = useState(false);

  const isFav = favorites.includes(file.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const getFileBadge = (type: EduFile["fileType"]) => {
    switch (type) {
      case "pdf":
        return {
          icon: <FileText className="w-4 h-4 text-rose-500 dark:text-rose-400" />,
          label: "PDF",
          color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        };
      case "word":
        return {
          icon: <FileSpreadsheet className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
          label: "DOCX",
          color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
        };
      case "ppt":
        return {
          icon: <FileSpreadsheet className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
          label: "PPTX",
          color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        };
      default:
        return {
          icon: <FileImage className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
          label: "IMG",
          color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        };
    }
  };

  const badge = getFileBadge(file.fileType);

  return (
    <div
      className={`rounded-2xl border transition duration-200 p-4 flex flex-col justify-between group shadow-sm hover:shadow-md ${
        theme === "dark"
          ? "bg-[#121a2d] border-slate-800/90 hover:border-sky-500/40"
          : "bg-white border-slate-200 hover:border-sky-400"
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>

          <div className="flex items-center space-x-1">
            {/* Likes badge matching image ❤️ 70 */}
            <button
              onClick={handleLike}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition border ${
                liked
                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-rose-500"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{likes}</span>
            </button>

            {/* Favorite star button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(file.id);
              }}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition"
              title="Favorite"
            >
              <Star
                className={`w-4 h-4 ${
                  isFav ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Category breadcrumbs */}
        <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mb-1 flex items-center space-x-1">
          <span>{file.levelName}</span>
          <span>•</span>
          <span>{file.deptName}</span>
          <span>•</span>
          <span className="truncate">{file.subjectName}</span>
        </div>

        {/* File Title */}
        <h4
          onClick={() => onSelect(file)}
          className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer transition leading-snug"
        >
          {file.title}
        </h4>

        {/* Short Description */}
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {file.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {file.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Download Action */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">{file.uploadedByUserName}</span>
            <CheckCircle2 className="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0" />
          </div>
          <div className="flex items-center space-x-2 text-slate-500 text-[10px]">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {file.uploadDate}
            </span>
            <span>•</span>
            <span>{file.fileSize}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onSelect(file)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-700"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(file);
            }}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ডাউনলোড" : "Download"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

