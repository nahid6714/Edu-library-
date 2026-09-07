import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Logged for diagnostics; the UI below keeps the app usable regardless.
    console.error("Edu Library crashed:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-lg font-bold mb-2">কিছু একটা সমস্যা হয়েছে</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            অ্যাপটি অপ্রত্যাশিতভাবে বন্ধ হয়ে গেছে। নিচের বাটনে চাপ দিয়ে আবার চালু করুন — আপনার ডাউনলোড করা ফাইল ও তথ্য সংরক্ষিত আছে।
          </p>
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            আবার চালু করুন
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
