import './App.css';
import React, { useState, useEffect } from 'react';
import { DEFAULT_JSON } from './consts';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
} from 'react-router-dom';
import { 
  RefreshCw,
  Layers
} from 'lucide-react';
import { enrichTree } from './utils';
import HomeView from './HomeView';
import TreeView from './ThreeView';
import type { NodeType } from './types';

const App = () => {
  const [treeData, setTreeData] = useState(() => {
    const saved = sessionStorage.getItem('dev_tool_json_tree');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return enrichTree(parsed);
      } catch (e) {
        console.error("Failed to parse saved session tree", e);
      }
    }
    return enrichTree(DEFAULT_JSON as NodeType);
  });

  const [jsonError, setJsonError] = useState(null);

  // Save to session storage whenever treeData changes
  useEffect(() => {
    if (treeData) {
      sessionStorage.setItem('dev_tool_json_tree', JSON.stringify(treeData));
    }
  }, [treeData]);

  const handleUpdateTree = (newJsonObj: NodeType) => {
    console.log("newJsonObj", newJsonObj)
    try {
      const enriched = enrichTree(newJsonObj);
      setTreeData(enriched);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError(error?.message ?? "Nieznany błąd podczas przetwarzania JSON");
      return false;
    }
  };

  const handleResetToDefault = () => {
    const enriched = enrichTree(JSON.parse(JSON.stringify(DEFAULT_JSON)));
    setTreeData(enriched);
    sessionStorage.setItem('dev_tool_json_tree', JSON.stringify(enriched));
    setJsonError(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Directory Visualizer</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Dev Tool</span>
              </h1>
              <p className="text-xs text-slate-400">Przeglądarka i analizator struktur JSON</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetToDefault}
              title="Przywróć domyślny przykładowy JSON"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Domyślny JSON</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomeView treeData={treeData} onUpdateTree={handleUpdateTree} jsonError={jsonError} />} />
            <Route path="/tree" element={<TreeView treeData={treeData} />} />
            <Route path="/tree/:nodePath" element={<TreeView treeData={treeData} />} />
            <Route path="*" element={<HomeView treeData={treeData} onUpdateTree={handleUpdateTree} jsonError={jsonError} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;