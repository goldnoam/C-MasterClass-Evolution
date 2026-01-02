
import React, { useEffect, useRef, useState } from 'react';
import { Example } from '../types';

interface EditorProps {
  code: string;
  onChange: (newCode: string) => void;
  topicTitle: string;
  topicId: string;
  t: any;
  examples?: Example[];
  onRun: () => void;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, topicTitle, topicId, t, examples = [], onRun }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOver, setIsOver] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    if (preRef.current && (window as any).Prism) {
      (window as any).Prism.highlightElement(preRef.current);
    }
  }, [code]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const text = e.dataTransfer.getData('text');
    if (text) {
      onChange(code + '\n' + text);
    }
  };

  const handleShare = () => {
    try {
      const payload = JSON.stringify({ topicId, code });
      const encoded = btoa(unescape(encodeURIComponent(payload)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      });
    } catch (e) {
      console.error("Failed to generate share link", e);
    }
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main.cpp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectExample = (ex: Example) => {
    onChange(ex.code);
    setShowExamples(false);
    // Tiny delay to ensure state propagates before "compiling"
    setTimeout(onRun, 100);
  };

  return (
    <div 
      className={`flex-1 flex flex-col border rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'border-slate-800'
      } dark:bg-[#0d1117] bg-white`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      aria-label="C++ Code Editor"
    >
      <div className="flex items-center justify-between px-4 py-3 dark:bg-slate-900/50 bg-slate-100 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs font-mono dark:text-slate-500 text-slate-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            main.cpp
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {examples.length > 0 && (
            <div className="relative">
              <button 
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 px-2 py-1 rounded"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {t.trySnippets}
              </button>
              
              {showExamples && (
                <div className="absolute top-full right-0 mt-2 w-48 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-lg shadow-xl z-30 p-1">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.examples}</div>
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectExample(ex)}
                      className="w-full text-left px-3 py-2 text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100 rounded transition-colors"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 hover:text-emerald-500 transition-colors"
            title={t.export}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.export}
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-blue-500 hover:text-blue-400 transition-colors"
            title={t.share}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {showCopied ? t.copied : t.share}
          </button>
          
          <div className="h-3 w-[1px] bg-slate-800" />
          
          <button 
            onClick={() => onChange('')}
            className="text-[10px] uppercase font-bold text-slate-500 hover:text-red-400 transition-colors"
            title={t.clear}
          >
            {t.clear}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative font-mono text-sm leading-relaxed editor-container">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="editor-textarea dark:text-slate-300 text-slate-800 focus:outline-none custom-scrollbar"
          placeholder="// Paste or drag-drop code here..."
        />
        <pre 
          ref={preRef}
          className="editor-highlight language-cpp whitespace-pre-wrap"
          aria-hidden="true"
        >
          <code className="language-cpp">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default Editor;
