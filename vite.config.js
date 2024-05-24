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
                const asset = bundle[fileName];
                // 確保只處理HTML檔案
                if (asset.type === 'asset' && fileName.endsWith('.html')) {
                    // 獲取檔案名稱
                    const newFileName = path.basename(fileName);
                    // 更新檔案名稱
                    asset.fileName = newFileName;
                }
            }
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    base: '/todo-pr/',
    plugins: [
        liveReload(['./**/*.html']),
        moveOutputPlugin(),
    ],
    server: {
        // open: 'index.html',
        open: '/', // 設置默認打開路徑
        fs: {
            strict: true, // 限制訪問路徑
        },
    },
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                glob
                    .sync('*.html') // 尋找跟目錄下所有HTML檔案 
                    .map((file) => [
                        path.basename(file, path.extname(file)), // 使用文件名（不带扩展名）作为键
                        fileURLToPath(new URL(file, import.meta.url)), // 生成文件的绝对路径
                    ])
            ),
        },
        outDir: 'dist',
    },

})
