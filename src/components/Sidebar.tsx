import type { TraceEntry } from '../lib/zip';
import { FileCode, Search, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface SidebarProps {
    traces: TraceEntry[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReset: () => void;
}

export function Sidebar({ traces, selectedId, onSelect, onReset }: SidebarProps) {
    const [query, setQuery] = useState('');

    const filtered = traces.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-10">
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={onReset}
                        className="p-1 -ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        title="Upload different file"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="font-bold text-lg text-white">Trace Viewer</h2>
                </div>

                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Traces</span>
                    <span className="text-xs font-mono text-slate-500">{traces.length}</span>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search traces..."
                        className="w-full bg-slate-800 text-sm text-white placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filtered.map(trace => (
                    <button
                        key={trace.id}
                        onClick={() => onSelect(trace.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group",
                            selectedId === trace.id
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                        )}
                    >
                        <FileCode className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            selectedId === trace.id ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"
                        )} />
                        <span className="truncate flex-1">{trace.name}</span>
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-600">
                        No matching traces
                    </div>
                )}
            </div>
        </div>
    );
}
