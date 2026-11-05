// Figma → Studio template. Reads frames through Figma's REST API and converts them using the
// naming rules in docs/template-format.md:
//   one frame per size, named like the size (post, square, story, yt, wide, li, lic, a4)
//   layers named  text:<key> [fit:<chars>] [area]  ·  image[:<key>]  ·  logo  ·  chip:<key>  ·  rect  ·  line
//   unnamed layers are skipped; fills that match a kit colour become roles (ground, surface, ink, muted, accent)

const FG_SIZES=['post','square','story','yt','wide','li','lic','a4'];
const fgHex=c=>{if(!c)return null;const h=v=>Math.round(v*255).toString(16).padStart(2,'0');return ('#'+h(c.r)+h(c.g)+h(c.b)).toUpperCase();};
const fgFill=n=>{const f=(n.fills||[]).find(x=>x.visible!==false&&(x.type==='SOLID'||x.type==='IMAGE'));if(!f)return null;if(f.type==='IMAGE')return {image:true};return {hex:fgHex(f.color),opacity:(f.opacity==null?1:f.opacity)*((f.color&&f.color.a)==null?1:f.color.a)};};
const fgHuman=k=>k.replace(/[-_]/g,' ').replace(/^\w/,c=>c.toUpperCase());

// Colour → role, using the target workspace's kit when there is one, else the Colorteam palette.
function fgRoleMap(kit){const m={};const add=(hex,role)=>{if(hex&&!m[hex.toUpperCase()])m[hex.toUpperCase()]=role;};
 if(kit&&kit.colors)kit.colors.forEach(c=>add(c.hex,c.role==='accent 2'?'accent':c.role));
 else{add('#0A0A0A','ground');add('#161616','surface');add('#E6E4DA','ink');add('#F2B0CD','accent');add('#A3A199','muted');add('#DEDCD0','ink');add('#FFFFFF','ink');}
 return m;}
const fgColor=(hex,roles,fallback)=>hex?(roles[hex.toUpperCase()]||hex):fallback;

function fgParseName(name){const raw=String(name||'').trim();const [head,...rest]=raw.split(/\s+/);const [type,key]=head.toLowerCase().split(':');const opts={};rest.forEach(t=>{const [k,v]=t.toLowerCase().split(':');opts[k]=v==null?true:v;});return {type,key,opts};}

function fgFont(style,kit){const fam=(style&&style.fontFamily)||'';const k=kit&&kit.fonts||{};
 if(k.serif&&fam.toLowerCase()===k.serif.toLowerCase())return 'serif';
 if(/newsreader|serif|georgia|garamond|times|playfair|lora|caslon/i.test(fam))return 'serif';
 if(k.display&&k.body&&k.display.toLowerCase()!==k.body.toLowerCase()&&fam.toLowerCase()===k.display.toLowerCase())return 'display';
 return ((style&&style.fontWeight)||400)>=650&&((style&&style.fontSize)||0)>=44?'display':'body';}

function fgWalk(node,fn){(node.children||[]).forEach(c=>{if(c.visible===false)return;fn(c);if(!/^(text|chip|image|logo|rect|line)(:|$)/i.test(String(c.name||'').trim().split(/\s/)[0]))fgWalk(c,fn);});}

// Convert one size frame to a layout. Returns {layout, fields}
function fgFrame(frame,size,roles,kit,warn){const box=frame.absoluteBoundingBox;const base=CT_SIZES[size];const s=base.W/box.width;
 const P=n=>{const b=n.absoluteBoundingBox;return {x:Math.round((b.x-box.x)*s),y:Math.round((b.y-box.y)*s),w:Math.round(b.width*s),h:Math.round(b.height*s)};};
 const bgFill=fgFill(frame);const layout={bg:bgFill&&bgFill.hex?fgColor(bgFill.hex,roles,'ground'):'ground',layers:[]};const fields={};
 fgWalk(frame,n=>{const {type,key,opts}=fgParseName(n.name);const p=P(n);
  if(type==='text'&&n.type==='TEXT'){if(!key){warn.push('“'+n.name+'” needs a key, e.g. text:title');return;}const st=n.style||{};const f=fgFill(n);
   const chars=String(n.characters||'');fields[key]=fields[key]||{k:key,label:fgHuman(key),def:chars,...((opts.area||chars.includes('\n')||chars.length>90)?{type:'area'}:{})};
   const fs=Math.round((st.fontSize||32)*s);
   layout.layers.push({type:'text',...p,bind:key,font:fgFont(st,kit),size:opts.fit?{max:fs,chars:Number(opts.fit)||14}:fs,weight:st.fontWeight||400,
    lineHeight:st.lineHeightPx&&st.fontSize?Math.round(st.lineHeightPx/st.fontSize*100)/100:undefined,
    letterSpacing:st.letterSpacing&&st.fontSize?(Math.round(st.letterSpacing/st.fontSize*1000)/1000)+'em':undefined,
    color:f&&f.hex?fgColor(f.hex,roles,'ink'):'ink',align:(st.textAlignHorizontal||'LEFT').toLowerCase().replace('justified','left'),
    valign:st.textAlignVertical==='BOTTOM'?'bottom':st.textAlignVertical==='CENTER'?'middle':undefined,upper:st.textCase==='UPPER'||undefined,rich:true});}
  else if(type==='image'){layout.layers.push({type:'image',...p,radius:Math.round((n.cornerRadius||0)*s),...(key&&key!=='photo'?{bind:key}:{})});if(key&&key!=='photo')fields[key]=fields[key]||{k:key,label:fgHuman(key),type:'image',def:null};}
  else if(type==='logo'){layout.layers.push({type:'logo',...p,align:opts.right?'right':undefined});}
  else if(type==='chip'){const t=n.type==='TEXT'?n:(n.children||[]).find(c=>c.type==='TEXT');const bgN=fgFill(n)?n:(n.children||[]).find(c=>c.type!=='TEXT'&&fgFill(c));const bf=bgN&&fgFill(bgN);const tf=t&&fgFill(t);
   if(!key){warn.push('“'+n.name+'” needs a key, e.g. chip:label');return;}
   fields[key]=fields[key]||{k:key,label:fgHuman(key),def:t?t.characters:''};
   layout.layers.push({type:'chip',x:p.x,y:p.y,bind:key,size:Math.round(((t&&t.style&&t.style.fontSize)||24)*s),fill:bf&&bf.hex?fgColor(bf.hex,roles,'accent'):'accent',color:tf&&tf.hex?fgColor(tf.hex,roles,'ground'):'ground',upper:t&&t.style&&t.style.textCase==='UPPER'?undefined:false});}
  else if(type==='rect'){const f=fgFill(n);layout.layers.push({type:'rect',...p,fill:f&&f.hex?fgColor(f.hex,roles,'surface'):'surface',radius:Math.round((n.cornerRadius||0)*s),opacity:f&&f.opacity<1?Math.round(f.opacity*100)/100:undefined});}
  else if(type==='line'){const f=fgFill(n)||((n.strokes||[])[0]&&{hex:fgHex(n.strokes[0].color)});layout.layers.push({type:'line',x:p.x,y:p.y,w:p.w,h:Math.max(1,p.h||Math.round((n.strokeWeight||2)*s)),color:f&&f.hex?fgColor(f.hex,roles,'ink'):'ink'});}
 });
 return {layout,fields};}

// Find the size frames under whatever node the link points at.
function figmaToTemplate(root,{id,name,kit}){const roles=fgRoleMap(kit);const warn=[];const frames=[];
 const visit=n=>{const nm=String(n.name||'').trim().toLowerCase();if((n.type==='FRAME'||n.type==='COMPONENT'||n.type==='INSTANCE')&&FG_SIZES.includes(nm)&&n.absoluteBoundingBox)frames.push(n);else(n.children||[]).forEach(visit);};
 visit(root);
 if(!frames.length)throw new Error('No frames named like a size (post, square, story, yt, wide, li, lic, a4) under that link.');
 const layouts={};const fields={};let photo=false;
 frames.forEach(fr=>{const size=fr.name.trim().toLowerCase();const r=fgFrame(fr,size,roles,kit,warn);layouts[size]=r.layout;Object.values(r.fields).forEach(f=>{if(!fields[f.k])fields[f.k]=f;});if(r.layout.layers.some(l=>l.type==='image'&&!l.bind))photo=true;});
 const sizes=FG_SIZES.filter(s=>layouts[s]);
 const tpl={id:id||String(root.name||'imported').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name:name||root.name||'Imported template',icon:'sparkles',sizes,photo,defTheme:0,fields:Object.values(fields).filter(f=>f.type!=='image'),layouts,source:{figma:true,at:new Date().toISOString()}};
 if(!tpl.fields.length)warn.push('No text layers named text:<key>. The template has nothing to edit.');
 return {tpl,warn};}

function fgParseUrl(u){const m=String(u).match(/figma\.com\/(?:design|file)\/([A-Za-z0-9]+)(?:\/branch\/([A-Za-z0-9]+))?[^?]*(?:\?.*node-id=([0-9]+[-:][0-9]+))?/);if(!m)return null;return {key:m[2]||m[1],node:m[3]?m[3].replace('-',':'):null};}

async function fgFetch(url,token){const p=fgParseUrl(url);if(!p)throw new Error('That doesn’t look like a Figma design link.');if(!p.node)throw new Error('Copy the link to the frame or section (right-click → Copy link to selection), so it has a node-id.');
 const r=await fetch('https://api.figma.com/v1/files/'+p.key+'/nodes?ids='+encodeURIComponent(p.node),{headers:{'X-Figma-Token':token}});
 if(r.status===403)throw new Error('Figma refused the token, or it has no access to this file.');if(!r.ok)throw new Error('Figma answered '+r.status+'.');
 const j=await r.json();const n=j.nodes&&j.nodes[p.node];if(!n||!n.document)throw new Error('Figma returned nothing for that node.');return n.document;}

function FigmaImport({onLoaded,toast,workspaces}){const [open,setOpen]=React.useState(false);const [url,setUrl]=React.useState('');const [token,setToken]=React.useState(()=>{try{return localStorage.getItem('ctbs2_figma')||'';}catch(e){return '';}});const [wsId,setWsId]=React.useState('');const [busy,setBusy]=React.useState(false);const [warn,setWarn]=React.useState([]);
 const run=async e=>{e.preventDefault();setBusy(true);setWarn([]);try{try{localStorage.setItem('ctbs2_figma',token);}catch(x){}
  const doc=await fgFetch(url,token.trim());const ws=(workspaces||[]).find(w=>w.id===wsId);const kit=ws&&ws.settings&&ws.settings.kit;
  const {tpl,warn}=figmaToTemplate(doc,{kit});setWarn(warn);onLoaded(tpl,wsId);toast('Imported '+tpl.sizes.length+' size'+(tpl.sizes.length>1?'s':'')+' from Figma');}catch(x){toast(x.message);}setBusy(false);};
 if(!open)return <button className="btn" onClick={()=>setOpen(true)}>Import from Figma</button>;
 return <section className="adm-card adm-wide" style={{marginBottom:14,flexBasis:"100%",order:9}}><div className="row" style={{justifyContent:'space-between'}}><h2>Import from Figma</h2><button className="btn xs ghost" onClick={()=>setOpen(false)}>Close</button></div>
 <form className="col" onSubmit={run}><label className="fld"><span>Link to the frame or section</span><input className="f-in" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.figma.com/design/…?node-id=12-34" required/><em>Inside it, one frame per size named post, square, story… Layers named text:title, image, logo, chip:label, rect, line. See docs/template-format.md.</em></label>
 <label className="fld"><span>Figma personal access token</span><input className="f-in mono" type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="figd_…" required autoComplete="off"/><em>Figma → Settings → Security → Personal access tokens, read-only file access. Kept only in this browser.</em></label>
 <label className="fld"><span>Match colours to the kit of</span><select className="f-in" value={wsId} onChange={e=>setWsId(e.target.value)}><option value="">Colorteam palette</option>{(workspaces||[]).filter(w=>w.slug!=='colorteam').map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
 <div className="row"><button className="btn primary" disabled={busy}>{busy?'Reading Figma…':'Import'}</button></div>
 {warn.length>0&&<ul className="g-ul bc">{warn.map((w,i)=><li key={i}>{w}</li>)}</ul>}</form></section>;}
Object.assign(window,{figmaToTemplate,fgParseUrl,FigmaImport});
