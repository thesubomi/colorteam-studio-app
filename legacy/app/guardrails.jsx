// Brand guardrails for client workspaces: who may move elements, length checks, and the kit as the in-editor guide.
function ctClientWs(){const ws=window.CTS&&CTS.workspace;return ws&&ws.slug!=='colorteam'?ws:null;}
function ctLayoutLocked(){const ws=ctClientWs();if(!ws)return false;const kit=(ws.settings&&ws.settings.kit)||{};const locks=kit.locks||{};if(CTS.isStaff||ws.role==='owner')return false;return locks.layout!==false;}
// Text that is far longer than the template was drawn for: the renderer shrinks it, but it stops being on-brand.
function ctBrandWarnings(tpl,fields){const out=[];const seen={};const lim=k=>{let n=null;if(tpl.layouts){Object.values(tpl.layouts).forEach(l=>(l.layers||[]).forEach(x=>{if(x.type==='text'&&x.bind===k&&x.size&&typeof x.size==='object'&&x.size.chars)n=n==null?x.size.chars:Math.min(n,x.size.chars);}));}const f=tpl.fields.find(x=>x.k===k);if(f&&f.max)n=f.max;return n;};
 tpl.fields.forEach(f=>{const v=String(fields[f.k]||'').replace(/\*/g,'');const n=lim(f.k);if(n&&v.length>n*2.2&&!seen[f.k]){seen[f.k]=1;out.push({k:f.k,msg:f.label+' is long ('+v.length+' characters). Under '+Math.round(n*2)+' keeps the type at full size.'});}
  if(f.type!=='area'&&/[\u{1F300}-\u{1FAFF}]/u.test(v))out.push({k:f.k,msg:'No emoji in '+f.label.toLowerCase()+'.'});
  if(/!{2,}/.test(v))out.push({k:f.k,msg:'One exclamation mark is plenty in '+f.label.toLowerCase()+'.'});});
 const kit=ctClientWs()&&ctClientWs().settings&&ctClientWs().settings.kit;const words=(kit&&kit.banned)?String(kit.banned).split(/[,\n]/).map(s=>s.trim().toLowerCase()).filter(Boolean):[];
 if(words.length){const all=Object.values(fields).map(v=>String(v||'').toLowerCase()).join(' ');words.forEach(w=>{if(all.includes(w))out.push({k:'',msg:'“'+w+'” is on the brand’s do-not-use list.'});});}
 return out;}
function InsBrandCheck({tpl,file}){const w=ctBrandWarnings(tpl,file.fields||{});if(!w.length)return null;return <InsSec title="Brand check"><ul className="g-ul bc">{w.map((x,i)=><li key={i}>{x.msg}</li>)}</ul></InsSec>;}
function InsKitGuide({toast}){const ws=ctClientWs();const kit=ws&&ws.settings&&ws.settings.kit;if(!kit)return <InsSec title="Brand"><p className="muted">No brand kit yet. An owner fills it on the Brand kit page; it shows here for everyone.</p></InsSec>;
 return <>
 <InsSec title="Colour"><div className="sw">{(kit.colors||[]).map(c=><button key={c.hex+c.name} className="sw-i" title={'Copy '+c.hex} onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(c.hex);toast('Copied '+c.hex);}}><i style={{background:c.hex}}></i><span>{c.name} <em className="muted">{c.role}</em></span><code>{c.hex}</code></button>)}</div></InsSec>
 <InsSec title="Type"><p className="g-p"><b>{kit.fonts&&kit.fonts.display||'Inter'}</b> for headlines, <b>{kit.fonts&&kit.fonts.body||'Inter'}</b> for body{kit.fonts&&kit.fonts.serif?<>, <b>{kit.fonts.serif}</b> for quotes</>:null}. Highlight one or two words with *asterisks*.</p></InsSec>
 {kit.voice&&<InsSec title="Voice"><p className="g-p" style={{whiteSpace:'pre-wrap'}}>{kit.voice}</p></InsSec>}
 {kit.imagery&&<InsSec title="Imagery"><p className="g-p" style={{whiteSpace:'pre-wrap'}}>{kit.imagery}</p></InsSec>}
 {kit.dont&&<InsSec title="Don'ts"><p className="g-p" style={{whiteSpace:'pre-wrap'}}>{kit.dont}</p></InsSec>}
 {ws.settings.guidelines&&<InsSec title="Guidelines"><button className="btn sm" onClick={()=>{location.hash='/guidelines';}}>Open the full guidelines</button></InsSec>}
 </>;}
// The template library a workspace's plan includes: its own custom templates first, then the shared
// library up to the plan's count. A file's current template always stays available to it.
function ctTemplatesFor(ws,keepId){const lim=ctLimits(ws).templates;if(lim==null)return CT_TEMPLATES;
 const own=CT_TEMPLATES.filter(t=>t.db&&t.scope==='workspace');const shared=CT_TEMPLATES.filter(t=>!(t.db&&t.scope==='workspace'));
 const list=own.concat(shared.slice(0,Math.max(0,lim-own.length)));
 if(keepId&&!list.some(t=>t.id===keepId)){const k=CT_TEMPLATES.find(t=>t.id===keepId);if(k)list.push(k);}return list;}
Object.assign(window,{ctTemplatesFor,ctLayoutLocked,ctBrandWarnings,InsBrandCheck,InsKitGuide,ctClientWs});
