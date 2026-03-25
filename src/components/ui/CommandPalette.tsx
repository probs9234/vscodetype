import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Hash } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'theme-dark', label: 'Color Theme: Dark+ (Default)', action: () => setTheme('dark') },
    { id: 'theme-light', label: 'Color Theme: Light+', action: () => setTheme('light') },
    { id: 'theme-hc', label: 'Color Theme: High Contrast', action: () => setTheme('hc') },
    { id: 'toggle-wrap', label: 'View: Toggle Word Wrap', action: () => {} },
    { id: 'toggle-minimap', label: 'View: Toggle Minimap', action: () => {} },
    { id: 'new-file', label: 'File: New File', action: () => {} },
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      }
      if (e.key === 'Enter') {
        filteredCommands[selectedIndex]?.action();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="w-full max-w-[600px] bg-vscode-sidebar border border-vscode-border shadow-2xl rounded overflow-hidden"
      >
        <div className="flex items-center px-4 py-2 border-b border-vscode-border">
          <ChevronRight size={16} className="mr-2 text-vscode-accent" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-vscode-text placeholder:opacity-50"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {filteredCommands.map((cmd, index) => (
            <div
              key={cmd.id}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => { cmd.action(); onClose(); }}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer text-[13px] ${
                selectedIndex === index ? 'bg-vscode-accent text-white' : 'text-vscode-text/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash size={14} className="opacity-40" />
                <span>{cmd.label}</span>
              </div>
              {cmd.shortcut && (
                <span className={`text-[10px] opacity-60 ${selectedIndex === index ? 'text-white' : ''}`}>
                  {cmd.shortcut}
                </span>
              )}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm italic">
              No matching commands found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
