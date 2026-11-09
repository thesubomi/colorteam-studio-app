function StudioApp(){
const [theme,setTheme]=React.useState(()=>localStorage.getItem('ctbs2_theme')||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
React.useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('ctbs2_theme',theme);},[theme]);
const parse=()=>{const h=location.hash.replace(/^#\/?/,'').split('/');if(h[0]==='file'&&h[1])return {name:'file',id:decodeURIComponent(h[1])};if(h[0]==='calendar')return {name:'calendar'};if(h[0]==='login')return {name:'login'};if(h[0]==='guidelines')return {name:'guidelines'};if(h[0]==='admin')return {name:'admin'};if(h[0]==='team')return {name:'team'};if(h[0]==='account')return {name:'account'};if(h[0]==='kit')return {name:'kit'};if(h[0]==='foundation')return {name:'foundation'};if(h[0]==='templates')return {name:'templates'};if(h[0]==='billing')return {name:'billing'};if(h[0]==='deliverables')return {name:'deliverables'};if(h[0]==='agents')return {name:'agents'};return {name:'home'};};
const [route,setRoute]=React.useState(parse);
React.useEffect(()=>{const h=()=>setRoute(parse());window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h);},[]);
const go=r=>{location.hash=r.name==='file'?'/file/'+encodeURIComponent(r.id):r.name==='calendar'?'/calendar':r.name==='guidelines'?'/guidelines':r.name==='admin'?'/admin':r.name==='team'?'/team':r.name==='account'?'/account':r.name==='kit'?'/kit':r.name==='foundation'?'/foundation':r.name==='templates'?'/templates':r.name==='billing'?'/billing':r.name==='deliverables'?'/deliverables':r.name==='agents'?'/agents':'/';};
const [user,setUser]=React.useState(undefined);const [authErr,setAuthErr]=React.useState('');
React.useEffect(()=>CTS.onAuth((u,e)=>{setUser(u||null);setAuthErr(e||'');}),[]);
React.useEffect(()=>{if(user!==undefined)ctTrack.page(!user||route.name==='login'?'login':route.name);},[route.name,!!user,user===undefined]);
const [wsTick,setWsTick]=React.useState(0);React.useEffect(()=>CTS.subscribeWorkspace(()=>setWsTick(x=>x+1)),[]);React.useEffect(()=>{const h=()=>setWsTick(x=>x+1);window.addEventListener('ct-templates',h);return()=>window.removeEventListener('ct-templates',h);},[]);
React.useEffect(()=>{const w=CTS.workspace;if(user&&w)ctTrack.user({plan:w.slug==='colorteam'?'internal':(w.plan||'core'),role:CTS.isStaff?'staff':(w.role||'member')});},[user&&user.uid,wsTick]);
const [files,setFiles]=React.useState([]);const [library,setLibrary]=React.useState([]);const [presence,setPresence]=React.useState([]);
React.useEffect(()=>{if(!user)return;const a=CTS.subscribeFiles(setFiles),b=CTS.subscribeLibrary(setLibrary),c=CTS.subscribePresence(setPresence);return()=>{a();b();c();};},[user&&user.uid]);
const [follow,setFollow]=React.useState(null);const [team,setTeam]=React.useState([]);const [cmReq,setCmReq]=React.useState(null);
React.useEffect(()=>{if(!user)return;CTS.team().then(t=>{const me=CTS.me;const list=(t||[]).slice();if(me&&!list.some(m=>m.email===me.email))list.push({email:me.email,name:me.name,role:CTS.role});setTeam(list);}).catch(()=>{});},[user&&user.uid]);
const openComment=(fid,cid)=>{setCmReq({cid,n:Date.now()});go({name:'file',id:fid});};
const [msg,setMsg]=React.useState('');React.useEffect(()=>{window.__ctToast=toast;});const tm=React.useRef();const toast=m=>{window.__ctToast=toast;setMsg(m);clearTimeout(tm.current);tm.current=setTimeout(()=>setMsg(''),2400);};
const join=(docId,uid)=>{setFollow(uid||null);go({name:'file',id:docId});};
const newFile=async tplId=>{const t=CT_TEMPLATES.find(x=>x.id===tplId);const fields=ctDefaults(t);try{const id=await CTS.createFile({tplId,title:CTS.autoTitle(t,fields),fields,photo:null,sizes:t.sizes.slice(),theme:t.defTheme||0,offsets:{},schedule:null,versions:[]});ctTrack.event('post_created',{template:tplId});go({name:'file',id});}catch(e){console.error(e);toast('Couldn’t create the file');}};
const save=(id,patch)=>CTS.saveFile(id,{...patch,updatedAt:new Date().toISOString(),updatedBy:CTS.me.name}).catch(()=>toast('Couldn’t save'));
const del=id=>CTS.deleteFile(id).then(()=>toast('File deleted')).catch(()=>toast('Couldn’t delete'));
const toastEl=msg?<div className="toast">{msg}</div>:null;
if(user===undefined)return <div className="boot"></div>;
if(!user||route.name==='login'||CTS.pendingLink||(user&&CTS.needPassword))return <HmLogin err={authErr} theme={theme} preview={!!user} onDone={()=>go({name:'home'})}/>;
if(route.name==='file'){if(!files.some(f=>f.id===route.id))return <div className="boot col"><p className="muted">Opening file…</p><button className="btn" onClick={()=>go({name:'home'})}>Back to files</button></div>;
 return <><Editor key={route.id} fileId={route.id} files={files} presence={presence} library={library} toast={toast} theme={theme} setTheme={setTheme} onBack={()=>go({name:'home'})} onJoin={join} followInit={follow} clearFollow={()=>setFollow(null)} team={team} cmReq={cmReq} onOpenComment={openComment}/>{toastEl}</>;}
return <div className="shell"><HmBar route={route.name} go={go} presence={presence} onJoin={join} theme={theme} setTheme={setTheme} files={files} onOpenComment={openComment}/>{route.name==='admin'&&CTS.isStaff?<HmAdmin go={go} toast={toast}/>:route.name==='team'?<HmTeam toast={toast} go={go}/>:route.name==='account'?<HmAccount toast={toast} go={go}/>:route.name==='kit'?<HmKit toast={toast}/>:route.name==='foundation'?<HmFoundation toast={toast}/>:route.name==='templates'&&CTS.isStaff?<HmTemplates toast={toast}/>:route.name==='deliverables'&&CTS.isStaff?<HmDeliverables toast={toast}/>:route.name==='billing'?<HmBilling go={go}/>:route.name==='agents'?<HmAgents toast={toast} go={go}/>:route.name==='guidelines'?<HmGuidelines toast={toast}/>:route.name==='calendar'?<HmCalendar files={files} go={go} save={save}/>:<HmHome files={files} presence={presence} go={go} newFile={newFile} onJoin={join} del={del}/>}{toastEl}</div>;}
// Report crashes and failed promises to the staff error log. Browser-extension and cross-origin noise is ignored.
const ctNoise=m=>/ResizeObserver loop|^Script error\.?$|chrome-extension:|moz-extension:|message channel closed/i.test(m||'');
window.addEventListener('error',e=>{const m=e.message||'';if(ctNoise(m)||ctNoise(e.filename))return;CTS.logError&&CTS.logError(e.error||m,'error');});
window.addEventListener('unhandledrejection',e=>{const r=e.reason;const m=(r&&r.message)||String(r||'');if(ctNoise(m))return;CTS.logError&&CTS.logError(r||m,'promise');});
// If a screen crashes, show a way out instead of a blank page.
class CtBoundary extends React.Component{constructor(p){super(p);this.state={err:null};}static getDerivedStateFromError(err){return {err};}
 componentDidCatch(err,info){CTS.logError&&CTS.logError({message:err&&err.message||String(err),stack:((err&&err.stack)||'')+'\n'+((info&&info.componentStack)||'')},'crash');}
 render(){if(!this.state.err)return this.props.children;return <div className="login"><div className="login-c col"><h1>Something went wrong</h1><p className="muted">This screen hit an error. It has been reported to Colorteam. Reloading usually fixes it; your work is saved as you go.</p><button className="btn primary wide" onClick={()=>{location.hash='/';location.reload();}}>Reload the Studio</button></div></div>;}}
// Cookie banner for analytics (live app only). Choice is kept per browser; Account has a switch to change it.
function CtConsent(){const [c,setC]=React.useState(()=>ctTrack.choice());React.useEffect(()=>{const h=()=>setC(ctTrack.choice());window.addEventListener('ct-consent',h);return()=>window.removeEventListener('ct-consent',h);},[]);
 if(!ctTrack.enabled||c)return null;
 return <div className="ct-consent" role="dialog" aria-label="Cookies"><p><b>Help us improve the Studio?</b> We'd like to use Google Analytics cookies to see which screens and features get used. No ads, and we never send your content or email.</p><div className="row"><button className="btn sm ghost" onClick={()=>ctTrack.set('denied')}>No thanks</button><button className="btn sm primary" onClick={()=>ctTrack.set('granted')}>Allow</button></div></div>;}
ReactDOM.createRoot(document.getElementById('root')).render(<CtBoundary><StudioApp/></CtBoundary>);
{const el=document.createElement('div');el.id='ct-consent-root';document.body.appendChild(el);ReactDOM.createRoot(el).render(<CtConsent/>);}
