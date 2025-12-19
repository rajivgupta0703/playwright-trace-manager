import { useState, useEffect } from 'react';
import { Dropzone } from './components/Dropzone';
import { Sidebar } from './components/Sidebar';
import { TraceViewer } from './components/TraceViewer';
import { extractTraces, type TraceEntry, loadTraceBlob } from './lib/zip';

function App() {
  const [traces, setTraces] = useState<TraceEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for the currently loaded blob
  const [activeBlob, setActiveBlob] = useState<Blob | null>(null);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const extracted = await extractTraces(file);
      setTraces(extracted);
      if (extracted.length > 0) {
        setSelectedId(extracted[0].id);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to process file. Please ensure it's a valid zip archive.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTraces([]);
    setSelectedId(null);
    setError(null);
    setActiveBlob(null);
  };

  // Effect to load the blob when selection changes
  useEffect(() => {
    if (!selectedId) {
      setActiveBlob(null);
      return;
    }

    const trace = traces.find(t => t.id === selectedId);
    if (!trace) return;

    let active = true;

    const load = async () => {
      setIsLoadingBlob(true);
      try {
        const blob = await loadTraceBlob(trace);
        if (active) setActiveBlob(blob);
      } catch (e) {
        console.error("Failed to extract trace blob", e);
        setError("Failed to load trace data");
      } finally {
        if (active) setIsLoadingBlob(false);
      }
    };

    load();

    return () => { active = false; };
  }, [selectedId, traces]);

  if (traces.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trace Manager
            </h1>
            <p className="text-slate-400 text-lg">
              Upload a trace folder or zip archive to inspect multiple Playwright traces.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 p-1">
            <Dropzone onFileSelect={handleUpload} isProcessing={isProcessing} />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-lg text-sm text-center border border-red-500/20 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-slate-950 overflow-hidden">
      <Sidebar
        traces={traces}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onReset={handleReset}
      />
      <main className="flex-1 h-full bg-slate-900 relative">
        {isLoadingBlob ? (
          <div className="flex items-center justify-center h-full text-slate-500 flex-col gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <div>Extracting trace data...</div>
          </div>
        ) : activeBlob && selectedId ? (
          <TraceViewer traceBlob={activeBlob} key={selectedId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a trace to view
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
