function StudioApp(){
const [theme,setTheme]=React.useState(()=>localStorage.getItem('ctbs2_theme')||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
React.useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('ctbs2_theme',theme);},[theme]);
const parse=()=>{const h=location.hash.replace(/^#\/?/,'').split('/');if(h[0]==='file'&&h[1])return {name:'file',id:decodeURIComponent(h[1])};if(h[0]==='calendar')return {name:'calendar'};if(h[0]==='login')return {name:'login'};if(h[0]==='guidelines')return {name:'guidelines'};if(h[0]==='admin')return {name:'admin'};if(h[0]==='team')return {name:'team'};if(h[0]==='account')return {name:'account'};if(h[0]==='kit')return {name:'kit'};if(h[0]==='foundation')return {name:'foundation'};if(h[0]==='templates')return {name:'templates'};if(h[0]==='billing')return {name:'billing'};return {name:'home'};};
const [route,setRoute]=React.useState(parse);
React.useEffect(()=>{const h=()=>setRoute(parse());window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h);},[]);
const go=r=>{location.hash=r.name==='file'?'/file/'+encodeURIComponent(r.id):r.name==='calendar'?'/calendar':r.name==='guidelines'?'/guidelines':r.name==='admin'?'/admin':r.name==='team'?'/team':r.name==='account'?'/account':r.name==='kit'?'/kit':r.name==='foundation'?'/foundation':r.name==='templates'?'/templates':r.name==='billing'?'/billing':'/';};
const [user,setUser]=React.useState(undefined);const [authErr,setAuthErr]=React.useState('');
React.useEffect(()=>CTS.onAuth((u,e)=>{setUser(u||null);setAuthErr(e||'');}),[]);
const [wsTick,setWsTick]=React.useState(0);React.useEffect(()=>CTS.subscribeWorkspace(()=>setWsTick(x=>x+1)),[]);React.useEffect(()=>{const h=()=>setWsTick(x=>x+1);window.addEventListener('ct-templates',h);return()=>window.removeEventListener('ct-templates',h);},[]);
const [files,setFiles]=React.useState([]);const [library,setLibrary]=React.useState([]);const [presence,setPresence]=React.useState([]);
React.useEffect(()=>{if(!user)return;const a=CTS.subscribeFiles(setFiles),b=CTS.subscribeLibrary(setLibrary),c=CTS.subscribePresence(setPresence);return()=>{a();b();c();};},[user&&user.uid]);
const [follow,setFollow]=React.useState(null);const [team,setTeam]=React.useState([]);const [cmReq,setCmReq]=React.useState(null);
React.useEffect(()=>{if(!user)return;CTS.team().then(t=>{const me=CTS.me;const list=(t||[]).slice();if(me&&!list.some(m=>m.email===me.email))list.push({email:me.email,name:me.name,role:CTS.role});setTeam(list);}).catch(()=>{});},[user&&user.uid]);
const openComment=(fid,cid)=>{setCmReq({cid,n:Date.now()});go({name:'file',id:fid});};
const [msg,setMsg]=React.useState('');React.useEffect(()=>{window.__ctToast=toast;});const tm=React.useRef();const toast=m=>{window.__ctToast=toast;setMsg(m);clearTimeout(tm.current);tm.current=setTimeout(()=>setMsg(''),2400);};
const join=(docId,uid)=>{setFollow(uid||null);go({name:'file',id:docId});};
const newFile=async tplId=>{const t=CT_TEMPLATES.find(x=>x.id===tplId);const fields=ctDefaults(t);try{const id=await CTS.createFile({tplId,title:CTS.autoTitle(t,fields),fields,photo:null,sizes:t.sizes.slice(),theme:t.defTheme||0,offsets:{},schedule:null,versions:[]});go({name:'file',id});}catch(e){console.error(e);toast('Couldn’t create the file');}};
const save=(id,patch)=>CTS.saveFile(id,{...patch,updatedAt:new Date().toISOString(),updatedBy:CTS.me.name}).catch(()=>toast('Couldn’t save'));
const del=id=>CTS.deleteFile(id).then(()=>toast('File deleted')).catch(()=>toast('Couldn’t delete'));
const toastEl=msg?<div className="toast">{msg}</div>:null;
if(user===undefined)return <div className="boot"></div>;
if(!user||route.name==='login')return <HmLogin err={authErr} theme={theme} preview={!!user} onDone={()=>go({name:'home'})}/>;
if(route.name==='file'){if(!files.some(f=>f.id===route.id))return <div className="boot col"><p className="muted">Opening file…</p><button className="btn" onClick={()=>go({name:'home'})}>Back to files</button></div>;
 return <><Editor key={route.id} fileId={route.id} files={files} presence={presence} library={library} toast={toast} theme={theme} setTheme={setTheme} onBack={()=>go({name:'home'})} onJoin={join} followInit={follow} clearFollow={()=>setFollow(null)} team={team} cmReq={cmReq} onOpenComment={openComment}/>{toastEl}</>;}
return <div className="shell"><HmBar route={route.name} go={go} presence={presence} onJoin={join} theme={theme} setTheme={setTheme} files={files} onOpenComment={openComment}/>{route.name==='admin'&&CTS.isStaff?<HmAdmin go={go} toast={toast}/>:route.name==='team'?<HmTeam toast={toast}/>:route.name==='account'?<HmAccount toast={toast} go={go}/>:route.name==='kit'?<HmKit toast={toast}/>:route.name==='foundation'?<HmFoundation toast={toast}/>:route.name==='templates'&&CTS.isStaff?<HmTemplates toast={toast}/>:route.name==='billing'?<HmBilling/>:route.name==='guidelines'?<HmGuidelines toast={toast}/>:route.name==='calendar'?<HmCalendar files={files} go={go} save={save}/>:<HmHome files={files} presence={presence} go={go} newFile={newFile} onJoin={join} del={del}/>}{toastEl}</div>;}
ReactDOM.createRoot(document.getElementById('root')).render(<StudioApp/>);
