import { useEffect, useRef, useState } from 'react';

interface TraceViewerProps {
    traceBlob: Blob;
}

export function TraceViewer({ traceBlob }: TraceViewerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [mountKey, setMountKey] = useState(0);

    // Force iframe remount when trace changes to ensure a fresh viewer state
    useEffect(() => {
        setIframeLoaded(false);
        setMountKey(prev => prev + 1);
    }, [traceBlob]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !iframeLoaded || !traceBlob) return;

        console.log('[Viewer] Sending load message for blob:', traceBlob.size, 'bytes');

        const sendMessage = () => {
            if (!iframe.contentWindow) return;
            try {
                iframe.contentWindow.postMessage({
                    method: 'load',
                    params: { trace: traceBlob }
                }, '*');
                console.log('[Viewer] postMessage sent');
            } catch (e) {
                console.error("[Viewer] Failed to post message to iframe", e);
            }
        };

        // Send multiple times to ensure the inner app catches it
        sendMessage();
        const t1 = setTimeout(sendMessage, 200);
        const t2 = setTimeout(sendMessage, 500);
        const t3 = setTimeout(sendMessage, 1000);
        const t4 = setTimeout(sendMessage, 2000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };

    }, [traceBlob, iframeLoaded, mountKey]);

    return (
        <div className="w-full h-full bg-slate-900 relative">
            <iframe
                key={mountKey}
                ref={iframeRef}
                src="/trace-viewer/index.html"
                className="w-full h-full border-0 absolute inset-0 bg-white"
                title="Trace Viewer"
                allow="clipboard-read; clipboard-write; fullscreen"
                onLoad={() => {
                    console.log('[Viewer] Iframe loaded');
                    setIframeLoaded(true);
                }}
            />
            {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        <span className="text-slate-400 text-sm">Initializing Viewer...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
