import React, { useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { X, FileCode, ChevronRight as ChevronIcon } from 'lucide-react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { useTheme } from '../../contexts/ThemeContext';

const getLanguage = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'tsx': return 'typescript';
    case 'jsx': return 'javascript';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'py': return 'python';
    default: return 'text';
  }
};

export const EditorArea = React.memo(() => {
  const { files, activeFileId, openFileIds, setActiveFileId, closeFile, updateFileContent } = useFileSystem();
  const { theme } = useTheme();
  
  const activeFile = useMemo(() => files.find(f => f.id === activeFileId), [files, activeFileId]);
  const openFiles = useMemo(() => files.filter(f => openFileIds.includes(f.id)), [files, openFileIds]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  }, [activeFileId, updateFileContent]);

  const editorTheme = useMemo(() => {
    if (theme === 'light') return 'light';
    if (theme === 'hc') return 'hc-black';
    return 'vs-dark';
  }, [theme]);

  const editorOptions = useMemo(() => ({
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 12 },
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorBlinking: 'smooth' as const,
    renderWhitespace: 'none' as const,
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on' as const,
    folding: true,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  }), []);

  if (!activeFile && openFiles.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-full bg-vscode-editor items-center justify-center text-gray-500 opacity-60">
        <h1 className="text-4xl font-bold mb-4">VSCode-Type</h1>
        <p className="text-sm">Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-vscode-editor">
      {/* Tabs */}
      <div className="flex bg-vscode-inactive-tab overflow-x-auto no-scrollbar border-b border-vscode-border h-9">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => setActiveFileId(file.id)}
            className={`flex items-center px-3 cursor-pointer border-r border-vscode-border min-w-[120px] max-w-[200px] shrink-0 group relative ${
              activeFileId === file.id
                ? 'bg-vscode-active-tab text-white'
                : 'bg-vscode-inactive-tab text-gray-400 opacity-70 hover:opacity-100 hover:bg-vscode-hover'
            }`}
          >
            {activeFileId === file.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-vscode-accent" />
            )}
            <FileCode size={14} className="mr-2 text-blue-400 shrink-0" />
            <span className="text-[13px] last:truncate flex-1">{file.name}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); closeFile(file.id); }}
              className="ml-2 hover:bg-vscode-hover rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      {activeFile && (
        <div className="flex items-center px-4 py-1 text-[12px] text-gray-500 bg-vscode-editor gap-1 border-b border-vscode-border/50">
          <span className="hover:text-gray-300 cursor-pointer">src</span>
          <ChevronIcon size={12} />
          <span className="text-gray-300 font-medium">{activeFile.name}</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0 relative">
        {activeFile ? (
          <Editor
            height="100%"
            theme={editorTheme}
            path={activeFile.name}
            language={getLanguage(activeFile.name)}
            value={activeFile.content}
            onChange={handleEditorChange}
            options={editorOptions}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
             <p className="text-sm">Select a tab to view content</p>
          </div>
        )}
      </div>
    </div>
  );
});
