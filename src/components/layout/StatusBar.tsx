import React from 'react';
import { GitBranch, Bell, Wifi, Sparkles, Play, Pause, Square, X } from 'lucide-react';
import { useTyping } from '../../contexts/TypingContext';

export const StatusBar = React.memo(() => {
  const { isTyping, isPaused, startSimulation, pauseSimulation, resumeSimulation, stopSimulation } = useTyping();

  return (
    <div className="h-[22px] bg-vscode-statusBar flex items-center justify-between px-3 text-[12px] text-gray-400 select-none shrink-0 border-t border-vscode-border">
      <div className="flex items-center gap-4 h-full">
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1 cursor-pointer h-full">
          <GitBranch size={13} />
          <span>main*</span>
        </div>
        
        {/* Simulation Controls (Integrated into Status Bar) */}
        {isTyping ? (
          <div className="flex items-center bg-vscode-accent/20 px-2 rounded h-[18px] gap-2 ml-2">
            <button 
              onClick={isPaused ? resumeSimulation : pauseSimulation}
              className="text-white hover:text-vscode-accent transition-colors"
            >
              {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
            </button>
            <button 
              onClick={stopSimulation}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <Square size={10} fill="currentColor" />
            </button>
            <span className="text-[10px] text-white opacity-80 uppercase tracking-tighter">Recording Reel...</span>
          </div>
        ) : (
          <button 
            onClick={startSimulation}
            className="flex items-center gap-1 px-2 hover:bg-vscode-accent hover:text-white transition-all h-[18px] text-[10px] font-bold uppercase tracking-wider"
            title="Start Reel Simulation"
          >
            <Play size={10} fill="currentColor" className="text-green-500" />
            <span>RUN REEL</span>
          </button>
        )}

        <div className="flex items-center gap-3 hover:bg-white/10 px-1 cursor-pointer h-full text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full border border-gray-500 flex items-center justify-center">
              <X size={8} strokeWidth={3} />
            </div>
            <span className="text-[11px]">0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-gray-400 translate-y-[-1px]"></div>
            <span className="text-[11px]">0</span>
          </div>
        </div>
        <div className="text-[11px] opacity-60 hidden md:block">3 files and 0 cells to analyze</div>
      </div>

      <div className="flex items-center h-full">
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center">Ln 2, Col 1</div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center">Spaces: 4</div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center">UTF-8</div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center">CRLF</div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center gap-1.5">
          <Sparkles size={13} className="text-vscode-accent" />
          <span>Python</span>
        </div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center gap-1">
          <Wifi size={13} />
          <span>Go Live</span>
        </div>
        <div className="hover:bg-white/10 px-2 cursor-pointer h-full flex items-center pr-2">
          <Bell size={13} />
        </div>
        <div className="flex items-center gap-1.5 px-3 bg-vscode-accent/10 border-l border-vscode-border h-full group">
          <span className="text-[10px] text-gray-500 group-hover:text-gray-400">BUILD BY</span>
          <span className="text-[11px] font-bold text-vscode-accent tracking-tighter">PROBS</span>
        </div>
      </div>
    </div>
  );
});
