import React, { createContext, useContext, useRef } from 'react';
import { useAITyping } from '../hooks/useAITyping';
import { useFileSystem } from './FileSystemContext';

interface TypingContextType {
  isTyping: boolean;
  isPaused: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeFileId, files, updateFileContent } = useFileSystem();
  const { type, pause, resume, cancel, isTyping, isPaused } = useAITyping();
  const originalContent = useRef<string>('');

  const startSimulation = () => {
    const activeFile = files.find(f => f.id === activeFileId);
    if (!activeFile || isTyping) return;

    originalContent.current = activeFile.content || '';
    updateFileContent(activeFile.id, ''); // Clear editor
    
    type(originalContent.current, {
      speed: 'fast',
      onProgress: (text) => {
        updateFileContent(activeFile.id, text);
      },
    });
  };

  return (
    <TypingContext.Provider value={{
      isTyping,
      isPaused,
      startSimulation,
      pauseSimulation: pause,
      resumeSimulation: resume,
      stopSimulation: cancel
    }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (!context) throw new Error('useTyping must be used within a TypingProvider');
  return context;
};
