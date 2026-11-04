import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';

// The Studio screens were written as browser globals (one <script type="text/babel"> per file).
// This plugin joins them into one module so they keep sharing a scope, and Vite compiles the JSX.
const ORDER = ['config.js','store.js','templates.jsx','canvas.jsx','comments.jsx','inspector.jsx','editor.jsx','home.jsx','guidelines.jsx','app.jsx'];
function legacyBundle(){
  const id = 'virtual:studio-legacy.jsx';
  return {
    name: 'studio-legacy',
    resolveId(s){ if (s === id) return '\0' + id; },
    async load(s){
      if (s !== '\0' + id) return;
      const dir = path.resolve('legacy/app');
      for (const f of ORDER) this.addWatchFile(path.join(dir, f));
      const src = ORDER.map(f => `// ---- ${f}\n` + fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
      const out = await transform(src, { loader: 'jsx', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', sourcefile: 'studio-legacy.jsx' });
      return out.code;
    }
  };
}
export default defineConfig({
  base: './',
  plugins: [react({ jsxRuntime: 'classic' }), legacyBundle()],
  build: { outDir: 'dist', assetsDir: '_app', sourcemap: false, chunkSizeWarningLimit: 1200 }
});
