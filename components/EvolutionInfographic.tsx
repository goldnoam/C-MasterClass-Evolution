
import React, { useState, useEffect } from 'react';

const STANDARDS = [
  { 
    year: '1998', 
    name: 'C++98', 
    desc: 'The first official ISO standard. Introduced Templates & STL.',
    features: ['Standard Template Library (STL)', 'Templates', 'Namespaces', 'Boolean type', 'New casts'],
    example: `std::vector<int> v = {1, 2, 3};\nstd::sort(v.begin(), v.end());`,
    metrics: { performance: 85, safety: 20, simplicity: 30, modernity: 10 },
    icon: '🏗️'
  },
  { 
    year: '2011', 
    name: 'C++11', 
    desc: 'The "Renaissance". Added auto, lambdas, smart pointers, & move semantics.',
    features: ['Move Semantics', 'Lambda Expressions', 'Auto Keyword', 'Smart Pointers', 'Range-based for', 'nullptr'],
    example: `auto lambda = [](int x) { return x * x; };\nstd::unique_ptr<int> p = std::make_unique<int>(10);`,
    metrics: { performance: 95, safety: 55, simplicity: 50, modernity: 40 },
    icon: '🚀'
  },
  { 
    year: '2014', 
    name: 'C++14', 
    desc: 'Refinements to C++11. Added generic lambdas & binary literals.',
    features: ['Generic Lambdas', 'Return type deduction', 'std::make_unique', 'Variable templates', 'Binary literals'],
    example: `auto generic = [](auto a, auto b) { return a + b; };\nint b = 0b1010;`,
    metrics: { performance: 96, safety: 60, simplicity: 65, modernity: 50 },
    icon: '🛠️'
  },
  { 
    year: '2017', 
    name: 'C++17', 
    desc: 'Modern power. Structured bindings, std::optional, and fold expressions.',
    features: ['Structured Bindings', 'std::optional', 'std::variant', 'std::any', 'if constexpr', 'Fold expressions'],
    example: `auto [x, y] = get_point();\nif constexpr (std::is_integral_v<T>) { ... }`,
    metrics: { performance: 97, safety: 70, simplicity: 75, modernity: 70 },
    icon: '🧩'
  },
  { 
    year: '2020', 
    name: 'C++20', 
    desc: 'Massive update. Modules, Concepts, Ranges, and Coroutines.',
    features: ['Concepts', 'Ranges Library', 'Modules', 'Coroutines', 'Spaceship operator (<=>)', 'std::format'],
    example: `template<typename T> concept Numeric = std::is_arithmetic_v<T>;\nauto res = vec | std::views::filter(odd);`,
    metrics: { performance: 98, safety: 85, simplicity: 80, modernity: 90 },
    icon: '🌀'
  },
  { 
    year: '2023', 
    name: 'C++23', 
    desc: 'Functional touch. std::expected, deducing this, & stacktrace.',
    features: ['std::expected', 'Deducing this', 'Multidimensional subscript', 'std::stacktrace', 'Extended float types'],
    example: `std::expected<double, Error> divide(double a, double b);\nstruct X { void f(this X& self); };`,
    metrics: { performance: 99, safety: 92, simplicity: 85, modernity: 95 },
    icon: '⚡'
  },
  { 
    year: '2026', 
    name: 'C++26', 
    desc: 'The Future Horizon. Aiming for Reflection, Contracts, and static safety.',
    features: ['Static Reflection', 'Contracts', 'Pack Indexing', 'Placeholder variables', 'std::execution', 'Hazard Pointers'],
    example: `// Static Reflection Concept\nfor... (auto m : std::meta::members_of(^MyStruct)) {\n    std::print("Member: {}", std::meta::name_of(m));\n}\nvoid process(int x) [[pre: x > 0]];`,
    metrics: { performance: 100, safety: 98, simplicity: 95, modernity: 100 },
    icon: '✨'
  },
];

const MetricBar: React.FC<{ label: string; value: number; color: string; delay: number }> = ({ label, value, color, delay }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest dark:text-slate-400 text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full dark:bg-slate-800 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const EvolutionInfographic: React.FC<{ t: any }> = ({ t }) => {
  const [selectedStandard, setSelectedStandard] = useState<typeof STANDARDS[0] | null>(null);

  // Growth path calculation for SVG
  const generatePath = () => {
    const step = 100 / (STANDARDS.length - 1);
    return STANDARDS.map((std, i) => {
      const x = i * step;
      const y = 80 - (std.metrics.modernity * 0.7); // Higher modernity = lower Y (top)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="relative group/timeline">
      <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-8 overflow-x-auto custom-scrollbar shadow-sm relative overflow-hidden">
        
        {/* Background Evolution Wave */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d={`${generatePath()} L 100 100 L 0 100 Z`} fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h3 className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2 relative z-10">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {t.timelineTitle}
        </h3>
        
        <div className="flex gap-4 min-w-[1000px] relative pb-6 h-32 items-center z-10">
          {STANDARDS.map((std, i) => (
            <div key={std.name} className="flex-1 relative flex flex-col items-center">
              {/* Connector Line */}
              {i < STANDARDS.length - 1 && (
                <div className="absolute top-1/2 left-1/2 w-full h-[1px] dark:bg-slate-800 bg-slate-200 z-0" />
              )}
              
              <button 
                onClick={() => setSelectedStandard(std)}
                className={`group relative z-10 flex flex-col items-center transition-all duration-500 transform hover:-translate-y-2`}
              >
                {/* Year Bubble */}
                <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center mb-4 transition-all duration-500 shadow-lg
                  ${std.year === '2026' 
                    ? 'border-dashed border-cyan-500 bg-cyan-500/10 text-cyan-400 animate-pulse' 
                    : 'border-indigo-600/50 dark:bg-slate-900 bg-white text-indigo-600 group-hover:border-indigo-500 group-hover:shadow-indigo-500/20'}`}>
                  <span className="text-[10px] font-black opacity-50">{std.year}</span>
                  <span className="text-lg">{std.icon}</span>
                </div>

                <h4 className="text-[11px] font-black dark:text-slate-200 text-slate-800 uppercase tracking-tighter group-hover:text-indigo-500 transition-colors">
                  {std.name}
                </h4>

                {/* Growth indicator dot */}
                <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-[0_0_10px_#6366f1]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Detail Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedStandard(null)}>
          <div className="w-full max-w-5xl dark:bg-slate-900 bg-white rounded-3xl shadow-2xl border dark:border-slate-800 border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh] scale-in" onClick={e => e.stopPropagation()}>
            
            {/* Modal Left Sidebar: Profile & Metrics */}
            <div className="w-full md:w-72 dark:bg-slate-950/50 bg-slate-50 p-8 border-r dark:border-slate-800 border-slate-200 flex flex-col gap-8 shrink-0">
              <div className="text-center">
                <div className="text-5xl mb-4 p-4 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 inline-block shadow-xl">
                  {selectedStandard.icon}
                </div>
                <h3 className="font-black text-3xl dark:text-white text-slate-900">{selectedStandard.name}</h3>
                <p className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-[0.3em] mt-1">Capability Profile</p>
              </div>

              <div className="space-y-6">
                <MetricBar label="Performance" value={selectedStandard.metrics.performance} color="bg-rose-500" delay={100} />
                <MetricBar label="Type Safety" value={selectedStandard.metrics.safety} color="bg-emerald-500" delay={300} />
                <MetricBar label="Simplicity" value={selectedStandard.metrics.simplicity} color="bg-amber-500" delay={500} />
                <MetricBar label="Modernity" value={selectedStandard.metrics.modernity} color="bg-indigo-500" delay={700} />
              </div>

              <div className="mt-auto p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Standard Status</div>
                <div className="text-[11px] font-black dark:text-emerald-400 text-emerald-600">
                  {parseInt(selectedStandard.year) <= 2023 ? 'RELEASED' : 'PROPOSED'}
                </div>
              </div>
            </div>

            {/* Modal Right Area: Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-8 py-6 border-b dark:border-slate-800 border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest">{selectedStandard.year} Evolution</span>
                </div>
                <button onClick={() => setSelectedStandard(null)} className="p-2 dark:hover:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" /></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="space-y-4">
                  <p className="text-xl font-medium dark:text-slate-200 text-slate-700 leading-relaxed border-l-4 border-indigo-500 pl-6 italic">
                    "{selectedStandard.desc}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{t.keyFeatures}</h4>
                    <ul className="space-y-2">
                      {selectedStandard.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm dark:text-slate-300 text-slate-700">
                          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{t.example}</h4>
                    <div className="p-4 dark:bg-slate-950 bg-slate-900 rounded-2xl border dark:border-slate-800 border-slate-700 font-mono text-xs leading-relaxed overflow-x-auto">
                      <pre className="text-indigo-300"><code>{selectedStandard.example}</code></pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 dark:bg-slate-950/50 bg-slate-50 border-t dark:border-slate-800 border-slate-200 flex justify-end">
                <button onClick={() => setSelectedStandard(null)} className="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95">
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvolutionInfographic;
