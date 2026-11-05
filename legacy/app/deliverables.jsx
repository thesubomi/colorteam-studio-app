// Staff page: what Colorteam owes each client, as dated tasks. Template requests and Brand Foundation
// stages appear automatically (0009_deliverables.sql); staff add their own and assign them.
const DL_KIND={request:'Request',foundation:'Foundation',manual:'Task'};
const dlToday=()=>new Date().toISOString().slice(0,10);
const dlIn=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
const dlFmt=d=>{if(!d)return 'No date';const x=new Date(d+'T12:00:00');return x.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});};

function HmDeliverables({toast}){const [rows,setRows]=React.useState(null);const [ws,setWs]=React.useState([]);const [staff,setStaff]=React.useState([]);
 const [show,setShow]=React.useState('open');const [who,setWho]=React.useState('all');const [client,setClient]=React.useState('');
 const [nt,setNt]=React.useState({workspace_id:'',title:'',due_on:dlIn(7),assignee:''});const [busy,setBusy]=React.useState(false);
 const load=()=>CTS.tasks.list().then(setRows).catch(e=>toast(e.message));
 React.useEffect(()=>{load();CTS.admin.list().then(setWs).catch(()=>{});CTS.tasks.staff().then(setStaff).catch(()=>{});},[]);
 const wsName=id=>(ws.find(w=>w.id===id)||{}).name||'Client';
 const set=async(t,patch)=>{setRows(r=>r.map(x=>x.id===t.id?{...x,...patch}:x));try{await CTS.tasks.update(t.id,patch);}catch(x){toast(x.message);load();}};
 const add=async e=>{e.preventDefault();if(!nt.workspace_id||!nt.title.trim()){toast('Pick a client and write the task');return;}setBusy(true);try{await CTS.tasks.create({workspace_id:nt.workspace_id,title:nt.title.trim(),due_on:nt.due_on||null,assignee:nt.assignee||null});setNt({...nt,title:''});toast('Task added');load();}catch(x){toast(x.message);}setBusy(false);};
 const remove=async t=>{if(!confirm('Delete “'+t.title+'”?'))return;try{await CTS.tasks.remove(t.id);load();}catch(x){toast(x.message);}};
 if(!rows)return <main className="adm"><p className="muted">Loading…</p></main>;
 const today=dlToday(),week=dlIn(7);
 const list=rows.filter(t=>(show==='all'||t.status===show)&&(who==='all'||(who==='me'?t.assignee===CTS.me.email:who==='none'?!t.assignee:t.assignee===who))&&(!client||t.workspace_id===client));
 const open=rows.filter(t=>t.status==='open');const overdue=open.filter(t=>t.due_on&&t.due_on<today);const thisWeek=open.filter(t=>t.due_on&&t.due_on>=today&&t.due_on<=week);
 const groups=show==='done'?[['Done',list]]:[['Overdue',list.filter(t=>t.status==='open'&&t.due_on&&t.due_on<today)],['Due this week',list.filter(t=>t.status==='open'&&t.due_on&&t.due_on>=today&&t.due_on<=week)],['Later',list.filter(t=>t.status==='open'&&t.due_on&&t.due_on>week)],['No date',list.filter(t=>t.status==='open'&&!t.due_on)],...(show==='all'?[['Done',list.filter(t=>t.status==='done')]]:[])];
 const row=t=>{const late=t.status==='open'&&t.due_on&&t.due_on<today;return <tr key={t.id} className={t.status==='done'?'dl-done':''}>
  <td style={{width:28}}><input type="checkbox" checked={t.status==='done'} onChange={e=>set(t,{status:e.target.checked?'done':'open'})} title="Mark done"/></td>
  <td><b>{t.title}</b><div className="muted" style={{fontSize:12}}>{wsName(t.workspace_id)} · <span className="pill">{DL_KIND[t.kind]||t.kind}</span></div></td>
  <td style={{width:160}}><input className={'f-in'+(late?' dl-late':'')} type="date" value={t.due_on||''} onChange={e=>set(t,{due_on:e.target.value||null})}/></td>
  <td style={{width:200}}><select className="f-in" value={t.assignee||''} onChange={e=>set(t,{assignee:e.target.value||null})}><option value="">Unassigned</option>{staff.map(s=><option key={s.email} value={s.email}>{s.name||s.email}</option>)}</select></td>
  <td style={{width:60}}>{t.kind==='manual'&&<button className="btn xs ghost" onClick={()=>remove(t)}>Delete</button>}</td></tr>;};
 return <main className="adm"><div className="adm-h"><h1>Deliverables</h1><p className="muted">What we owe each client. Template requests and Foundation stages appear here on their own, due by plan turnaround (Core 5 working days, Growth 3, Max 2). They close when the request or stage is marked done.</p></div>
 <div className="adm-kpis"><div><b>{open.length}</b><span>Open</span></div><div className={overdue.length?'bad':''}><b>{overdue.length}</b><span>Overdue</span></div><div><b>{thisWeek.length}</b><span>Due this week</span></div><div><b>{open.filter(t=>!t.assignee).length}</b><span>Unassigned</span></div></div>
 <section className="adm-card adm-wide" style={{marginTop:14}}>
  <div className="row dl-filters"><select className="f-in" value={show} onChange={e=>setShow(e.target.value)}><option value="open">Open</option><option value="done">Done</option><option value="all">All</option></select>
   <select className="f-in" value={who} onChange={e=>setWho(e.target.value)}><option value="all">Everyone</option><option value="me">Mine</option><option value="none">Unassigned</option>{staff.filter(s=>s.email!==CTS.me.email).map(s=><option key={s.email} value={s.email}>{s.name||s.email}</option>)}</select>
   <select className="f-in" value={client} onChange={e=>setClient(e.target.value)}><option value="">All clients</option>{ws.filter(w=>w.slug!=='colorteam').map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
  {groups.filter(([,g])=>g.length).map(([name,g])=><div key={name} style={{marginTop:14}}><h2 className={name==='Overdue'?'dl-h bad':'dl-h'}>{name} <span className="muted">{g.length}</span></h2><table className="adm-t"><tbody>{g.map(row)}</tbody></table></div>)}
  {!list.length&&<p className="muted" style={{marginTop:14}}>Nothing here.</p>}
 </section>
 <section className="adm-card adm-wide" style={{marginTop:14}}><h2>Add a task</h2><form className="row adm-add" onSubmit={add} style={{flexWrap:'wrap'}}>
  <select className="f-in" value={nt.workspace_id} onChange={e=>setNt({...nt,workspace_id:e.target.value})} required><option value="">Client</option>{ws.filter(w=>w.slug!=='colorteam').map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select>
  <input className="f-in" style={{flex:'1 1 240px'}} placeholder="Monthly check-in call" value={nt.title} onChange={e=>setNt({...nt,title:e.target.value})} required/>
  <input className="f-in" type="date" value={nt.due_on} onChange={e=>setNt({...nt,due_on:e.target.value})}/>
  <select className="f-in" value={nt.assignee} onChange={e=>setNt({...nt,assignee:e.target.value})}><option value="">Unassigned</option>{staff.map(s=><option key={s.email} value={s.email}>{s.name||s.email}</option>)}</select>
  <button className="btn primary" disabled={busy}>Add</button></form></section></main>;}
Object.assign(window,{HmDeliverables});
