
import React, { useMemo, useRef, useEffect } from 'react';

interface TopicExplanationProps {
  explanation: string;
  isLoading: boolean;
  t: any;
}

const TopicExplanation: React.FC<TopicExplanationProps> = ({ explanation, isLoading, t }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleExport = () => {
    const blob = new Blob([explanation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `C++_Course_Module_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = explanation.replace(/```[\s\S]*?```/g, ' [Code omitted] ');
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
          <div key={index} className="relative group my-8">
             <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 pointer-events-none" />
             <div className="absolute right-4 top-4 z-20 opacity-0 group-hover:opacity-100 transition-all">
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
      return <span key={index}>{part}</span>;
    });
  }, [explanation]);

  return (
    <div className="flex flex-col h-full bg-inherit" aria-label="Explanation Panel">
      <div className="px-8 py-4 dark:bg-slate-900/80 bg-slate-50 border-b dark:border-slate-800 border-slate-200 flex justify-between items-center z-10">
        <h3 className="text-sm font-extrabold dark:text-white text-slate-900 uppercase tracking-tight">{t.topicDeepDive}</h3>
        <div className="flex gap-2">
          <button onClick={handleSpeak} className="p-1.5 rounded-lg dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 dark:text-slate-300 text-slate-600 hover:bg-slate-100 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t.export}
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-inherit">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold dark:text-slate-300 text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
            {renderContent}
          </article>
        </div>
      </div>
    </div>
  );
};

export default TopicExplanation;
