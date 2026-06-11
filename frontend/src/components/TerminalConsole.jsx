import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';

export default function TerminalConsole({ onClose, projects, skills, settings }) {
  const [history, setHistory] = useState([
    'Welcome to GOWRI-OS Bash Shell v1.0.4 (macOS Native Emulator)',
    'Type "help" to see all available commands, or "exit" to return to visual mode.',
    ''
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of console
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const commandLine = input.trim();
      const args = commandLine.toLowerCase().split(' ');
      const cmd = args[0];

      let output = [];

      switch (cmd) {
        case 'help':
          output = [
            'Available system operations:',
            '  help               Display this operational matrix',
            '  ls                 List all mock database directories',
            '  cat [file]         Output contents of specified target file',
            '  clear              Clear console buffer',
            '  neofetch           Display system specs and developer coordinates',
            '  exit               Terminate terminal session and return to UI'
          ];
          break;
        case 'ls':
          output = [
            'total 42',
            '-rwxr-xr-x  1 gowri  staff   482B May 30 18:50 about.txt',
            '-rw-r--r--  1 gowri  staff   890B May 30 18:50 skills.json',
            '-rw-r--r--  1 gowri  staff   1.2K May 30 18:50 projects.json',
            '-rw-r--r--  1 gowri  staff   312B May 30 18:50 contact.txt'
          ];
          break;
        case 'cat':
          const target = args[1];
          if (!target) {
            output = ['Usage: cat [file_name] (e.g. cat about.txt)'];
          } else if (target === 'about.txt') {
            output = [
              '--- About Gowrishopanan ---',
              `Bio: ${settings.bio || 'Software Engineering Student specialized in full-stack MERN & automated ML models.'}`,
              'Location: Colombo, Sri Lanka',
              'University: SLIIT (Sri Lanka Institute of Information Technology)',
              'Focus Areas: Full-stack Web Systems, Deep Learning, Selenium Test Automation.'
            ];
          } else if (target === 'skills.json') {
            output = [
              '{',
              '  "category_programming": ["Java", "JavaScript", "C++", "SQL"],',
              `  "skills": [${skills.slice(0, 8).map(s => `"${s.name}"`).join(', ')}],`,
              '  "frameworks": ["React", "Express.js", "Node.js", "Tailwind CSS"],',
              '  "testing_frameworks": ["Selenium Webdriver", "PyTest"]',
              '}'
            ];
          } else if (target === 'projects.json') {
            output = projects.map(p => 
              `[PROJECT] ${p.title} - ${p.subtitle}\n  > Description: ${p.description}\n  > Tech: ${p.tags.join(', ')}\n`
            );
          } else if (target === 'contact.txt') {
            output = [
              '--- Official Contact Node ---',
              `Email: ${settings.email || 'siveswaran.shopanan@gmail.com'}`,
              `GitHub: ${settings.github || 'https://github.com'}`,
              `LinkedIn: ${settings.linkedin || 'https://linkedin.com'}`,
              'Server Status: 100% Online'
            ];
          } else {
            output = [`cat: ${target}: No such file or directory. Try 'ls' to see files.`];
          }
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'exit':
          onClose();
          return;
        case 'neofetch':
          output = [
            '  _,---|---,_      gowri@SLIIT-Node',
            '  `|  / \\  |`      ----------------',
            '   |  | |  |       OS: Gowri-OS macOS v1.0.4',
            '   |  \\ /  |       Uptime: 2 days, 14 hours',
            '   `|--|--|`       Shell: bash 5.2.21',
            '     ` | `         Base Station: Colombo, Sri Lanka',
            '                   CPU: Apple M3 Max (Developer Core)',
            '                   Theme: Frozen Lake Pure White',
            '                   Database: Connected (MongoDB Atlas)'
          ];
          break;
        case '':
          output = [];
          break;
        default:
          output = [`bash: command not found: ${cmd}. Type "help" for valid operations.`];
      }

      setHistory(prev => [
        ...prev, 
        `gowri@dev-shell:~$ ${commandLine}`,
        ...output,
        ''
      ]);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-[#33FF33] font-mono p-4 md:p-8 flex flex-col justify-between overflow-hidden select-text">
      
      {/* Terminal Title Bar Window controls */}
      <div className="flex items-center justify-between border-b border-[#33FF33]/20 pb-4 mb-4 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-black hover:opacity-80 transition-opacity"
            title="Exit Shell"
          >
            <X size={8} />
          </button>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 flex items-center justify-center text-black">
            <Minimize2 size={8} />
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-black">
            <Maximize2 size={8} />
          </div>
        </div>
        <span className="text-white/45 text-xs font-bold tracking-widest flex items-center gap-2">
          <Terminal size={14} className="text-[#33FF33]" /> GOWRI-OS BASH SHELL (DEV-STATION)
        </span>
        <button 
          onClick={onClose}
          className="text-[#33FF33] hover:text-white border border-[#33FF33]/30 hover:border-white px-3 py-1 rounded-lg text-[10px] tracking-widest font-extrabold uppercase transition-all duration-300"
        >
          EXIT SHELL
        </button>
      </div>

      {/* Retro Ascii Logo Banner */}
      <div className="flex-grow overflow-y-auto mb-4 scrollbar-thin text-xs md:text-sm leading-relaxed pr-2">
        <pre className="text-[#33FF33]/65 hidden md:block text-[8px] leading-tight select-none mb-6">
{`   _____  ______      ________ _____  _    _  ____  _____   _   _          _   _ 
  |  __ \\|  ____|    |  ____|  __ \\| |  | |/ __ \\|  __ \\ | \\ | |   /\\   | \\ | |
  | |  | | |__ ______| |__  | |__) | |  | | |  | | |__) |  \\| |  /  \\  |  \\| |
  | |  | |  __|______|  __| |  _  /| |  | | |  | |  ___/| . \` | / /\\ \\ | . \` |
  | |__| | |____     | |____| | \\ \\| |__| | |__| | |    | |\\  |/ ____ \\| |\\  |
  |_____/|______|    |______|_|  \\_\\\\____/ \\____/|_|    |_| \\_/_/    \\_\\_| \\_|`}
        </pre>

        <div className="flex flex-col gap-1.5">
          {history.map((line, index) => (
            <div 
              key={index} 
              className={`whitespace-pre-wrap ${
                line.startsWith('gowri@') 
                  ? 'text-white font-bold' 
                  : line.startsWith('---') || line.startsWith('[PROJECT]')
                  ? 'text-sky-300 font-extrabold'
                  : 'text-[#33FF33]/85'
              }`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Input line */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-white font-bold whitespace-nowrap">gowri@dev-shell:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-grow bg-transparent border-none outline-none text-[#33FF33] focus:ring-0 p-0 m-0 font-mono"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal window footer status bar */}
      <div className="flex items-center justify-between border-t border-[#33FF33]/20 pt-4 text-white/30 text-[10px] select-none">
        <span>SESSION: STABLE (BASH EMULATION)</span>
        <span>LATENCY: 14MS (ATLAS NODE)</span>
      </div>
    </div>
  );
}
