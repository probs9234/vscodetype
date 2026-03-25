import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, FileCode, Plus, FolderPlus, 
  Trash2, FileJson, FileText, FileCode2, Hash, Type, 
  FileCheck, File as FileIcon, MoreHorizontal
} from 'lucide-react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import type { FileNode } from '../../contexts/FileSystemContext';

export const SideBar = React.memo(() => {
  const { files, createFile, createFolder } = useFileSystem();
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);

  const startCreation = (type: 'file' | 'folder', parentId: string | null = null) => {
    setIsCreating(type);
    setNewItemParentId(parentId);
  };

  const handleFinishCreation = (name: string) => {
    if (name.trim()) {
      if (isCreating === 'file') createFile(name, newItemParentId);
      else if (isCreating === 'folder') createFolder(newItemParentId ? name : name, newItemParentId);
    }
    setIsCreating(null);
    setNewItemParentId(null);
  };

  const renderTree = (parentId: string | null, depth = 0) => {
    const children = files.filter((f) => f.parentId === parentId);
    
    return (
      <>
        {children.sort((a,b) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1) || a.name.localeCompare(b.name)).map((file) => (
          <FileItem key={file.id} file={file} depth={depth} onNewItem={startCreation} />
        ))}
        {isCreating && newItemParentId === parentId && (
          <div className="px-4 py-1 flex items-center" style={{ paddingLeft: `${(depth + 1) * 12 + 16}px` }}>
            <span className="mr-2">
              {isCreating === 'file' ? <FileIcon size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
            </span>
            <input
              autoFocus
              className="bg-vscode-input-bg text-vscode-input-fg text-[13px] border border-vscode-accent outline-none w-full px-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFinishCreation(e.currentTarget.value);
                if (e.key === 'Escape') setIsCreating(null);
              }}
              onBlur={(e) => handleFinishCreation(e.target.value)}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-64 h-full bg-vscode-sidebar flex flex-col border-r border-vscode-border shrink-0 select-none overflow-hidden hover:overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
        <span>Explorer</span>
        <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
           <button onClick={() => startCreation('file')} className="p-1 hover:bg-vscode-hover rounded" title="New File"><Plus size={14} /></button>
           <button onClick={() => startCreation('folder')} className="p-1 hover:bg-vscode-hover rounded" title="New Folder"><FolderPlus size={14} /></button>
           <button className="p-1 hover:bg-vscode-hover rounded"><MoreHorizontal size={14} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex items-center px-4 py-1 text-[11px] font-bold text-gray-300 hover:bg-vscode-hover cursor-pointer group">
          <ChevronDown size={14} className="mr-1" />
          <span>PROJECT</span>
        </div>
        <div className="mt-1">
          {renderTree(null)}
        </div>
      </div>

      {/* Outline & Timeline Sections */}
      <div className="mt-auto border-t border-vscode-border divide-y divide-vscode-border/30">
        <div className="flex items-center px-4 py-1.5 text-[11px] font-bold text-gray-300 hover:bg-vscode-hover cursor-pointer uppercase tracking-normal">
          <ChevronRight size={14} className="mr-2 opacity-60" />
          <span>OUTLINE</span>
        </div>
        <div className="flex items-center px-4 py-1.5 text-[11px] font-bold text-gray-300 hover:bg-vscode-hover cursor-pointer uppercase tracking-normal">
          <ChevronRight size={14} className="mr-2 opacity-60" />
          <span>TIMELINE</span>
        </div>
      </div>
    </div>
  );
});

const FileItem: React.FC<{ 
  file: FileNode; 
  depth: number; 
  onNewItem: (type: 'file' | 'folder', parentId: string) => void;
}> = ({ file, depth, onNewItem }) => {
  const { openFile, activeFileId, files, deleteNode } = useFileSystem();
  const [isOpen, setIsOpen] = useState(file.isOpen || false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      openFile(file.id);
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx': return <FileCode2 size={14} className="text-blue-400" />;
      case 'js':
      case 'jsx': return <FileCode size={14} className="text-yellow-400" />;
      case 'json': return <FileJson size={14} className="text-yellow-600" />;
      case 'css': return <Hash size={14} className="text-blue-500" />;
      case 'html': return <FileText size={14} className="text-orange-500" />;
      case 'md': return <Type size={14} className="text-gray-400" />;
      case 'py': return <FileCheck size={14} className="text-green-500" />;
      default: return <FileIcon size={14} className="text-gray-400" />;
    }
  };

  const children = files.filter(f => f.parentId === file.id);

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center px-4 py-[3px] cursor-pointer text-[13px] hover:bg-vscode-hover group whitespace-nowrap ${
          activeFileId === file.id ? 'bg-vscode-hover text-white' : 'text-gray-400'
        }`}
        style={{ paddingLeft: `${(depth + 1) * 12 + 16}px` }}
      >
        <span className="flex items-center min-w-[20px]">
          {file.type === 'folder' ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14}/>
          ) : getFileIcon(file.name)}
        </span>
        <span className={`ml-1 flex-1 truncate ${activeFileId === file.id ? 'text-white' : ''}`}>
          {file.name}
        </span>
        
        {/* Actions */}
        <div className="hidden group-hover:flex items-center gap-1.5 px-2">
          {file.type === 'folder' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onNewItem('file', file.id); }}
                className="hover:text-white" title="New File"
              >
                <Plus size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNewItem('folder', file.id); }}
                className="hover:text-white" title="New Folder"
              >
                <FolderPlus size={14} />
              </button>
            </>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); deleteNode(file.id); }}
            className="hover:text-red-400" title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {file.type === 'folder' && isOpen && (
        <div className="mt-[-1px]">
          {children.sort((a,b) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1) || a.name.localeCompare(b.name)).map(child => (
            <FileItem key={child.id} file={child} depth={depth + 1} onNewItem={onNewItem} />
          ))}
        </div>
      )}
    </div>
  );
};
