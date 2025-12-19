import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { cn } from '../lib/utils';

interface DropzoneProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export function Dropzone({ onFileSelect, isProcessing }: DropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        // Check for files
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Find the first zip file or use the first file
            const zipFile = Array.from(files).find(f => f.name.toLowerCase().endsWith('.zip'));
            onFileSelect(zipFile || files[0]);
        }
    }, [onFileSelect]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // If multiple files (like from a folder upload), we pick the first one 
            // but ideally we should handle multiple selection if we wanted to support direct folder selection better.
            // For now, let's just stick to the main request: zipped folder.
            onFileSelect(e.target.files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center w-full h-full min-h-[400px] border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out cursor-pointer",
                isDragging
                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800",
                isProcessing && "opacity-50 pointer-events-none"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".zip"
                onChange={handleChange}
            />

            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="p-4 rounded-full bg-slate-700/50 ring-1 ring-white/10">
                    {isProcessing ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    ) : (
                        <Upload className="w-12 h-12 text-blue-400" />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                        {isProcessing ? 'Processing archive...' : 'Upload Traces'}
                    </h3>
                    <p className="text-slate-400 max-w-sm">
                        Drag and drop a <b>zipped folder</b> containing multiple Playwright traces.
                    </p>
                </div>

                <button className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                    Browse Archive
                </button>
            </div>
        </div>
    );
}
