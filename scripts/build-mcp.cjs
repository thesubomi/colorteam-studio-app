// Inlines templates.json into supabase/functions/mcp/index.ts (one file, for the dashboard editor).
//   npm run build && node scripts/template-manifest.cjs && node scripts/build-mcp.cjs
const fs=require('fs');const path=require('path');const d=path.resolve(__dirname,'..','supabase/functions/mcp');
const src=fs.readFileSync(path.join(d,'server.ts'),'utf8').replace('declare const MANIFEST: { templates: any[]; sizes: Record<string, { label: string; W: number; H: number }> };',
 '// Generated from templates.json by scripts/build-mcp.cjs. Edit server.ts, not this file.\nconst MANIFEST: { templates: any[]; sizes: Record<string, { label: string; W: number; H: number }> } = '+fs.readFileSync(path.join(d,'templates.json'),'utf8').trim()+';');
fs.writeFileSync(path.join(d,'index.ts'),src);console.log('index.ts',src.length);
