import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    esbuild: {
        // Disable sourcemaps during transform to reduce peak memory
        sourcemap: false,
    },
    build: {
        // Single-threaded chunking — safer on memory-constrained hosts
        rollupOptions: {
            maxParallelFileOps: 3,
        },
        // No sourcemaps in production
        sourcemap: false,
        // Raise the chunk warning threshold to avoid noisy warnings
        chunkSizeWarningLimit: 1000,
    },
});
