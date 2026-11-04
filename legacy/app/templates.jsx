const CT_THEMES=[
{id:'night',name:'Night',bg:'#0A0A0A',ink:'#E6E4DA',sub:'#A3A199',lab:'#F2B0CD',acc:'#F2B0CD',hl:'color',cardSoft:'#161616',glass:'rgba(10,10,10,.74)',nameC:'#F2B0CD',line:'rgba(230,228,218,.5)',hair:'rgba(230,228,218,.16)',logo:'assets/brand26/wordmark-white.svg',pod:'assets/brand26/podcast-mark-onblack.png',chipBg:'#F2B0CD',chipInk:'#0A0A0A',cardAcc:'#F2B0CD',cardChip:'#F2B0CD',outline:'#F2B0CD',statBg:'#F2B0CD',statInk:'#0A0A0A',glow:true},
{id:'stone',name:'Stone',bg:'#DEDCD0',ink:'#0A0A0A',sub:'#57554D',lab:'#57554D',acc:'#0A0A0A',hl:'mark',mark:'#F2B0CD',cardSoft:'#CFCDC0',glass:'rgba(222,220,208,.86)',nameC:'#0A0A0A',line:'rgba(10,10,10,.55)',hair:'rgba(10,10,10,.14)',logo:'assets/brand26/wordmark-black.svg',pod:'assets/logo/podcast-mark-lime.png',chipBg:'#0A0A0A',chipInk:'#DEDCD0',cardAcc:'#F2B0CD',cardChip:'#DEDCD0',outline:'#F2B0CD',statBg:'#0A0A0A',statInk:'#DEDCD0'},
{id:'pink',name:'Pink',bg:'#F2B0CD',ink:'#0A0A0A',sub:'#3B2A31',lab:'#0A0A0A',acc:'#0A0A0A',hl:'mark',mark:'rgba(255,255,255,.7)',cardSoft:'#E79DBF',glass:'rgba(242,176,205,.86)',nameC:'#0A0A0A',line:'rgba(10,10,10,.55)',hair:'rgba(10,10,10,.16)',logo:'assets/brand26/wordmark-black.svg',pod:'assets/logo/podcast-mark-lime.png',chipBg:'#0A0A0A',chipInk:'#F2B0CD',cardAcc:'#F2B0CD',cardChip:'#F2B0CD',outline:'#FFFFFF',statBg:'#0A0A0A',statInk:'#F2B0CD'},
{id:'podcast',name:'Podcast',bg:'#F3F2E6',ink:'#0A0A0A',sub:'#4A4A44',lab:'#4A4A44',acc:'#0A0A0A',hl:'mark',mark:'#D4FFC0',cardSoft:'#E8E7D9',glass:'rgba(243,242,230,.88)',nameC:'#0A0A0A',line:'rgba(10,10,10,.7)',hair:'rgba(10,10,10,.14)',logo:'assets/brand26/wordmark-black.svg',pod:'assets/logo/podcast-mark-lime.png',chipBg:'#D4FFC0',chipInk:'#0A0A0A',cardAcc:'#A8FC78',cardChip:'#D4FFC0',outline:'#D4FFC0',statBg:'#D4FFC0',statInk:'#0A0A0A',flames:true}];
const CT_SIZES={post:{label:'Post 4:5',W:1080,H:1350},square:{label:'Square 1:1',W:1080,H:1080},story:{label:'Story 9:16',W:1080,H:1920},yt:{label:'Thumbnail 16:9',W:1280,H:720},wide:{label:'Landscape 16:9',W:1600,H:900},li:{label:'Personal banner',W:1584,H:396},lic:{label:'Company cover',W:1128,H:191},a4:{label:'A4 page',W:794,H:1123}};
const ctLines=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
const ctFit=(base,text,chars)=>{const n=String(text||'').replace(/\*/g,'').length||1;return base*Math.min(1,Math.sqrt(chars/n));};
const ctD=(size,t,x)=>({margin:0,fontWeight:700,fontSize:size,lineHeight:.95,letterSpacing:'-0.035em',color:t.ink,textWrap:'balance',...x});
const T6_SERIF={fontFamily:'var(--font-serif),Newsreader,serif',fontWeight:400,letterSpacing:'-0.01em'};
function ctAmp(s,k){return String(s).split('&').flatMap((p,i)=>i?[<span key={k+'a'+i} style={T6_SERIF}>&amp;</span>,p]:[p]);}
function ctRich(text,t){return String(text||'').split(/(\*[^*]+\*)/).map((s,i)=>{if(s.length>2&&s[0]==='*'&&s[s.length-1]==='*'){const inner=s.slice(1,-1);return <span key={i} style={t.hl==='color'?{color:t.acc}:{backgroundImage:`linear-gradient(transparent 58%,${t.mark} 58%,${t.mark} 94%,transparent 94%)`,WebkitBoxDecorationBreak:'clone',boxDecorationBreak:'clone',padding:'0 .04em'}}>{ctAmp(inner,i)}</span>;}return <React.Fragment key={i}>{ctAmp(s,i)}</React.Fragment>;});}
const ctLab=(u,t,x)=>({textTransform:'uppercase',letterSpacing:'.12em',fontSize:22*u,fontWeight:600,color:t.lab,...x});
const T6_GRAIN=`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const T6_FL=[[-.05,.13,.62,.22],[.07,.12,.82,.04],[.19,.12,.56,.34],[.32,.11,.92,-.12],[.46,.12,.7,.12],[.6,.11,.86,-.06],[.73,.12,.6,.3],[.86,.12,.84,.02],[.97,.12,.66,.2]];
function T6Bg({t,W,H}){return <div style={{position:'absolute',inset:0,background:t.bg,overflow:'hidden'}}>
{t.glow&&<div style={{position:'absolute',inset:0,background:`radial-gradient(${Math.round(W*.62)}px ${Math.round(H*.55)}px at 100% 0%,rgba(242,176,205,.5),rgba(242,176,205,0)),radial-gradient(${Math.round(W*.58)}px ${Math.round(H*.5)}px at 100% 100%,rgba(93,191,43,.4),rgba(93,191,43,0))`}}></div>}
{t.flames&&T6_FL.map(([x,w,h,y],i)=><div key={i} style={{position:'absolute',left:x*W,top:y*H,width:w*W,height:h*H,borderRadius:'50%',background:'#FAFAF3'}}></div>)}
<div style={{position:'absolute',inset:0,backgroundImage:T6_GRAIN,backgroundSize:'220px 220px',opacity:t.glow?.2:.1}}></div></div>;}
function T6Pill({t,u,children,style,light}){return <div style={{display:'inline-block',border:`${1.5*u}px solid ${light?'rgba(255,255,255,.85)':t.line}`,borderRadius:999,padding:`${9*u}px ${26*u}px`,fontSize:26*u,lineHeight:1.2,color:light?'#FFFFFF':t.ink,whiteSpace:'nowrap',...style}}>{children}</div>;}
function T6Chip({t,u,children,size=26,bg,ink,style}){return <span style={{alignSelf:'flex-start',display:'inline-block',background:bg||t.chipBg,color:ink||t.chipInk,borderRadius:999,padding:`${size*.38*u}px ${size*.9*u}px`,fontSize:size*u,fontWeight:600,lineHeight:1.15,whiteSpace:'nowrap',...style}}>{children}</span>;}
function T6Pod({t,u,size=88}){return <div style={{display:'flex',alignItems:'center',gap:16*u}}><img src={t.pod} alt="" style={{height:size*u,width:size*u,borderRadius:size*.24*u,display:'block'}}/><span style={{fontWeight:500,fontSize:size*.33*u,lineHeight:1,letterSpacing:'-0.02em',color:t.ink}}>The<br/>Colorteam<br/>Podcast</span></div>;}
function T6Top({t,u,pod,top=64}){return <><div style={{position:'absolute',left:72*u,top:top*u}}>{pod?<T6Pod t={t} u={u}/>:<img src={t.logo} alt="colorteam" style={{height:40*u,display:'block'}}/>}</div><div style={{position:'absolute',right:72*u,top:(top+(pod?24:-2))*u}}><T6Pill t={t} u={u}>colorteam.io</T6Pill></div></>;}
function T6Spark({c,s,style}){return <svg width={s} height={s} viewBox="0 0 100 100" style={{position:'absolute',...style}}><path d="M50 0C53 36 64 47 100 50C64 53 53 64 50 100C47 64 36 53 0 50C36 47 47 36 50 0Z" fill={c}/></svg>;}
function CtPhoto({p,t,style,pos,outline}){const cut=p&&p.cutout;const o=outline?(t.outline||'#FFFFFF'):null;const f=o?`drop-shadow(8px 0 0 ${o}) drop-shadow(-8px 0 0 ${o}) drop-shadow(0 8px 0 ${o}) drop-shadow(0 -8px 0 ${o})`:undefined;
return <div style={{position:'absolute',overflow:'hidden',background:cut&&outline?'transparent':t.cardSoft,...style}}>{p&&p.src&&<img src={p.src} alt="" style={cut?{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',height:'94%',filter:f}:{width:'100%',height:'100%',objectFit:'cover',objectPosition:pos||'50% 22%',display:'block'}}/>}</div>;}
const ctSvgCache={};
function CtSvgIcon({name,size,color}){const [svg,setSvg]=React.useState(ctSvgCache[name]||'');React.useEffect(()=>{if(ctSvgCache[name]){setSvg(ctSvgCache[name]);return;}fetch(`https://unpkg.com/lucide-static@0.460.0/icons/${name}.svg`).then(r=>r.text()).then(s=>{s=s.replace(/width="24"/,'width="100%"').replace(/height="24"/,'height="100%"');ctSvgCache[name]=s;setSvg(s);}).catch(()=>{});},[name]);return <span style={{display:'block',width:size,height:size,color}} dangerouslySetInnerHTML={{__html:svg}}></span>;}
const CT_ICON_MAP=[[/work|portfolio|case/,'briefcase'],[/service/,'layers'],[/podcast|listen/,'mic'],[/team|people|about/,'users'],[/review|testimon/,'star'],[/contact|mail/,'mail'],[/blog|insight|read/,'pen-line'],[/brand/,'sparkles'],[/design/,'pen-tool'],[/web|site/,'globe'],[/market/,'megaphone'],[/hir|career|job/,'user-plus'],[/event|webinar/,'calendar'],[/tip|learn/,'lightbulb']];
const ctIconFor=l=>{const s=l.toLowerCase();const m=CT_ICON_MAP.find(([r])=>r.test(s));return m?m[1]:'heart';};
const foot=(u,t,i,N,last)=><div style={{position:'absolute',left:72*u,right:72*u,bottom:64*u,display:'flex',justifyContent:'space-between',fontSize:24*u,color:t.sub}}><span>{String(i+1).padStart(2,'0')} / {String(N).padStart(2,'0')}</span><span>{last||'swipe →'}</span></div>;

const CT_TEMPLATES=[
{id:'podcast',name:'Podcast guest announcement',icon:'mic',sizes:['post','story'],photo:true,defTheme:3,fields:[{k:'episode',label:'Episode number',def:'06'},{k:'guest',label:'Guest name',def:'Heather Winkle'},{k:'role',label:'Guest role',def:'VP of Digital Experience, Delta Air Lines'},{k:'label',label:'Label',def:'New episode'}],
render(f,{W,H,t,p}){const u=W/1080,tall=H>1500,pt=tall?330:236,ph=tall?1000:740;return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u} pod top={tall?110:64}/>
<CtPhoto p={p} t={t} style={{left:72*u,right:72*u,top:pt*u,height:ph*u,borderRadius:40*u}}/>
<div style={{position:'absolute',left:104*u,top:(pt+ph-32)*u,transform:'translateY(-100%)'}}><T6Chip t={t} u={u} size={30} bg={t.cardChip} ink="#0A0A0A">EPISODE {f.episode}</T6Chip></div>
<div style={{position:'absolute',left:72*u,right:72*u,top:(pt+ph+44)*u,display:'flex',flexDirection:'column',gap:14*u}}><span style={ctLab(u,t)}>{f.label}</span><h1 style={ctD(ctFit(tall?120:100,f.guest,16)*u,t)}>{ctRich(f.guest,t)}</h1><p style={{margin:0,fontSize:30*u,lineHeight:1.3,color:t.sub}}>{f.role}</p></div></>];}},
{id:'quote',name:'Quote card',icon:'quote',sizes:['post','square'],photo:true,defTheme:0,fields:[{k:'quote',label:'Quote',type:'area',def:'Brand trust compounds. *Show up* every week, even when nobody is clapping.'},{k:'name',label:'Name',def:'Subomi Archibong'},{k:'role',label:'Role',def:'Founder & CEO, Colorteam'}],
render(f,{W,H,t,p}){const u=W/1080,sq=H<1200;const hasP=p&&p.src;return [<><T6Bg t={t} W={W} H={H}/>
{hasP&&<CtPhoto p={p} t={t} style={{left:W*.4,right:0,top:(sq?120:200)*u,bottom:0,background:'transparent'}}/>}
<T6Top t={t} u={u}/>
<div style={{position:'absolute',left:72*u,width:(hasP?660:936)*u,top:(sq?180:300)*u,bottom:(sq?72:110)*u,borderRadius:44*u,border:`${1.5*u}px solid ${t.line}`,background:t.glass,padding:`${56*u}px ${54*u}px`,display:'flex',flexDirection:'column',justifyContent:'center',gap:30*u,boxSizing:'border-box'}}>
<div style={{fontSize:170*u,lineHeight:.62,fontWeight:700,color:t.acc,height:74*u}}>“</div>
<p style={{margin:0,fontSize:ctFit(sq?50:58,f.quote,110)*u,lineHeight:1.16,fontWeight:500,letterSpacing:'-0.02em',color:t.ink,textWrap:'pretty'}}>{ctRich(f.quote,t)}</p>
<div><div style={{fontSize:32*u,fontWeight:500,color:t.nameC}}>{f.name}</div><div style={{fontSize:24*u,color:t.sub,marginTop:6*u}}>{f.role}</div></div></div></>];}},
{id:'carousel',name:'Carousel',icon:'gallery-horizontal',sizes:['post','square'],defTheme:0,fields:[{k:'kicker',label:'Series label',def:'Marketing tips'},{k:'title',label:'Cover title',def:'*Systems* Over Speed'},{k:'points',label:'Slides (one per line, "Title — detail")',type:'area',def:'Plan the month — Set three priorities and cut the rest.\nBatch the work — Write, design and schedule in one block.\nReview weekly — Keep what moved the needle.'},{k:'cta',label:'Closing slide',def:'Follow @yourcolorteam for more'}],
render(f,{W,H,t}){const u=W/1080,sq=H<1200,pts=ctLines(f.points),N=pts.length+2;
const cover=<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/><div style={{position:'absolute',left:72*u,right:72*u,bottom:170*u,display:'flex',flexDirection:'column',gap:34*u}}>{f.kicker&&<T6Pill t={t} u={u} style={{alignSelf:'flex-start'}}>{f.kicker}</T6Pill>}<h1 style={ctD(ctFit(sq?136:156,f.title,18)*u,t)}>{ctRich(f.title,t)}</h1></div>{foot(u,t,0,N)}</>;
const body=pts.map((s,i)=>{const [h,...r]=s.split(/\s[—–-]\s/);return <><T6Bg t={t} W={W} H={H}/><img src={t.logo} alt="" style={{position:'absolute',left:72*u,top:64*u,height:34*u}}/><div style={{position:'absolute',left:72*u,top:(sq?180:240)*u,width:132*u,height:132*u,borderRadius:34*u,border:`${2*u}px solid ${t.acc}`,display:'grid',placeItems:'center',fontSize:56*u,fontWeight:600,color:t.acc}}>{String(i+1).padStart(2,'0')}</div><div style={{position:'absolute',left:72*u,right:110*u,top:(sq?420:560)*u,display:'flex',flexDirection:'column',gap:28*u}}><h2 style={ctD(ctFit(92,h,30)*u,t)}>{ctRich(h,t)}</h2>{r.length>0&&<p style={{margin:0,fontSize:36*u,lineHeight:1.35,color:t.sub,textWrap:'pretty'}}>{r.join(' — ')}</p>}</div>{foot(u,t,i+1,N)}</>;});
const end=<><T6Bg t={t} W={W} H={H}/><T6Spark c={t.acc} s={130*u} style={{left:72*u,top:(sq?200:300)*u}}/><div style={{position:'absolute',left:72*u,right:72*u,top:(sq?400:540)*u,display:'flex',flexDirection:'column',gap:40*u}}><h2 style={ctD(ctFit(100,f.cta,28)*u,t)}>{ctRich(f.cta,t)}</h2><T6Pill t={t} u={u} style={{alignSelf:'flex-start'}}>colorteam.io</T6Pill></div>{foot(u,t,N-1,N,'colorteam.io')}</>;
return [cover,...body,end];}},
{id:'reel',name:'Reel cover',icon:'clapperboard',sizes:['story'],photo:true,defTheme:3,fields:[{k:'series',label:'Label',def:'Clara Armand-Delille · Founder, ThirdEye Media'},{k:'title',label:'Title',def:'Marketing Isn’t the Only Thing That *Builds Trust*'}],
render(f,{W,H,t,p}){const u=W/1080;return [<><T6Bg t={t} W={W} H={H}/><CtPhoto p={p} t={t} style={{left:0,right:0,top:280*u,bottom:0,background:'transparent'}} pos="50% 15%"/>
<div style={{position:'absolute',left:0,right:0,bottom:0,height:520*u,background:'linear-gradient(rgba(10,10,10,0),rgba(10,10,10,.7))'}}></div>
<T6Top t={t} u={u} pod={!!t.flames} top={110}/>
<div style={{position:'absolute',left:150*u,right:150*u,top:1060*u,background:'#0A0A0A',borderRadius:60*u,padding:`${62*u}px ${56*u}px ${90*u}px`,textAlign:'center'}}><h1 style={ctD(ctFit(86,f.title,34)*u,{...t,ink:'#FFFFFF'},{textAlign:'center',lineHeight:1.02})}>{ctRich(f.title,{...t,hl:'color',acc:t.cardAcc})}</h1>
{f.series&&<div style={{position:'absolute',left:'50%',bottom:0,transform:'translate(-50%,50%)'}}><T6Chip t={t} u={u} size={28} bg={t.cardChip} ink="#0A0A0A" style={{fontWeight:500}}>{f.series}</T6Chip></div>}</div>
<div style={{position:'absolute',left:0,right:0,top:1580*u,display:'flex',justifyContent:'center'}}><T6Pill t={t} u={u} light>colorteam.io</T6Pill></div></>];}},
{id:'story',name:'Story',icon:'smartphone',sizes:['story'],photo:true,defTheme:0,fields:[{k:'headline',label:'Headline',def:'New Work: *NECLive* 2025'},{k:'body',label:'Body',type:'area',def:'A scalable visual identity for the creative economy, from avatar to stage.'},{k:'cta',label:'Call to action',def:'See the case study'}],
render(f,{W,H,t,p}){const u=W/1080;return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u} top={110}/>
<div style={{position:'absolute',left:72*u,right:72*u,top:300*u,display:'flex',flexDirection:'column',gap:30*u}}><span style={ctLab(u,t)}>Case study</span><h1 style={ctD(ctFit(118,f.headline,22)*u,t)}>{ctRich(f.headline,t)}</h1><p style={{margin:0,fontSize:36*u,lineHeight:1.35,color:t.sub,maxWidth:820*u,textWrap:'pretty'}}>{f.body}</p></div>
<CtPhoto p={p} t={t} style={{left:72*u,right:72*u,top:900*u,height:560*u,borderRadius:40*u}}/>
<div style={{position:'absolute',left:0,right:0,top:1500*u,display:'flex',justifyContent:'center'}}><T6Chip t={t} u={u} size={34}>{f.cta} ↑</T6Chip></div></>];}},
{id:'team',name:'Team spotlight',icon:'user-round',sizes:['post'],photo:true,defTheme:1,fields:[{k:'headline',label:'Label',def:'Meet the team'},{k:'name',label:'Name',def:'Funmibi Samuel'},{k:'role',label:'Role',def:'Marketing Lead, Colorteam'}],
render(f,{W,H,t,p}){const u=W/1080;return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/>
<CtPhoto p={p} t={t} style={{left:72*u,right:72*u,top:170*u,bottom:330*u,borderRadius:40*u}}/>
<div style={{position:'absolute',left:104*u,top:202*u}}><T6Chip t={t} u={u} size={26}>{f.headline}</T6Chip></div>
<div style={{position:'absolute',left:72*u,right:72*u,bottom:72*u,display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:30*u}}><div style={{display:'flex',flexDirection:'column',gap:10*u}}><h1 style={ctD(ctFit(92,f.name,16)*u,t)}>{ctRich(f.name,t)}</h1><span style={{fontSize:28*u,color:t.sub}}>{f.role}</span></div><span style={{fontSize:28*u,color:t.sub,whiteSpace:'nowrap'}}>swipe →</span></div></>];}},
{id:'youtube',name:'YouTube thumbnail',icon:'youtube',sizes:['yt'],photo:true,defTheme:3,fields:[{k:'label',label:'Label',def:'Episode 05'},{k:'title',label:'Title',def:'The Shortcut That Kills *Startups*'}],
render(f,{W,H,t,p}){const u=H/720,pod=!!t.flames,cut=p&&p.cutout;return [<><T6Bg t={t} W={W} H={H}/>
{cut?<CtPhoto p={p} t={t} outline style={{right:20*u,bottom:0,top:70*u,width:W*.44}}/>:<CtPhoto p={p} t={t} style={{right:56*u,top:56*u,bottom:56*u,width:W*.4,borderRadius:28*u}}/>}
<div style={{position:'absolute',left:56*u,top:48*u}}>{pod?<T6Pod t={t} u={u*.7}/>:<img src={t.logo} alt="" style={{height:30*u,display:'block'}}/>}</div>
{cut&&<div style={{position:'absolute',right:56*u,top:52*u}}><T6Pill t={t} u={u*.8}>colorteam.io</T6Pill></div>}
<h1 style={{...ctD(ctFit(98,f.title,24)*u,t),position:'absolute',left:56*u,width:W*.52,top:(pod?210:170)*u}}>{ctRich(f.title,t)}</h1>
{f.label&&<div style={{position:'absolute',left:56*u,bottom:56*u}}><T6Chip t={t} u={u} size={34} bg={t.cardChip} ink="#0A0A0A" style={{fontWeight:500,textTransform:'uppercase'}}>{f.label}</T6Chip></div>}</>];}},
{id:'linkedin',name:'LinkedIn banner',icon:'linkedin',sizes:['li','lic'],defTheme:0,fields:[{k:'headline',label:'Headline',def:'Design Beyond *Boundaries*'},{k:'sub',label:'Sub-line',def:'Branding · Creative production · Marketing · Digital'}],
render(f,{W,H,t,size}){const u=H/396,co=size==='lic';return [<><T6Bg t={t} W={W} H={H}/><T6Spark c={t.acc} s={150*u} style={{right:(co?90:160)*u,top:'50%',marginTop:-75*u}}/>
<div style={{position:'absolute',left:co?72*u:W*.33,right:(co?300:420)*u,top:0,bottom:0,display:'flex',flexDirection:'column',justifyContent:'center',gap:18*u}}><img src={t.logo} alt="" style={{height:26*u,alignSelf:'flex-start'}}/><h1 style={ctD(ctFit(70,f.headline,26)*u,t)}>{ctRich(f.headline,t)}</h1><p style={{margin:0,fontSize:22*u,color:t.sub}}>{f.sub}</p></div></>];}},
{id:'highlights',name:'Highlight covers',icon:'circle-dot',sizes:['story'],defTheme:0,fields:[{k:'labels',label:'Highlights (comma separated)',def:'Work, Services, Podcast, Team, Reviews',hint:'Icons are matched to each label.'}],
render(f,{W,H,t}){const u=W/1080;const ls=String(f.labels||'').split(',').map(s=>s.trim()).filter(Boolean);return ls.map(l=><><T6Bg t={t} W={W} H={H}/><div style={{position:'absolute',left:'50%',top:'50%',width:560*u,height:560*u,marginLeft:-280*u,marginTop:-280*u,borderRadius:'50%',background:t.chipBg,display:'grid',placeItems:'center'}}><CtSvgIcon name={ctIconFor(l)} size={220*u} color={t.chipInk}/></div></>);}},
{id:'event',name:'Event / webinar',icon:'calendar',sizes:['post','wide'],photo:true,defTheme:0,fields:[{k:'format',label:'Format',def:'Live webinar'},{k:'title',label:'Title',def:'Brand Trust in the *Age of AI*'},{k:'date',label:'Date',def:'Thu, 12 November'},{k:'time',label:'Time',def:'4 PM WAT · 4 PM CET'},{k:'speaker',label:'Speaker',def:'Subomi Archibong'},{k:'speakerRole',label:'Speaker role',def:'Founder & CEO, Colorteam'}],
render(f,{W,H,t,p,size}){const wide=size==='wide';const u=wide?H/900:W/1080;
const meta=<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:`1px solid ${t.hair}`}}>{[['Date',f.date],['Time',f.time]].map(([k,v])=><div key={k} style={{padding:`${22*u}px 0`,display:'flex',flexDirection:'column',gap:8*u}}><span style={ctLab(u,t,{fontSize:20*u})}>{k}</span><span style={{fontSize:34*u,fontWeight:600,color:t.ink}}>{v}</span></div>)}</div>;
const spk=ph=><div style={{display:'flex',alignItems:'center',gap:24*u}}>{ph&&<CtPhoto p={p} t={t} style={{position:'relative',width:130*u,height:130*u,borderRadius:'50%',flex:'none'}}/>}<div><div style={{fontWeight:600,fontSize:30*u,color:t.ink}}>{f.speaker}</div><div style={{fontSize:24*u,color:t.sub,marginTop:6*u}}>{f.speakerRole}</div></div></div>;
if(wide)return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/><div style={{position:'absolute',left:72*u,top:200*u,width:W*.5,display:'flex',flexDirection:'column',gap:32*u}}><T6Pill t={t} u={u} style={{alignSelf:'flex-start'}}>{f.format}</T6Pill><h1 style={ctD(ctFit(108,f.title,28)*u,t)}>{ctRich(f.title,t)}</h1></div><div style={{position:'absolute',left:72*u,width:W*.5,bottom:72*u,display:'flex',flexDirection:'column',gap:32*u}}>{spk(false)}{meta}</div><CtPhoto p={p} t={t} style={{right:72*u,top:170*u,bottom:72*u,width:W*.34,borderRadius:36*u}}/></>];
return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/><div style={{position:'absolute',left:72*u,right:72*u,top:230*u,display:'flex',flexDirection:'column',gap:34*u}}><T6Pill t={t} u={u} style={{alignSelf:'flex-start'}}>{f.format}</T6Pill><h1 style={ctD(ctFit(124,f.title,26)*u,t)}>{ctRich(f.title,t)}</h1></div><div style={{position:'absolute',left:72*u,right:72*u,bottom:72*u,display:'flex',flexDirection:'column',gap:40*u}}>{spk(true)}{meta}</div></>];}},
{id:'hiring',name:'Hiring post',icon:'user-plus',sizes:['post','square'],defTheme:0,fields:[{k:'headline',label:'Headline',def:'We’re *Hiring*'},{k:'role',label:'Role',def:'Copywriter'},{k:'details',label:'Details (one per line)',type:'area',def:'Remote\nWarsaw or Lagos\nFull-time'},{k:'cta',label:'How to apply',def:'Apply at colorteam.io/careers'}],
render(f,{W,H,t}){const u=W/1080,sq=H<1200;return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/><T6Spark c={t.acc} s={120*u} style={{right:80*u,top:(sq?190:250)*u}}/>
<h1 style={{...ctD((sq?180:212)*u,t),position:'absolute',left:64*u,right:220*u,top:(sq?180:240)*u}}>{ctRich(f.headline,t)}</h1>
<div style={{position:'absolute',left:72*u,right:72*u,bottom:72*u,display:'flex',flexDirection:'column',gap:30*u}}><span style={ctLab(u,t)}>Open role</span><h2 style={ctD(ctFit(96,f.role,18)*u,t)}>{f.role}</h2><div style={{display:'flex',flexWrap:'wrap',gap:12*u}}>{ctLines(f.details).map((d,i)=><T6Pill key={i} t={t} u={u}>{d}</T6Pill>)}</div><T6Chip t={t} u={u} size={30}>{f.cta} →</T6Chip></div></>];}},
{id:'case',name:'Case study',icon:'briefcase',sizes:['post'],photo:true,defTheme:0,fields:[{k:'client',label:'Client',def:'Netflix Nigeria'},{k:'headline',label:'Headline',def:'Making Netflix Feel *Nigerian*, Every Week'},{k:'stat',label:'Result figure',def:'600K+'},{k:'statLabel',label:'Result label',def:'Instagram followers, up from under 10K'}],
render(f,{W,H,t,p}){const u=W/1080;return [<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/>
<div style={{position:'absolute',left:72*u,right:72*u,top:190*u,display:'flex',flexDirection:'column',gap:24*u}}><span style={ctLab(u,t)}>Case study · {f.client}</span><h1 style={ctD(ctFit(86,f.headline,40)*u,t)}>{ctRich(f.headline,t)}</h1></div>
<CtPhoto p={p} t={t} style={{left:72*u,right:72*u,top:600*u,bottom:150*u,borderRadius:40*u}}/>{foot(u,t,0,2)}</>,
<><T6Bg t={t} W={W} H={H}/><T6Top t={t} u={u}/>
<div style={{position:'absolute',left:72*u,right:72*u,top:200*u,bottom:150*u,borderRadius:44*u,background:t.statBg,color:t.statInk,padding:`${60*u}px`,display:'flex',flexDirection:'column',justifyContent:'space-between',boxSizing:'border-box'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:20*u}}><span style={{fontSize:40*u,fontWeight:600,letterSpacing:'-0.02em',lineHeight:1.15,maxWidth:700*u}}>{f.statLabel}</span><svg width={70*u} height={70*u} viewBox="0 0 100 100"><path d="M50 0C53 36 64 47 100 50C64 53 53 64 50 100C47 64 36 53 0 50C36 47 47 36 50 0Z" fill={t.statInk}/></svg></div><div style={{fontWeight:700,fontSize:ctFit(300,f.stat,5)*u,lineHeight:.85,letterSpacing:'-0.05em'}}>{f.stat}</div></div>
{foot(u,t,1,2,'Full case study at colorteam.io')}</>];}}];

/* Proposals */
const PP={M:64,top:118,bottom:1123-96};const PP_W=794-PP.M*2;
const ppInit=n=>String(n||'?').split(/\s+/).filter(w=>/\w/.test(w)).slice(0,2).map(w=>w[0].toUpperCase()).join('');
function ppParse(md){const L=String(md||'').replace(/\r/g,'').split('\n');const out=[];let i=0,para=[];const fl=()=>{if(para.length){out.push({t:'p',x:para.join(' ')});para=[];}};
while(i<L.length){const s=L[i].trim();let m;if(!s){fl();i++;continue;}
if((m=s.match(/^(#{1,3})\s+(.*)/))){fl();out.push({t:'h'+m[1].length,x:m[2]});i++;continue;}
if(/^[-*•]\s+/.test(s)){fl();out.push({t:'li',x:s.replace(/^[-*•]\s+/,'')});i++;continue;}
if((m=s.match(/^(\d+)[.)]\s+(.*)/))){fl();out.push({t:'oli',n:m[1],x:m[2]});i++;continue;}
if(s.startsWith('>')){fl();out.push({t:'q',x:s.replace(/^>\s?/,'')});i++;continue;}
if(s.startsWith('|')){fl();const rows=[];while(i<L.length&&L[i].trim().startsWith('|')){const r=L[i].trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());if(!r.every(c=>/^:?-{2,}:?$/.test(c)))rows.push(r);i++;}if(rows.length)out.push({t:'table',rows});continue;}
if(/^-{3,}$/.test(s)){fl();out.push({t:'hr'});i++;continue;}
para.push(s);i++;}fl();return out;}
const ppLn=(x,fs,wd)=>Math.max(1,Math.ceil(String(x||'').replace(/\*\*/g,'').length*fs*.54/wd));
function ppRowH(r,n,head){const cw=PP_W/n;return Math.max(...r.map(c=>ppLn(c,head?10.5:12.5,cw-14)))*(head?16:19)+(head?14:18);}
function ppH(b){switch(b.t){case 'h1':return 36;case 'h2':return ppLn(b.x,30,PP_W)*34+16;case 'h3':return ppLn(b.x,16,PP_W)*22+22;case 'p':return ppLn(b.x,13,PP_W)*20.5+10;case 'li':case 'oli':return ppLn(b.x,13,PP_W-22)*20.5+6;case 'q':return ppLn(b.x,22,PP_W)*30+34;case 'hr':return 30;case 'table':{const n=b.rows[0].length;return b.rows.reduce((s,r,i)=>s+ppRowH(r,n,i===0),0)+16;}default:return 20;}}
function ppPaginate(blocks){const pages=[];let cur=[],y=PP.top;const K=1.06;const br=()=>{if(cur.length){pages.push(cur);cur=[];y=PP.top;}};
for(let i=0;i<blocks.length;i++){const b=blocks[i];
 if(b.t==='h1'){br();cur.push(b);y+=ppH(b)*K;continue;}
 if(b.t==='table'){const n=b.rows[0].length,head=b.rows[0];const hh=ppRowH(head,n,true)+16;let chunk=[head],h=hh;for(const r of b.rows.slice(1)){const rh=ppRowH(r,n,false);if(y+(h+rh)*K>PP.bottom){if(chunk.length>1)cur.push({t:'table',rows:chunk});br();chunk=[head];h=hh;}chunk.push(r);h+=rh;}cur.push({t:'table',rows:chunk});y+=h*K;continue;}
 const h=ppH(b)*K;let need=h;if((b.t==='h2'||b.t==='h3')&&blocks[i+1])need+=Math.min(ppH(blocks[i+1]),80);
 if(y+need>PP.bottom&&cur.some(x=>x.t!=='h1'))br();cur.push(b);y+=h;}
br();return pages;}
function ppInline(s){return String(s||'').split(/(\*\*[^*]+\*\*)/).map((x,i)=>x.length>4&&x.startsWith('**')&&x.endsWith('**')?<b key={i} style={{fontWeight:600}}>{x.slice(2,-2)}</b>:<React.Fragment key={i}>{ctAmp(x,i)}</React.Fragment>);}
const PPC={bg:'#F4F3EE',ink:'#0A0A0A',sub:'#57554D',mark:'#F2B0CD',hair:'rgba(10,10,10,.12)'};
function PpBlock({b}){const ink=PPC.ink,sub=PPC.sub,hl={hl:'mark',mark:PPC.mark};switch(b.t){
case 'h1':return <div style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:sub,margin:'0 0 18px',display:'flex',alignItems:'center',gap:8}}><i style={{width:7,height:7,borderRadius:'50%',background:'#F2B0CD',display:'inline-block'}}></i>{b.x}</div>;
case 'h2':return <h2 style={{margin:'0 0 14px',fontSize:30,lineHeight:'34px',fontWeight:700,letterSpacing:'-0.03em',color:ink,textWrap:'balance'}}>{ctRich(b.x,hl)}</h2>;
case 'h3':return <h3 style={{margin:'16px 0 6px',fontSize:16,lineHeight:'22px',fontWeight:600,letterSpacing:'-0.01em',color:ink}}>{ppInline(b.x)}</h3>;
case 'p':return <p style={{margin:'0 0 10px',fontSize:13,lineHeight:'20.5px',color:ink,textWrap:'pretty'}}>{ppInline(b.x)}</p>;
case 'li':case 'oli':return <div style={{display:'grid',gridTemplateColumns:'22px 1fr',margin:'0 0 6px',fontSize:13,lineHeight:'20.5px',color:ink}}><span style={{color:sub}}>{b.t==='oli'?b.n+'.':'•'}</span><span>{ppInline(b.x)}</span></div>;
case 'q':return <blockquote style={{margin:'10px 0 24px',fontSize:22,lineHeight:'30px',fontWeight:500,letterSpacing:'-0.015em',color:ink,textWrap:'pretty'}}>{ctRich(b.x,hl)}</blockquote>;
case 'hr':return <div style={{height:1,background:PPC.hair,margin:'14px 0'}}></div>;
case 'table':return <table style={{width:'100%',borderCollapse:'collapse',margin:'4px 0 12px',fontSize:12.5,lineHeight:'19px',color:ink}}><thead><tr>{b.rows[0].map((c,i)=><th key={i} style={{textAlign:'left',fontSize:10.5,lineHeight:'16px',letterSpacing:'.1em',textTransform:'uppercase',color:sub,fontWeight:600,padding:'0 12px 8px 0',borderBottom:'1.5px solid '+ink}}>{c}</th>)}</tr></thead><tbody>{b.rows.slice(1).map((r,j)=><tr key={j}>{r.map((c,i)=><td key={i} style={{padding:'9px 12px 9px 0',borderBottom:'1px solid '+PPC.hair,verticalAlign:'top',fontWeight:i===0?600:400}}>{ppInline(c)}</td>)}</tr>)}</tbody></table>;
default:return null;}}
const PP_SAMPLE=`# Project overview
## Four more places to be *bought*
> “Among the world’s most beautiful rugs.”
The promise already on your homepage. This plan gives it more ways to turn into a sale.
**Client** Mona, Mona & Co. Rugs, antiques and lighting, Zurich, Switzerland.
**Main goal** More channels that drive purchases: people click a piece they love and buy it there and then.
**Window** 30 October to 28 November 2026, every channel live by the end.
### Where things stand
Your WooCommerce site sells, but orders only show up in the dashboard, so you check by hand. That ends this month.
Instagram runs well but stands alone. It is tied to your personal Facebook with no Meta Business account behind it, which blocks the shop signup today.
Your Google Business Profile is bare, yet it has already brought a customer to your door.

# The channels
## Ranked by how fast they *sell*
Six workstreams, ordered by how quickly each one starts producing. Two are quick wins we can bank early.
| Channel | Priority | Why it matters |
| --- | --- | --- |
| Instagram Shop | Highest | Click and buy straight from your posts. The blocker is account structure, not product. |
| Etsy | High | Opens Switzerland-only, as you asked. The lowest platform cost of the four. |
| Google Business Profile | Quick win | Exists, bare, and already produced a walk-in customer. |
| WooCommerce alerts | Quick win | Instant phone alerts for orders, abandoned carts and messages. |
| Pinterest | Build | A shopping channel where your competitors already sell. |

# The plan
## Step *by* step
Work runs 30 October to 28 November. Everything happens on accounts you own, with access granted by invitation.
### Step 0 · 30 Oct – 4 Nov · Access and inputs
You send the access items and documents. The one item with a waiting time is a fresh extract from the Swiss Companies Register for Etsy, so we order it in week one.
### Step 1 · 5 – 12 Nov · Instagram Shop
- Create the Meta Business account and connect the business Instagram to it.
- Set up the Facebook page, product catalog and domain verification.
- Submit the shop for review, then tag the first 10–15 posts.
- Finish with a live test on your own phone.

# The investment
## Four stages, EUR *2,000* in total
| Stage | Scope | Fee |
| --- | --- | --- |
| 1 | Instagram Shop and order alerts | EUR 700 |
| 2 | Etsy shop and first listings | EUR 600 |
| 3 | Google Business Profile | EUR 300 |
| 4 | Pinterest catalog and pins | EUR 400 |
Invoiced as each stage completes.`;
CT_TEMPLATES.push({id:'proposal',name:'Proposal',icon:'file-text',sizes:['a4'],defTheme:0,doc:true,fields:[{k:'client',label:'Client name',def:'Mona & Co'},{k:'clientLogo',label:'Client logo',type:'image',def:''},{k:'title',label:'Proposal title',def:'Sales Channel *Expansion*'},{k:'subtitle',label:'Summary',type:'area',def:'More ways for people to buy what you make: a shop on Instagram, a gallery on Etsy, a Pinterest presence that sells, and order alerts in your pocket. Everything live by 28 November.'},{k:'date',label:'Date',def:'29 October 2026'},{k:'body',label:'Proposal content',type:'doc',def:PP_SAMPLE},{k:'closing',label:'Closing line',def:'Let’s build *together*.'},{k:'contact',label:'Contact',type:'area',def:'Subomi Archibong · Founder & CEO\nsubomi@colorteam.io · +48 722 162 814\ncolorteam.io'}],
render(f,{W,H,t}){const body=ppPaginate(ppParse(f.body));const N=body.length+2;const title=String(f.title||'').replace(/\*/g,'');
const secs=[];body.forEach((pg,i)=>pg.forEach(b=>{if(b.t==='h1')secs.push({x:b.x,p:i+2});}));
const lab={fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:t.lab,fontWeight:600};
const logo=f.clientLogo?<img src={f.clientLogo} alt="" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',display:'block'}}/>:<span style={{fontWeight:700,fontSize:30,color:'#0A0A0A',letterSpacing:'-0.03em'}}>{ppInit(f.client)}</span>;
const cover=<><T6Bg t={t} W={W} H={H}/>
<div style={{position:'absolute',left:64,right:64,top:56,display:'flex',justifyContent:'space-between',alignItems:'center'}}><img src={t.logo} alt="colorteam" style={{height:22,display:'block'}}/><span style={{...lab,color:t.sub}}>Proposal · {f.date}</span></div>
<div style={{position:'absolute',left:64,right:64,top:210,display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',alignItems:'center',gap:16}}><div style={{width:88,height:88,borderRadius:22,background:'#FFFFFF',display:'grid',placeItems:'center',padding:14,boxSizing:'border-box',overflow:'hidden',flex:'none'}}>{logo}</div><div style={{display:'flex',flexDirection:'column',gap:4}}><span style={lab}>Prepared for</span><span style={{fontSize:20,fontWeight:600,color:t.ink,letterSpacing:'-0.01em'}}>{f.client}</span></div></div>
<h1 style={ctD(ctFit(70,f.title,24),t,{lineHeight:.96,marginTop:30})}>{ctRich(f.title,t)}</h1><p style={{margin:0,fontSize:16,lineHeight:1.5,color:t.sub,maxWidth:560,textWrap:'pretty'}}>{f.subtitle}</p></div>
{secs.length>0&&<div style={{position:'absolute',left:64,right:64,bottom:92}}><div style={{...lab,marginBottom:14}}>Inside this document</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:28,borderTop:`1px solid ${t.hair}`}}>{secs.slice(0,8).map((s,i)=><div key={i} style={{display:'flex',gap:14,padding:'11px 0',borderBottom:`1px solid ${t.hair}`,fontSize:13,color:t.ink}}><span style={{color:t.sub,fontVariantNumeric:'tabular-nums',width:56,flex:'none'}}>Page {String(s.p).padStart(2,'0')}</span><span style={{fontWeight:500}}>{s.x}</span></div>)}</div></div>}
<div style={{position:'absolute',left:64,right:64,bottom:40,display:'flex',justifyContent:'space-between',fontSize:11,color:t.sub}}><span>Prepared for {f.client}</span><span>colorteam.io</span></div></>;
const page=(pg,i)=><><div style={{position:'absolute',inset:0,background:PPC.bg}}></div>
<div style={{position:'absolute',left:64,right:64,top:40,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:PPC.sub,paddingBottom:12,borderBottom:`1px solid ${PPC.hair}`}}><span>{f.client} · {title}</span><span style={{display:'flex',alignItems:'center',gap:10}}>{f.clientLogo&&<img src={f.clientLogo} alt="" style={{height:16,maxWidth:80,objectFit:'contain'}}/>}<span>colorteam.io</span></span></div>
<div style={{position:'absolute',left:64,right:64,top:PP.top}}>{pg.map((b,j)=><PpBlock key={j} b={b}/>)}</div>
<div style={{position:'absolute',left:64,right:64,bottom:40,display:'flex',justifyContent:'space-between',fontSize:11,color:PPC.sub}}><span>Prepared for {f.client}</span><span>Page {i+2} of {N}</span></div></>;
const end=<><T6Bg t={t} W={W} H={H}/><div style={{position:'absolute',left:64,right:64,top:0,bottom:0,display:'flex',flexDirection:'column',justifyContent:'center',gap:26}}><span style={lab}>Next step</span><h1 style={ctD(ctFit(76,f.closing,22),t)}>{ctRich(f.closing,t)}</h1><p style={{margin:0,fontSize:15,lineHeight:1.6,color:t.sub,whiteSpace:'pre-line'}}>{f.contact}</p></div>
<img src={t.logo} alt="" style={{position:'absolute',left:64,bottom:44,height:20}}/><span style={{position:'absolute',right:64,bottom:44,fontSize:11,color:t.sub}}>Page {N} of {N}</span></>;
return [cover,...body.map(page),end];}});

function CtAsset({tpl,size,fields,theme,photo,page=0,offsets,live,onLayerDown}){const s=CT_SIZES[size],t=CT_THEMES[theme]||CT_THEMES[0];const pages=tpl.render(fields,{W:s.W,H:s.H,t,p:photo,size});const pi=Math.max(0,Math.min(page,pages.length-1));const pg=pages[pi]||null;let body=pg;if(pg&&pg.props&&(live||offsets)){body=React.Children.toArray(pg.props.children).map((k,i)=>{const id=pi+':'+i;const o=offsets&&offsets[id];return <div key={id} data-layer={id} className={live?'ct-layer live':'ct-layer'} style={{position:'absolute',inset:0,pointerEvents:'none',transform:o?`translate(${o.x}px,${o.y}px)`:undefined}} onPointerDown={onLayerDown?e=>onLayerDown(id,e):undefined}>{k}</div>;});}return <div style={{position:'relative',width:s.W,height:s.H,background:t.bg,color:t.ink,overflow:'hidden',fontFamily:'var(--font-sans),Inter,sans-serif'}}>{body}</div>;}
const ctPageCount=(tpl,size,fields)=>{const s=CT_SIZES[size];return tpl.render(fields,{W:s.W,H:s.H,t:CT_THEMES[0],p:null,size}).length;};
function CtScaled({W,H,bw,bh,children,style}){const s=Math.min(bw/W,bh/H);return <div style={{width:W*s,height:H*s,position:'relative',overflow:'hidden',flex:'none',...style}}><div style={{width:W,height:H,transform:`scale(${s})`,transformOrigin:'0 0'}}>{children}</div></div>;}
const ctDefaults=tpl=>Object.fromEntries(tpl.fields.map(x=>[x.k,x.def]));
const CT_SAMPLE_PHOTO={src:'assets/imagery/portrait-cutout-woman-desaturated.png',cutout:true,sample:true};
Object.assign(window,{CT_THEMES,CT_SIZES,CT_TEMPLATES,CtAsset,CtScaled,ctPageCount,ctDefaults,CT_SAMPLE_PHOTO,ctRich,T6Bg,T6Spark});
