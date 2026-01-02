
import React, { useState } from 'react';

const STANDARDS = [
  { 
    year: '1998', 
    name: 'C++98', 
    desc: 'The first official ISO standard. Introduced Templates & STL.',
    features: ['Standard Template Library (STL)', 'Templates', 'Namespaces', 'Boolean type', 'New casts (static_cast, etc.)'],
    example: `std::vector<int> v = {1, 2, 3};\nstd::sort(v.begin(), v.end());`
  },
  { 
    year: '2011', 
    name: 'C++11', 
    desc: 'The "Renaissance". Added auto, lambdas, smart pointers, & move semantics.',
    features: ['Move Semantics', 'Lambda Expressions', 'Auto Keyword', 'Smart Pointers (unique_ptr, shared_ptr)', 'Range-based for loops', 'nullptr'],
    example: `auto lambda = [](int x) { return x * x; };\nstd::unique_ptr<int> p = std::make_unique<int>(10);`
  },
  { 
    year: '2014', 
    name: 'C++14', 
    desc: 'Refinements to C++11. Added generic lambdas & binary literals.',
    features: ['Generic Lambdas', 'Return type deduction', 'std::make_unique', 'Variable templates', 'Binary literals'],
    example: `auto generic = [](auto a, auto b) { return a + b; };\nint b = 0b1010;`
  },
  { 
    year: '2017', 
    name: 'C++17', 
    desc: 'Modern power. Structured bindings, std::optional, and fold expressions.',
    features: ['Structured Bindings', 'std::optional', 'std::variant', 'std::any', 'if constexpr', 'Fold expressions'],
    example: `auto [x, y] = get_point();\nif constexpr (std::is_integral_v<T>) { ... }`
  },
  { 
    year: '2020', 
    name: 'C++20', 
    desc: 'Massive update. Modules, Concepts, Ranges, and Coroutines.',
    features: ['Concepts', 'Ranges Library', 'Modules', 'Coroutines', 'Spaceship operator (<=>)', 'std::format (partially)'],
    example: `template<typename T> concept Numeric = std::is_arithmetic_v<T>;\nauto res = vec | std::views::filter(odd);`
  },
  { 
    year: '2023', 
    name: 'C++23', 
    desc: 'Functional touch. std::expected, deducing this, & stacktrace.',
    features: ['std::expected', 'Deducing this', 'Multidimensional subscript operator', 'std::stacktrace', 'Extended floating-point types'],
    example: `std::expected<double, Error> divide(double a, double b);\nstruct X { void f(this X& self); };`
  },
  { 
    year: '2026', 
    name: 'C++26', 
    desc: 'The Future Horizon. Aiming for transformative features that simplify complex patterns.',
    features: [
      'Static Reflection (^T, [: reflection :])', 
      'Contracts (Pre/Post conditions & Assertions)', 
      'Pack Indexing (P2662: args...[i])', 
      'Placeholder Variables (P2169: _)', 
      'Structured Binding Attributes', 
      'std::execution (Sender/Receiver)', 
      'Hazard Pointers & RCU'
    ],
    example: `// Static Reflection Concept (P2996)\nfor... (auto m : std::meta::members_of(^MyStruct)) {\n    std::print("Member: {}", std::meta::name_of(m));\n}\n\n// Contracts (P2900)\nvoid process(int x) [[pre: x > 0]];`
  },
];

const EvolutionInfographic: React.FC<{ t: any }> = ({ t }) => {
  const [selectedStandard, setSelectedStandard] = useState<typeof STANDARDS[0] | null>(null);

  return (
    <div className="relative group/timeline">
      <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-8 overflow-x-auto custom-scrollbar shadow-sm">
        <h3 className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {t.timelineTitle}
        </h3>
        
        <div className="flex gap-4 min-w-[1000px] relative pb-6 h-32 items-center">
          {STANDARDS.map((std, i) => (
            <div key={std.name} className="flex-1 relative flex flex-col items-center">
              {/* Connector Line with Hover Effect */}
              {i < STANDARDS.length - 1 && (
                <div className="absolute top-1/2 left-1/2 w-full h-[2px] dark:bg-slate-800 bg-slate-200 z-0 
                  group-hover/timeline:bg-indigo-500/20 transition-all duration-700 ease-in-out" 
                />
              )}
              
              {/* Standard Node (Directly Clickable) */}
              <button 
                onClick={() => setSelectedStandard(std)}
                className={`group relative z-10 flex flex-col items-center transition-all duration-300 transform active:scale-95`}
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-black mb-4 transition-all duration-300
                  ${std.year === '2026' 
                    ? 'border-dashed border-cyan-500 bg-cyan-500/10 text-cyan-400 animate-pulse ring-4 ring-cyan-500/5' 
                    : 'border-indigo-600 dark:bg-slate-900 bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]'}`}>
                  {std.year.slice(2)}
                </div>
                <h4 className="text-[11px] font-black dark:text-slate-200 text-slate-800 uppercase tracking-tighter group-hover:text-indigo-500 transition-colors">
                  {std.name}
                </h4>
                <div className="h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-300 mt-1 rounded-full" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Detail Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedStandard(null)}>
          <div className="w-full max-w-3xl dark:bg-slate-900 bg-white rounded-3xl shadow-2xl border dark:border-slate-800 border-slate-200 overflow-hidden flex flex-col max-h-[90vh] scale-in" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 dark:bg-slate-950/50 bg-slate-50 border-b dark:border-slate-800 border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-black rounded-full ${selectedStandard.year === '2026' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'}`}>
                  ISO {selectedStandard.year}
                </span>
                <h3 className="font-black dark:text-white text-slate-900 text-2xl tracking-tight">{selectedStandard.name} {t.standardDetails}</h3>
              </div>
              <button onClick={() => setSelectedStandard(null)} className="p-2 dark:hover:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all text-slate-500 hover:rotate-90">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{t.keyFeatures}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStandard.features.map(f => (
                    <div key={f} className="flex items-center gap-3 p-3 dark:bg-slate-800/40 bg-slate-100 rounded-xl border dark:border-slate-700 border-slate-200 text-sm dark:text-slate-300 text-slate-700 font-medium">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{t.example}</h4>
                <div className="p-6 dark:bg-slate-950 bg-slate-900 rounded-2xl border dark:border-slate-800 border-slate-700 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner">
                  <pre className="text-indigo-300"><code className="language-cpp">{selectedStandard.example}</code></pre>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border leading-relaxed ${selectedStandard.year === '2026' ? 'bg-cyan-600/5 border-cyan-500/20 text-cyan-500' : 'bg-indigo-600/5 border-indigo-500/20 text-indigo-400'}`}>
                <p className="text-sm italic font-medium">
                  {selectedStandard.desc}
                </p>
              </div>
            </div>

            <div className="px-8 py-6 dark:bg-slate-950/50 bg-slate-50 border-t dark:border-slate-800 border-slate-200 flex justify-end">
              <button onClick={() => setSelectedStandard(null)} className="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-900/20 transition-all active:scale-95">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvolutionInfographic;
