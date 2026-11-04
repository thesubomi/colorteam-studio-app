const INS_BUILTIN=[
{kind:'logo',name:'Wordmark white',src:'assets/brand26/wordmark-white.svg',dark:true},
{kind:'logo',name:'Wordmark black',src:'assets/brand26/wordmark-black.svg'},
{kind:'logo',name:'Wordmark lime',src:'assets/brand26/mark-green.png',dark:true},
{kind:'logo',name:'Podcast mark',src:'assets/logo/podcast-mark-lime.png'},
{kind:'logo',name:'Podcast mark on black',src:'assets/brand26/podcast-mark-onblack.png',dark:true},
{kind:'photo',name:'Cut-out portrait',src:'assets/imagery/portrait-cutout-woman-desaturated.png'},
{kind:'photo',name:'Portrait, chair',src:'assets/imagery/portrait-cutout-man-chair.png'},
{kind:'headshot',name:'Heather Winkle',src:'assets/imagery/heather-winkle.png'}];
const INS_SW=[['Black','#0A0A0A'],['Stone','#DEDCD0'],['Pink','#F2B0CD'],['Lime','#A8FC78'],['Card','#161616'],['Light field','#ECEAE2'],['Warm grey','#57554D'],['Sage','#929A92'],['Podcast cream','#F3F2E6'],['Pale lime','#D4FFC0']];
function insRead(file,max=1400){return new Promise(res=>{const fr=new FileReader();fr.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL(/png|webp|gif/.test(file.type)?'image/png':'image/jpeg',.86));};i.onerror=()=>res(fr.result);i.src=fr.result;};fr.readAsDataURL(file);});}
function InsSec({title,right,children}){return <section className="sec"><div className="sec-h"><span>{title}</span>{right}</div>{children}</section>;}
function InsField({x,value,onChange,toast}){const [busy,setBusy]=React.useState(false);
if(x.type==='image')return <div className="fld"><span>{x.label}</span><div className="ph-row"><div className="ph-th logo-th">{value?<img src={value} alt=""/>:<span>None</span>}</div><div className="col"><label className="btn sm">{value?'Replace':'Upload logo'}<input type="file" accept="image/*" hidden onChange={async e=>{const fl=e.target.files[0];e.target.value='';if(fl)onChange(await insRead(fl,800));}}/></label>{value&&<button className="btn sm ghost" onClick={()=>onChange('')}>Remove</button>}<em>PNG or SVG with a transparent background works best.</em></div></div></div>;
if(x.type==='doc')return <div className="fld"><span className="row" style={{justifyContent:'space-between'}}>{x.label}<label className="btn xs">{busy?'Reading…':'Import document'}<input type="file" accept=".docx,.md,.markdown,.txt,.pdf" hidden onChange={async e=>{const fl=e.target.files[0];e.target.value='';if(!fl)return;setBusy(true);try{const md=await window.ctImportDoc(fl);onChange(md);toast&&toast('Imported '+fl.name);}catch(err){console.error(err);toast&&toast(err.message||'Couldn’t read that file');}setBusy(false);}}/></label></span><textarea className="f-in doc-in" rows={16} value={value||''} onChange={e=>onChange(e.target.value)}></textarea><em>Import a .docx, .md, .txt or .pdf. # starts a new section and page, ## is a heading, ### a sub-heading, - a bullet, &gt; a pull quote and | builds a table. Wrap words in *asterisks* to highlight them.</em></div>;
const area=x.type==='area';return <label className="fld"><span>{x.label}</span>{area?<textarea className="f-in" rows={Math.min(6,Math.max(2,String(value||'').split('\n').length))} value={value||''} onChange={e=>onChange(e.target.value)}></textarea>:<input className="f-in" value={value||''} onChange={e=>onChange(e.target.value)}/>}{x.hint&&<em>{x.hint}</em>}</label>;}

function InsDesign({file,tpl,change,sel,setSel,goAssets,addLibrary,toast}){
const size=file.sizes[0],d=CT_SIZES[size],photo=ctPhotoFor(file,tpl);
const setField=(k,val)=>change(f=>({fields:{...f.fields,[k]:val}}));
const switchTpl=id=>{const t=CT_TEMPLATES.find(x=>x.id===id);change(f=>{const dd=ctDefaults(t);const keep={};for(const k in dd)if(f.fields[k]!=null&&tpl.fields.some(x=>x.k===k))keep[k]=f.fields[k];return {tplId:id,fields:{...dd,...keep},sizes:t.sizes.slice(),offsets:{}};});setSel(null);};
const off=sel&&sel.id&&!sel.locked?(((file.offsets||{})[sel.size]||{})[sel.id]||{x:0,y:0}):null;
const setOff=val=>change(f=>{const m={...((f.offsets||{})[sel.size]||{})};if(val)m[sel.id]=val;else delete m[sel.id];return {offsets:{...f.offsets,[sel.size]:m}};});
const anyOff=Object.values(file.offsets||{}).some(m=>m&&Object.keys(m).length);
const toggleSize=s=>change(f=>{const has=f.sizes.includes(s);const n=has?f.sizes.filter(x=>x!==s):[...f.sizes,s];return n.length?{sizes:tpl.sizes.filter(x=>n.includes(x))}:{};});
return <>
<InsSec title="Template"><select className="f-in" value={tpl.id} onChange={e=>switchTpl(e.target.value)}>{CT_TEMPLATES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></InsSec>
{sel&&sel.id&&<InsSec title="Selected layer" right={<button className="lnk" onClick={()=>setSel(null)}>Deselect</button>}>{sel.locked?<p className="muted">Backgrounds and full-bleed photos are locked to keep layouts on brand.</p>:<><div className="xy"><label><span>X</span><input type="number" step="8" className="f-in" value={off.x} onChange={e=>setOff({...off,x:+e.target.value||0})}/></label><label><span>Y</span><input type="number" step="8" className="f-in" value={off.y} onChange={e=>setOff({...off,y:+e.target.value||0})}/></label><button className="btn sm" onClick={()=>setOff(null)}>Reset</button></div><p className="muted">Drag on the canvas. It snaps to an 8 px grid, the centre and the margins. Use the arrow keys to nudge, or Shift for 40 px.</p></>}</InsSec>}
<InsSec title="Content">{tpl.fields.map(x=><InsField key={tpl.id+x.k} x={x} value={file.fields[x.k]} onChange={val=>setField(x.k,val)} toast={toast}/>)}<p className="muted">Wrap words in *asterisks* to highlight them.</p></InsSec>
{tpl.photo&&<InsSec title="Photo"><div className="ph-row"><div className="ph-th">{file.photo?<img src={file.photo} alt=""/>:<span>Sample</span>}</div><div className="col"><label className="btn sm">Upload<input type="file" accept="image/*" hidden onChange={async e=>{const fl=e.target.files[0];e.target.value='';if(!fl)return;const src=await insRead(fl);change({photo:src});addLibrary({kind:'photo',name:fl.name.replace(/\.[^.]+$/,''),src});}}/></label><button className="btn sm" onClick={goAssets}>From library</button>{file.photo&&<button className="btn sm ghost" onClick={()=>change({photo:null})}>Remove</button>}</div></div></InsSec>}
<InsSec title="Sizes"><div className="chips">{tpl.sizes.map(s=><button key={s} className={'chip'+(file.sizes.includes(s)?' on':'')} onClick={()=>toggleSize(s)}>{CT_SIZES[s].label}<span>{CT_SIZES[s].W}×{CT_SIZES[s].H}</span></button>)}</div></InsSec>
<InsSec title="Style"><div className="themes">{CT_THEMES.map((t,i)=><button key={t.id} className={'theme-c'+(file.theme===i?' on':'')} onClick={()=>change({theme:i})}><span className="theme-th"><CtScaled W={d.W} H={d.H} bw={54} bh={54}><CtAsset tpl={tpl} size={size} fields={file.fields} theme={i} photo={photo} page={0} offsets={(file.offsets||{})[size]}/></CtScaled></span><span>{t.name}</span></button>)}</div></InsSec>
<InsSec title="Publish date"><input type="date" className="f-in" value={file.schedule||''} onChange={e=>change({schedule:e.target.value||null},{noVersion:true})}/></InsSec>
{anyOff&&<InsSec title="Layout"><button className="btn sm" onClick={()=>{change({offsets:{}});setSel(null);}}>Reset all positions</button></InsSec>}
</>;}

function InsAssets({file,tpl,change,library,addLibrary,removeLibrary}){
const [flt,setFlt]=React.useState('all');const [kind,setKind]=React.useState('photo');const [busy,setBusy]=React.useState(false);
const items=[...INS_BUILTIN.map(x=>({...x,builtin:true})),...(library||[])].filter(x=>flt==='all'||x.kind===flt);
const up=async e=>{const fs=[...e.target.files];e.target.value='';setBusy(true);for(const fl of fs){const src=await insRead(fl);await addLibrary({kind,name:fl.name.replace(/\.[^.]+$/,''),src});}setBusy(false);};
return <>
<InsSec title="Library"><div className="seg">{[['all','All'],['logo','Logos'],['photo','Photos'],['headshot','Team']].map(([k,l])=><button key={k} className={flt===k?'on':''} onClick={()=>setFlt(k)}>{l}</button>)}</div>
{items.length?<div className="lib">{items.map(x=><div key={x.id||x.src} className={'lib-i'+(x.dark?' dark':'')+(file.photo===x.src?' on':'')} title={x.name}><img src={x.src} alt="" loading="lazy"/><div className="lib-ov"><span>{x.name}</span><div className="row">{tpl.photo&&x.kind!=='logo'&&<button className="btn xs primary" onClick={()=>change({photo:x.src})}>Use</button>}<a className="btn xs" href={x.src} download={(x.name||'asset')+'.png'}>Save</a>{!x.builtin&&<button className="btn xs ghost" onClick={()=>removeLibrary(x.id)}>Remove</button>}</div></div></div>)}</div>:<p className="muted">Nothing here yet.</p>}</InsSec>
<InsSec title="Add to library"><div className="row"><select className="f-in" value={kind} onChange={e=>setKind(e.target.value)}><option value="photo">Photo</option><option value="headshot">Team headshot</option><option value="logo">Logo</option></select><label className="btn sm">{busy?'Uploading…':'Upload'}<input type="file" accept="image/*" multiple hidden onChange={up}/></label></div><p className="muted">Shared with the whole team.</p></InsSec>
</>;}

function InsGuide({toast}){return <>
<InsSec title="Colour"><div className="sw">{INS_SW.map(([n,h])=><button key={h} className="sw-i" title={'Copy '+h} onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(h);toast('Copied '+h);}}><i style={{background:h}}></i><span>{n}</span><code>{h}</code></button>)}</div></InsSec>
<InsSec title="Type"><p className="g-p"><b>Inter Bold</b> for headlines, with tight tracking (−3.5%). Highlight one or two words: pink type on dark grounds, a pink marker on light.</p><p className="g-p"><b>Newsreader</b> only for the “&amp;”.</p></InsSec>
<InsSec title="Writing"><ul className="g-ul"><li>Use Title Case for headlines and sentence case for sub-lines.</li><li>Write labels in uppercase with wide tracking, for example "CASE STUDY 01".</li><li>Name people with their role.</li><li>Don't use emoji in headlines.</li></ul></InsSec>
<InsSec title="Podcast"><ul className="g-ul"><li>Use a cream ground with soft vertical shapes.</li><li>Use the black mark with the lime heart, and pale-lime labels.</li><li>Give cut-out guests a pale-lime outline.</li></ul></InsSec>
<InsSec title="Layout"><ul className="g-ul"><li>Use 72 px margins on 1080-wide formats.</li><li>Use rounded cards (36–44 px) and outline pills for tags.</li><li>Keep the top 250 px and bottom 340 px of stories clear.</li></ul></InsSec>
</>;}

function InsHistory({file,snapshot,restore}){const [label,setLabel]=React.useState('');const vs=file.versions||[];
return <>
<InsSec title="Save a version"><form className="row" onSubmit={e=>{e.preventDefault();snapshot(label.trim()||'Saved version');setLabel('');}}><input className="f-in" placeholder="Name this version" value={label} onChange={e=>setLabel(e.target.value)}/><button className="btn sm" type="submit">Save</button></form></InsSec>
<InsSec title="History">{vs.length===0?<p className="muted">No versions yet. A version is saved every 15 minutes while you work, and whenever the file is sent or approved.</p>:<div className="vers">{vs.map((v,i)=>{const t=CT_TEMPLATES.find(x=>x.id===v.snap.tplId)||CT_TEMPLATES[0];const s=(v.snap.sizes||t.sizes)[0];const d=CT_SIZES[s];return <div key={v.at+i} className="ver"><span className="ver-th"><CtScaled W={d.W} H={d.H} bw={44} bh={44}><CtAsset tpl={t} size={s} fields={v.snap.fields} theme={v.snap.theme} photo={ctPhotoFor(file,t)} page={0} offsets={(v.snap.offsets||{})[s]}/></CtScaled></span><span className="ver-b"><b>{v.label}</b><span>{v.by} · {fmtRel(v.at)}</span></span><button className="btn xs" onClick={()=>restore(v)}>Restore</button></div>;})}</div>}</InsSec>
</>;}

function Inspector(props){const [tab,setTab]=[props.tab,props.setTab];const nOpen=cmOpenCount(props.file);
return <aside className="insp"><div className="insp-tabs">{[['design','Design'],['comments','Comments'],['assets','Assets'],['guide','Guide'],['history','History']].map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{l}{k==='comments'&&nOpen>0&&<span className="tab-n">{nOpen}</span>}</button>)}</div>
<div className="insp-body">{tab==='design'&&<InsDesign {...props} goAssets={()=>setTab('assets')}/>}{tab==='comments'&&<CmPanel {...props}/>}{tab==='assets'&&<InsAssets {...props}/>}{tab==='guide'&&<InsGuide toast={props.toast}/>}{tab==='history'&&<InsHistory {...props}/>}</div></aside>;}
Object.assign(window,{Inspector});
