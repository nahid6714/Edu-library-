export type Role = "user" | "moderator" | "admin";

export type FileType = "pdf" | "word" | "ppt" | "image";

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  photoUrl: string;
  role: Role;
  educationLevel: string;
  department: string;
  semester: string;
  bio: string;
  joinDate: string;
  uploadCount: number;
  downloadCount: number;
  favouriteCount: number;
  badge: "Newbie" | "Contributor" | "Scholar" | "Moderator" | "Admin";
  warningLevel: number; // 0 to 3
  status: "active" | "suspended" | "banned";
}

export interface EduSubject {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  semesterId: string;
}

export interface EduDepartment {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  icon: string;
  semesters: { id: string; name: string; nameBn: string }[];
  subjects: EduSubject[];
}

export interface EduLevel {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  icon: string;
  departments: EduDepartment[];
}

export interface EduFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: FileType;
  fileSize: string; // e.g. "2.4 MB"
  levelId: string;
  levelName: string;
  deptId: string;
  deptName: string;
  semesterId: string;
  semesterName: string;
  subjectId: string;
  subjectName: string;
  tags: string[];
  screenshots: string[]; // 1-5 screenshot URLs
  uploadedByUserId: string;
  uploadedByUserName: string;
  uploadDate: string;
  downloadCount: number;
  viewCount: number;
  reportCount: number;
  status: "approved" | "pending" | "rejected" | "hidden";
  rejectReason?: string;
  version: string;
}

export interface Notice {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  createdBy: string;
  publishDate: string;
  priority: "low" | "medium" | "high";
  pinned: boolean;
}

export interface FileReport {
  id: string;
  fileId: string;
  fileName: string;
  reporterId: string;
  reporterName: string;
  type: "copyright" | "inappropriate" | "broken" | "wrong_category" | "other";
  message: string;
  status: "pending" | "resolved" | "ignored";
  date: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "approval" | "rejection" | "notice" | "warning" | "system";
  read: boolean;
  date: string;
}

export interface DownloadedFile {
  fileId: string;
  fileTitle: string;
  fileType: FileType;
  fileSize: string;
  downloadDate: string;
  localPath: string;
  contentPreview: string; // Simulated text content for PDF reader
  levelName: string;
  subjectName: string;
}

export interface RecycleItem {
  id: string;
  file: EduFile;
  deletedBy: string;
  deleteDate: string;
  expiresDate: string; // 15 days calculation
  daysRemaining: number;
}
