// Billing for client owners: plan, status and what was bought, from workspaces.settings.billing (written by stripe-webhook).
const BL_PLANS={core:{name:'Core',price:149,foundation:990},growth:{name:'Growth',price:349,foundation:1490},max:{name:'Max',price:799,foundation:2490},internal:{name:'Internal',price:0,foundation:0}};
const BL_ADDONS={none:null,starter_logo:'Starter Logo',website:'Website'};
const BL_STATUS={active:['Active','#1F5F3F','#DDF5CF'],trialing:['Trial','#1F5F3F','#DDF5CF'],past_due:['Payment due','#8A1C1C','#FFE1DC'],unpaid:['Unpaid','#8A1C1C','#FFE1DC'],canceled:['Cancelled','#57554D','#F1F1EF'],incomplete:['Incomplete','#6B4E00','#FFF3C4']};
function HmBilling(){const ws=CTS.workspace;const b=(ws.settings&&ws.settings.billing)||null;const plan=BL_PLANS[ws.plan]||BL_PLANS.core;const portal=window.CT_STUDIO_CONFIG&&CT_STUDIO_CONFIG.billingPortal;
 const st=BL_STATUS[(b&&b.status)||'active']||BL_STATUS.active;const money=(n,c)=>n==null?'':new Intl.NumberFormat('en',{style:'currency',currency:(c||'usd').toUpperCase(),maximumFractionDigits:0}).format(n/100);
 return <main className="adm"><div className="adm-h"><h1>Billing</h1><p className="muted">{ws.name}</p></div>
 <div className="adm-grid"><section className="adm-card"><h2>Plan</h2><div className="bl-plan"><b>{plan.name}</b>{plan.price>0&&<span>${plan.price} / month</span>}<span className="bl-st" style={{color:st[1],background:st[2]}}>{st[0]}</span></div>
 {b?<table className="adm-t" style={{marginTop:12}}><tbody>
  <tr><td className="muted">Brand Foundation</td><td>{b.foundation?'Included, one-time $'+plan.foundation.toLocaleString('en'):'Not included (Studio Setup)'}</td></tr>
  {BL_ADDONS[b.addons]&&<tr><td className="muted">Add-on</td><td>{BL_ADDONS[b.addons]}</td></tr>}
  <tr><td className="muted">First payment</td><td>{money(b.amount_total,b.currency)} on {String(b.paid_at||'').slice(0,10)}</td></tr>
  {b.cancel_at&&<tr><td className="muted">Ends</td><td>{new Date(b.cancel_at*1000).toISOString().slice(0,10)}</td></tr>}
  {b.livemode===false&&<tr><td className="muted">Mode</td><td><span className="adm-flag">Test payment</span></td></tr>}
 </tbody></table>:<p className="muted" style={{marginTop:10}}>{ws.plan==='internal'?'Internal workspace, no billing.':'This workspace was set up by Colorteam, not through checkout. Billing is handled directly with Colorteam.'}</p>}</section>
 <section className="adm-card"><h2>Manage</h2><p className="muted" style={{marginBottom:10}}>Change card, download invoices, switch plan or cancel.</p>{portal?<a className="btn primary" href={portal} target="_blank" rel="noopener">Manage billing</a>:<a className="btn" href="https://studio-staging.colorteam.io/contact/" target="_blank" rel="noopener">Contact Colorteam</a>}<p className="muted" style={{marginTop:10}}>Upgrading to Max is a conversation with Colorteam; book a call from the contact page.</p></section></div></main>;}
Object.assign(window,{HmBilling});
