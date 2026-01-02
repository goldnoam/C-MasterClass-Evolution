
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopicExplanation from './components/TopicExplanation';
import EvolutionInfographic from './components/EvolutionInfographic';
import { CURRICULUM } from './constants';
import { Topic, Difficulty } from './types';
import { TRANSLATIONS } from './translations';

const LS_KEYS = {
  TOPIC_ID: 'cpp_masterclass_topic_id',
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

  const [currentTopic, setCurrentTopic] = useState<Topic>(CURRICULUM[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>(CURRICULUM[0].detailedContent || CURRICULUM[0].summary);

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

    const savedTopicId = localStorage.getItem(LS_KEYS.TOPIC_ID);
    if (savedTopicId) {
      const topic = CURRICULUM.find(t => t.id === savedTopicId);
      if (topic) {
        setCurrentTopic(topic);
        setExplanation(topic.detailedContent || topic.summary);
      }
    }
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

  const handleTopicSelect = (topic: Topic) => {
    setCurrentTopic(topic);
    setExplanation(topic.detailedContent || topic.summary);
    speak(topic.title);
    if (!completedTopics.includes(topic.id)) {
      setCompletedTopics(prev => [...prev, topic.id]);
    }
  };

  const difficultyColors = {
    [Difficulty.BEGINNER]: 'text-emerald-400 bg-emerald-400/10',
    [Difficulty.INTERMEDIATE]: 'text-sky-400 bg-sky-400/10',
    [Difficulty.ADVANCED]: 'text-amber-400 bg-amber-400/10',
    [Difficulty.EXPERT]: 'text-rose-400 bg-rose-400/10',
  };

  return (
    <div className="flex h-screen overflow-hidden dark:bg-slate-950 bg-slate-50 transition-colors">
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
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
              <div className="py-2">
                <EvolutionInfographic t={t} />
              </div>

              <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <p className="text-lg dark:text-slate-300 text-slate-600 leading-relaxed font-medium italic relative z-10">
                  "{currentTopic.summary}"
                </p>
              </div>

              <div className="dark:bg-slate-900/30 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
                <TopicExplanation explanation={explanation} isLoading={false} t={t} />
              </div>

              <footer className="mt-auto pb-12 flex flex-col items-center gap-3 pt-12 border-t dark:border-slate-900 border-slate-200" role="contentinfo">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold dark:text-slate-500 text-slate-400 tracking-wider">
                    {t.copyright}
                  </span>
                  <div className="h-4 w-[1px] dark:bg-slate-800 bg-slate-300" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] dark:text-slate-600 text-slate-500 uppercase font-bold tracking-widest">{t.feedback}:</span>
                    <a href="mailto:goldnoamai@gmail.com" className="text-xs font-bold dark:text-blue-400 text-blue-600 hover:text-blue-500 transition-colors underline decoration-dotted decoration-blue-500/30">
                      goldnoamai@gmail.com
                    </a>
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
