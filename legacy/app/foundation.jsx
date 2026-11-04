// Brand Foundation tracker: the client sees where their one-time Foundation stands.
// Colorteam staff move stages along and attach files; owners sign off at the end.
const FD_STAGES=[['moodboards','Mood boards','Two directions to choose from.'],['logo','Logo','Kept and refined, or redesigned, with the social mini mark.'],['guidelines','Guidelines','The brand guidelines PDF, built for content.'],['signoff','Sign-off','Everything approved and loaded into the Studio.']];
const FD_STATUS=['not started','in progress','with client','done'];

function FdFile({f}){const [url,setUrl]=React.useState(null);React.useEffect(()=>{let on=true;CTS.kit.assetUrl(f.path).then(u=>{if(on)setUrl(u);}).catch(()=>{});return()=>{on=false;};},[f.path]);
return <a className="fd-file" href={url||'#'} target="_blank" rel="noopener"><UiIcon n="paperclip" s={13}/>{f.name}</a>;}

function HmFoundation({toast}){const ws=CTS.workspace;const staff=CTS.isStaff;const owner=ws.role==='owner';
const [fd,setFd]=React.useState(()=>(ws.settings&&ws.settings.foundation)||{});const [busy,setBusy]=React.useState(false);
React.useEffect(()=>{setFd((CTS.workspace.settings&&CTS.workspace.settings.foundation)||{});},[ws.id,ws.settings]);
const stage=k=>fd[k]||{status:'not started',files:[],note:''};
const persist=async next=>{setBusy(true);try{await CTS.foundation.save(next);setFd(next);}catch(x){toast(x.message);}setBusy(false);};
const setStatus=(k,status)=>persist({...fd,[k]:{...stage(k),status,updatedAt:new Date().toISOString(),updatedBy:CTS.me.name}});
const setNote=(k,note)=>setFd({...fd,[k]:{...stage(k),note}});
const saveNote=k=>persist({...fd,[k]:{...stage(k),updatedAt:new Date().toISOString(),updatedBy:CTS.me.name}});
const attach=async(k,e)=>{const f=e.target.files&&e.target.files[0];if(!f)return;setBusy(true);try{const path=await CTS.kit.uploadAsset(f,'foundation-'+k);await persist({...fd,[k]:{...stage(k),files:[...(stage(k).files||[]),{name:f.name,path,at:new Date().toISOString()}]}});toast('File attached');}catch(x){toast(x.message);}setBusy(false);e.target.value='';};
const signOff=()=>{if(!confirm('Sign off the Brand Foundation? This tells Colorteam everything is approved.'))return;persist({...fd,signoff:{...stage('signoff'),status:'done',signedBy:CTS.me.name,signedAt:new Date().toISOString()}});};
const doneCount=FD_STAGES.filter(([k])=>stage(k).status==='done').length;
return <main className="adm"><div className="adm-h"><h1>Brand Foundation</h1><p className="muted">{doneCount===4?'Complete. Your Studio runs on the approved brand.':doneCount+' of 4 stages done. '+(staff?'Move stages along as work lands; the client sees this page too.':'Colorteam updates this as the work lands; you sign off at the end.')}</p></div>
<div className="fd-steps">{FD_STAGES.map(([k,title,desc],i)=>{const s=stage(k);return <section key={k} className={'adm-card fd-step '+s.status.replace(' ','-')}><div className="fd-top"><span className="fd-n">{String(i+1).padStart(2,'0')}</span><div><h2>{title}</h2><p className="muted">{desc}</p></div>{staff?<select className="f-in fd-sel" value={s.status} onChange={e=>setStatus(k,e.target.value)} disabled={busy}>{FD_STATUS.map(x=><option key={x} value={x}>{x}</option>)}</select>:<span className={'pill fd-pill '+s.status.replace(' ','-')}>{s.status}</span>}</div>
{(s.files||[]).length>0&&<div className="fd-files">{s.files.map(f=><FdFile key={f.path} f={f}/>)}</div>}
{staff?<div className="col" style={{marginTop:8}}><textarea className="f-in" rows={2} placeholder="Note for the client (what to look at, what you need back)" value={s.note||''} onChange={e=>setNote(k,e.target.value)} onBlur={()=>saveNote(k)}/><div className="row"><label className="btn xs">Attach file<input type="file" style={{display:'none'}} onChange={e=>attach(k,e)} disabled={busy} accept="application/pdf,image/png,image/jpeg,image/svg+xml,image/webp"/></label>{s.updatedAt&&<span className="muted">Updated {String(s.updatedAt).slice(0,10)} by {s.updatedBy}</span>}</div></div>
:s.note?<p className="fd-note">{s.note}</p>:null}
{k==='signoff'&&owner&&s.status==='with client'&&<button className="btn primary" style={{marginTop:10}} onClick={signOff} disabled={busy}>Sign off the Foundation</button>}
{k==='signoff'&&s.signedBy&&<p className="muted" style={{marginTop:8}}>Signed off by {s.signedBy} on {String(s.signedAt).slice(0,10)}.</p>}
</section>;})}</div></main>;}
Object.assign(window,{HmFoundation});
