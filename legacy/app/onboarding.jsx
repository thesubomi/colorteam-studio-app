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
Object.assign(window,{HmOnboarding});
