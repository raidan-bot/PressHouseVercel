import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  RefreshCw, 
  AlertTriangle, 
  Info 
} from "lucide-react";

export default function PressAgentDashboard() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agentStatus, setAgentStatus] = useState("idle"); // idle, thinking, responding
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setAgentStatus("thinking");

    try {
      const res = await api.post("/api/ai/press-agent", { prompt: input });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]); // Display the assistant's response
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]); // Display an error message
    } finally {
      setLoading(false);
      setAgentStatus("idle");
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleRefresh = () => {
    clearChat();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            {isRtl ? "وكيل الصحافة الذكي" : "PressAgent AI"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isRtl 
              ? "مساعد ذكي يعتمد على البيانات الحقيقية للموقع فقط. لا يقوم بالهلوسة."
              : "Smart assistant based on real site data only. Does not hallucinate."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertTriangle size={16} />
          {error}
          <button onClick={() => setError('')} className="me-auto font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)]">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div className="max-w-md">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isRtl ? "مرحباً بك في وكيل الصحافة" : "Welcome to PressAgent"}
              </h3>
              <p className="text-slate-600 mb-6">
                {isRtl 
                  ? "اسألني أي شيء عن موقع بيت الصحافة. سأجابك بناءً على البيانات الحقيقية فقط."
                  : "Ask me anything about PressHouse. I answer based on real data only."}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["What are the latest articles?", "Show me violations data", "Help me write a title"].map((example) => ( // Add examples to give the user an idea of what to ask
                  <button
                    key={example}
                    onClick={() => {
                      setInput(example);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-indigo-600" : "bg-slate-100"
                }`}>
                  {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-600" />}
                </div>
                <div className={`max-w-[85%] p-3 rounded-lg ${
                  msg.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {agentStatus === "thinking" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                  <Bot size={16} className="text-slate-600" />
                </div>
                <div className="bg-slate-100 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                  <span className="text-sm text-slate-600">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRtl ? "اسأل وكيل الصحافة..." : "Ask PressAgent..."}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm font-bold flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">{isRtl ? "ملاحظة هامة:" : "Important Note:"}</p>
          <p className="text-xs text-amber-700 mt-1">
            {isRtl
              ? "يجيب وكيل الصحافة بناءً على بيانات موقعك الحقيقية فقط. لا يقوم بالهلوسة أو تقديم معلومات غير موجودة في قاعدة البيانات."
              : "PressAgent answers based on your real site data only. It does not hallucinate or provide information not in the database."}
          </p>
        </div>
      </div>
    </div>
  );
}
