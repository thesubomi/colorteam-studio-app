// Templates defined as data. Same shape the Figma importer will produce. Format: docs/template-format.md
window.CT_JSON_TEMPLATES=[
{id:'announcement',name:'Announcement',icon:'megaphone',sizes:['post','square','story'],photo:false,defTheme:0,
 fields:[{k:'label',label:'Label',def:'New'},{k:'title',label:'Headline',def:'Something *worth* announcing'},{k:'body',label:'Body',type:'area',def:'One or two lines that say what it is and why it matters.'},{k:'cta',label:'Call to action',def:'colorteam.io'}],
 layouts:{
  post:{layers:[
   {type:'logo',x:72,y:72,w:260,h:48},
   {type:'chip',x:72,y:300,bind:'label',size:26},
   {type:'text',x:72,y:400,w:936,h:560,bind:'title',font:'display',size:{max:124,chars:14},color:'ink',rich:true},
   {type:'line',x:72,y:1010,w:936,h:2,color:'ink',opacity:.3},
   {type:'text',x:72,y:1050,w:760,h:180,bind:'body',font:'body',size:34,color:'muted',lineHeight:1.3},
   {type:'text',x:72,y:1260,w:936,h:40,bind:'cta',font:'body',size:24,weight:600,color:'accent',upper:true}]},
  square:{layers:[
   {type:'logo',x:72,y:72,w:260,h:48},
   {type:'chip',x:72,y:240,bind:'label',size:24},
   {type:'text',x:72,y:330,w:936,h:440,bind:'title',font:'display',size:{max:112,chars:14},color:'ink',rich:true},
   {type:'text',x:72,y:820,w:760,h:150,bind:'body',font:'body',size:30,color:'muted'},
   {type:'text',x:72,y:1000,w:936,h:40,bind:'cta',font:'body',size:22,weight:600,color:'accent',upper:true}]},
  story:{layers:[
   {type:'logo',x:72,y:160,w:260,h:48},
   {type:'chip',x:72,y:560,bind:'label',size:28},
   {type:'text',x:72,y:660,w:936,h:700,bind:'title',font:'display',size:{max:136,chars:14},color:'ink',rich:true},
   {type:'text',x:72,y:1400,w:800,h:220,bind:'body',font:'body',size:36,color:'muted'},
   {type:'text',x:72,y:1700,w:936,h:40,bind:'cta',font:'body',size:26,weight:600,color:'accent',upper:true}]}}},
{id:'photo-quote',name:'Photo quote',icon:'image',sizes:['post','story'],photo:true,defTheme:0,
 fields:[{k:'quote',label:'Quote',type:'area',def:'Design is the *quiet* part of trust.'},{k:'name',label:'Name',def:'Subomi Archibong'},{k:'role',label:'Role',def:'Founder, Colorteam'}],
 layouts:{
  post:{layers:[
   {type:'image',x:72,y:72,w:936,h:620,radius:32},
   {type:'text',x:72,y:740,w:936,h:380,bind:'quote',font:'serif',size:{max:72,chars:40},color:'ink',lineHeight:1.12,rich:true},
   {type:'text',x:72,y:1160,w:700,h:40,bind:'name',font:'body',size:30,weight:600,color:'ink'},
   {type:'text',x:72,y:1205,w:700,h:40,bind:'role',font:'body',size:26,color:'muted'},
   {type:'logo',x:760,y:1190,w:248,h:44,align:'right'}]},
  story:{layers:[
   {type:'image',x:0,y:0,w:1080,h:1100,radius:0},
   {type:'text',x:72,y:1180,w:936,h:440,bind:'quote',font:'serif',size:{max:80,chars:40},color:'ink',lineHeight:1.12,rich:true},
   {type:'text',x:72,y:1660,w:700,h:40,bind:'name',font:'body',size:32,weight:600,color:'ink'},
   {type:'text',x:72,y:1710,w:700,h:40,bind:'role',font:'body',size:28,color:'muted'},
   {type:'logo',x:760,y:1700,w:248,h:44,align:'right'}]}}}
];
