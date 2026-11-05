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
