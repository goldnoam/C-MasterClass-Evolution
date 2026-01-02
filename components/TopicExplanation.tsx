
import React, { useState, useMemo, useRef, useEffect } from 'react';

interface TopicExplanationProps {
  explanation: string;
  isLoading: boolean;
  t: any;
}

const TopicExplanation: React.FC<TopicExplanationProps> = ({ explanation, isLoading, t }) => {
  const [search, setSearch] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when explanation changes and trigger Prism
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    const timer = setTimeout(() => {
      if ((window as any).Prism && contentRef.current) {
        (window as any).Prism.highlightAllUnder(contentRef.current);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [explanation]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(explanation).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleExport = () => {
    const blob = new Blob([explanation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `C++_Evolution_Explanation_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Filter out code blocks for cleaner speech
      const textToSpeak = explanation.replace(/```[\s\S]*?```/g, ' [Code segment omitted] ');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderContent = useMemo(() => {
    if (!explanation) return null;

    const parts = explanation.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const lang = lines[0].replace('```', '').trim() || 'cpp';
        const code = lines.slice(1, -1).join('\n');
        return (
          <div key={index} className="relative group my-8 transition-all duration-500">
             <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 pointer-events-none" />
             
             <div className="absolute right-4 top-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="bg-slate-800/80 hover:bg-slate-700 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur-sm shadow-xl active:scale-95 transition-all"
                >
                  COPY SNIPPET
                </button>
             </div>
             
             <pre className={`language-${lang} relative z-10 !bg-slate-950/90 !rounded-xl !border !border-slate-800 shadow-2xl !p-6 !m-0 overflow-x-hidden whitespace-pre-wrap break-words border-l-4 border-l-blue-500/50`}>
               <code className={`language-${lang}`}>{code}</code>
             </pre>
          </div>
        );
      }

      if (search.trim()) {
        const textParts = part.split(new RegExp(`(${search})`, 'gi'));
        return textParts.map((tp, i) => 
          tp.toLowerCase() === search.toLowerCase() 
            ? <mark key={`${index}-${i}`} className="bg-blue-500/30 text-blue-200 rounded px-0.5 border-b border-blue-500">{tp}</mark> 
            : tp
        );
      }

      return <span key={index}>{part}</span>;
    });
  }, [explanation, search]);

  return (
    <div className="flex flex-col h-full bg-inherit" aria-label="Explanation Panel">
      <div className="px-8 py-4 dark:bg-slate-900/80 bg-slate-50 border-b dark:border-slate-800 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h3 className="text-sm font-extrabold dark:text-white text-slate-900 tracking-tight leading-none mb-1">{t.topicDeepDive}</h3>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Expert Analysis</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 justify-end">
          <div className="relative group w-full max-w-xs">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-300 rounded-lg py-1.5 pl-10 pr-4 text-xs dark:text-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleSpeak}
              className="p-1.5 rounded-lg dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 dark:text-slate-300 text-slate-600 hover:dark:bg-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              title="Speak Explanation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <button 
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 dark:text-slate-300 text-slate-600 hover:dark:bg-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" />
              </svg>
              {showCopied ? t.copied : 'Copy All'}
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-900/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.export}
            </button>
          </div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-inherit">
        {isLoading ? (
          <div className="space-y-8 animate-pulse max-w-4xl mx-auto">
            <div className="h-8 dark:bg-slate-800 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-full"></div>
              <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-11/12"></div>
            </div>
            <div className="h-32 dark:bg-slate-800 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ) : (
          <div ref={contentRef} className="max-w-4xl mx-auto">
            <article className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:tracking-tight prose-headings:font-extrabold
              prose-h1:text-4xl prose-h1:bg-gradient-to-r prose-h1:from-blue-500 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:mb-8
              prose-h2:text-2xl prose-h2:text-blue-500 prose-h2:mt-12 prose-h2:border-b prose-h2:dark:border-slate-800 prose-h2:pb-2
              prose-h3:text-xl prose-h3:text-indigo-400 prose-h3:mt-8
              prose-strong:text-blue-500 dark:prose-strong:text-blue-400
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-code:text-indigo-500 dark:prose-code:text-indigo-400 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-a:text-blue-500 prose-a:no-underline prose-a:font-bold hover:prose-a:underline
              dark:text-slate-300 text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {renderContent || <p className="text-slate-500 italic">Select a subject from the sidebar to begin deep-dive education.</p>}
            </article>
          </div>
        )}
      </div>
      
      <div className="px-8 py-3 dark:bg-slate-950/50 bg-slate-100 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono italic">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          AI Analysis Engine v3.1
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">
          {new Date().toLocaleDateString()} Refreshed
        </div>
      </div>
    </div>
  );
};

export default TopicExplanation;
