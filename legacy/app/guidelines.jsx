const GL_SECTIONS=[['colour','Colour'],['type','Typography'],['logo','Logo'],['graphics','Graphic elements'],['imagery','Imagery'],['podcast','Podcast'],['applications','Applications'],['usage','Usage']];
const GL_PRIMARY=[['Black','#0A0A0A','#E6E4DA','The main ground for social, decks and the site hero.'],['Stone','#DEDCD0','#0A0A0A','Type on black, and the light ground for editorial pages.'],['Pink','#F2B0CD','#0A0A0A','The accent for highlight words, labels, chips and icons.']];
const GL_SUPPORT=[['Lime','#A8FC78','#0A0A0A','Second accent, used sparingly'],['Card','#161616','#E6E4DA','Cards on black'],['Light field','#ECEAE2','#0A0A0A','Pages and panels'],['Warm grey','#57554D','#FFFFFF','Secondary type on light'],['Sage','#929A92','#0A0A0A','Meta text'],['Border','#B4B2A5','#0A0A0A','Hairlines on light']];
const GL_POD=[['Podcast cream','#F3F2E6','#0A0A0A'],['Pale lime','#D4FFC0','#0A0A0A'],['Lime','#A8FC78','#0A0A0A'],['Black','#0A0A0A','#FFFFFF']];
const GL_LOGOS=[['Wordmark, white','assets/brand26/wordmark-white.svg','#0A0A0A'],['Wordmark, black','assets/brand26/wordmark-black.svg','#DEDCD0'],['Wordmark, lime','assets/brand26/mark-green.png','#0A0A0A'],['Podcast mark','assets/logo/podcast-mark-lime.png','#F3F2E6'],['Podcast mark on black','assets/brand26/podcast-mark-onblack.png','#0A0A0A']];
const GL_IMG=[['Documentary studio','assets/imagery/heather-winkle.png','#161616',false],['Cut-out portrait with outline','assets/imagery/portrait-cutout-woman-desaturated.png','#F3F2E6',true],['Editorial cut-out','assets/imagery/portrait-cutout-man-chair.png','#DEDCD0',false]];
const GL_APPS=[['quote',0,'post'],['podcast',3,'post'],['case',0,'post'],['hiring',2,'post'],['reel',3,'story'],['proposal',0,'a4']];

function HmGuidelines({toast}){
const pdf=(window.CT_STUDIO_CONFIG||{}).guidelinesUrl;
const [active,setActive]=React.useState('colour');
React.useEffect(()=>{const h=()=>{let cur=GL_SECTIONS[0][0];for(const [id] of GL_SECTIONS){const el=document.getElementById('gl-'+id);if(el&&el.getBoundingClientRect().top<140)cur=id;}setActive(cur);};window.addEventListener('scroll',h,{passive:true});h();return()=>window.removeEventListener('scroll',h);},[]);
const jump=id=>{const el=document.getElementById('gl-'+id);if(el)window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-72,behavior:'smooth'});};
const copy=h=>{navigator.clipboard&&navigator.clipboard.writeText(h);toast('Copied '+h);};
const night=CT_THEMES[0],pod=CT_THEMES[3];
const sw=(n,h,ink,d,big)=><button key={n+h} className={'gl-sw'+(big?' big':'')} style={{background:h,color:ink}} onClick={()=>copy(h)}><b>{n}</b><span>{h}</span>{d&&<em>{d}</em>}</button>;
const sec=(id,n,title,p)=><div className="gl-sh"><span className="gl-n">{n}</span><h2>{title}</h2>{p&&<p>{p}</p>}</div>;
return <main className="gl">
<aside className="gl-nav"><span className="gl-k">Brand guidelines</span>{GL_SECTIONS.map(([id,l])=><button key={id} className={active===id?'on':''} onClick={()=>jump(id)}>{l}</button>)}{pdf&&<a className="btn sm gl-dl" href={pdf} target="_blank" rel="noopener"><UiIcon n="file-down" s={14}/>Previous edition (PDF)</a>}</aside>
<div className="gl-body">
<header className="gl-hero"><T6Bg t={night} W={1100} H={420}/><div className="gl-hero-in"><img src="assets/brand26/wordmark-white.svg" alt="colorteam" className="gl-hero-logo"/><h1>Design Beyond<br/><span style={{color:'#F2B0CD'}}>Boundaries</span></h1><div className="gl-hero-m"><span>colorteam</span><span>Brand guidelines</span><span>2026</span></div></div></header>

<section id="gl-colour" className="gl-s">{sec('colour','01','Colour','Black and stone carry everything, and pink is the one accent. Lime is a second accent, kept for small moments and the podcast. Click a swatch to copy its hex.')}
<div className="gl-prim">{GL_PRIMARY.map(([n,h,i,d])=>sw(n,h,i,d,true))}</div>
<h3 className="gl-h3">Supporting</h3><div className="gl-sup">{GL_SUPPORT.map(([n,h,i,d])=>sw(n,h,i,d))}</div>
<div className="gl-ratio"><i style={{flex:6,background:'#0A0A0A'}}></i><i style={{flex:2.5,background:'#DEDCD0'}}></i><i style={{flex:1.2,background:'#F2B0CD'}}></i><i style={{flex:.3,background:'#A8FC78'}}></i></div><p className="muted">Rough share of a typical frame: black 60, stone 25, pink 12, lime 3.</p></section>

<section id="gl-type" className="gl-s">{sec('type','02','Typography','Inter carries everything. Newsreader appears only as the serif ampersand.')}
<div className="gl-type"><div className="gl-spec dark"><span className="gl-k">Display · Inter Bold</span><div className="gl-disp">Making Netflix feel <span style={{color:'#F2B0CD'}}>Nigerian</span></div><p>Tracking −3.5% · line-height 0.95 · Title Case · highlight one or two words in pink</p></div>
<div className="gl-spec stone"><span className="gl-k">On light grounds</span><div className="gl-disp sm">Four ways we <span style={{backgroundImage:'linear-gradient(transparent 58%,#F2B0CD 58%,#F2B0CD 94%,transparent 94%)'}}>work</span> with you</div><p>On stone, the highlight becomes a pink marker under the word.</p></div>
<div className="gl-spec"><span className="gl-k">Label</span><div className="gl-lab">03 · OUR SERVICES</div><p>Inter SemiBold, uppercase, tracking +12%. Pink on dark grounds, warm grey on light.</p></div>
<div className="gl-spec"><span className="gl-k">Body and accent</span><div className="gl-body-s">A localised social media content engine for Netflix Nigeria.</div><div className="gl-disp sm" style={{marginTop:6}}>Brand <span className="gl-amp">&amp;</span> Identity</div><p>Sentence case for body. The “&amp;” always switches to Newsreader.</p></div></div></section>

<section id="gl-logo" className="gl-s">{sec('logo','03','Logo','The wordmark is always lowercase “colorteam”. Use white on black and black on stone or pink. The lime wordmark is for special moments only. Keep clear space equal to the x-height on every side.')}
<div className="gl-logos">{GL_LOGOS.map(([n,src,bg])=><figure key={src} className="gl-lg"><div style={{background:bg}}><img src={src} alt={n}/></div><figcaption><span>{n}</span><a href={src} download>Download</a></figcaption></figure>)}</div></section>

<section id="gl-graphics" className="gl-s">{sec('graphics','04','Graphic elements','There are only a few elements. Use them quietly.')}
<div className="gl-gfx">
<figure><div style={{position:'relative',overflow:'hidden'}}><T6Bg t={night} W={400} H={260}/></div><figcaption><b>Glow</b>Pink in the top-right corner, green in the bottom-right, over black with grain. Use it as a background, never behind text.</figcaption></figure>
<figure><div style={{position:'relative',overflow:'hidden'}}><T6Bg t={pod} W={400} H={260}/></div><figcaption><b>Podcast shapes</b>Soft vertical capsules on cream. Use them for the podcast only.</figcaption></figure>
<figure><div style={{background:'#0A0A0A',display:'grid',placeItems:'center',position:'relative'}}><T6Spark c="#F2B0CD" s={80} style={{left:'50%',top:'50%',marginLeft:-40,marginTop:-40}}/></div><figcaption><b>Sparkle</b>One per frame at most, in pink or black.</figcaption></figure>
<figure><div style={{background:'#0A0A0A',display:'flex',flexWrap:'wrap',gap:8,alignContent:'center',justifyContent:'center',padding:20}}>{['Branding','Creative production','Marketing','Digital'].map(x=><span key={x} style={{border:'1.5px solid rgba(230,228,218,.5)',borderRadius:999,padding:'6px 14px',color:'#E6E4DA',fontSize:13}}>{x}</span>)}<span style={{background:'#F2B0CD',borderRadius:999,padding:'6px 14px',color:'#0A0A0A',fontSize:13,fontWeight:600}}>Case study</span></div><figcaption><b>Pills and cards</b>Outline pills for tags, a filled pill for the one key label, and cards with 24–44 px corners.</figcaption></figure>
</div></section>

<section id="gl-imagery" className="gl-s">{sec('imagery','05','Imagery','Show real people and real work. Use warm, documentary light, put photos in rounded cards, and let client work show in its own colours.')}
<div className="gl-imgs">{GL_IMG.map(([n,src,bg,o])=><figure key={src} className="gl-im"><div style={{background:bg}}><img src={src} alt={n} style={o?{objectFit:'contain',filter:'drop-shadow(5px 0 0 #D4FFC0) drop-shadow(-5px 0 0 #D4FFC0) drop-shadow(0 5px 0 #D4FFC0) drop-shadow(0 -5px 0 #D4FFC0)'}:undefined}/></div><figcaption>{n}</figcaption></figure>)}</div></section>

<section id="gl-podcast" className="gl-s">{sec('podcast','06','The Colorteam Podcast','The podcast has its own lighter world: a cream ground, the lime heart mark and pale-lime name plates. It should still feel like it belongs to colorteam.')}
<div className="gl-sup">{GL_POD.map(([n,h,i])=>sw(n,h,i))}</div></section>

<section id="gl-applications" className="gl-s">{sec('applications','07','Applications','These are live studio templates. Start from one rather than a blank file.')}
<div className="gl-apps">{GL_APPS.map(([id,th,s])=>{const t=CT_TEMPLATES.find(x=>x.id===id);if(!t)return null;const d=CT_SIZES[s];return <figure key={id} className="gl-app"><div><CtScaled W={d.W} H={d.H} bw={230} bh={300}><CtAsset tpl={t} size={s} fields={ctDefaults(t)} theme={th} photo={t.photo?CT_SAMPLE_PHOTO:null}/></CtScaled></div><figcaption>{t.name} · {CT_THEMES[th].name}</figcaption></figure>;})}</div></section>

<section id="gl-usage" className="gl-s">{sec('usage','08','Usage')}
<div className="gl-rules"><div className="gl-do"><h3><UiIcon n="check" s={16}/>Do</h3><ul><li>Lead with black and stone, and highlight one or two words in pink.</li><li>Put labels in uppercase with wide tracking above headlines.</li><li>Use outline pills for tags and rounded cards for work.</li><li>Name people with their role.</li><li>Keep text inside each platform's safe zone.</li></ul></div>
<div className="gl-dont"><h3><UiIcon n="x" s={16}/>Don't</h3><ul><li>Use pink and lime together as equals in one frame.</li><li>Put the glow behind body text.</li><li>Stretch, recolour or outline the wordmark.</li><li>Use the podcast cream for corporate posts.</li><li>Use emoji in headlines, decks or proposals.</li></ul></div></div></section>
</div></main>;}
Object.assign(window,{HmGuidelines});
