function edVersion(f,label){return {at:new Date().toISOString(),by:CTS.me.name,label,snap:{tplId:f.tplId,fields:f.fields,sizes:f.sizes,theme:f.theme,offsets:f.offsets}};}
const ED_DESIGN_KEYS=['fields','offsets','theme','sizes','photo','tplId'];
const edSlug=s=>String(s||'asset').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);

function EdApproval({file,onSend,onDecide}){const [open,setOpen]=React.useState(false);const [text,setText]=React.useState('');const ref=useDismiss(open,setOpen);const appr=CTS.isApprover();
if(appr&&file.status==='pending')return <div className="pop-wrap" ref={ref}><button className="btn" onClick={()=>setOpen(o=>!o)}>Request changes</button><button className="btn primary" onClick={()=>onDecide('approved','')}><UiIcon n="check" s={15}/>Approve</button>{open&&<div className="pop"><label className="fld"><span>What needs to change?</span><textarea className="f-in" rows="3" autoFocus value={text} onChange={e=>setText(e.target.value)}></textarea></label><button className="btn primary sm" onClick={()=>{onDecide('changes',text.trim()||'Please revise.');setOpen(false);setText('');}}>Send feedback</button></div>}</div>;
if(file.status==='pending')return <button className="btn" disabled>Waiting for {CTS.approverName}</button>;
if(file.status==='approved')return <span className="ok-tag"><UiIcon n="check" s={14}/>Approved</span>;
return <div className="pop-wrap" ref={ref}><button className="btn primary" onClick={()=>setOpen(o=>!o)}>{file.status==='changes'?'Resubmit':'Send for approval'}</button>{open&&<div className="pop"><label className="fld"><span>Note for {CTS.approverName} (optional)</span><textarea className="f-in" rows="3" autoFocus value={text} onChange={e=>setText(e.target.value)}></textarea></label><button className="btn primary sm" onClick={()=>{onSend(text.trim());setOpen(false);setText('');}}>Send</button></div>}</div>;}

function Editor({fileId,files,presence,library,team,toast,theme,setTheme,onBack,onJoin,followInit,clearFollow,cmReq,onOpenComment}){
const remote=files.find(f=>f.id===fileId)||null;
const [file,setFileS]=React.useState(remote);const fileRef=React.useRef(remote);const setFile=n=>{fileRef.current=n;setFileS(n);};
const dirty=React.useRef(false),saveT=React.useRef(null),editT=React.useRef(null),pend=React.useRef({}),lastSend=React.useRef(0);
const [sel,setSel]=React.useState(null);const selRef=React.useRef(null);selRef.current=sel;
const [cursors,setCursors]=React.useState({});const [follow,setFollow]=React.useState(followInit||null);
const [menu,setMenu]=React.useState(false);const menuRef=useDismiss(menu,setMenu);const [busy,setBusy]=React.useState('');const [stage,setStage]=React.useState(false);const stageRef=React.useRef(null);
React.useEffect(()=>{clearFollow&&clearFollow();},[]);
const [mode,setMode]=React.useState('move');const [openId,setOpenId]=React.useState(null);const [draft,setDraft]=React.useState(null);const [showRes,setShowRes]=React.useState(false);const [focus,setFocus]=React.useState(null);const [tab,setTab]=React.useState('design');
React.useEffect(()=>{if(!remote)return;const f=fileRef.current;if(!f){setFile(remote);return;}if(!dirty.current&&String(remote.updatedAt)>String(f.updatedAt))setFile({...remote,comments:cmMerge(f.comments,remote.comments)});else if(remote.comments){const mc=cmMerge(f.comments,remote.comments);if(JSON.stringify(mc)!==JSON.stringify(f.comments||[]))setFile({...f,comments:mc});}},[remote&&remote.updatedAt,remote&&remote.status,remote&&JSON.stringify(remote.comments||[]).length]);
const save=React.useCallback(async()=>{const f=fileRef.current;if(!f)return;dirty.current=false;try{await CTS.saveFile(f.id,f);}catch(e){console.error(e);toast('Couldn’t save. Check your connection.');}},[]);
const flush=()=>{const p=pend.current;pend.current={};editT.current=null;if(Object.keys(p).length)CTS.sendEdit({docId:fileId,patch:p});};
const change=React.useCallback((patch,opts={})=>{const f=fileRef.current;if(!f)return;const p={...(typeof patch==='function'?patch(f):patch)};if(!Object.keys(p).length)return;
 const design=Object.keys(p).some(k=>ED_DESIGN_KEYS.includes(k));let extra={};
 if(design&&!opts.noVersion){const vs=f.versions||[];const last=vs[0];if(!last||Date.now()-new Date(last.at).getTime()>15*60000)extra.versions=[edVersion(f,'Auto-save'),...vs].slice(0,25);if(f.status==='approved'&&!('status' in p)){extra.status='draft';toast('Edited after approval. Send it again when it’s ready.');}}
 const n={...f,...p,...extra,updatedAt:new Date().toISOString(),updatedBy:CTS.me.name};setFile(n);dirty.current=true;clearTimeout(saveT.current);saveT.current=setTimeout(save,600);
 const bp={...p,...extra};delete bp.versions;if(typeof bp.photo==='string'&&bp.photo.length>150000)delete bp.photo;if(Object.keys(bp).length){Object.assign(pend.current,bp);if(!editT.current)editT.current=setTimeout(flush,50);}},[save]);
React.useEffect(()=>{const h=()=>{if(dirty.current)save();};window.addEventListener('beforeunload',h);return()=>{window.removeEventListener('beforeunload',h);clearTimeout(saveT.current);if(dirty.current)save();};},[]);
React.useEffect(()=>{if(file)CTS.setPresence({docId:file.id,docTitle:file.title});},[file&&file.id,file&&file.title]);
React.useEffect(()=>()=>CTS.setPresence({docId:null,docTitle:''}),[]);
React.useEffect(()=>{const u1=CTS.onEdit(p=>{if(p.docId!==fileId||(CTS.me&&p.uid===CTS.me.uid))return;const f=fileRef.current;if(!f)return;const pt={...p.patch};if(pt.comments)pt.comments=cmMerge(f.comments,pt.comments);setFile({...f,...pt});});
 const u2=CTS.onCursor(c=>{if(c.docId!==fileId||(CTS.me&&c.uid===CTS.me.uid))return;setCursors(m=>({...m,[c.uid]:{...c,t:Date.now()}}));});
 const iv=setInterval(()=>setCursors(m=>{const n={};let ch=false;for(const k in m){if(Date.now()-m[k].t<6000)n[k]=m[k];else ch=true;}return ch?n:m;}),1500);return()=>{u1();u2();clearInterval(iv);};},[fileId]);
const people=Object.fromEntries((presence||[]).map(p=>[p.uid,p]));
React.useEffect(()=>{if(!follow)return;const p=people[follow];if(!p){setFollow(null);return;}if(p.docId&&p.docId!==fileId)onJoin(p.docId,p.uid);},[presence,follow]);
const onPointerWorld=(x,y)=>{const t=Date.now();if(t-lastSend.current<40)return;lastSend.current=t;const s=selRef.current;CTS.sendCursor({docId:fileId,x,y,sel:s&&s.id?{size:s.size,page:s.page,id:s.id}:null});};
const onOffset=(size,id,val)=>change(f=>{const m={...((f.offsets||{})[size]||{})};if(val)m[id]=val;else delete m[id];return {offsets:{...f.offsets,[size]:m}};});
const snapshot=label=>{change(f=>({versions:[edVersion(f,label),...(f.versions||[])].slice(0,25)}),{noVersion:true});toast('Version saved');};
const restore=v=>{change(f=>({...v.snap,versions:[edVersion(f,'Before restoring “'+v.label+'”'),...(f.versions||[])].slice(0,25)}),{noVersion:true});setSel(null);toast('Version restored');};
const onSend=note=>{change(f=>({status:'pending',comment:'',note,versions:[edVersion(f,'Sent for approval'),...(f.versions||[])].slice(0,25)}),{noVersion:true});toast('Sent to '+CTS.approverName);};
const onDecide=(status,comment)=>{change(f=>({status,comment,versions:[edVersion(f,status==='approved'?'Approved by '+CTS.me.name:'Changes requested'),...(f.versions||[])].slice(0,25)}),{noVersion:true});toast(status==='approved'?'Approved':'Feedback sent');};
const me=CTS.me;
const updC=fn=>change(f=>({comments:fn(f.comments||[])}),{noVersion:true});
const nowS=()=>new Date().toISOString();
const placeComment=(f,x,y)=>{setOpenId(null);setDraft({fk:f.key,x,y});};
const addThread=text=>{if(!draft||!text)return;const t={id:cmId(),fk:draft.fk,x:draft.x,y:draft.y,uid:me.uid,name:me.name,email:me.email,photo:me.photo||null,text,mentions:cmMentions(text,team),at:nowS(),updatedAt:nowS(),resolved:false,replies:[]};updC(cs=>[...cs,t]);setDraft(null);setOpenId(t.id);setMode('move');const n=t.mentions.length;toast(n?'Comment posted. '+n+' teammate'+(n>1?'s':'')+' notified.':'Comment posted');};
const reply=(tid,text)=>{if(!text)return;const r={id:cmId(),uid:me.uid,name:me.name,email:me.email,photo:me.photo||null,text,mentions:cmMentions(text,team),at:nowS()};updC(cs=>cs.map(t=>t.id===tid?{...t,replies:[...(t.replies||[]),r],updatedAt:nowS()}:t));if(r.mentions.length)toast('Reply posted. Tagged teammates notified.');};
const resolveT=tid=>updC(cs=>cs.map(t=>t.id===tid?{...t,resolved:!t.resolved,updatedAt:nowS()}:t));
const deleteT=tid=>{updC(cs=>cs.map(t=>t.id===tid?{...t,deleted:true,updatedAt:nowS()}:t));setOpenId(null);};
const deleteR=(tid,rid)=>updC(cs=>cs.map(t=>t.id===tid?{...t,replies:(t.replies||[]).map(r=>r.id===rid?{...r,deleted:true,updatedAt:nowS()}:r),updatedAt:nowS()}:t));
const openThread=(tid,pan=true)=>{setDraft(null);setOpenId(tid);if(!pan)return;const t=(fileRef.current.comments||[]).find(x=>x.id===tid);if(!t)return;const tp=CT_TEMPLATES.find(x=>x.id===fileRef.current.tplId)||CT_TEMPLATES[0];const fr=cvFrames(fileRef.current,tp).find(x=>x.key===t.fk);if(fr)setFocus({x:fr.x+t.x,y:fr.y+t.y,n:Date.now()});};
React.useEffect(()=>{if(!cmReq)return;setTab('comments');const t=(fileRef.current&&fileRef.current.comments||[]).find(x=>x.id===cmReq.cid);if(t){if(t.resolved)setShowRes(true);setTimeout(()=>openThread(cmReq.cid),80);}},[cmReq&&cmReq.n]);
React.useEffect(()=>{const h=ev=>{const ae=document.activeElement;if(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName))return;if(ev.metaKey||ev.ctrlKey||ev.altKey)return;if(ev.key==='c'||ev.key==='C'){setMode(m=>m==='comment'?'move':'comment');setDraft(null);}else if(ev.key==='v'||ev.key==='V'){setMode('move');setDraft(null);}else if(ev.key==='Escape'){if(draft||openId){ev.preventDefault();setDraft(null);setOpenId(null);}else if(mode==='comment')setMode('move');}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[draft,openId,mode]);
if(!file)return <div className="boot col"><p className="muted">This file isn’t available.</p><button className="btn" onClick={onBack}>Back to files</button></div>;
const tpl=CT_TEMPLATES.find(t=>t.id===file.tplId)||CT_TEMPLATES[0];
const frames=cvFrames(file,tpl);const target=(sel&&frames.find(f=>f.key===sel.fk))||frames[0];
const threads=(file.comments||[]).filter(t=>!t.deleted);
const overlay=(f,z)=>{const ts=threads.filter(t=>t.fk===f.key&&(showRes||!t.resolved||t.id===openId));return <>{ts.map(t=><div key={t.id} className={'pin-w'+(t.id===openId?' top':'')} style={{left:t.x,top:t.y,transform:`scale(${1/z})`}}><CmPin c={t} n={(t.replies||[]).filter(r=>!r.deleted).length} open={t.id===openId} resolved={t.resolved} onClick={()=>setOpenId(o=>o===t.id?null:t.id)}/>{t.id===openId&&<CmThread t={t} team={team} onReply={txt=>reply(t.id,txt)} onResolve={()=>resolveT(t.id)} onDelete={()=>deleteT(t.id)} onDeleteReply={rid=>deleteR(t.id,rid)} onClose={()=>setOpenId(null)}/>}</div>)}{draft&&draft.fk===f.key&&<div className="pin-w top" style={{left:draft.x,top:draft.y,transform:`scale(${1/z})`}}><CmPin c={{name:me.name,email:me.email,photo:me.photo}} n={0} open/><CmNew team={team} onSubmit={addThread} onCancel={()=>setDraft(null)}/></div>}</>;};
const followP=follow&&cursors[follow]?{x:cursors[follow].x,y:cursors[follow].y}:null;
async function withStage(fn){setMenu(false);setStage(true);await new Promise(r=>setTimeout(r,120));try{await fn();}catch(e){console.error(e);toast('Export failed. Try again.');}setStage(false);setBusy('');}
const snapFrame=fr=>{const n=stageRef.current.querySelector(`[data-ex="${fr.key}"]`);return htmlToImage.toPng(n.firstChild,{width:fr.W,height:fr.H,pixelRatio:fr.W<1000?2.5:1,cacheBust:true});};
const fname=fr=>`${edSlug(file.title)}-${fr.size}${fr.n>1?'-'+String(fr.page+1).padStart(2,'0'):''}`;
const exportPng=all=>withStage(async()=>{const list=all?frames:[target];setBusy('Exporting…');for(const fr of list){const url=await snapFrame(fr);const a=document.createElement('a');a.href=url;a.download=fname(fr)+'.png';a.click();await new Promise(r=>setTimeout(r,250));}toast(list.length>1?list.length+' PNGs downloaded':'PNG downloaded');});
const exportPdf=()=>withStage(async()=>{setBusy('Exporting…');const {jsPDF}=window.jspdf;let doc=null;for(const fr of frames){const url=await snapFrame(fr);const o=fr.W>fr.H?'l':'p';if(!doc)doc=new jsPDF({unit:'px',format:[fr.W,fr.H],orientation:o,hotfixes:['px_scaling']});else doc.addPage([fr.W,fr.H],o);doc.addImage(url,'PNG',0,0,fr.W,fr.H);}doc.save(edSlug(file.title)+'.pdf');toast('PDF downloaded');});
return <div className="ed">
<header className="bar">
<div className="bar-l"><button className="icon-btn" title="All files" onClick={onBack}><UiIcon n="arrow-left"/></button><img className="bar-logo" src={theme==='dark'?'assets/logo/wordmark-white.png':'assets/logo/wordmark-black.png'} alt="colorteam"/><span className="bar-sep">/</span><input className="title-in" value={file.title} onChange={e=>change({title:e.target.value},{noVersion:true})} aria-label="File name"/><StatusPill status={file.status}/></div>
<div className="bar-r"><Presence list={presence} currentDoc={file.id} followUid={follow} onJoin={onJoin} onFollow={setFollow}/><CmInbox files={files} onOpen={onOpenComment}/><ThemeToggle theme={theme} setTheme={setTheme}/>
<div className="pop-wrap" ref={menuRef}><button className="btn" disabled={!!busy} onClick={()=>setMenu(m=>!m)}><UiIcon n="download" s={15}/>{busy||'Export'}</button>{menu&&<div className="menu"><button onClick={()=>exportPng(false)}><UiIcon n="image" s={15}/><span>PNG<em>{CT_SIZES[target.size].label}{target.n>1?` · ${target.page+1}/${target.n}`:''}</em></span></button><button onClick={()=>exportPng(true)}><UiIcon n="images" s={15}/><span>PNG, all frames<em>{frames.length} files</em></span></button><button onClick={exportPdf}><UiIcon n="file-down" s={15}/><span>PDF, all frames<em>One page per frame</em></span></button></div>}</div>
<EdApproval file={file} onSend={onSend} onDecide={onDecide}/></div>
</header>
<div className="ed-body">
<div className="ed-main">
{file.status==='changes'&&file.comment&&<div className="note-b"><b>{CTS.approverName}:</b> {file.comment}</div>}
{file.status==='pending'&&CTS.isApprover()&&file.note&&<div className="note-b"><b>{file.ownerName||'Designer'}:</b> {file.note}</div>}
{follow&&people[follow]&&<div className="follow-tag" style={{background:people[follow].color}}>Following {people[follow].name.split(' ')[0]} · Esc to stop</div>}
<Canvas file={file} tpl={tpl} sel={sel} setSel={s=>{setSel(s);if(!s){setOpenId(null);setDraft(null);}}} onOffset={onOffset} cursors={cursors} people={people} onPointerWorld={onPointerWorld} follow={followP} onStopFollow={()=>follow&&setFollow(null)} commenting={mode==='comment'} onPlace={placeComment} overlay={overlay} focus={focus}/>
<div className="tools" onPointerDown={ev=>ev.stopPropagation()}><button className={mode==='move'?'on':''} title="Move (V)" onClick={()=>{setMode('move');setDraft(null);}}><UiIcon n="mouse-pointer-2" s={16}/></button><button className={mode==='comment'?'on':''} title="Comment (C)" onClick={()=>{setMode(m=>m==='comment'?'move':'comment');setDraft(null);}}><UiIcon n="message-circle" s={16}/>{threads.filter(t=>!t.resolved).length>0&&<i>{threads.filter(t=>!t.resolved).length}</i>}</button></div>
{mode==='comment'&&!draft&&<div className="mode-tip">Click anywhere on a frame to comment · Esc to exit</div>}
</div>
<Inspector file={file} tpl={tpl} change={change} sel={sel} setSel={setSel} library={library} addLibrary={CTS.addLibrary} removeLibrary={CTS.removeLibrary} snapshot={snapshot} restore={restore} toast={toast} tab={tab} setTab={setTab} frames={frames} team={team} openId={openId} onOpen={id=>openThread(id)} showResolved={showRes} setShowResolved={setShowRes} setMode={m=>{setMode(m);setDraft(null);}}/>
</div>
{stage&&<div className="stage" ref={stageRef} aria-hidden="true">{frames.map(fr=><div key={fr.key} data-ex={fr.key}><CtAsset tpl={tpl} size={fr.size} fields={file.fields} theme={file.theme} photo={ctPhotoFor(file,tpl)} page={fr.page} offsets={(file.offsets||{})[fr.size]}/></div>)}</div>}
</div>;}
Object.assign(window,{Editor});
