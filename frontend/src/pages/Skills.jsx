import React, { useState, useEffect } from 'react';
import { Terminal, Database, ShieldCheck, PenTool, LayoutTemplate, Settings2, Play, Circle } from 'lucide-react';

export default function Skills({ skills }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState(skills[0] || null);
  const [terminalLines, setTerminalLines] = useState([]);
  const [visibleLinesCount, setVisibleLinesCount] = useState(0);

  // Auto-select first skill when skills list loads or changes
  useEffect(() => {
    if (skills && skills.length > 0 && !selectedSkill) {
      setSelectedSkill(skills[0]);
    }
  }, [skills, selectedSkill]);

  // Dynamic Icon assignment based on category
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('language')) return <Terminal className="text-[#6D8196]" size={20} />;
    if (cat.includes('database')) return <Database className="text-[#6D8196]" size={20} />;
    if (cat.includes('testing')) return <ShieldCheck className="text-[#6D8196]" size={20} />;
    if (cat.includes('edit') || cat.includes('design')) return <PenTool className="text-[#6D8196]" size={20} />;
    if (cat.includes('framework')) return <LayoutTemplate className="text-[#6D8196]" size={20} />;
    return <Settings2 className="text-[#6D8196]" size={20} />;
  };

  // Group unique categories
  const categories = ['ALL', ...new Set(skills.map(s => s.category))];

  // Filter skills
  const filteredSkills = activeCategory === 'ALL'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  // Custom Terminal Script Generator
  const generateTerminalScript = (skill) => {
    if (!skill) return [];
    const name = skill.name;
    const cat = skill.category;
    const lvl = skill.level;

    const base = [
      `gowri@dev-shell:~$ initiate-diagnostic --tool "${name.toLowerCase()}"`,
      `[SYSTEM] Connecting to local toolchain benchmarks...`,
      `[SYSTEM] Category identified: ${cat.toUpperCase()}`,
      `[SYSTEM] Proficiency verification: ${lvl.toUpperCase()}`,
    ];

    if (name.includes('Java') && !name.includes('Script')) {
      return [
        ...base,
        `> java -jar SLIIT_academic_benchmark.jar`,
        `OpenJDK 64-Bit Server VM (build 21.0.2+13-LTS)`,
        `[SUCCESS] Multi-threaded software structures loaded (48 cores).`,
        `[SUCCESS] Memory footprint: 142MB. JVM thread latency: 0.8ms.`
      ];
    }
    if (name.includes('JavaScript') || name.includes('Express')) {
      return [
        ...base,
        `> node --eval "console.log(process.versions)"`,
        `{ node: '20.11.0', v8: '11.3.244.8-node.17', uv: '1.46.0' }`,
        `> Booting asynchronous MERN microservices cluster...`,
        `[SUCCESS] Express router online on local port: 5005. Status: STABLE.`
      ];
    }
    if (name.includes('React') || name.includes('Tailwind')) {
      return [
        ...base,
        `> npm run dev --vite`,
        `VITE v5.1.4  ready in 189ms`,
        `  ➜  Local:   http://localhost:5173/`,
        `[SUCCESS] Tailwind JIT compiler active. HMR connection online.`
      ];
    }
    if (name.includes('Mongo') || name.includes('SQL') || name.includes('MySQL')) {
      return [
        ...base,
        `> db.adminCommand({ ping: 1 })`,
        `Connecting to cluster0-shard-00-00.mongodb.net:27017...`,
        `[SUCCESS] Handshake verified. Latency: 14ms.`,
        `[SUCCESS] Data engine active. Current active connections: 8.`
      ];
    }
    if (name.includes('Selenium') || name.includes('Testing')) {
      return [
        ...base,
        `> pytest automated_testing_suite.py`,
        `==================== test session starts ====================`,
        `collected 24 test landmarks...`,
        `test_login.py . [PASSED]`,
        `test_api_endpoints.py ... [PASSED]`,
        `[SUCCESS] 24/24 integration unit benchmarks verified (100% green).`
      ];
    }
    if (name.includes('Git') || name.includes('GitHub')) {
      return [
        ...base,
        `> git push origin main`,
        `Enumerating objects: 8, done.`,
        `Writing objects: 100% (8/8), 1.02 KiB | 1.02 MiB/s, done.`,
        `[SUCCESS] Head branch 'main' successfully synced to origin/main.`
      ];
    }
    if (name.includes('Figma') || name.includes('Photo') || name.includes('Illustrator')) {
      return [
        ...base,
        `> parse-figma-spec --source="gowri_portfolio.fig"`,
        `Resolving design coordinate grids, outline paths, typography...`,
        `[SUCCESS] Theme successfully set to: [Pure White + Frozen Lake].`,
        `[SUCCESS] Glassmorphic coordinates exported to styles/tokens.`
      ];
    }
    if (name.includes('C++')) {
      return [
        ...base,
        `> g++ -O3 -std=c++20 main.cpp -o diagnostic_run`,
        `Compiling hardware-level optimized diagnostics...`,
        `[SUCCESS] Executable built (ARM64 macOS native binary).`,
        `[SUCCESS] Run latency execution time: 0.04ms.`
      ];
    }

    // Default Fallback
    return [
      ...base,
      `> run-generic-diagnostic --name="${name}"`,
      `Scanning repository commits, system details...`,
      `[SUCCESS] Custom landmark compiled for: ${name.toUpperCase()}!`,
      `[SUCCESS] Thread state: operational. Local environment: active.`
    ];
  };

  // Trigger Typing Animation when selectedSkill changes
  useEffect(() => {
    if (selectedSkill) {
      const script = generateTerminalScript(selectedSkill);
      setTerminalLines(script);
      setVisibleLinesCount(0);
    }
  }, [selectedSkill]);

  // Interval timer for typing/revealing lines gradually
  useEffect(() => {
    if (visibleLinesCount < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLinesCount(prev => prev + 1);
      }, 180); // Reveal a line every 180ms
      return () => clearTimeout(timer);
    }
  }, [visibleLinesCount, terminalLines]);

  return (
    <div className="relative min-h-screen w-full pt-32 pb-20 px-6 md:px-12 bg-white overflow-x-hidden">
      
      {/* Background Vertical Grid Lines */}
      <div className="bg-grid-lines">
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line hidden md:block"></div>
        <div className="grid-vertical-line"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 flex flex-col gap-12">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 select-none apple-reveal">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#6D8196]" />
            <span className="font-display text-xs tracking-widest font-extrabold text-[#6D8196]">02 / CAPABILITIES</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase text-black/90">
            TECHNICAL TOOLKIT
          </h1>
        </div>

        {/* Premium Pill Segment Categories Selector */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-black/[0.03] border border-black/5 p-1.5 rounded-2xl w-fit max-w-full backdrop-blur-md overflow-x-auto apple-reveal delay-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const firstOfCat = cat === 'ALL' 
                  ? skills[0] 
                  : skills.find(s => s.category === cat);
                if (firstOfCat) setSelectedSkill(firstOfCat);
              }}
              className={`font-display text-xs md:text-sm tracking-wider font-bold px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#000080] text-white shadow-lg shadow-black/10'
                  : 'text-black/60 hover:text-[#000080] hover:bg-black/5'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Master Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Segmented Telemetry Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 apple-reveal delay-200">
            {filteredSkills.map((skill, idx) => {
              const isSelected = selectedSkill && selectedSkill.name === skill.name;
              return (
                <div 
                  key={skill.id || idx}
                  onClick={() => setSelectedSkill(skill)}
                  className={`cursor-pointer rounded-2xl p-5 flex flex-col justify-between gap-5 group transition-all duration-500 hover:shadow-xl hover:shadow-[#000080]/5 hover:-translate-y-0.5 border select-none ${
                    isSelected 
                      ? 'bg-white border-[#000080] shadow-xl shadow-black/5 scale-[1.01]' 
                      : 'bg-white/40 border-black/5 hover:border-[#000080]/30 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'bg-[#000080]/10 text-[#000080]' : 'bg-black/[0.04] group-hover:bg-[#000080]/10 group-hover:text-[#000080]'
                    }`}>
                      {getCategoryIcon(skill.category)}
                    </div>
                    <span className={`font-display text-[10px] md:text-xs tracking-wide font-black px-3 py-1 rounded-full border transition-all duration-300 ${
                      skill.level === 'Advanced'
                        ? 'bg-[#ADD8E6]/20 border-[#ADD8E6]/40 text-[#000080]'
                        : 'bg-black/[0.03] border-black/5 text-black/50'
                    }`}>
                      {skill.level.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[10px] md:text-xs tracking-wider font-extrabold text-black/40 uppercase">
                      {skill.category}
                    </span>
                    <h3 className={`font-display text-lg md:text-xl font-black tracking-tight leading-none transition-colors ${
                      isSelected ? 'text-[#000080]' : 'text-black/90 group-hover:text-[#000080]'
                    }`}>
                      {skill.name}
                    </h3>
                  </div>

                  {/* 10-Segment LED Meter Display */}
                  <div className="flex flex-col gap-1 pt-1.5">
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-mono font-bold text-black/35">
                      <span>METER DIAGNOSTIC</span>
                      <span className={isSelected ? 'text-[#000080] font-black' : 'text-[#6D8196] font-black'}>
                        {skill.level === 'Advanced' ? '90%' : '70%'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, segmentIdx) => {
                        const isNodeActive = segmentIdx < (skill.level === 'Advanced' ? 9 : 7);
                        return (
                          <span 
                            key={segmentIdx}
                            className={`h-1.5 flex-grow rounded-sm transition-all duration-700 spring-fill`}
                            style={{ 
                              backgroundColor: isNodeActive 
                                ? (isSelected ? '#000080' : '#6D8196') 
                                : 'rgba(0, 0, 0, 0.05)',
                              animationDelay: `${segmentIdx * 60}ms`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE: Translucent Developer Diagnostics Console Terminal */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 apple-reveal delay-300">
            <div className="w-full bg-black/95 backdrop-blur-xl text-green-400 rounded-3xl p-6 border border-white/10 font-mono text-xs md:text-sm leading-relaxed shadow-2xl h-[380px] flex flex-col justify-between overflow-hidden relative select-none">
              
              {/* Subtle grid layer in background */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 select-none z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-white/45 font-display text-[9px] tracking-wider font-extrabold uppercase">
                  gowri@developer-shell:~
                </span>
                <Play size={10} className="text-green-500/70" />
              </div>

              {/* Terminal Screen Body */}
              <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-1 select-text scrollbar-thin z-10">
                {selectedSkill ? (
                  terminalLines.slice(0, visibleLinesCount).map((line, idx) => {
                    const isCommand = line.startsWith('>') || line.startsWith('gowri@');
                    const isSuccess = line.startsWith('[SUCCESS]');
                    const isSystem = line.startsWith('[SYSTEM]');
                    
                    let textColor = 'text-green-400/85';
                    if (isCommand) textColor = 'text-white font-bold';
                    if (isSuccess) textColor = 'text-sky-300 font-extrabold';
                    if (isSystem) textColor = 'text-[#ADD8E6]';

                    return (
                      <div key={idx} className={`whitespace-pre-wrap font-mono transition-opacity duration-300 ${textColor}`}>
                        {line}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-white/45 italic text-center py-20 font-sans">
                    Select any capability to run local compiler diagnostics...
                  </div>
                )}
                
                {/* Simulated Blinking Cursor at bottom */}
                {visibleLinesCount === terminalLines.length && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-white font-bold">gowri@dev-shell:~$</span>
                    <span className="w-1.5 h-3 bg-green-400 animate-pulse inline-block" />
                  </div>
                )}
              </div>

              {/* Status footer inside terminal */}
              <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3 text-white/40 text-[9px] select-none font-sans uppercase z-10">
                <span className="flex items-center gap-1.5">
                  <Circle size={8} className="fill-green-500 text-green-500" /> SYSTEM ONLINE
                </span>
                <span>BASED: BASH SHELL</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
