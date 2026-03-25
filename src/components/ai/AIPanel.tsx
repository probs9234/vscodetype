import React, { useState } from 'react';
import { Sparkles, Send, X, Pause, Play, Square } from 'lucide-react';
import { useAITyping } from '../../hooks/useAITyping';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { motion, AnimatePresence } from 'framer-motion';

export const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const { type, pause, resume, cancel, isTyping, isPaused } = useAITyping();
  const { activeFileId, updateFileContent, files } = useFileSystem();

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeFileId) return;
    
    // Simple prompt-to-code local logic for demo/replica
    let codeToType = `// Generated for: ${prompt}\n\n`;
    if (prompt.toLowerCase().includes('react')) {
      codeToType += `import React from 'react';\n\nexport const GeneratedComponent = () => {\n  return (\n    <div className="p-4 border rounded-lg shadow-sm bg-vscode-sidebar">\n      <h2 className="text-xl font-bold mb-2">Hello From AI!</h2>\n      <p className="opacity-70">This code was typed with human-like precision.</p>\n      <button className="mt-4 px-4 py-2 bg-vscode-accent text-white rounded hover:opacity-90 transition-opacity">\n        Click Me\n      </button>\n    </div>\n  );\n};\n`;
    } else if (prompt.toLowerCase().includes('python')) {
      codeToType += `def main():\n    print("Hello from VSCode AI!")\n    data = [1, 2, 3, 4, 5]\n    squared = [x**2 for x in data]\n    print(f"Data: {data}")\n    print(f"Squared: {squared}")\n\nif __name__ == "__main__":\n    main()\n`;
    } else {
      codeToType += `function handleAction() {\n  console.log("Processing action...");\n  const result = calculateValue(10, 20);\n  notifyUser(result);\n}\n\nfunction calculateValue(a, b) {\n  return a + b * Math.random();\n}\n`;
    }

    const currentFileNode = files.find(f => f.id === activeFileId);
    const originalContent = currentFileNode?.content || '';

    type(codeToType, {
      speed,
      onProgress: (text) => {
        updateFileContent(activeFileId, originalContent + '\n' + text);
      },
    });
    setPrompt('');
  };

  return (
    <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 bg-vscode-sidebar border border-vscode-border rounded-lg shadow-2xl overflow-hidden mb-3 pointer-events-auto"
          >
            <div className="bg-vscode-activityBar px-4 py-2 flex items-center justify-between border-b border-vscode-border">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-vscode-accent" />
                <span className="text-[13px] font-medium">✦ Prompt → Code</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI to write some code..."
                className="w-full h-24 bg-vscode-input-bg text-vscode-input-fg text-[13px] p-2 rounded border border-vscode-border focus:outline-none focus:border-vscode-accent resize-none placeholder:opacity-50"
                disabled={isTyping}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {(['slow', 'normal', 'fast'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                        speed === s ? 'bg-vscode-accent text-white' : 'hover:bg-vscode-hover opacity-60'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <>
                      <button
                        onClick={isPaused ? resume : pause}
                        className="p-1.5 bg-vscode-hover rounded hover:bg-vscode-border text-white transition-colors"
                        title={isPaused ? "Resume" : "Pause"}
                      >
                        {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                      </button>
                      <button
                        onClick={cancel}
                        className="p-1.5 bg-red-900/30 text-red-500 rounded hover:bg-red-900/50 transition-colors"
                        title="Cancel"
                      >
                        <Square size={14} fill="currentColor" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || !activeFileId}
                      className="flex items-center gap-2 bg-vscode-accent text-white px-3 py-1.5 rounded text-[13px] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <span>Generate</span>
                      <Send size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {isTyping && (
              <div className="px-4 pb-2">
                <div className="h-1 bg-vscode-hover rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-vscode-accent"
                  />
                </div>
                <p className="text-[10px] mt-1 opacity-60 italic">AI is typing...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-3 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-vscode-border text-white' : 'bg-vscode-accent text-white'
        }`}
      >
        <Sparkles size={24} className={isTyping ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
};
