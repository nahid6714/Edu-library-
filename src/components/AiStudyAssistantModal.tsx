import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Volume2,
  VolumeX,
  BookOpen,
  Zap,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiStudyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiStudyAssistantModal: React.FC<AiStudyAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_init",
      role: "assistant",
      content:
        lang === "bn"
          ? "আসসালামু আলাইকুম! আমি এডু লাইব্রেরির Gemini AI স্টাডি এসিস্ট্যান্ট। এসএসসি, এইচএসসি, অনার্স, বিসিএস বা যেকোনো পরীক্ষার সিলেবাস, নোটস, সূত্র বা ব্যাখ্যা সম্পর্কে প্রশ্ন করুন।"
          : "Hello! I am Edu Library's Gemini AI Study Assistant. Ask me anything about HSC, SSC, Honours, or BCS exam formulas, chapter summaries, or question solutions!",
    },
  ]);

  const [input, setInput] = useState("");
  const [modelType, setModelType] = useState<"gemini-3.5-flash" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-lite">("gemini-3.5-flash");
  const [isLoading, setIsLoading] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: lang === "bn" ? "পদার্থবিজ্ঞান ভেক্টর শর্টকাট" : "Physics Vector Formula",
      prompt: "HSC Physics 1st Paper Vector chapter shortcut formulas and 3 important board math techniques.",
    },
    {
      label: lang === "bn" ? "বিসিএস সাধারণ জ্ঞান সাম্প্রতিক" : "BCS Bangladesh GK",
      prompt: "Provide 5 highly probable BCS Preliminary Bangladesh affairs questions with concise answers.",
    },
    {
      label: lang === "bn" ? "অনার্স ইংরেজি কবিতা সামারি" : "Honours English Poetry",
      prompt: "Summarize the key theme and imagery of John Keats' Ode to a Nightingale in simple English.",
    },
    {
      label: lang === "bn" ? "আইসিটি লজিক গেইট শর্টকাট" : "ICT Logic Gates",
      prompt: "Explain NAND and NOR universal gates boolean logic in Bengali with truth table concepts.",
    },
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: textToSend,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelType,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction:
            "You are an expert AI Study Tutor for Bangladeshi students. Answer in clear Bengali or English depending on user prompt. Structure answers with bullet points, formulas, and step-by-step reasoning.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI model");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: data.text || "No response received.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "দুঃখিত, কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। (" + (err.message || "Server Error") + ")",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = async (msgId: string, text: string) => {
    if (playingMsgId === msgId && audioObj) {
      audioObj.pause();
      setPlayingMsgId(null);
      return;
    }

    try {
      setPlayingMsgId(msgId);
      const response = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.substring(0, 800), voiceName: "Kore" }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const data = await response.json();
      const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
      const newAudio = new Audio(audioUrl);
      setAudioObj(newAudio);

      newAudio.onended = () => setPlayingMsgId(null);
      newAudio.play();
    } catch (err) {
      console.error("TTS playback error:", err);
      setPlayingMsgId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-950 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-base flex items-center">
                <span>{lang === "bn" ? "Gemini AI স্টাডি এসিস্ট্যান্ট" : "Gemini AI Study Tutor"}</span>
              </h2>
              <p className="text-[11px] text-emerald-200">
                {lang === "bn" ? "স্মার্ট প্রশ্নোত্তর ও অধ্যায় সমাধান" : "Instant Study Solutions"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Model Selector */}
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="bg-emerald-900 text-emerald-100 text-xs font-semibold rounded-lg px-2 py-1 border border-emerald-700 focus:outline-none"
              title="Select Gemini Model Tier"
            >
              <option value="gemini-3.5-flash">⚡ Flash (General)</option>
              <option value="gemini-3.1-pro-preview">🧠 Pro (Complex)</option>
              <option value="gemini-3.1-flash-lite">🚀 Lite (Fast)</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex space-x-2 overflow-x-auto text-xs shrink-0">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium whitespace-nowrap transition flex items-center space-x-1 shrink-0"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${
                m.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === "user"
                    ? "bg-slate-800 text-white"
                    : "bg-emerald-700 text-white"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                  m.role === "user"
                    ? "bg-emerald-700 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>

                {/* Speech button on assistant messages */}
                {m.role === "assistant" && (
                  <button
                    onClick={() => handleSpeakMessage(m.id, m.content)}
                    className="mt-2 text-[10px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center space-x-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200"
                  >
                    {playingMsgId === m.id ? (
                      <>
                        <VolumeX className="w-3 h-3 text-rose-600" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>Listen TTS</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold p-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>Gemini is generating response...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "আপনার পড়া সম্পর্কিত প্রশ্নটি লিখুন..."
                  : "Type your study question here..."
              }
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
