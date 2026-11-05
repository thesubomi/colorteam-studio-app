// Colorteam Studio settings. The Supabase project is chosen by hostname:
// production (colorteam.io, app.colorteam.io) or staging (everything else).
(function(){
  var PROD={url:'https://vxuqsfyvvchwqzvdjjfs.supabase.co',anonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dXFzZnl2dmNod3F6dmRqamZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTY0MDksImV4cCI6MjEwODc3MjQwOX0.zwxszgZvAWhCYdc8XyoZpNIGef73tYmBmST9Ni3QSrM'};
  var STAGING={url:'https://aqssqqiiwcfwyygmxoic.supabase.co',anonKey:'sb_publishable_ZHoIN242se2j2ltViYiI4w_yuVQ1I8j'};
  var h=location.hostname;
  var prod=(h==='colorteam.io'||h==='www.colorteam.io'||h==='app.colorteam.io');
  window.CT_STUDIO_ENV=prod?'production':'staging';
  window.CT_RELEASE=typeof __CT_RELEASE__!=='undefined'?__CT_RELEASE__:'dev';
  window.CT_STUDIO_CONFIG={
    supabase:prod?PROD:STAGING,
    googleSignIn:false,
    guidelinesUrl:'assets/Colorteam-Brand-Guidelines.pdf',
    approverName:'Subomi',
    // Stripe customer portal (card, invoices, cancel). Staging uses the test-mode portal.
    billingPortal:prod?null:'https://billing.stripe.com/p/login/test_dRmaEWgX77cVbSE5MrgEg00'
  };
  // Plan entitlements (D5). null = unlimited. Mirrors public.plan_limit() in 0008_plan_limits.sql.
  var PLANS={
    core:{seats:2,templates:12,requests:2,channels:3,custom:false,mcp:false},
    growth:{seats:5,templates:24,requests:5,channels:6,custom:false,mcp:false},
    max:{seats:null,templates:null,requests:null,channels:null,custom:true,mcp:true},
    internal:{seats:null,templates:null,requests:null,channels:null,custom:true,mcp:true}
  };
  window.CT_PLAN_LIMITS=PLANS;
  // Limits for a workspace: its plan's defaults plus any extras Colorteam granted in settings.limits.
  window.ctLimits=function(ws){
    if(!ws||ws.slug==='colorteam')return PLANS.internal;
    var base=PLANS[ws.plan]||PLANS.core,extra=(ws.settings&&ws.settings.limits)||{},out={};
    for(var k in base)out[k]=(extra[k]!=null)?extra[k]:base[k];
    return out;
  };
})();
// Google Analytics 4 (property "Colorteam Studio"). Only on the live app, and only after the person
// says yes in the cookie banner: nothing loads and no cookies are set before that. No emails, names,
// file titles or IDs are sent: just which screen is open and a few product events.
(function(){
  var GA_ID='G-9PKMRXNKJQ';
  var live=location.hostname==='app.colorteam.io';
  var force=false;try{force=localStorage.getItem('ctbs2_ga_test')==='1';}catch(e){}
  var KEY='ctbs2_consent';
  var get=function(){try{return localStorage.getItem(KEY);}catch(e){return null;}};
  var loaded=false,queue=[];
  function load(){
    if(loaded)return;loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    gtag('config',GA_ID,{send_page_view:false,anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false,debug_mode:force||undefined});
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;document.head.appendChild(s);
    queue.splice(0).forEach(function(a){gtag.apply(null,a);});
  }
  var A={
    enabled:live||force,
    choice:get,
    set:function(v){try{localStorage.setItem(KEY,v);}catch(e){}if(v==='granted'){load();if(A.screen)A.page(A.screen);}else if(loaded&&window.gtag)gtag('consent','update',{analytics_storage:'denied'});window.dispatchEvent(new Event('ct-consent'));},
    event:function(name,params){if(!A.enabled||get()!=='granted')return;var a=['event',name,params||{}];if(loaded&&window.gtag)gtag.apply(null,a);else queue.push(a);},
    page:function(screen){A.screen=screen;A.event('page_view',{page_title:screen,page_location:location.origin+'/'+screen,page_path:'/'+screen});},
    user:function(props){if(!A.enabled||get()!=='granted')return;var a=['set','user_properties',props];if(loaded&&window.gtag)gtag.apply(null,a);else queue.push(a);}
  };
  window.ctTrack=A;
  if(A.enabled&&get()==='granted')load();
})();
// Publishing helpers: channels, UTM tagging and the scheduled moment of a post.
(function(){
  var CH=['LinkedIn','Instagram','Facebook','X','TikTok','YouTube','Website','Email'];
  var SRC={LinkedIn:'linkedin',Instagram:'instagram',Facebook:'facebook',X:'x',TikTok:'tiktok',YouTube:'youtube',Website:'website',Email:'newsletter'};
  window.CT_CHANNELS=CH;
  // utm = the workspace preset from the brand kit: {medium, campaign, sources:{Channel:source}, off}
  window.ctUtmPreset=function(kit){var u=(kit&&kit.utm)||{};return {off:!!u.off,medium:u.medium||'social',campaign:u.campaign||'',sources:Object.assign({},SRC,u.sources||{})};};
  window.ctSlug=function(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);};
  window.ctTagLink=function(link,channel,preset,campaign,content){
    link=String(link||'').trim();if(!link)return '';if(!/^https?:\/\//i.test(link))link='https://'+link;
    var u;try{u=new URL(link);}catch(e){return link;}
    if(preset.off||u.searchParams.has('utm_source'))return u.toString();
    u.searchParams.set('utm_source',preset.sources[channel]||window.ctSlug(channel));
    u.searchParams.set('utm_medium',channel==='Email'?'email':preset.medium);
    var c=window.ctSlug(campaign||preset.campaign);if(c)u.searchParams.set('utm_campaign',c);
    var ct=window.ctSlug(content);if(ct)u.searchParams.set('utm_content',ct);
    return u.toString();
  };
  window.ctBrowserTz=function(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Warsaw';}catch(e){return 'Europe/Warsaw';}};
  // The scheduled moment as a Date: schedule (YYYY-MM-DD) + time (HH:MM, default 09:00) in the post's time zone.
  window.ctWhen=function(f){
    if(!f||!f.schedule)return null;var t=f.time||'09:00',tz=f.tz||window.ctBrowserTz();
    var guess=new Date(f.schedule+'T'+t+':00Z');if(isNaN(guess))return null;
    try{var parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(guess).reduce(function(o,p){o[p.type]=p.value;return o;},{});
      var asTz=Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute);return new Date(guess.getTime()-(asTz-guess.getTime()));}catch(e){return guess;}
  };
  window.ctWhenLabel=function(f){var d=window.ctWhen(f);if(!d)return '';return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})+', '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});};
})();

// What the AI needs to know about a template: its text fields and their samples.
window.ctAiTpl=function(t){return {id:t.id,name:t.name,fields:(t.fields||[]).filter(function(f){return !f.type||f.type==='area';}).map(function(f){return {k:f.k,label:f.label,def:typeof f.def==='string'?f.def:''};})};};
