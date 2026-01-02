
import React, { useState, useMemo } from 'react';
import { CURRICULUM } from '../constants';
import { Topic, Category, Difficulty } from '../types';
import { TRANSLATIONS } from '../translations';

interface SidebarProps {
  activeTopicId: string;
  onTopicSelect: (topic: Topic) => void;
  completedTopics: string[];
  t: any;
  lang: keyof typeof TRANSLATIONS;
  setLang: (l: any) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  fontSize: 'font-s' | 'font-m' | 'font-l';
  setFontSize: (s: any) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTopicId, onTopicSelect, completedTopics, t, lang, setLang, 
  theme, setTheme, fontSize, setFontSize, isMuted, setIsMuted 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLatestOnly, setShowLatestOnly] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  
  const categories = Object.values(Category);
  const difficulties = ['All', ...Object.values(Difficulty)];

  const filteredCurriculum = useMemo(() => {
    let list = CURRICULUM;
    
    if (showLatestOnly) {
      list = list.filter(t => t.standard === 'C++23' || t.standard === 'C++26' || (t.standard && parseInt(t.standard.replace('C++', '')) >= 23));
    }

    if (selectedDifficulty !== 'All') {
      list = list.filter(t => t.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.summary.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query) ||
        (topic.standard && topic.standard.toLowerCase().includes(query))
      );
    }
    return list;
  }, [searchQuery, showLatestOnly, selectedDifficulty]);

  const handleExportSearch = () => {
    const data = filteredCurriculum.map(t => `${t.title} [${t.standard || 'General'}] - ${t.difficulty}\nSummary: ${t.summary}\n---`).join('\n\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `C++_Masterclass_Search_Results.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const difficultyColors = {
    [Difficulty.BEGINNER]: 'border-emerald-500/30 text-emerald-500',
    [Difficulty.INTERMEDIATE]: 'border-sky-500/30 text-sky-500',
    [Difficulty.ADVANCED]: 'border-amber-500/30 text-amber-500',
    [Difficulty.EXPERT]: 'border-rose-500/30 text-rose-500',
    'All': 'border-slate-500/30 text-slate-500'
  };

  return (
    <div className="w-80 h-screen dark:bg-slate-900 bg-white border-r dark:border-slate-800 border-slate-200 flex flex-col shadow-2xl z-20" role="navigation" aria-label="Main Navigation">
      <div className="p-6 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/50 bg-slate-50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg italic text-white" aria-hidden="true">C++</div>
          <div>
            <h1 className="text-lg font-extrabold dark:text-white text-slate-800 leading-tight">{t.title}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="px-4 py-2 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/40 bg-slate-50 flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md dark:bg-slate-800 bg-slate-200 dark:text-yellow-400 text-slate-600 hover:scale-105 transition-transform focus:ring-2 focus:ring-blue-500 outline-none"
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-md transition-all hover:scale-105 focus:ring-2 focus:ring-blue-500 outline-none ${isMuted ? 'bg-red-500/10 text-red-500' : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-600'}`}
            title={isMuted ? t.unmute : t.mute}
            aria-label={isMuted ? t.unmute : t.mute}
            aria-pressed={isMuted}
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="text-[10px] uppercase font-bold dark:bg-slate-800 bg-slate-200 border-none rounded p-1 outline-none cursor-pointer hover:scale-105 transition-transform focus:ring-2 focus:ring-blue-500"
            aria-label={t.lang}
          >
            <option value="en">EN</option>
            <option value="he">HE</option>
            <option value="zh">ZH</option>
            <option value="hi">HI</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
        </div>
        <div className="flex gap-1" role="group" aria-label={t.fontSize}>
          {['font-s', 'font-m', 'font-l'].map((sz) => (
            <button 
              key={sz}
              onClick={() => setFontSize(sz as any)}
              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 focus:ring-2 focus:ring-blue-500 outline-none ${fontSize === sz ? 'bg-blue-600 text-white shadow-lg' : 'dark:bg-slate-800 bg-slate-200 text-slate-500'}`}
              title={`${t.fontSize}: ${sz.split('-')[1].toUpperCase()}`}
              aria-current={fontSize === sz}
            >
              {sz.split('-')[1].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/40 bg-slate-50 space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-200 rounded-lg py-2 pl-10 pr-10 text-xs dark:text-slate-200 text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            aria-label={t.searchPlaceholder}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-red-500 transition-colors"
              aria-label={t.clear}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
              </svg>
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by Difficulty">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff as any)}
              className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tight border transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
                selectedDifficulty === diff 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : `dark:bg-slate-950 bg-white border-slate-800 hover:border-blue-500/50 ${difficultyColors[diff as keyof typeof difficultyColors] || 'text-slate-400'}`
              }`}
              aria-pressed={selectedDifficulty === diff}
            >
              {diff}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowLatestOnly(!showLatestOnly)}
            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border focus:ring-2 focus:ring-blue-500 outline-none ${
              showLatestOnly 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                : 'dark:bg-slate-950 bg-white dark:border-slate-800 border-slate-200 text-slate-500 hover:text-slate-300'
            }`}
            aria-pressed={showLatestOnly}
          >
            <span>{t.focusLatest}</span>
            <div className={`w-3 h-3 rounded-full border ${showLatestOnly ? 'bg-cyan-500 border-cyan-400' : 'border-slate-700'}`} />
          </button>
          <button 
            onClick={handleExportSearch}
            className="p-2 rounded-lg dark:bg-slate-800 bg-slate-200 text-slate-500 hover:text-blue-500 transition-all border dark:border-slate-700 border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            title={t.export}
            aria-label={t.export}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2 space-y-4" role="listbox">
        {categories.map((category) => {
          const categoryTopics = filteredCurriculum.filter(t => t.category === category);
          if (categoryTopics.length === 0) return null;

          return (
            <div key={category} className="space-y-1" role="group" aria-label={category}>
              <h3 className="px-4 text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full dark:bg-slate-700 bg-slate-300" />
                {category}
              </h3>
              <div className="space-y-0.5 px-1">
                {categoryTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onTopicSelect(topic)}
                    role="option"
                    aria-selected={activeTopicId === topic.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-200 flex items-center justify-between group focus:ring-2 focus:ring-blue-500 outline-none
                      ${activeTopicId === topic.id 
                        ? 'bg-blue-600/15 text-blue-500 dark:text-blue-300 border border-blue-500/30 shadow-sm' 
                        : 'text-slate-500 hover:dark:bg-slate-800/50 hover:bg-slate-100 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-1 h-1 rounded-full shrink-0 ${completedTopics.includes(topic.id) ? 'bg-emerald-500' : 'dark:bg-slate-700 bg-slate-300'}`} />
                      <span className="truncate">{topic.title}</span>
                    </div>
                    {topic.standard && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 dark:bg-slate-800 bg-slate-200 rounded text-slate-500 group-hover:text-slate-400 transition-colors">
                        {topic.standard}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t dark:border-slate-800 border-slate-200 dark:bg-slate-950/80 bg-slate-50 backdrop-blur-sm">
        <div className="dark:bg-slate-900/60 bg-white rounded-xl p-3 border dark:border-slate-800/50 border-slate-200 shadow-sm">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
            <span>{t.courseProgress}</span>
            <span className="text-blue-600 dark:text-blue-400">{Math.round((completedTopics.length / CURRICULUM.length) * 100)}%</span>
          </div>
          <div className="w-full dark:bg-slate-800 bg-slate-200 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={Math.round((completedTopics.length / CURRICULUM.length) * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-1000 ease-in-out"
              style={{ width: `${(completedTopics.length / CURRICULUM.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[9px] text-slate-500 text-center italic">
            {completedTopics.length} of {CURRICULUM.length} {t.modulesCompleted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
