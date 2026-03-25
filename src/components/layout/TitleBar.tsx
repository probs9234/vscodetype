import React from 'react';
import { 
  ArrowLeft, ArrowRight, Search, Layout, 
  Minus, Square, X, MoreHorizontal 
} from 'lucide-react';

interface TitleBarProps {
  onSearchClick: () => void;
}

export const TitleBar = React.memo(({ onSearchClick }: TitleBarProps) => {
  return (
    <div className="h-9 bg-vscode-titleBar flex items-center justify-between px-3 text-[12px] text-gray-400 select-none shrink-0 border-b border-vscode-border">
      {/* Left: Window Controls / App Icon */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img src="/vite.svg" alt="VS Code" className="w-4 h-4" />
          <div className="flex gap-4">
            <span className="hover:bg-vscode-hover px-2 py-1 rounded cursor-default">File</span>
            <span className="hover:bg-vscode-hover px-2 py-1 rounded cursor-default">Edit</span>
            <span className="hover:bg-vscode-hover px-2 py-1 rounded cursor-default">Selection</span>
            <span className="hover:bg-vscode-hover px-2 py-1 rounded cursor-default hidden md:block">View</span>
            <span className="hover:bg-vscode-hover px-2 py-1 rounded cursor-default hidden md:block">Go</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <ArrowLeft size={16} className="opacity-50" />
          <ArrowRight size={16} className="opacity-50" />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div 
        onClick={onSearchClick}
        className="flex items-center justify-center bg-vscode-input-bg hover:bg-vscode-hover border border-vscode-border rounded-md px-4 py-1 w-[400px] gap-2 cursor-pointer transition-colors"
      >
        <Search size={14} />
        <span className="text-[11px] opacity-60">vscodetype - Visual Studio Code</span>
      </div>

      {/* Right: Layout / Window Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4 border-r border-vscode-border pr-2">
          <Layout size={16} className="hover:text-white cursor-pointer" />
          <MoreHorizontal size={16} className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-vscode-hover text-white transition-colors">
            <Minus size={14} />
          </button>
          <button className="p-2 hover:bg-vscode-hover text-white transition-colors">
            <Square size={12} />
          </button>
          <button className="p-2 hover:bg-red-500 text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});
