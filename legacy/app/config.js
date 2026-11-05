// Colorteam Studio settings. The Supabase project is chosen by hostname:
// production (colorteam.io, app.colorteam.io) or staging (everything else).
(function(){
  var PROD={url:'https://vxuqsfyvvchwqzvdjjfs.supabase.co',anonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dXFzZnl2dmNod3F6dmRqamZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTY0MDksImV4cCI6MjEwODc3MjQwOX0.zwxszgZvAWhCYdc8XyoZpNIGef73tYmBmST9Ni3QSrM'};
  var STAGING={url:'https://aqssqqiiwcfwyygmxoic.supabase.co',anonKey:'sb_publishable_ZHoIN242se2j2ltViYiI4w_yuVQ1I8j'};
  var h=location.hostname;
  var prod=(h==='colorteam.io'||h==='www.colorteam.io'||h==='app.colorteam.io');
  window.CT_STUDIO_ENV=prod?'production':'staging';
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
