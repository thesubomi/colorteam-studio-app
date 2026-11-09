// First steps for a fresh client workspace: shown on the home screen until the kit exists,
// a teammate is added and a first file is made. Owners see actions; editors see progress.
function HmOnboarding({files,go,newFile}){const ws=CTS.workspace;if(!ws||ws.slug==='colorteam')return null;const st=ws.settings||{};const owner=CTS.isStaff||ws.role==='owner';
const [team,setTeam]=React.useState(null);React.useEffect(()=>{let on=true;CTS.team().then(t=>{if(on)setTeam(t);}).catch(()=>{if(on)setTeam([]);});return()=>{on=false;};},[ws.id]);
const [hidden,setHidden]=React.useState(()=>{try{return localStorage.getItem('ctbs2_onb_'+ws.id)==='1';}catch(e){return false;}});
const hasKit=!!(st.kit&&st.kit.colors&&st.kit.colors.length);const hasGuide=!!st.guidelines;const fd=st.foundation||{};const fdDone=['moodboards','logo','guidelines','signoff'].filter(k=>fd[k]&&fd[k].status==='done').length;
const hasTeam=(team||[]).length>1;const hasFile=(files||[]).length>0;
const steps=[
 {k:'brand',done:hasKit,title:hasKit?'Brand kit in place':'Set up the brand',body:hasGuide?'Guidelines are uploaded. Fill the kit so templates use your colours and fonts.':fdDone>0||(fd.moodboards&&fd.moodboards.status!=='not started')?'Colorteam is building your Brand Foundation ('+fdDone+' of 4 stages done). The kit fills in as it lands.':'Have brand guidelines? Upload the PDF and fill the kit. Starting from scratch? Colorteam builds the Foundation first.',
  actions:[['Brand kit','kit'],['Upload guidelines','guidelines'],['Foundation','foundation']]},
 {k:'team',done:hasTeam,title:hasTeam?'Team is in':'Add your team',body:'Editors make content, approvers sign it off. People sign in with a link to their email.',actions:[['Add people','team']]},
 {k:'first',done:hasFile,title:hasFile?'First file made':'Make the first post',body:'Pick a template, change the words, send it for approval, export at the right size.',actions:[['Start from a template','templates']]},
];
const done=steps.filter(s=>s.done).length;
if(hidden||(done===3&&(st.brand_stage||!owner)))return null;
const act=key=>{if(key==='templates'){const el=document.querySelector('.tpl-grid');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return;}go({name:key});};
return <section className="hs onb"><div className="onb-h"><div><h2>Getting {ws.name} ready</h2><p className="muted">{done} of 3 done{owner?'':' · owners complete these'}</p></div><button className="btn xs ghost" onClick={()=>{try{localStorage.setItem('ctbs2_onb_'+ws.id,'1');}catch(e){}setHidden(true);}}>Hide</button></div>
{owner&&!st.brand_stage&&<OnbStage/>}<div className="onb-grid">{steps.map((s,i)=><div key={s.k} className={'onb-c'+(s.done?' done':'')}><span className="onb-n">{s.done?'✓':i+1}</span><b>{s.title}</b><p className="muted">{s.body}</p>{owner&&!s.done&&<div className="row">{s.actions.map(([l,k])=><button key={k} className={'btn xs'+(k===s.actions[0][1]?' primary':'')} onClick={()=>act(k)}>{l}</button>)}</div>}</div>)}</div></section>;}
// One question for new owners: where the brand is today. Shapes what Colorteam does first; synced to HubSpot.
const ONB_STAGES=[['no_brand','No brand yet','We need a name, logo and look'],['guidelines_no_system','Guidelines, but no system','We have a brand book, not the templates'],['brand_need_speed','A brand and content already','We need to make it faster']];
function OnbStage(){const [busy,setBusy]=React.useState('');const pick=async k=>{setBusy(k);try{await CTS.setBrandStage(k);}catch(e){window.__ctToast&&window.__ctToast(e.message);}setBusy('');};
 return <div className="onb-q"><b>Where is your brand today?</b><div className="onb-qs">{ONB_STAGES.map(([k,t,d])=><button key={k} className="onb-qb" disabled={!!busy} onClick={()=>pick(k)}><span>{busy===k?'Saving…':t}</span><em>{d}</em></button>)}</div></div>;}
// Full-screen welcome shown once, right after a new owner pays and signs in for the first time.
// Welcome > Brand stage > Bring the brand in > Invite the team > Done. Saved as settings.onboarded.
// Existing workspaces that already answered the brand question skip it. Staff can preview at #/welcome.
function ctNeedsOnboarding(ws){if(!ws||ws.slug==='colorteam')return false;const st=ws.settings||{};if(st.onboarded||st.brand_stage)return false;return ws.role==='owner';}
const ONB_PLAN={core:'Core',growth:'Growth',max:'Max',internal:'Internal'};
function OnbFlow({go,theme,toast,onDone}){const ws=CTS.workspace;const st=(ws&&ws.settings)||{};
 const [step,setStep]=React.useState(0);const [stage,setStage]=React.useState(st.brand_stage||'');const [busy,setBusy]=React.useState('');
 const [gl,setGl]=React.useState(st.guidelinesName||'');const [drag,setDrag]=React.useState(false);
 const [people,setPeople]=React.useState([{email:'',role:'editor'}]);const [sent,setSent]=React.useState([]);
 const seats=ctLimits(ws).seats;const free=seats==null?4:Math.max(0,seats-1);
 const first=((CTS.me&&CTS.me.name)||'').split(' ')[0];const plan=ONB_PLAN[ws.plan]||'Core';
 const STEPS=['Welcome','Your brand','Brand files','Team','Ready'];
 const next=()=>setStep(s=>Math.min(s+1,STEPS.length-1));const back=()=>setStep(s=>Math.max(s-1,0));
 const pickStage=async k=>{setStage(k);setBusy('stage');try{await CTS.setBrandStage(k);}catch(e){toast(e.message);}setBusy('');next();};
 const upload=async f=>{if(!f)return;if(f.type!=='application/pdf'){toast('Upload a PDF.');return;}setBusy('gl');try{await CTS.guidelines.upload(f);setGl(f.name);ctTrack.event('onboarding_guidelines',{});}catch(e){toast(e.message);}setBusy('');};
 const invite=async()=>{const list=people.filter(p=>p.email.trim());if(!list.length){next();return;}setBusy('team');const ok=[];
  for(const p of list){try{await CTS.admin.addMember(ws.id,{email:p.email,name:'',role:p.role});ok.push(p.email.trim().toLowerCase());}catch(e){toast(p.email+': '+e.message);}}
  setSent(x=>[...x,...ok]);setPeople([{email:'',role:'editor'}]);setBusy('');if(ok.length===list.length)next();};
 const finish=async dest=>{setBusy('done');try{await CTS.finishOnboarding();ctTrack.event('onboarding_done',{stage:stage||'skipped'});}catch(e){toast(e.message);}setBusy('');onDone(dest);};
 const logo=<img className="onbf-logo" src={theme==='dark'?'assets/brand26/wordmark-white.svg':'assets/brand26/wordmark-black.svg'} alt="colorteam"/>;
 const noBrand=stage==='no_brand';
 let body;
 if(step===0)body=<><span className="onbf-chip">{plan} plan active</span><h1>Welcome to Studio{first?', '+first:''}</h1><p className="onbf-lede">Payment's through and {ws.name}'s workspace is ready. Three quick steps and you can make your first on-brand post.</p>
  <ol className="onbf-list"><li><b>Bring your brand in</b><span>Guidelines, colours, fonts and logo, so every template looks like you.</span></li><li><b>Invite your team</b><span>Editors make content, approvers sign it off.</span></li><li><b>Make your first post</b><span>Pick a template, change the words, download at the right size.</span></li></ol>
  <div className="onbf-act"><button className="btn primary lg" onClick={next}>Let's set up</button></div></>;
 else if(step===1)body=<><h1>Where is your brand today?</h1><p className="onbf-lede">This tells your Colorteam team where to start.</p>
  <div className="onbf-opts">{ONB_STAGES.map(([k,t,d])=><button key={k} className={'onbf-opt'+(stage===k?' on':'')} disabled={!!busy} onClick={()=>pickStage(k)}><span className="onbf-radio"/><span><b>{busy==='stage'&&stage===k?'Saving…':t}</b><em>{d}</em></span></button>)}</div>
  <div className="onbf-act"><button className="btn ghost" onClick={back}>Back</button>{stage&&<button className="btn primary lg" onClick={next}>Continue</button>}</div></>;
 else if(step===2)body=noBrand?<><h1>We'll build your brand first</h1><p className="onbf-lede">Your Brand Foundation is where taste gets defined. Colorteam takes you through it, and your kit and templates fill in as each stage is signed off.</p>
  <ol className="onbf-list onbf-stages"><li><b>Mood boards</b><span>Two directions to choose from.</span></li><li><b>Logo</b><span>Built on the direction you pick.</span></li><li><b>Guidelines</b><span>Colours, type and rules in one place.</span></li><li><b>Sign-off</b><span>You approve, and the Studio is set up on it.</span></li></ol>
  <div className="onbf-act"><button className="btn ghost" onClick={back}>Back</button><button className="btn primary lg" onClick={next}>Continue</button></div></>
  :<><h1>Bring your brand in</h1><p className="onbf-lede">Upload your brand guidelines PDF. Your team sees it in the Studio, and it's what your brand kit is built from.</p>
  <label className={'onbf-drop'+(drag?' over':'')+(gl?' done':'')} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files&&e.dataTransfer.files[0]);}}>
   <input type="file" accept="application/pdf" hidden onChange={e=>{upload(e.target.files&&e.target.files[0]);e.target.value='';}}/>
   <span className="onbf-ic">{gl?'✓':'↑'}</span><b>{busy==='gl'?'Uploading…':gl?gl:'Drop your guidelines PDF here'}</b><em>{gl?'Uploaded. Choose another file to replace it.':'or click to choose a file'}</em></label>
  <div className="onbf-act"><button className="btn ghost" onClick={back}>Back</button><span className="onbf-sp"/>{!gl&&<button className="btn ghost" onClick={next}>I'll do this later</button>}<button className="btn primary lg" disabled={!gl||busy==='gl'} onClick={next}>Continue</button></div></>;
 else if(step===3)body=<><h1>Invite your team</h1><p className="onbf-lede">{seats==null?'Your plan has unlimited seats.':'Your '+plan+' plan has '+seats+' seats, one of them is yours.'} People get an email with a link to sign in.</p>
  {sent.length>0&&<p className="onbf-sent">Invited: {sent.join(', ')}</p>}
  {free-sent.length>0?<div className="onbf-team">{people.map((p,i)=><div key={i} className="onbf-row"><input className="f-in" type="email" placeholder="name@company.com" value={p.email} onChange={e=>setPeople(people.map((x,j)=>j===i?{...x,email:e.target.value}:x))}/><select className="f-in" value={p.role} onChange={e=>setPeople(people.map((x,j)=>j===i?{...x,role:e.target.value}:x))}><option value="editor">Editor</option><option value="approver">Approver</option></select></div>)}
   {people.length<free-sent.length&&<button className="btn xs ghost onbf-more" onClick={()=>setPeople([...people,{email:'',role:'editor'}])}>+ Add another</button>}</div>
   :<p className="muted">All seats are in use. You can add more from Billing later.</p>}
  <div className="onbf-act"><button className="btn ghost" onClick={back}>Back</button><span className="onbf-sp"/><button className="btn ghost" onClick={next}>Skip for now</button><button className="btn primary lg" disabled={busy==='team'} onClick={invite}>{busy==='team'?'Sending…':people.some(p=>p.email.trim())?'Send invites':'Continue'}</button></div></>;
 else body=<><span className="onbf-ic big">✓</span><h1>You're all set</h1><p className="onbf-lede">{noBrand?'Colorteam starts on your Brand Foundation next. You can follow every stage under Foundation. Templates are ready to explore in the meantime.':gl?'Your guidelines are in. Fill the brand kit next so templates use your colours, fonts and logo.':'Add your guidelines or brand kit whenever you are ready. Templates are waiting.'}</p>
  <div className="onbf-act col"><button className="btn primary lg" disabled={busy==='done'} onClick={()=>finish(noBrand?'foundation':'kit')}>{noBrand?'See my Brand Foundation':'Set up my brand kit'}</button><button className="btn ghost" disabled={busy==='done'} onClick={()=>finish('templates')}>Browse templates</button></div></>;
 return <div className="onbf"><div className="onbf-top">{logo}{step<STEPS.length-1&&<button className="btn xs ghost" onClick={()=>finish('home')}>Skip setup</button>}</div>
  <div className="onbf-c" key={step}><div className="onbf-prog" aria-label={'Step '+(step+1)+' of '+STEPS.length}>{STEPS.map((l,i)=><span key={l} className={i<step?'d':i===step?'on':''}/>)}</div>{body}</div></div>;}
Object.assign(window,{HmOnboarding,OnbFlow,ctNeedsOnboarding});
