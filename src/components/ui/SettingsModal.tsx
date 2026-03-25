import React from 'react';
import { X, Sliders, Type, Layout, Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-vscode-sidebar border border-vscode-border shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="px-6 py-4 border-b border-vscode-border flex items-center justify-between bg-vscode-activityBar">
          <div className="flex items-center gap-2 font-bold">
            <Sliders size={18} className="text-vscode-accent" />
            <span>Settings</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-vscode-hover rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <Section icon={Palette} title="Appearance">
            <SettingItem label="Color Theme" description="Choose the editor's visual theme.">
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="bg-vscode-bg border border-vscode-border p-1.5 rounded text-sm outline-none focus:border-vscode-accent"
              >
                <option value="dark">Dark+ (Default)</option>
                <option value="light">Light+</option>
                <option value="hc">High Contrast</option>
              </select>
            </SettingItem>
          </Section>

          <Section icon={Type} title="Editor">
            <SettingItem label="Font Size" description="Controls the font size in pixels.">
              <input type="number" defaultValue={14} className="bg-vscode-bg border border-vscode-border p-1.5 rounded text-sm w-20 outline-none" />
            </SettingItem>
            <SettingItem label="Font Family" description="Controls the font family.">
              <select className="bg-vscode-bg border border-vscode-border p-1.5 rounded text-sm outline-none">
                <option>Consolas</option>
                <option>JetBrains Mono</option>
                <option>Roboto Mono</option>
              </select>
            </SettingItem>
          </Section>

          <Section icon={Layout} title="Workbench">
            <SettingItem label="Minimap" description="Controls if the minimap is shown.">
              <input type="checkbox" defaultChecked className="accent-vscode-accent h-4 w-4" />
            </SettingItem>
            <SettingItem label="Word Wrap" description="Controls how lines should wrap.">
              <input type="checkbox" className="accent-vscode-accent h-4 w-4" />
            </SettingItem>
          </Section>
        </div>

        <div className="px-6 py-4 border-t border-vscode-border bg-vscode-activityBar flex justify-end">
          <button 
            onClick={onClose}
            className="bg-vscode-accent text-white px-6 py-2 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Section: React.FC<{ icon: any, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2 text-sm font-bold opacity-60 uppercase tracking-widest border-b border-vscode-border pb-2">
      <Icon size={14} />
      <span>{title}</span>
    </div>
    <div className="flex flex-col gap-6">
      {children}
    </div>
  </div>
);

const SettingItem: React.FC<{ label: string, description: string, children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex items-start justify-between gap-8">
    <div className="flex-1">
      <div className="text-[14px] font-medium mb-1">{label}</div>
      <div className="text-[12px] opacity-60 leading-relaxed">{description}</div>
    </div>
    <div className="shrink-0">
      {children}
    </div>
  </div>
);
