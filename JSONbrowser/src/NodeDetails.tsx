import React from "react";
import { 
  useNavigate 
} from 'react-router-dom';
import { ChevronRight, FileCode, Folder, FolderOpen } from "lucide-react";
import { formatBytes } from "./utils";
import type { NodeType } from "./types";

const NodeDetails = ({ node, rootName }: { node: NodeType; rootName: string }) => {
  const navigate = useNavigate();

  const getRelativePath = (fullPath: string) => {
    if (fullPath === rootName) return '';
    return fullPath.replace(new RegExp(`^${rootName}/?`), '');
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      {/* Breadcrumb / Path header */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800 overflow-x-auto">
        <span>root</span>
        {node.path !== rootName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-slate-200 font-medium truncate">{node.path.replace(/^root\/?/, '')}</span>
          </>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3.5 rounded-2xl ${
              node.type === 'folder' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {node.type === 'folder' ? <FolderOpen className="w-8 h-8" /> : <FileCode className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{node.name}</h2>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full ${
                  node.type === 'folder' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {node.type === 'folder' ? 'Folder' : 'Plik'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">{node.path}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        {node.type === 'file' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium mb-1">Rozmiar pliku</span>
              <span className="text-lg font-bold text-white font-mono">{formatBytes(node.size)}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">({node.size} bajtów)</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium mb-1">Typ węzła</span>
              <span className="text-lg font-bold text-white capitalize">Plik źródłowy</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Liść w drzewie katalogów</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium mb-1">Liczba bezpośrednich dzieci</span>
              <span className="text-lg font-bold text-white font-mono">{node.childrenCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Elementów w tym katalogu</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium mb-1">Całkowity rozmiar (poddrzewo)</span>
              <span className="text-lg font-bold text-white font-mono">{formatBytes(node.totalSize)}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Suma rozmiarów wszystkich plików</span>
            </div>
          </div>
        )}

        {/* Folder Children List */}
        {node.type === 'folder' && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Zawartość katalogu ({node.children?.length || 0})</h3>
            {(!node.children || node.children.length === 0) ? (
              <div className="text-xs text-slate-500 bg-slate-950 p-6 rounded-xl text-center border border-slate-800">
                Ten folder jest pusty.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {node.children.map((child) => {
                  const childRelative = getRelativePath(child.path);
                  return (
                    <button
                      key={child.path}
                      onClick={() => navigate(`/tree/${childRelative}`)}
                      className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {child.type === 'folder' ? (
                          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                        <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">{child.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded shrink-0 ml-2">
                        {child.type === 'file' ? formatBytes(child.size) : `${child.childrenCount} elem.`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeDetails;