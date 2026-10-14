import React, { useState, useEffect, useMemo } from 'react';
import NodeDetails from './NodeDetails';
import TreeNodeItem from './TreeNodeItem';
import { findNodeByPath, formatBytes, searchTree } from './utils';
import { AlertCircle, ArrowLeft, FileCode, Folder, RefreshCw, Search } from 'lucide-react';
import type { NodeType } from './types';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const TreeView = ({ treeData }: { treeData: NodeType }) => {
  const { nodePath } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q') || '';
  const setSearchQuery = (q: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set('q', q);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  // Expanded folders state (store paths of expanded folders)
  const [expandedPaths, setExpandedPaths] = useState(() => {
    // Default root expanded
    const initial = new Set();
    if (treeData) initial.add(treeData.path);
    return initial;
  });

  // Automatically expand folders leading up to the selected nodePath
  useEffect(() => {
    if (nodePath && treeData) {
      const parts = nodePath.split('/');
      let current = treeData.name;
      const newExpanded = new Set(expandedPaths);
      newExpanded.add(current);
      for (let i = 0; i < parts.length - 1; i++) {
        current = `${current}/${parts[i]}`;
        newExpanded.add(current);
      }
      console.log("newExpanded", newExpanded);
      setExpandedPaths(newExpanded);
    }
  }, [nodePath, treeData]);

  const toggleFolder = (path: string) => {
    const next = new Set(expandedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setExpandedPaths(next);
  };

  // Find currently selected node based on nodePath param
  const selectedNode = useMemo(() => {
    if (!treeData) return null;
    if (!nodePath) {
      // Default selection to root if no nodePath specified
      return treeData;
    }
    return findNodeByPath(treeData, nodePath) || treeData;
  }, [treeData, nodePath]);

  // Global search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !treeData) return [];
    return searchTree(treeData, searchQuery.trim());
  }, [treeData, searchQuery]);

  if (!treeData) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Brak wczytanej struktury</h3>
          <p className="text-sm text-slate-400 mb-6">Wczytaj poprawny plik JSON lub powrót do strony głównej.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Przejdź do konfiguracji</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Sidebar / Tree Navigator */}
      <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] md:sticky md:top-16">
        {/* Top actions & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nawigator katalogów</span>
            <Link
              to="/"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Zmień JSON</span>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj pliku lub folderu..."
              className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tree items or Search results list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {searchQuery.trim() ? (
            <div className="space-y-1">
              <div className="text-xs font-semibold px-2 py-1 text-slate-400">
                Wyniki wyszukiwania ({searchResults.length}):
              </div>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-500 p-4 text-center">Brak wyników dla „{searchQuery}”</div>
              ) : (
                searchResults.map((node: NodeType) => {
                  // Compute route path relative to root path or absolute path from root
                  // Our node.path e.g. root/src/index.ts -> url param src/index.ts
                  const relativePath = node.path.replace(/^root\/?/, '');
                  const isSelected = selectedNode?.path === node.path;

                  return (
                    <button
                      key={node.path}
                      onClick={() => navigate(`/tree/${relativePath}`)}
                      className={`w-full text-left p-2 rounded-xl transition flex flex-col gap-1 text-xs ${
                        isSelected 
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' 
                          : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        {node.type === 'folder' ? (
                          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                        <span className="truncate">{node.name}</span>
                        <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                          {node.type === 'file' ? formatBytes(node.size) : `${node.childrenCount} elem.`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate pl-6">
                        {node.path}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <TreeNodeItem
              node={treeData}
              expandedPaths={expandedPaths}
              toggleFolder={toggleFolder}
              selectedNodePath={selectedNode?.path}
              rootName={treeData.name}
            />
          )}
        </div>
      </aside>

      {/* Main Content Detail Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 flex flex-col">
        {selectedNode ? (
          <NodeDetails node={selectedNode} rootName={treeData.name} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Wybierz element z drzewa po lewej stronie, aby zobaczyć szczegóły.
          </div>
        )}
      </div>
    </div>
  );
}
export default TreeView;