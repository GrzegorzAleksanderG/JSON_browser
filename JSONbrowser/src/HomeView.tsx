import { AlertCircle, ChevronRight, FileJson, Upload } from "lucide-react";
import { DEFAULT_JSON } from "./consts";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import type { NodeType } from "./types";

const HomeView =({ treeData, onUpdateTree, jsonError } : { treeData: NodeType; onUpdateTree: (data: NodeType) => boolean; jsonError: string | null }) => {
  const [inputJson, setInputJson] = useState(() => JSON.stringify(treeData, null, 2));
  const [errorMsg, setErrorMsg] = useState(jsonError);
  const navigate = useNavigate();

  const handleLoadSample = () => {
    setInputJson(JSON.stringify(DEFAULT_JSON, null, 2));
    onUpdateTree(DEFAULT_JSON as NodeType);
    setErrorMsg(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
    setErrorMsg(null);
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(inputJson);
      if (!parsed.name || !parsed.type) {
        throw new Error("Struktura JSON musi zawierać przynajmniej pole 'name' oraz 'type' w korzeniu.");
      }
      const success = onUpdateTree(parsed);
      if (success) {
        navigate('/tree');
      }
    } catch (err) {
      setErrorMsg(`Błąd parsowania JSON: ${err.message}`);
    }
  };

  const handleFileUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputJson(content);
        try {
          const parsed = JSON.parse(content);
          const success = onUpdateTree(parsed);
          if (success) {
            navigate('/tree');
          }
        } catch (err) {
          setErrorMsg(`Błąd parsowania pliku JSON: ${err.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-indigo-400" />
              <span>Wgraj lub wklej strukturę JSON katalogu</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Wklej surowy kod JSON reprezentujący drzewo katalogów i plików lub wgraj plik z dysku.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              type="button"
              className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium px-3 py-2 rounded-xl border border-indigo-500/30 transition flex items-center gap-1.5"
            >
              <span>Wczytaj szablon</span>
            </button>
            <label className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Wgraj plik .json</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Nieprawidłowy format JSON</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={12}
              value={inputJson}
              onChange={handleTextChange}
              placeholder='{"name": "root", "type": "folder", "children": [...] }'
              className="w-full font-mono text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y shadow-inner"
              spellCheck="false"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400">
              Przykładowa struktura zawiera zagnieżdżone foldery oraz pliki z rozmiarami w bajtach.
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-sm"
            >
              <span>Wizualizuj drzewo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default HomeView;