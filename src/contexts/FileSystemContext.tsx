import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId: string | null;
  isOpen?: boolean;
}

interface FileSystemContextType {
  files: FileNode[];
  activeFileId: string | null;
  openFileIds: string[];
  setActiveFileId: (id: string | null) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  createFile: (name: string, parentId: string | null) => void;
  createFolder: (name: string, parentId: string | null) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteNode: (id: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const INITIAL_FILES: FileNode[] = [
  { id: '1', name: 'src', type: 'folder', parentId: null, isOpen: true },
  { id: '2', name: 'App.tsx', type: 'file', parentId: '1', content: 'import React from "react";\n\nexport default function App() {\n  return <div>Hello VSCode!</div>;\n}' },
  { id: '3', name: 'index.css', type: 'file', parentId: '1', content: 'body {\n  margin: 0;\n  padding: 0;\n}' },
  { id: '4', name: 'README.md', type: 'file', parentId: null, content: '# VSCode-Type\n\nA professional AI coding assistant.' },
];

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('vscode-files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  
  const [activeFileId, setActiveFileId] = useState<string | null>(() => {
    return localStorage.getItem('vscode-active-file') || '2';
  });
  
  const [openFileIds, setOpenFileIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('vscode-open-files');
    return saved ? JSON.parse(saved) : ['2', '3'];
  });

  // Debounced Save to LocalStorage
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('vscode-files', JSON.stringify(files));
      localStorage.setItem('vscode-open-files', JSON.stringify(openFileIds));
      if (activeFileId) localStorage.setItem('vscode-active-file', activeFileId);
    }, 1000); // Save only after 1s of inactivity
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [files, openFileIds, activeFileId]);

  const openFile = useCallback((id: string) => {
    setOpenFileIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setActiveFileId(id);
  }, []);

  const closeFile = useCallback((id: string) => {
    setOpenFileIds(prev => {
      const next = prev.filter(fid => fid !== id);
      if (activeFileId === id) {
        setActiveFileId(next.length > 0 ? next[next.length - 1] : null);
      }
      return next;
    });
  }, [activeFileId]);

  const createFile = useCallback((name: string, parentId: string | null) => {
    const newFile: FileNode = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'file',
      content: '',
      parentId,
    };
    setFiles(prev => [...prev, newFile]);
    setOpenFileIds(prev => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
  }, []);

  const createFolder = useCallback((name: string, parentId: string | null) => {
    const newFolder: FileNode = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'folder',
      parentId,
      isOpen: true,
    };
    setFiles(prev => [...prev, newFolder]);
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id && f.parentId !== id));
    setOpenFileIds(prev => prev.filter(fid => fid !== id));
    if (activeFileId === id) setActiveFileId(null);
  }, [activeFileId]);

  const value = useMemo(() => ({ 
    files, activeFileId, openFileIds, 
    setActiveFileId, openFile, closeFile, 
    createFile, createFolder, updateFileContent, deleteNode 
  }), [files, activeFileId, openFileIds, openFile, closeFile, createFile, createFolder, updateFileContent, deleteNode]);

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used within a FileSystemProvider');
  return context;
};
