import React from "react";
import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatBytes } from "./utils";
import type { NodeType } from "./types";

const TreeNodeItem = ({ node, expandedPaths, toggleFolder, selectedNodePath, rootName }: { node: NodeType; expandedPaths: Set<string>; toggleFolder: (path: string) => void; selectedNodePath: string; rootName: string }) => {
  const navigate = useNavigate();
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedNodePath === node.path;

  // Compute relative path for link/navigation e.g. src/components/Button.tsx
  const relativePath = node.path === rootName ? '' : node.path.replace(new RegExp(`^${rootName}/?`), '');

  const handleSelect = (e : React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/tree/${relativePath}`);
  };

  const handleToggle = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      toggleFolder(node.path);
    }
  };

  return (
    <div className="text-xs select-none">
      <div
        onClick={handleSelect}
        className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition ${
          isSelected 
            ? 'bg-indigo-600 text-white font-medium shadow-sm' 
            : 'hover:bg-slate-800/80 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {node.type === 'folder' ? (
            <button 
              type="button" 
              onClick={handleToggle}
              className="p-0.5 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition"
            >
              {node.children && node.children.length > 0 ? (
                isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <span className="w-3.5 h-3.5 inline-block" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 inline-block" />
          )}

          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
            ) : (
              <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
            )
          ) : (
            <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
          )}

          <span className="truncate">{node.name}</span>
        </div>

        <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded shrink-0 ${
          isSelected 
            ? 'bg-indigo-700 text-indigo-100' 
            : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-800'
        }`}>
          {node.type === 'file' ? formatBytes(node.size) : `${node.childrenCount}`}
        </span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && node.children.length > 0 && (
        <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-800 ml-3">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              expandedPaths={expandedPaths}
              toggleFolder={toggleFolder}
              selectedNodePath={selectedNodePath}
              rootName={rootName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNodeItem;