
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getTutorResponse } from '../services/geminiService';

interface AITutorProps {
  currentTopicTitle: string;
  currentCode: string;
  t: any;
  isOnline: boolean;
}

const SUGGESTIONS = [
  "Explain memory safety",
  "How do templates work?",
  "What is RAII?",
  "Modern C++ vs Legacy",
  "Design pattern advice",
  "Review my code"
];

const AITutor: React.FC<AITutorProps> = ({ currentTopicTitle, currentCode, t, isOnline }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your AI C++ Tutor. I see we're looking at **${currentTopicTitle}**. How can I help you understand this better?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    if (!isOnline) {
       setMessages(prev => [...prev, { role: 'user', content: textToSend }, { role: 'assistant', content: t.offlineMode }]);
       setInput('');
       setShowSuggestions(false);
       return;
    }

    const userMessage: Message = { role: 'user', content: textToSend };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    const aiResponse = await getTutorResponse(newHistory, {
      topicTitle: currentTopicTitle,
      code: currentCode
    });

    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsTyping(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      setInput(prev => prev + (prev ? '\n' : '') + droppedText);
    }
  };

  return (
    <div 
      className="w-96 flex flex-col dark:bg-slate-900 bg-slate-50 border-l dark:border-slate-800 border-slate-200" 
      role="complementary" 
      aria-label="AI Tutoring Chat"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} aria-hidden="true" />
          <h2 className="text-sm font-bold dark:text-slate-200 text-slate-800">{t.tutorTitle}</h2>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: "Memory cleared." }])}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs transition-colors font-bold uppercase focus:outline-none focus:underline"
          aria-label="Clear chat history"
        >
          {t.clear}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'dark:bg-slate-800 bg-white dark:text-slate-200 text-slate-800 rounded-bl-none border dark:border-slate-700 border-slate-200'
            }`}>
              <div className="whitespace-pre-wrap prose dark:prose-invert prose-sm max-w-none">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="dark:bg-slate-800 bg-white rounded-2xl rounded-bl-none px-4 py-2.5 border dark:border-slate-700 border-slate-200 flex gap-1 items-center" aria-label="Tutor is typing">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 dark:bg-slate-950 bg-slate-100 border-t dark:border-slate-800 border-slate-200 relative">
        {showSuggestions && (
          <div className="absolute bottom-full left-0 w-full p-2 space-y-1 dark:bg-slate-900 bg-white border-t dark:border-slate-800 border-slate-200 shadow-2xl z-30">
            <p className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1">Suggestions</p>
            {SUGGESTIONS.map(s => (
              <button 
                key={s}
                onClick={() => handleSend(s)}
                className="w-full text-left px-3 py-1.5 text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-50 rounded transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative group">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t.askAnything}
            className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl pl-4 pr-20 py-3 text-sm dark:text-slate-200 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            aria-label="Ask AI Tutor"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            {input && (
               <button 
                onClick={() => setInput('')}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                aria-label="Clear input"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                 </svg>
               </button>
            )}
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg focus:ring-2 focus:ring-blue-400 outline-none"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <p className="mt-2 text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold">
          Expert AI Guidance • Drag & Drop Support
        </p>
      </div>
    </div>
  );
};

export default AITutor;
