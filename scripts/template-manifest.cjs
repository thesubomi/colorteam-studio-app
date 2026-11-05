// Writes supabase/functions/mcp/templates.json from the built app (run after `npm run build`):
//   node scripts/template-manifest.cjs
// The mcp function inlines it, so agents see the same built-in templates and fields as the app.
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..','dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
const srv=http.createServer((q,s)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,b)=>{if(e){s.writeHead(404);s.end();return;}s.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});s.end(b);});}).listen(0,async()=>{
 const port=srv.address().port;const b=await chromium.launch();const pg=await b.newPage();
 await pg.addInitScript(()=>{Object.defineProperty(window,'supabase',{get(){return undefined},set(){}});localStorage.setItem('ctbs_user',JSON.stringify({email:'x@colorteam.io'}));});
 await pg.goto(`http://localhost:${port}/`);await pg.waitForFunction(()=>window.CT_TEMPLATES&&window.ctAllSizes);
 const m=await pg.evaluate(()=>CT_TEMPLATES.filter(t=>!t.db).map(t=>({id:t.id,name:t.name,internal:CT_INTERNAL_TEMPLATES.includes(t.id),photo:!!t.photo,defTheme:t.defTheme||0,sizes:ctAllSizes(t),designedSizes:t.sizes,
   fields:t.fields.filter(f=>f.type!=='image'&&f.type!=='doc').map(f=>({k:f.k,label:f.label,multiline:f.type==='area'||undefined,def:f.def})),clientDefaults:(window.CT_CLIENT_DEFAULTS||{})[t.id]||null})));
 const sizes=await pg.evaluate(()=>Object.fromEntries(Object.entries(CT_SIZES).map(([k,v])=>[k,{label:v.label,W:v.W,H:v.H}])));
 fs.writeFileSync(path.resolve(__dirname,'..','supabase/functions/mcp/templates.json'),JSON.stringify({templates:m,sizes},null,1));
 console.log('templates:',m.length);await b.close();srv.close();});
