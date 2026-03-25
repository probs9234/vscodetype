import React from 'react';
import { Files, Search, GitBranch, Play, Blocks, Settings, UserCircle } from 'lucide-react';

const items = [
  { icon: Files, label: 'Explorer', id: 'explorer' },
  { icon: Search, label: 'Search', id: 'search' },
  { icon: GitBranch, label: 'Source Control', id: 'git' },
  { icon: Play, label: 'Run and Debug', id: 'debug' },
  { icon: Blocks, label: 'Extensions', id: 'extensions' },
];

export const ActivityBar: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const [active, setActive] = React.useState('explorer');

  return (
    <div className="w-12 h-screen bg-vscode-activityBar flex flex-col items-center py-2 gap-4 border-r border-vscode-border group shrink-0">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`relative p-2 transition-colors duration-200 hover:text-white ${
            active === item.id ? 'text-white border-l-2 border-white' : 'text-gray-400'
          }`}
          title={item.label}
        >
          <item.icon size={24} strokeWidth={1.5} />
        </button>
      ))}

      <div className="mt-auto flex flex-col items-center gap-4 pb-2">
        <button className="text-gray-400 hover:text-white transition-colors" title="Accounts">
          <UserCircle size={24} strokeWidth={1.5} />
        </button>
        <button onClick={onOpenSettings} className="text-gray-400 hover:text-white transition-colors" title="Settings">
          <Settings size={24} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
