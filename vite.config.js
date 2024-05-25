import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

function moveOutputPlugin() {
    return {
        name: 'move-output',
        enforce: 'post',
        apply: 'build',
        async generateBundle(options, bundle) {
            for (const fileName in bundle) {
                if (fileName.startsWith('pages/')) {
                    const newFileName = fileName.slice('pages/'.length).replace(/\.html$/, '');
                    bundle[newFileName] = bundle[fileName];
                    delete bundle[fileName];
                }
            }
        },
    };
}

export default defineConfig({
    base: '/todo-pr/',
    plugins: [
        liveReload(['./pages/**/*.html']),
        moveOutputPlugin(),
    ],
    server: {
        // open: 'index.html',
        open: 'pages/index',
        fs: {
            strict: true, // 限制訪問路徑
        },
    },
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('pages/**/*.html').map((file) => [
                    path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
                    fileURLToPath(new URL(file, import.meta.url)),
                ])
            ),
        },
        outDir: 'dist',
    },

})
