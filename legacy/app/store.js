(function(){
const C=window.CT_STUDIO_CONFIG||{};
const cloud=!!(C.supabase&&C.supabase.url&&C.supabase.anonKey&&window.supabase);
const PAL=['#E5484D','#0090FF','#30A46C','#F76B15','#8E4EC6','#D6409F','#12A594','#C9A227'];
const colorFor=s=>{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return PAL[h%PAL.length];};
const iso=()=>new Date().toISOString();
const bus={};const on=(e,f)=>{(bus[e]=bus[e]||new Set()).add(f);return()=>bus[e].delete(f);};
const emit=(e,d)=>{(bus[e]||[]).forEach(f=>{try{f(d);}catch(err){console.error(err);}});};
const autoTitle=(tpl,f)=>{const v=Object.values(f||{}).find(x=>typeof x==='string'&&x.trim())||'';return tpl.name+' — '+v.replace(/\*/g,'').split('\n')[0].slice(0,40);};
function norm(list){const T=window.CT_TEMPLATES||[];if(!T.length)return [];return list.map(f=>{const tpl=T.find(t=>t.id===f.tplId);if(!tpl)return null;const fields={...window.ctDefaults(tpl),...(f.fields||{})};let sizes=(f.sizes||[]).filter(s=>tpl.sizes.includes(s));if(!sizes.length)sizes=tpl.sizes.slice();return {...f,fields,sizes,theme:+f.theme||0,offsets:f.offsets||{},versions:f.versions||[],comments:f.comments||[],title:f.title||autoTitle(tpl,fields),status:['pending','approved','changes'].includes(f.status)?f.status:'draft',schedule:f.schedule||null};}).filter(Boolean).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));}
let files=[],library=[],presence=[],mine={docId:null,docTitle:''},authCb=null;
let workspaces=[],workspace=null,isStaff=false;const LS_WS='ctbs2_ws';
const S={mode:cloud?'cloud':'local',approverName:C.approverName||'Subomi',google:!!C.googleSignIn,colorFor,autoTitle,me:null,role:null,
 isApprover(){return S.role==='approver';},
 get workspaces(){return workspaces;},get workspace(){return workspace;},get isStaff(){return isStaff;},
 subscribeWorkspace(f){f(workspace);return on('workspace',f);},
 subscribeTemplates(f){return on('templates',f);},
 subscribeFiles(f){f(norm(files));return on('files',f);},
 subscribeLibrary(f){f(library.slice());return on('library',f);},
 subscribePresence(f){f(presence.slice());return on('presence',f);},
 onCursor:f=>on('cursor',f),onEdit:f=>on('edit',f)};
const pubFiles=()=>emit('files',norm(files));
const pubLib=()=>emit('library',library.slice());

if(!cloud){
 const LS_U='ctbs_user',LS_F='ctbs2_files',LS_L='ctbs2_library';
 const day=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
 const ago=m=>new Date(Date.now()-m*60000).toISOString();
 const TEAM=[{uid:'u-isaac',email:'isaacabogye492@gmail.com',name:'Isaac Abogye',role:'designer'},{uid:'u-ife',email:'ifeoluwababawemimo@gmail.com',name:'Ifeoluwa Oluwayimika',role:'designer'},{uid:'u-subomi',email:'subomi@colorteam.io',name:'Subomi',role:'approver'}];
 const own=u=>{const t=TEAM.find(x=>x.uid===u);return {owner:u,ownerName:t.name,updatedBy:t.name};};
 const SEED=[
  {id:'f-ep06',title:'EP06 — Heather Winkle',tplId:'podcast',fields:{episode:'06',guest:'Heather Winkle',role:'VP of Digital Experience, Delta Air Lines',label:'New episode'},photo:'assets/imagery/heather-winkle.png',sizes:['post','story'],theme:0,schedule:day(-2),status:'approved',comment:'Looks great. Ship it.',...own('u-isaac'),createdAt:ago(5000),updatedAt:ago(2900)},
  {id:'f-hire',title:'Hiring — Copywriter',tplId:'hiring',fields:{headline:"We're *Hiring*",role:'Copywriter',details:'Remote · Warsaw or Lagos\nFull-time\nBrand, web and social writing',cta:'Apply at colorteam.io/careers'},sizes:['post','square'],theme:2,schedule:day(3),status:'draft',...own('u-ife'),createdAt:ago(400),updatedAt:ago(3)},
  {id:'f-sys',title:'Systems Over Speed — carousel',tplId:'carousel',sizes:['post'],theme:1,schedule:day(6),status:'changes',comment:'Tighten slide 3 so the detail sits on two lines.',...own('u-isaac'),createdAt:ago(1600),updatedAt:ago(12)},
  {id:'f-quote',title:'Quote — Subomi on brand trust',tplId:'quote',sizes:['post'],theme:1,schedule:day(1),status:'pending',...own('u-ife'),createdAt:ago(900),updatedAt:ago(95)},
  {id:'f-web',title:'Webinar — Brand Trust in the Age of AI',tplId:'event',sizes:['post','wide'],theme:0,schedule:null,status:'draft',...own('u-isaac'),createdAt:ago(2600),updatedAt:ago(1500)},
  {id:'f-team',title:'Team spotlight — Funmibi',tplId:'team',sizes:['post'],theme:0,schedule:day(9),status:'draft',...own('u-ife'),createdAt:ago(3000),updatedAt:ago(2200)}];
 try{files=JSON.parse(localStorage.getItem(LS_F))||SEED;}catch(e){files=SEED;}
 try{library=JSON.parse(localStorage.getItem(LS_L))||[];}catch(e){library=[];}
 if(!localStorage.getItem('ctbs2_seed_c')){const P=(u,n,e)=>({uid:u,name:n,email:e,photo:null});const I=P('u-isaac','Isaac Abogye','isaacabogye492@gmail.com'),F=P('u-ife','Ifeoluwa Oluwayimika','ifeoluwababawemimo@gmail.com'),B=P('u-subomi','Subomi','subomi@colorteam.io');
  const SC={'f-sys':[{id:'c-s1',fk:'post:3',x:560,y:760,...B,text:'@Isaac Abogye can we tighten this detail so it sits on two lines?',mentions:['isaacabogye492@gmail.com'],at:ago(40),updatedAt:ago(9),resolved:false,replies:[{id:'c-s1r',...I,text:'On it. Shortening the copy now.',mentions:[],at:ago(9)}]}],
   'f-hire':[{id:'c-h1',fk:'post:0',x:420,y:1210,...F,text:'@Subomi is the careers page live yet, or should this point to the email address?',mentions:['subomi@colorteam.io'],at:ago(6),updatedAt:ago(6),resolved:false,replies:[]}],
   'f-quote':[{id:'c-q1',fk:'post:0',x:300,y:620,...I,text:'Love the serif quote mark here. @Ifeoluwa Oluwayimika should we try the lime version too?',mentions:['ifeoluwababawemimo@gmail.com'],at:ago(120),updatedAt:ago(80),resolved:false,replies:[{id:'c-q1r',...F,text:'Tried it. Black reads better with the photo.',mentions:[],at:ago(80)}]}]};
  files=files.map(f=>SC[f.id]&&!(f.comments&&f.comments.length)?{...f,comments:SC[f.id]}:f);localStorage.setItem('ctbs2_seed_c','1');}
 const saveLS=(k,v,strip)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){try{localStorage.setItem(k,JSON.stringify(strip(v)));}catch(_){}}};
 const persist=()=>saveLS(LS_F,files,v=>v.map(f=>({...f,photo:f.photo&&f.photo.startsWith('data:')?null:f.photo,versions:(f.versions||[]).slice(0,3)})));
 const persistLib=()=>saveLS(LS_L,library,v=>v.slice(0,6));
 const mkMe=e=>{const n=e.split('@')[0].replace(/[._\d]+/g,' ').trim().replace(/\b\w/g,c=>c.toUpperCase());return {uid:'me',email:e,name:/^subomi/i.test(n)?'Subomi':(n||'You'),photo:null,color:colorFor(e)};};
 workspaces=[{id:'ws-colorteam',slug:'colorteam',name:'Colorteam',plan:'internal',role:'owner'},{id:'ws-demo',slug:'acme',name:'Acme (demo client)',plan:'growth',role:'owner',settings:{}}];workspace=workspaces[localStorage.getItem('ctbs2_demo_client')?1:0];isStaff=true;
 S.setWorkspace=slug=>{const w=workspaces.find(x=>x.slug===slug);if(!w)return;workspace=w;if(slug==='acme')localStorage.setItem('ctbs2_demo_client','1');else localStorage.removeItem('ctbs2_demo_client');emit('workspace',workspace);};
 S.guidelines={async url(){return null;},async upload(){throw new Error('Demo mode');}};S.foundation={async save(){throw new Error('Demo mode');}};S.requests={async list(){return [];},async create(){throw new Error('Demo mode');},async update(){},async remove(){}};S.templates={async list(){return [];},async get(){throw new Error('Demo mode');},async save(){throw new Error('Demo mode');},async publish(){},async remove(){},reload(){}};S.kit={get(){return null;},async save(){throw new Error('Demo mode');},async uploadAsset(){throw new Error('Demo mode');},async assetUrl(){return null;}};S.admin={async list(){return workspaces.map(w=>({...w,members:3,files:files.length,pending:files.filter(f=>f.status==='pending').length,foundation:w.slug==='acme'?1:4,fdWaiting:w.slug==='acme',hasKit:w.slug!=='acme',openReq:w.slug==='acme'?1:0,last:files[0]&&files[0].updatedAt}));},async create(){throw new Error('Demo mode');},async members(){return TEAM.map(t=>({email:t.email,name:t.name,role:t.role==='approver'?'owner':'editor'}));},async addMember(){throw new Error('Demo mode');},async removeMember(){throw new Error('Demo mode');}};
 const login=e=>{const u=mkMe(e);S.me=u;S.role='approver';buildPresence();authCb&&authCb(u);};
 S.onAuth=cb=>{authCb=cb;setTimeout(()=>{let s=null;try{s=JSON.parse(localStorage.getItem(LS_U));}catch(e){}if(s&&s.email)login(s.email);else cb(null);},0);return()=>{authCb=null;};};
 S.sendLink=async e=>{const m=e.trim().toLowerCase();localStorage.setItem(LS_U,JSON.stringify({email:m}));login(m);};
 S.signInGoogle=()=>S.sendLink('subomi@colorteam.io');
 S.signOut=async()=>{localStorage.removeItem(LS_U);S.me=null;S.role=null;authCb&&authCb(null);};
 S.updateName=async name=>{S.me={...S.me,name:name.trim()||S.me.name};};S.resetPassword=async()=>{};S.setPassword=async()=>{};
 S.team=async()=>TEAM;
 S.createFile=async x=>{const id='f-'+Date.now().toString(36);const t=iso();files=[{...x,id,owner:'me',ownerName:S.me.name,updatedBy:S.me.name,createdAt:t,updatedAt:t,status:'draft',comment:''},...files];persist();pubFiles();return id;};
 S.saveFile=async(id,x)=>{files=files.map(f=>f.id===id?{...f,...x}:f);persist();pubFiles();};
 S.deleteFile=async id=>{files=files.filter(f=>f.id!==id);persist();pubFiles();};
 S.addLibrary=async it=>{library=[{...it,id:'l-'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),by:S.me.name,at:iso()},...library];persistLib();pubLib();};
 S.removeLibrary=async id=>{library=library.filter(l=>l.id!==id);persistLib();pubLib();};
 const SIMS=[{uid:'u-isaac',name:'Isaac Abogye',email:'isaacabogye492@gmail.com',docId:'f-sys',ph:0.3},{uid:'u-ife',name:'Ifeoluwa Oluwayimika',email:'ifeoluwababawemimo@gmail.com',docId:'f-hire',ph:2.1},{uid:'u-subomi',name:'Subomi',email:'subomi@colorteam.io',docId:null,ph:4}];
 const titleOf=id=>{const f=norm(files).find(x=>x.id===id);return f?f.title:'';};
 function buildPresence(){if(!S.me){presence=[];emit('presence',presence);return;}const sims=SIMS.filter(s=>s.email!==S.me.email&&(s.docId===null||files.some(f=>f.id===s.docId)));presence=[...sims.map(s=>({uid:s.uid,name:s.name,color:colorFor(s.email),docId:s.docId,docTitle:s.docId?titleOf(s.docId):''})),{uid:'me',name:S.me.name,color:S.me.color,docId:mine.docId,docTitle:mine.docTitle,me:true}];emit('presence',presence.slice());}
 S.setPresence=p=>{mine=p;buildPresence();};
 S.sendCursor=()=>{};S.sendEdit=()=>{};
 let tk=0;
 setInterval(()=>{if(!S.me||!window.CT_SIZES||!mine.docId)return;tk++;for(const s of SIMS){if(s.docId!==mine.docId||s.email===S.me.email)continue;const f=norm(files).find(x=>x.id===s.docId);if(!f)continue;const size=f.sizes[0],d=window.CT_SIZES[size];const t=tk*0.045+s.ph;const x=d.W*(0.5+0.32*Math.sin(t*0.6)+0.07*Math.sin(t*2.1));const y=d.H*(0.5+0.34*Math.sin(t*0.37+s.ph)+0.05*Math.cos(t*1.7));const ph=Math.floor(tk/70)%5;const sel=ph===0?null:{size,page:0,id:'0:'+(ph+1)};emit('cursor',{uid:s.uid,docId:s.docId,x,y,sel});}},60);
}else{
 const sb=window.supabase.createClient(C.supabase.url,C.supabase.anonKey);
 let live=null,filesCh=null,libCh=null,lt=null;
 const fromRow=r=>{const d=r.data||{};return {...d,id:r.id,owner:r.uid,email:r.email,status:r.status,comment:r.comment||'',createdAt:r.at,updatedAt:d.updatedAt||r.at,ownerName:d.ownerName||d.by||(r.email||'').split('@')[0]};};
 const loadFiles=async()=>{if(!workspace)return;const {data,error}=await sb.from('requests').select('*').eq('workspace_id',workspace.id);if(error){console.error(error);return;}files=data.map(fromRow);pubFiles();};
 const loadFilesSoon=()=>{clearTimeout(lt);lt=setTimeout(loadFiles,250);};
 const loadLib=async()=>{if(!workspace)return;const {data,error}=await sb.from('library').select('*').eq('workspace_id',workspace.id).order('at',{ascending:false});if(error){console.warn('library',error.message);return;}library=data.map(r=>({id:r.id,kind:r.kind,name:r.name,src:r.src,by:r.by_name,at:r.at}));pubLib();};
 async function resolve(session){if(!session)return {user:null};const u=session.user;const email=u.email.toLowerCase();
  const [{data:ms,error:e1},{data:st}]=await Promise.all([sb.from('memberships').select('role,name,workspaces(id,slug,name,plan,settings)').eq('email',email),sb.from('staff').select('email,name').eq('email',email).maybeSingle()]);
  if(e1){console.error(e1);}
  isStaff=!!st;
  let list=(ms||[]).filter(x=>x.workspaces).map(x=>({...x.workspaces,role:x.role,memberName:x.name}));
  if(isStaff){const {data:all}=await sb.from('workspaces').select('id,slug,name,plan,settings').order('name');list=(all||[]).map(w=>{const mine=list.find(x=>x.id===w.id);return {...w,role:mine?mine.role:'staff'};});}
  if(!list.length){await sb.auth.signOut();return {user:null,err:'This account has not been invited to Brand Studio. Ask '+S.approverName+' for an invite.'};}
  workspaces=list;const want=localStorage.getItem(LS_WS);workspace=list.find(w=>w.slug===want)||list[0];
  const name=(st&&st.name)||(workspace.memberName)||u.user_metadata&&u.user_metadata.full_name||email.split('@')[0];
  S.role=(isStaff||workspace.role==='owner'||workspace.role==='approver')?'approver':'designer';
  return {user:{uid:u.id,email,name,photo:u.user_metadata&&u.user_metadata.avatar_url||null,color:colorFor(email)}};}
 const track=()=>{if(live&&S.me)live.track({uid:S.me.uid,name:S.me.name,photo:S.me.photo,color:S.me.color,docId:mine.docId,docTitle:mine.docTitle,at:iso()});};
 function startLive(){if(live)return;live=sb.channel('studio-live-'+workspace.slug,{config:{presence:{key:S.me.uid},broadcast:{self:false}}});
  live.on('presence',{event:'sync'},()=>{const st=live.presenceState();presence=Object.values(st).map(a=>a[a.length-1]).map(p=>({...p,me:p.uid===S.me.uid}));emit('presence',presence.slice());})
   .on('broadcast',{event:'cursor'},({payload})=>emit('cursor',payload))
   .on('broadcast',{event:'edit'},({payload})=>emit('edit',payload))
   .subscribe(st=>{if(st==='SUBSCRIBED')track();});}
 function stopLive(){if(live){sb.removeChannel(live);live=null;}presence=[];emit('presence',[]);}
 S.onAuth=cb=>{authCb=cb;let last;const go=async s=>{const k=s?s.user.id:'none';if(k===last)return;last=k;const r=await resolve(s);S.me=r.user;if(r.user){startLive();loadFiles();loadLib();prepareKitLogos();loadTemplates();if(!filesCh)filesCh=sb.channel('db-requests').on('postgres_changes',{event:'*',schema:'public',table:'requests'},loadFilesSoon).subscribe();if(!libCh)libCh=sb.channel('db-library').on('postgres_changes',{event:'*',schema:'public',table:'library'},loadLib).subscribe();}else stopLive();cb(r.user,r.err);};sb.auth.getSession().then(({data})=>go(data.session));const {data:{subscription}}=sb.auth.onAuthStateChange((_e,s)=>go(s));return()=>subscription.unsubscribe();};
 S.signInGoogle=async()=>{const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:'select_account'}}});if(error)throw error;};
 S.sendLink=async e=>{const {error}=await sb.auth.signInWithOtp({email:e.trim().toLowerCase(),options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;};
 S.signOut=async()=>{stopLive();S.role=null;await sb.auth.signOut();};
 const loadTemplates=async()=>{if(!workspace)return;const {data,error}=await sb.from('templates').select('id,workspace_id,key,name,spec,published,version').or('workspace_id.is.null,workspace_id.eq.'+workspace.id).eq('published',true);if(error){console.warn('templates',error.message);return;}if(window.ctSetDbTemplates)window.ctSetDbTemplates((data||[]).map(r=>({...r.spec,id:r.key,name:r.name,dbId:r.id,scope:r.workspace_id?'workspace':'global'})));emit('templates',data||[]);};
 S.requests={
  async list(all){let q=sb.from('template_requests').select('*').order('created_at',{ascending:false});if(!all&&workspace)q=q.eq('workspace_id',workspace.id);const {data,error}=await q;if(error)throw error;return data||[];},
  async create({title,brief}){const {error}=await sb.from('template_requests').insert({workspace_id:workspace.id,requested_by:S.me.email,title,brief:brief||''});if(error)throw error;},
  async update(id,patch){const {error}=await sb.from('template_requests').update({...patch,updated_at:iso()}).eq('id',id);if(error)throw error;},
  async remove(id){const {error}=await sb.from('template_requests').delete().eq('id',id);if(error)throw error;}
 };
 S.templates={
  async list(){const {data,error}=await sb.from('templates').select('id,workspace_id,key,name,published,version,updated_at,created_by').order('updated_at',{ascending:false});if(error)throw error;return data||[];},
  async get(id){const {data,error}=await sb.from('templates').select('*').eq('id',id).single();if(error)throw error;return data;},
  async save({id,workspace_id,key,name,spec,published}){const row={workspace_id:workspace_id||null,key,name,spec,published:!!published,updated_at:iso(),created_by:S.me.name};let q;if(id){const cur=await S.templates.get(id);row.version=(cur.version||1)+1;q=sb.from('templates').update(row).eq('id',id);}else{q=sb.from('templates').insert(row);}const {error}=await q;if(error)throw error;loadTemplates();},
  async publish(id,published){const {error}=await sb.from('templates').update({published,updated_at:iso()}).eq('id',id);if(error)throw error;loadTemplates();},
  async remove(id){const {error}=await sb.from('templates').delete().eq('id',id);if(error)throw error;loadTemplates();},
  reload:()=>loadTemplates()
 };
 const prepareKitLogos=async()=>{if(!workspace)return;const kit=workspace.settings&&workspace.settings.kit;const logos={};if(kit&&kit.logos&&kit.logos.length){for(const l of kit.logos){try{const {data}=await sb.storage.from('guidelines').createSignedUrl(l.path,3600*6);if(data){if(l.dark&&!logos.dark)logos.dark=data.signedUrl;if(!l.dark&&!logos.light)logos.light=data.signedUrl;}}catch(e){}}}workspace={...workspace,kitLogos:logos};workspaces=workspaces.map(w=>w.id===workspace.id?workspace:w);emit('workspace',workspace);};
 S.foundation={async save(fd){if(!workspace)throw new Error('No workspace');const settings={...(workspace.settings||{}),foundation:fd};const {error}=await sb.from('workspaces').update({settings}).eq('id',workspace.id);if(error)throw error;workspace={...workspace,settings};workspaces=workspaces.map(w=>w.id===workspace.id?workspace:w);emit('workspace',workspace);}};
 S.kit={
  get(){return (workspace&&workspace.settings&&workspace.settings.kit)||null;},
  async save(kit){if(!workspace)throw new Error('No workspace');const settings={...(workspace.settings||{}),kit:{...kit,updatedAt:iso(),updatedBy:S.me.name}};const {error}=await sb.from('workspaces').update({settings}).eq('id',workspace.id);if(error)throw error;workspace={...workspace,settings};workspaces=workspaces.map(w=>w.id===workspace.id?workspace:w);emit('workspace',workspace);prepareKitLogos();return settings.kit;},
  async uploadAsset(file,kind){if(!workspace)throw new Error('No workspace');const ext=(file.name.split('.').pop()||'png').toLowerCase();const path=workspace.id+'/kit/'+kind+'-'+Date.now()+'.'+ext;const {error}=await sb.storage.from('guidelines').upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return path;},
  async assetUrl(path){const {data,error}=await sb.storage.from('guidelines').createSignedUrl(path,3600);if(error)throw error;return data.signedUrl;}
 };
 S.guidelines={
  async url(){const path=workspace&&workspace.settings&&workspace.settings.guidelines;if(!path)return null;const {data,error}=await sb.storage.from('guidelines').createSignedUrl(path,3600);if(error)throw error;return data.signedUrl;},
  async upload(file){if(!workspace)throw new Error('No workspace');if(file.type!=='application/pdf')throw new Error('Upload a PDF.');const path=workspace.id+'/guidelines-'+Date.now()+'.pdf';const {error}=await sb.storage.from('guidelines').upload(path,file,{contentType:'application/pdf',upsert:false});if(error)throw error;
   const settings={...(workspace.settings||{}),guidelines:path,guidelinesName:file.name,guidelinesAt:iso(),guidelinesBy:S.me.name};const {error:e2}=await sb.from('workspaces').update({settings}).eq('id',workspace.id);if(e2)throw e2;workspace={...workspace,settings};workspaces=workspaces.map(w=>w.id===workspace.id?workspace:w);emit('workspace',workspace);return path;}
 };
 S.updateName=async name=>{name=name.trim();if(!name)return;const {error}=await sb.auth.updateUser({data:{full_name:name}});if(error)throw error;if(workspace){await sb.from('memberships').update({name}).eq('workspace_id',workspace.id).eq('email',S.me.email);}S.me={...S.me,name};track();};
 S.resetPassword=async()=>{const {error}=await sb.auth.resetPasswordForEmail(S.me.email,{redirectTo:location.origin+location.pathname});if(error)throw error;};
 S.setPassword=async pw=>{const {error}=await sb.auth.updateUser({password:pw});if(error)throw error;};
 S.team=async()=>{const {data}=await sb.from('memberships').select('email,name,role').eq('workspace_id',workspace.id);return (data||[]).map(m=>({email:m.email,name:m.name,role:m.role==='editor'?'designer':'approver'}));};
 S.setWorkspace=slug=>{const w=workspaces.find(x=>x.slug===slug);if(!w||!workspace||w.id===workspace.id)return;workspace=w;localStorage.setItem(LS_WS,slug);S.role=(isStaff||w.role==='owner'||w.role==='approver')?'approver':'designer';files=[];library=[];pubFiles();pubLib();stopLive();startLive();loadFiles();loadLib();emit('workspace',workspace);prepareKitLogos();loadTemplates();};
 S.admin={
  async list(){const [{data:ws},{data:ms},{data:rq},{data:tr}]=await Promise.all([sb.from('workspaces').select('id,slug,name,plan,created_at,settings').order('name'),sb.from('memberships').select('workspace_id'),sb.from('requests').select('workspace_id,status,at,data->>updatedAt'),sb.from('template_requests').select('workspace_id,status')]);
   const FD=['moodboards','logo','guidelines','signoff'];
   return (ws||[]).map(w=>{const mine=(rq||[]).filter(r=>r.workspace_id===w.id);const fd=(w.settings&&w.settings.foundation)||{};const last=mine.map(r=>r.updatedAt||r.at).sort().pop()||null;
    return {...w,members:(ms||[]).filter(m=>m.workspace_id===w.id).length,files:mine.length,pending:mine.filter(r=>r.status==='pending').length,
     foundation:FD.filter(k=>fd[k]&&fd[k].status==='done').length,fdWaiting:FD.some(k=>fd[k]&&fd[k].status==='with client'),hasKit:!!(w.settings&&w.settings.kit),
     openReq:(tr||[]).filter(r=>r.workspace_id===w.id&&(r.status==='open'||r.status==='in progress')).length,last};});},
  async create({slug,name,plan}){const {data,error}=await sb.from('workspaces').insert({slug,name,plan:plan||'core'}).select('id,slug,name,plan').single();if(error)throw error;workspaces=[...workspaces,{...data,role:'staff'}];return data;},
  async members(wsId){const {data,error}=await sb.from('memberships').select('email,name,role,created_at').eq('workspace_id',wsId).order('created_at');if(error)throw error;return data||[];},
  async addMember(wsId,{email,name,role,silent}){email=email.trim().toLowerCase();if(silent){const {error}=await sb.from('memberships').upsert({workspace_id:wsId,email,name:name||null,role:role||'editor'});if(error)throw error;return {email_sent:false};}
   const {data,error}=await sb.functions.invoke('invite',{body:{workspace_id:wsId,email,name:name||'',role:role||'editor',redirect:location.origin+location.pathname}});if(error){let msg=error.message;try{const j=await error.context.json();msg=j.error||msg;}catch(e){}throw new Error(msg);}if(data&&data.error)throw new Error(data.error);return data||{};},
  async removeMember(wsId,email){const {error}=await sb.from('memberships').delete().eq('workspace_id',wsId).eq('email',email);if(error)throw error;}
 };
 const split=x=>{const {id,owner,email,status,comment,createdAt,...data}=x;return {data,status:status||'draft',comment:comment||''};};
 S.createFile=async x=>{const t=iso();const s=split({...x,ownerName:S.me.name,updatedBy:S.me.name,updatedAt:t});const {data,error}=await sb.from('requests').insert({data:s.data,email:S.me.email,status:'draft',comment:'',workspace_id:workspace.id}).select('*').single();if(error)throw error;files=[fromRow(data),...files];pubFiles();return data.id;};
 S.saveFile=async(id,x)=>{const cur=files.find(f=>f.id===id)||{};const full={...cur,...x};files=files.map(f=>f.id===id?full:f);pubFiles();const {error}=await sb.from('requests').update(split(full)).eq('id',id);if(error)throw error;};
 S.deleteFile=async id=>{const {error}=await sb.from('requests').delete().eq('id',id);if(error)throw error;files=files.filter(f=>f.id!==id);pubFiles();};
 S.addLibrary=async it=>{const {error}=await sb.from('library').insert({kind:it.kind,name:it.name,src:it.src,by_name:S.me.name,workspace_id:workspace.id});if(error)throw error;loadLib();};
 S.removeLibrary=async id=>{const {error}=await sb.from('library').delete().eq('id',id);if(error)throw error;loadLib();};
 S.setPresence=p=>{mine=p;track();};
 S.sendCursor=p=>{if(live)live.send({type:'broadcast',event:'cursor',payload:{...p,uid:S.me.uid}});};
 S.sendEdit=p=>{if(live)live.send({type:'broadcast',event:'edit',payload:{...p,uid:S.me.uid}});};
}
window.CTS=S;
const loadScript=src=>new Promise((res,rej)=>{if(document.querySelector('script[src="'+src+'"]')){res();return;}const el=document.createElement('script');el.src=src;el.onload=res;el.onerror=()=>rej(new Error('Couldn’t load the document reader'));document.head.appendChild(el);});
function html2md(html){const d=document.createElement('div');d.innerHTML=html;const inl=n=>{let s='';n.childNodes.forEach(c=>{if(c.nodeType===3)s+=c.textContent;else if(/^(STRONG|B)$/.test(c.tagName)){const t=inl(c).trim();s+=t?'**'+t+'**':'';}else if(c.tagName==='BR')s+=' ';else if(c.nodeType===1)s+=inl(c);});return s.replace(/\s+/g,' ');};
const out=[];d.childNodes.forEach(n=>{if(n.nodeType!==1)return;const tg=n.tagName;const tx=inl(n).trim();const plain=tx.replace(/\*\*/g,'');
if(tg==='H1')out.push('# '+plain);else if(tg==='H2')out.push('## '+plain);else if(/^H[3-6]$/.test(tg))out.push('### '+plain);
else if(tg==='UL'||tg==='OL'){let k=1;n.querySelectorAll(':scope>li').forEach(li=>out.push((tg==='OL'?(k++)+'. ':'- ')+inl(li).trim()));}
else if(tg==='TABLE'){const rows=[...n.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>inl(td).trim().replace(/\|/g,'/')));if(rows.length){out.push('| '+rows[0].join(' | ')+' |');out.push('|'+rows[0].map(()=>' --- ').join('|')+'|');rows.slice(1).forEach(r=>out.push('| '+r.join(' | ')+' |'));}}
else if(tg==='BLOCKQUOTE')out.push('> '+tx);
else if(tx){if(/^\*\*[^*]+\*\*$/.test(tx)&&tx.length<80)out.push('### '+plain);else out.push(tx);}
out.push('');});return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();}
function pdf2md(text){const L=text.split('\n').map(l=>l.trim()).filter(l=>!/^-- \d+ of \d+ --$/.test(l));const out=[];let para=[];const fl=()=>{if(para.length){out.push(para.join(' '));out.push('');para=[];}};
for(const l of L){if(!l){fl();continue;}if(l.length<50&&l===l.toUpperCase()&&/[A-Z]/.test(l)){fl();out.push('# '+l.charAt(0)+l.slice(1).toLowerCase());out.push('');continue;}if(/^[•\-–]\s/.test(l)){fl();out.push('- '+l.replace(/^[•\-–]\s/,''));continue;}para.push(l);if(/[.!?:”]$/.test(l))fl();}fl();return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();}
window.ctImportDoc=async file=>{const n=file.name.toLowerCase();
if(/\.(md|markdown|txt)$/.test(n))return await file.text();
if(n.endsWith('.docx')){await loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js');const r=await window.mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});return html2md(r.value);}
if(n.endsWith('.pdf')){const {PDFParse}=await import('https://cdn.jsdelivr.net/npm/pdf-parse@2.4.5/dist/pdf-parse/web/pdf-parse.es.js');PDFParse.setWorker('https://cdn.jsdelivr.net/npm/pdf-parse@2.4.5/dist/pdf-parse/web/pdf.worker.min.mjs');const p=new PDFParse({data:new Uint8Array(await file.arrayBuffer())});const r=await p.getText();return pdf2md(r.text);}
if(n.endsWith('.doc'))throw new Error('Old .doc files aren’t supported. Save it as .docx and try again.');
throw new Error('Use a .docx, .md, .txt or .pdf file.');};
})();
