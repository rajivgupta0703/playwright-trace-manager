import { BlobReader, ZipReader, BlobWriter, type Entry } from '@zip.js/zip.js';

export interface TraceEntry {
    id: string;
    name: string;
    entry?: Entry; // Store the zip entry for lazy loading
    file?: File;   // Store the direct file if it was a single upload
}

export async function extractTraces(file: File): Promise<TraceEntry[]> {
    console.log('[Zip] Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
    return scanZipEntries(file);
}

async function scanZipEntries(file: File): Promise<TraceEntry[]> {
    try {
        const reader = new ZipReader(new BlobReader(file));
        const entries = await reader.getEntries();
        console.log(`[Zip] Found ${entries.length} total entries in archive`);

        // Filter out macOS metadata files and non-zip files
        const zipEntries = entries.filter(entry => {
            const filename = entry.filename;
            const isZip = !entry.directory && filename.toLowerCase().endsWith('.zip');
            const isMetadata = filename.includes('__MACOSX/') || filename.split('/').pop()?.startsWith('._');
            return isZip && !isMetadata;
        });

        const results: TraceEntry[] = [];

        if (zipEntries.length > 0) {
            console.log(`[Zip] Found ${zipEntries.length} valid nested zip files`);
            for (const entry of zipEntries) {
                const name = entry.filename.split('/').pop() || entry.filename;
                results.push({
                    id: entry.filename,
                    name,
                    entry
                });
            }
        } else {
            console.log('[Zip] No nested zips found, treating the whole file as a single trace');
            results.push({
                id: 'root',
                name: file.name,
                file: file
            });
            await reader.close();
        }

        return results.sort((a, b) => a.name.localeCompare(b.name));

    } catch (e) {
        console.error('[Zip] Error scanning zip:', e);
        throw new Error(`Failed to read zip contents. ${e instanceof Error ? e.message : String(e)}`);
    }
}

export async function loadTraceBlob(entry: TraceEntry): Promise<Blob> {
    if (entry.file) return entry.file;
    if (entry.entry) {
        console.log('[Zip] Extracting trace blob for:', entry.name);
        // @ts-ignore
        const blob = await entry.entry.getData(new BlobWriter("application/zip"));

        if (blob.size === 0) {
            throw new Error("Extracted trace file is empty");
        }

        console.log('[Zip] Extracted size:', blob.size, 'bytes');
        return blob;
    }
    throw new Error("No data found for this entry");
}
