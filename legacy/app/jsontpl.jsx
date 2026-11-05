// Templates as data. A template is JSON (see docs/template-format.md): fields, sizes and, per size,
// a list of layers. ctRenderJson draws the layers; ctThemesFromKit turns a client's brand kit into
// the theme objects the whole editor already understands. Code templates keep working unchanged.

function ctHexRgba(hex,a){const h=String(hex||'#000').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
function ctLum(hex){const h=String(hex||'#000').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;return (0.299*r+0.587*g+0.114*b)/255;}

// Theme objects from a brand kit: one per "ground"-like colour, so the Style picker offers Brand, Light, Accent.
function ctThemesFromKit(kit,logos){const cols=(kit&&kit.colors)||[];const by=r=>(cols.find(c=>c.role===r)||{}).hex;
 const ground=by('ground')||'#111111',surface=by('surface')||'#FFFFFF',ink=by('ink')||'#111111',accent=by('accent')||'#F2B0CD',muted=by('muted'),accent2=by('accent 2');
 const mk=(id,name,bg,extra)=>{const dark=ctLum(bg)<0.5;const fg=dark?(ctLum(ink)<0.5?surface:ink):(ctLum(ink)<0.5?ink:ground);const acc=(id==='accent'?(dark?surface:ground):accent);
  return {id,name,bg,ink:fg,sub:muted&&Math.abs(ctLum(muted)-ctLum(bg))>0.25?muted:ctHexRgba(fg,.72),lab:acc,acc,hl:'color',mark:ctHexRgba(acc,.55),cardSoft:dark?ctHexRgba(fg,.08):ctHexRgba(ground,.06),glass:ctHexRgba(bg,.8),nameC:acc,line:ctHexRgba(fg,.5),hair:ctHexRgba(fg,.16),logo:(dark?logos.dark:logos.light)||logos.light||logos.dark||'',pod:'',chipBg:acc,chipInk:id==='accent'?accent:bg,cardAcc:accent,cardChip:accent,outline:acc,statBg:acc,statInk:bg,kit:true,...extra};};
 const list=[mk('brand','Brand',ground),mk('light','Light',surface),mk('accent','Accent',accent)];
 if(accent2)list.push(mk('accent2','Accent 2',accent2));
 return list;}

const CT_CODE_THEMES=CT_THEMES.slice();
let ctFontLink=null;
function ctLoadFonts(kit){const fam=[...new Set([kit&&kit.fonts&&kit.fonts.display,kit&&kit.fonts&&kit.fonts.body,kit&&kit.fonts&&kit.fonts.serif].filter(Boolean).map(s=>s.trim()).filter(s=>s&&!/^(inter|newsreader)$/i.test(s)))];
 if(ctFontLink){ctFontLink.remove();ctFontLink=null;}if(!fam.length)return;
 ctFontLink=document.createElement('link');ctFontLink.rel='stylesheet';ctFontLink.href='https://fonts.googleapis.com/css2?'+fam.map(f=>'family='+encodeURIComponent(f).replace(/%20/g,'+')+':wght@400;500;600;700;800').join('&')+'&display=swap';document.head.appendChild(ctFontLink);}

// Swap the editor's themes when the workspace changes: Colorteam keeps its code themes, clients get kit themes.
function ctApplyWorkspaceThemes(ws){const kit=ws&&ws.settings&&ws.settings.kit;const next=(ws&&ws.slug!=='colorteam'&&kit)?ctThemesFromKit(kit,(ws.kitLogos||{})):CT_CODE_THEMES;
 CT_THEMES.length=0;next.forEach(t=>CT_THEMES.push(t));ctLoadFonts(ws&&ws.slug!=='colorteam'?kit:null);}
if(window.CTS&&CTS.subscribeWorkspace)CTS.subscribeWorkspace(ctApplyWorkspaceThemes);

const ctFontFor=(name,kit)=>{const f=kit&&kit.fonts||{};const map={display:f.display,body:f.body,serif:f.serif};const fam=map[name]||(name==='serif'?'Newsreader':'Inter');return name==='serif'?`"${fam}",var(--font-serif),Newsreader,serif`:`"${fam}",var(--font-sans),Inter,system-ui,sans-serif`;};
const ctColor=(v,t)=>{if(!v)return undefined;const m={ground:t.bg,surface:t.cardSoft,ink:t.ink,muted:t.sub,accent:t.acc,label:t.lab};return m[v]||v;};

// Render one size of a JSON template. Coordinates are in the size's own pixels (e.g. 1080×1350 for post).
function ctRenderJson(tpl,f,{W,H,t,p,size}){const kit=(window.CTS&&CTS.workspace&&CTS.workspace.settings&&CTS.workspace.settings.kit)||null;
 const layout=tpl.layouts[size]||tpl.layouts[tpl.sizes[0]];const base=CT_SIZES[layout.base||size]||{W,H};const sx=W/base.W,sy=H/base.H,u=Math.min(sx,sy);
 const px=n=>n*u;const pos=l=>({position:'absolute',left:l.x*sx,top:l.y*sy,width:l.w!=null?l.w*sx:undefined,height:l.h!=null?l.h*sy:undefined});
 const txt=(l,i)=>{const raw=l.bind?f[l.bind]:l.text;const text=l.upper?String(raw||'').toUpperCase():raw;const fs=typeof l.size==='object'?ctFit(l.size.max,raw,l.size.chars||18)*u:(l.size||40)*u;
  const style={...pos(l),margin:0,fontFamily:ctFontFor(l.font||'body',kit),fontSize:fs,fontWeight:l.weight||(l.font==='display'?700:400),lineHeight:l.lineHeight||(l.font==='display'?0.98:1.3),letterSpacing:l.letterSpacing||(l.font==='display'?'-0.03em':l.upper?'.12em':'0'),color:ctColor(l.color||'ink',t),textAlign:l.align||'left',whiteSpace:'pre-wrap',textWrap:'balance',display:'flex',flexDirection:'column',justifyContent:l.valign==='bottom'?'flex-end':l.valign==='middle'?'center':'flex-start'};
  return <div key={i} style={style}><span>{l.rich===false?text:ctRich(text,t)}</span></div>;};
 const out=(layout.layers||[]).map((l,i)=>{switch(l.type){
  case 'rect':return <div key={i} style={{...pos(l),background:ctColor(l.fill||'surface',t),borderRadius:px(l.radius||0),opacity:l.opacity==null?1:l.opacity,border:l.stroke?`${px(l.strokeWidth||2)}px solid ${ctColor(l.stroke,t)}`:undefined}}/>;
  case 'text':return txt(l,i);
  case 'image':return <CtPhoto key={i} p={l.bind?f[l.bind]:p} t={t} style={{...pos(l),borderRadius:px(l.radius||0)}} outline={l.outline}/>;
  case 'logo':{const src=l.src||t.logo;return src?<img key={i} src={src} alt="" style={{...pos(l),objectFit:'contain',objectPosition:l.align==='right'?'right center':'left center'}}/>:null;}
  case 'chip':{const text=l.bind?f[l.bind]:l.text;const fs=(l.size||28)*u;return <div key={i} style={{...pos(l),display:'inline-flex',alignItems:'center',padding:`${fs*0.35}px ${fs*0.7}px`,borderRadius:999,background:ctColor(l.fill||'accent',t),color:ctColor(l.color||'ground',t),fontFamily:ctFontFor('body',kit),fontSize:fs,fontWeight:600,letterSpacing:'.08em',textTransform:l.upper===false?'none':'uppercase',whiteSpace:'nowrap',width:'auto'}}>{text}</div>;}
  case 'line':return <div key={i} style={{...pos(l),height:px(l.h||2),background:ctColor(l.color||'ink',t),opacity:l.opacity==null?.5:l.opacity}}/>;
  default:return null;}});
 return [<React.Fragment key="p0"><div style={{position:'absolute',inset:0,background:ctColor(layout.bg||'ground',t)}}/>{out}</React.Fragment>];}

// Register JSON templates next to the code ones. Later (step 51) they also come from the database.
function ctRegisterJsonTemplates(list){(list||[]).forEach(tpl=>{if(!tpl||!tpl.id||CT_TEMPLATES.some(x=>x.id===tpl.id))return;CT_TEMPLATES.push({...tpl,json:true,render(f,ctx){return ctRenderJson(tpl,f,ctx);}});});}
ctRegisterJsonTemplates(window.CT_JSON_TEMPLATES);
// Templates from the database replace the previous database set (never the code or bundled ones).
function ctSetDbTemplates(list){for(let i=CT_TEMPLATES.length-1;i>=0;i--)if(CT_TEMPLATES[i].db)CT_TEMPLATES.splice(i,1);
 (list||[]).forEach(tpl=>{if(!tpl||!tpl.id||!tpl.layouts)return;const idx=CT_TEMPLATES.findIndex(x=>x.id===tpl.id);const entry={...tpl,json:true,db:true,render(f,ctx){return ctRenderJson(tpl,f,ctx);}};if(idx>=0)CT_TEMPLATES[idx]=entry;else CT_TEMPLATES.push(entry);});
 window.dispatchEvent(new Event('ct-templates'));}
Object.assign(window,{ctSetDbTemplates,ctRenderJson,ctRegisterJsonTemplates,ctThemesFromKit,ctApplyWorkspaceThemes});
