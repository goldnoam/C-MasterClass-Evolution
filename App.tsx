
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopicExplanation from './components/TopicExplanation';
import EvolutionInfographic from './components/EvolutionInfographic';
import { CURRICULUM } from './constants';
import { Topic, Difficulty } from './types';
import { getTopicExplanation } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const LS_KEYS = {
  TOPIC_ID: 'cpp_masterclass_topic_id',
  CODE: 'cpp_masterclass_code',
  COMPLETED: 'cpp_masterclass_completed',
  THEME: 'cpp_masterclass_theme',
  LANG: 'cpp_masterclass_lang',
  FONT_SIZE: 'cpp_masterclass_font_size',
  MUTED: 'cpp_masterclass_muted'
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const [fontSize, setFontSize] = useState<'font-s' | 'font-m' | 'font-l'>('font-m');
  const [isMuted, setIsMuted] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [currentTopic, setCurrentTopic] = useState<Topic>(CURRICULUM[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  
  const [explanation, setExplanation] = useState<string>('');
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);

  const t = TRANSLATIONS[lang];

  const speak = useCallback((text: string) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = lang === 'he' ? 'he-IL' : lang;
      window.speechSynthesis.speak(ut);
    }
  }, [lang, isMuted]);

  useEffect(() => {
    const savedCompleted = localStorage.getItem(LS_KEYS.COMPLETED);
    const savedTheme = localStorage.getItem(LS_KEYS.THEME) as any;
    const savedLang = localStorage.getItem(LS_KEYS.LANG) as any;
    const savedFontSize = localStorage.getItem(LS_KEYS.FONT_SIZE) as any;
    const savedMuted = localStorage.getItem(LS_KEYS.MUTED);

    if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted));
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedMuted) setIsMuted(JSON.parse(savedMuted));

    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.split('#share=')[1];
        const payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        const topic = CURRICULUM.find(t => t.id === payload.topicId);
        if (topic) {
          setCurrentTopic(topic);
          fetchExplanation(topic);
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }
      } catch (e) {
        console.error("Failed to hydrate from share link", e);
      }
    }
    
    const savedTopicId = localStorage.getItem(LS_KEYS.TOPIC_ID);
    if (savedTopicId) {
      const topic = CURRICULUM.find(t => t.id === savedTopicId);
      if (topic) {
        setCurrentTopic(topic);
        fetchExplanation(topic);
      }
    } else {
      fetchExplanation(CURRICULUM[0]);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem(LS_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    document.body.className = fontSize;
    localStorage.setItem(LS_KEYS.FONT_SIZE, fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.LANG, lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.MUTED, JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.TOPIC_ID, currentTopic.id);
  }, [currentTopic]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.COMPLETED, JSON.stringify(completedTopics));
  }, [completedTopics]);

  const fetchExplanation = async (topic: Topic) => {
    setIsFetchingExplanation(true);
    const result = await getTopicExplanation(topic);
    setExplanation(result);
    setIsFetchingExplanation(false);
    
    if (!completedTopics.includes(topic.id)) {
      setCompletedTopics(prev => [...prev, topic.id]);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setCurrentTopic(topic);
    fetchExplanation(topic);
    speak(topic.title);
  };

  const difficultyColors = {
    [Difficulty.BEGINNER]: 'text-emerald-400 bg-emerald-400/10',
    [Difficulty.INTERMEDIATE]: 'text-sky-400 bg-sky-400/10',
    [Difficulty.ADVANCED]: 'text-amber-400 bg-amber-400/10',
    [Difficulty.EXPERT]: 'text-rose-400 bg-rose-400/10',
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 dark:bg-slate-950 bg-slate-50`}>
      <Sidebar 
        activeTopicId={currentTopic.id} 
        onTopicSelect={handleTopicSelect} 
        completedTopics={completedTopics}
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      <main className="flex-1 flex flex-col min-w-0" role="main">
        {/* Header */}
        <header className="h-16 px-8 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between dark:bg-slate-900/50 bg-white/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold tracking-tight">{currentTopic.title}</h2>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${difficultyColors[currentTopic.difficulty]}`}>
              {currentTopic.difficulty}
            </div>
            {currentTopic.standard && (
              <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-600 border dark:border-slate-700 border-slate-300">
                {currentTopic.standard}
              </div>
            )}
            {!isOnline && (
              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-full animate-pulse">OFFLINE</span>
            )}
          </div>
        </header>

        {/* Unified Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
              
              {/* Visual Timeline - MOVED TO TOP */}
              <div className="py-2">
                <EvolutionInfographic t={t} />
              </div>

              {/* Summary Hero */}
              <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
                </div>
                <p className="text-lg dark:text-slate-300 text-slate-600 leading-relaxed font-medium italic relative z-10">
                  "{currentTopic.summary}"
                </p>
              </div>

              {/* Main Subject Content */}
              <div className="dark:bg-slate-900/30 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
                <TopicExplanation explanation={explanation} isLoading={isFetchingExplanation} t={t} />
              </div>

              <footer className="mt-auto pb-12 flex flex-col items-center gap-3 pt-12 border-t dark:border-slate-900 border-slate-200" role="contentinfo">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold dark:text-slate-500 text-slate-400 tracking-wider">
                    {t.copyright}
                  </span>
                  <div className="h-4 w-[1px] dark:bg-slate-800 bg-slate-300" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] dark:text-slate-600 text-slate-500 uppercase font-bold tracking-widest">{t.feedback}:</span>
                    <a 
                      href="mailto:goldnoamai@gmail.com" 
                      className="text-xs font-bold dark:text-blue-400 text-blue-600 hover:text-blue-500 transition-colors underline decoration-dotted decoration-blue-500/30"
                    >
                      goldnoamai@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full dark:bg-emerald-500/10 bg-emerald-100 text-[10px] font-bold text-emerald-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Offline Ready
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full dark:bg-blue-500/10 bg-blue-100 text-[10px] font-bold text-blue-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Accessible UI
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
