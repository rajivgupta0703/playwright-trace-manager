#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The dist folder is located at ../dist relative to this file in node_modules
const distPath = path.resolve(__dirname, '../dist');

console.log('\n🎭 Playwright Trace Manager');
console.log('---------------------------');
console.log('Launching local viewer...\n');

try {
    // Use npx vite preview to serve the dist folder
    // We specify the path to ensure it's serving our built files
    execSync(`npx vite preview --outDir "${distPath}" --port 5173 --host --open`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
    });
} catch (error) {
    console.error('\n❌ Failed to start the viewer.');
    console.error('Make sure you have vite installed or run inside the package directory.');
    process.exit(1);
}
