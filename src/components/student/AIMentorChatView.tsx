import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askAIMentor } from '../../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIMentorChatView: React.FC = () => {
  const { profile, language, targetRole } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        language === 'hi'
          ? `नमस्ते ${profile.name}! मैं आपका स्किलसेतु करियर मेंटर हूँ। आपके लक्षित पद '${targetRole.titleHi}' और आपकी स्किल प्रोफाइल के आधार पर आप मुझसे कोई भी सवाल पूछ सकते हैं।`
          : language === 'mr'
          ? `नमस्कार ${profile.name}! मी तुमचा स्किलसेतू करिअर मार्गदर्शक आहे. तुमचे लक्ष्य '${targetRole.titleMr}' गाठण्यासाठी मी तुम्हाला मदत करू शकतो. विचारा तुमचे प्रश्न!`
          : `Hello ${profile.name}! I am your Setu Career Advisor. Grounded in your profile and target role '${targetRole.title}', ask me anything about bridging your skill gaps, course roadmaps, or NAPS apprenticeships.`,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askAIMentor(text, profile, messages, language);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue processing your query. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    {
      en: `Why is PLC & SCADA required for my target role?`,
      hi: `मेरे लक्षित पद के लिए PLC प्रोग्रामिंग क्यों जरूरी है?`,
      mr: `माझ्या पदासाठी PLC का आवश्यक आहे?`,
    },
    {
      en: `How do I prepare for NAPS government apprenticeships?`,
      hi: `NAPS सरकारी अप्रेंटिसशिप के लिए कैसे आवेदन करें?`,
      mr: `NAPS शिकाऊ उमेदवारीसाठी अर्ज कसा करावा?`,
    },
    {
      en: `Can I reach this role studying 6 hours a week?`,
      hi: `क्या मैं सप्ताह में 6 घंटे पढ़कर यह पद हासिल कर सकता हूँ?`,
      mr: `दर आठवड्याला ६ तास अभ्यास करून हे पद मिळेल का?`,
    },
  ];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0D1836] rounded-3xl p-5 border border-slate-200 dark:border-[#1E2D52] shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1F4E79] to-[#2A68A1] flex items-center justify-center text-white shadow-xs">
            <BotMessageSquare className="w-5 h-5 text-[#F28C28]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🤖</span>
              <span>Setu AI Career Counselor</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded in {profile.name}'s verified gaps for {targetRole.title}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full hidden sm:inline">
          Guardrailed • Educational
        </span>
      </div>

      {/* Chat Messages Frame */}
      <div className="bg-white dark:bg-[#0D1836] rounded-3xl border border-slate-200 dark:border-[#1E2D52] shadow-xs flex flex-col h-[520px] overflow-hidden transition-colors">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#1F4E79] text-white'
                      : 'bg-orange-100 dark:bg-orange-950/40 text-[#F28C28]'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <span>🤖</span>}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1F4E79] text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-50 dark:bg-[#101935] border border-slate-200 dark:border-[#1E2D52] text-slate-800 dark:text-slate-100 rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
              <span>Setu Mentor is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#101935] border-t border-slate-100 dark:border-[#1E2D52] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((p, pidx) => {
            const promptText = language === 'hi' ? p.hi : language === 'mr' ? p.mr : p.en;
            return (
              <button
                key={pidx}
                onClick={() => handleSendMessage(promptText)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D1836] border border-slate-200 dark:border-[#1E2D52] hover:border-[#1F4E79] dark:hover:border-sky-400 text-[11px] font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
              >
                {promptText}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0D1836] border-t border-slate-200 dark:border-[#1E2D52] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              language === 'hi'
                ? 'कौशल, कोर्स या करियर के बारे में पूछें...'
                : language === 'mr'
                ? 'कौशल्य किंवा करिअरबद्दल विचारा...'
                : 'Ask about skills, courses, or career roadmap...'
            }
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79] dark:focus:ring-sky-500"
          />
          <button
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="px-4 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] dark:hover:bg-[#183F63] text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
