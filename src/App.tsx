import { useState, useEffect, useCallback } from 'react';
import { ActivityBar } from './components/layout/ActivityBar';
import { SideBar } from './components/layout/SideBar';
import { EditorArea } from './components/layout/EditorArea';
import { StatusBar } from './components/layout/StatusBar';
import { ThemeProvider } from './contexts/ThemeContext';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { CommandPalette } from './components/ui/CommandPalette';
import { SettingsModal } from './components/ui/SettingsModal';
import { TitleBar } from './components/layout/TitleBar';
import { TypingProvider } from './contexts/TypingContext';

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleOpenCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleCloseCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        handleOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenCommandPalette]);

  return (
    <ThemeProvider>
      <FileSystemProvider>
        <TypingProvider>
          <div className="flex flex-col h-screen overflow-hidden bg-vscode-bg text-vscode-text select-none">
            <TitleBar onSearchClick={handleOpenCommandPalette} />
            
            <div className="flex flex-1 overflow-hidden">
              <ActivityBar onOpenSettings={handleOpenSettings} />
              <SideBar />
              <div className="flex-1 flex flex-col min-w-0">
                <EditorArea />
              </div>
            </div>

            <StatusBar />

            {/* Overlays */}
            {isCommandPaletteOpen && (
              <CommandPalette onClose={handleCloseCommandPalette} />
            )}
            {isSettingsOpen && (
              <SettingsModal onClose={handleCloseSettings} />
            )}
          </div>
        </TypingProvider>
      </FileSystemProvider>
    </ThemeProvider>
  );
}

export default App;
