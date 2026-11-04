// Brand Studio v2 settings. The Supabase project is chosen by hostname:
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
    approverName:'Subomi'
  };
})();
