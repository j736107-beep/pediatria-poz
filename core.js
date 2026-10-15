// Pediatria POZ – logika obliczeń (czyste funkcje, testowane w node)
(function(G){
var P={};
P.r=function(x,d){var f=Math.pow(10,d==null?1:d);return Math.round(x*f)/f};
P.num=function(v){if(v==null)return NaN;v=String(v).replace(',','.').trim();return v===''?NaN:Number(v)};
// ---------- PESEL ----------
P.pesel=function(s){s=String(s||'').replace(/\D/g,'');if(s.length!==11)return {ok:false,err:'PESEL ma 11 cyfr'};
 var w=[1,3,7,9,1,3,7,9,1,3],sum=0;for(var i=0;i<10;i++)sum+=w[i]*+s[i];var c=(10-sum%10)%10;if(c!==+s[10])return {ok:false,err:'Błędna suma kontrolna PESEL'};
 var y=+s.slice(0,2),m=+s.slice(2,4),d=+s.slice(4,6),cent;
 if(m>80){cent=1800;m-=80}else if(m>60){cent=2200;m-=60}else if(m>40){cent=2100;m-=40}else if(m>20){cent=2000;m-=20}else cent=1900;
 var dt=new Date(Date.UTC(cent+y,m-1,d));if(dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)return {ok:false,err:'Błędna data w PESEL'};
 return {ok:true,dob:dt.toISOString().slice(0,10),sex:(+s[9])%2?'m':'f'}};
// ---------- wiek ----------
function D(s){if(s instanceof Date)return new Date(Date.UTC(s.getFullYear(),s.getMonth(),s.getDate()));var a=String(s).split('-');return new Date(Date.UTC(+a[0],+a[1]-1,+a[2]))}
P.D=D;P.iso=function(d){return d.toISOString().slice(0,10)};
P.addDays=function(s,n){var d=D(s);d.setUTCDate(d.getUTCDate()+n);return P.iso(d)};
P.days=function(a,b){return Math.round((D(b)-D(a))/864e5)};
P.age=function(dob,today){var a=D(dob),b=D(today);if(b<a)return null;var y=b.getUTCFullYear()-a.getUTCFullYear(),m=b.getUTCMonth()-a.getUTCMonth(),d=b.getUTCDate()-a.getUTCDate();
 if(d<0){m--;d+=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth(),0)).getUTCDate()}if(m<0){y--;m+=12}
 var days=P.days(dob,today);return {y:y,m:m,d:d,days:days,months:days/30.4375,years:days/365.25}};
P.ageTxt=function(a){if(!a)return '—';if(a.y===0&&a.m===0)return a.d+' d';var s=[];if(a.y)s.push(a.y+' l');if(a.m||a.y<3)s.push(a.m+' mies');if(a.y<2)s.push(a.d+' d');return s.join(' ')};
// wiek skorygowany: wcześniak <37 tc, do 24 mies. życia
P.corrected=function(dob,today,ga){var a=P.age(dob,today);if(!a||!(ga>=22&&ga<37)||a.months>=24)return null;var cd=a.days-Math.round((40-ga)*7);
 return {days:cd,months:cd/30.4375,txt:cd<0?('przed terminem: '+(-cd)+' d'):P.ageTxt(P.age(P.addDays(dob,Math.round((40-ga)*7)),today))}};
P.bmi=function(w,hcm){return w/Math.pow(hcm/100,2)};
P.bsa=function(w,hcm){return Math.sqrt(w*hcm/3600)};// Mosteller
// ---------- LMS ----------
P.phi=function(z){var t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p};
P.lmsZ=function(x,L,M,S){return Math.abs(L)<1e-9?Math.log(x/M)/S:(Math.pow(x/M,L)-1)/(L*S)};
P.lmsX=function(z,L,M,S){return Math.abs(L)<1e-9?M*Math.exp(S*z):M*Math.pow(1+L*S*z,1/L)};
function interp(rows,mo){if(mo<rows[0][0]||mo>rows[rows.length-1][0])return null;for(var i=0;i<rows.length-1;i++){var a=rows[i],b=rows[i+1];if(mo>=a[0]&&mo<=b[0]){var f=b[0]===a[0]?0:(mo-a[0])/(b[0]-a[0]);return [a[1]+f*(b[1]-a[1]),a[2]+f*(b[2]-a[2]),a[3]+f*(b[3]-a[3])]}}return null}
P.interp=interp;
// ind: wfa|lhfa|hcfa|bmi ; zwraca {z,c,src}
P.growth=function(T,ind,sex,mo,x){if(!(x>0)||!(mo>=0))return null;var who=mo<=60,key=(who?'who_':'cdc_')+ind+'_'+sex,rows=T[key];
 if(!rows){return null}
 if(who&&ind==='lhfa'){var seen=false;rows=rows.filter(function(r){if(r[0]!==24)return true;if(!seen){seen=true;return mo<24}return mo>=24})}
 var l=interp(rows,mo);if(!l)return null;var z=P.lmsZ(x,l[0],l[1],l[2]);
 // WHO: korekta skrajnych z dla masy i BMI (WHO Anthro, z>3 / z<-3)
 if(who&&(ind==='wfa'||ind==='bmi')&&Math.abs(z)>3){var sg=z>0?1:-1,x3=P.lmsX(3*sg,l[0],l[1],l[2]),x2=P.lmsX(2*sg,l[0],l[1],l[2]),sd=sg*(x3-x2);z=sg*(3+(x-x3)*sg/sd)}
 return {z:z,c:P.phi(z)*100,src:who?'WHO 2006 (0–5 l.)':'CDC 2000 (2–20 l.) – DO WERYFIKACJI wobec siatek OLAF',L:l[0],M:l[1],S:l[2]}};
P.growthFlag=function(ind,g,mo){if(!g)return null;var c=g.c,z=g.z;
 if(ind==='bmi'){if(mo<=60){if(z>3)return ['red','otyłość (>+3 SD WHO)'];if(z>2)return ['orange','nadwaga (>+2 SD WHO)'];if(z>1)return ['orange','ryzyko nadwagi (>+1 SD)'];if(z<-2)return ['red','niedożywienie (<−2 SD)']}
  else{if(c>=95)return ['red','otyłość (≥95 c)'];if(c>=85)return ['orange','nadwaga (≥85 c)'];if(c<5)return ['orange','niedowaga (<5 c)']}return ['ok','norma']}
 if(c<3)return ['red','<3 centyla'];if(c>97)return ['red','>97 centyla'];if(c<10||c>90)return ['orange',c<10?'3–10 c':'90–97 c'];return ['ok','norma']};
// ---------- LEKI ----------
// u: jednostka (mg lub j.m.), conc: u na ml (płyn) lub null (tabl/czopek – unit)
P.dose=function(o){// o:{w, perKgDose, perKgDay, n, maxDose, maxDay, conc, unit}
 var w=o.w,n=o.n,dose=o.perKgDose!=null?o.perKgDose*w:o.perKgDay*w/n,raw=dose,capped=false,flags=[];
 if(o.maxDose&&dose>o.maxDose){dose=o.maxDose;capped=true;flags.push('dawka jednorazowa ograniczona do max '+o.maxDose+' '+(o.unit||'mg'))}
 if(o.maxDay&&dose*n>o.maxDay){dose=o.maxDay/n;capped=true;flags.push('dawka dobowa ograniczona do max '+o.maxDay+' '+(o.unit||'mg'))}
 var r={mg:dose,raw:raw,day:dose*n,perKgDay:dose*n/w,capped:capped,flags:flags};if(o.conc)r.ml=dose/o.conc;return r};
// ocena dawki wpisanej ręcznie
P.check=function(o){var day=o.dose*o.n,lvl='ok',m=[];if(o.maxDose&&o.dose>o.maxDose*1.001){lvl='red';m.push('przekroczona max dawka jednorazowa')}
 if(o.maxDay&&day>o.maxDay*1.001){lvl='red';m.push('przekroczona max dawka dobowa')}if(o.maxKgDay&&day/o.w>o.maxKgDay*1.05){lvl='red';m.push('>'+o.maxKgDay+' '+(o.unit||'mg')+'/kg/d')}
 if(lvl==='ok'&&o.minKgDay&&day/o.w<o.minKgDay*0.9){lvl='orange';m.push('poniżej zakresu terapeutycznego')}return {lvl:lvl,msg:m}};
P.roundMl=function(ml){return ml<2?P.r(ml,2):ml<10?Math.round(ml*4)/4:Math.round(ml*2)/2};
// ---------- skale ----------
P.mcisaac=function(o){var s=(o.t?1:0)+(o.noCough?1:0)+(o.nodes?1:0)+(o.exud?1:0)+(o.age>=3&&o.age<15?1:o.age>=45?-1:0);
 var t=s<=1?['ok','bez antybiotyku i bez testu']:s<=3?['orange','szybki test na antygen PBHS (RADT); antybiotyk tylko przy (+)']:['red','RADT/posiew; antybiotyk przy (+) (w Polsce zalecany test także przy 4–5 pkt)'];return {s:s,lvl:t[0],txt:t[1]}};
P.westley=function(o){var s=(+o.str||0)+(+o.ret||0)+(+o.air||0)+(+o.cyan||0)+(+o.cons||0);var t=s<=2?['ok','łagodny – deksametazon 0,15 mg/kg p.o., leczenie domowe']:s<=7?['orange','umiarkowany – deksametazon 0,15–0,6 mg/kg, budezonid neb, obserwacja 2–4 h']:s<=11?['red','ciężki – adrenalina neb, steryd, skierowanie do szpitala']:['red','zagrażająca niewydolność oddechowa – pilnie szpital/ZRM'];return {s:s,lvl:t[0],txt:t[1]}};
P.cds=function(o){var s=(+o.a||0)+(+o.e||0)+(+o.m||0)+(+o.t||0);var t=s===0?['ok','brak odwodnienia (<3%)']:s<=4?['orange','odwodnienie lekkie (3–6%)']:['red','odwodnienie umiarkowane/ciężkie (≥6%)'];return {s:s,lvl:t[0],txt:t[1]}};
P.ors=function(w,pct){return {lo:50*w,hi:100*w,v:(pct||50)*w}};
P.holliday=function(w){var d=w<=10?100*w:w<=20?1000+50*(w-10):1500+20*(w-20);return {day:Math.min(d,2400),h:Math.min(d,2400)/24}};
P.aom=function(o){// o:{mo, bilat, otorrhea, severe}
 if(o.mo<6)return {lvl:'red',abx:true,txt:'<6 mies. – antybiotyk od razu (rozważ skierowanie)'};
 if(o.otorrhea)return {lvl:'red',abx:true,txt:'wyciek z ucha – antybiotyk od razu'};
 if(o.severe)return {lvl:'red',abx:true,txt:'ciężki przebieg (T≥39 °C, silny ból, stan ogólny) – antybiotyk od razu'};
 if(o.mo<24&&o.bilat)return {lvl:'red',abx:true,txt:'6–24 mies., obustronne OZUŚ – antybiotyk od razu'};
 return {lvl:'orange',abx:false,txt:'obserwacja 48–72 h z leczeniem p/bólowym; antybiotyk, gdy brak poprawy/pogorszenie'}};
P.aomDays=function(mo,severe){return mo<24||severe?10:'5–7'};
// ---------- żywienie ----------
P.formula=function(o){// o:{w, ageDays}
 var d=o.ageDays,feeds=d<30?8:d<60?7:d<120?6:d<180?5:d<365?4:3,day;
 if(d<10)day=Math.max(0,(d-1))*70;else if(d<183)day=Math.min(150*o.w,1000);else day=Math.min(120*o.w,800);
 return {day:Math.round(day),feeds:feeds,per:Math.round(day/feeds/10)*10,note:d<10?'reguła Finkelsteina: (dzień życia − 1) × 70 ml':d<183?'150 ml/kg/d (max ok. 1000 ml)':'od 6. mies. dieta rozszerzona; mleko ok. 500–600 ml/d (max ~800)'}};
P.vitD=function(o){var mo=o.mo;if(o.preterm&&mo<12)return 'wcześniak: 400–800 j.m./d (wg masy i karmienia; kontrola 25(OH)D)';
 if(mo<6)return '400 j.m./d od pierwszych dni życia (niezależnie od karmienia)';if(mo<12)return '400–600 j.m./d (wliczając podaż z mleka modyfikowanego)';
 if(mo<12*11)return 'IV–IX: 600–1000 j.m./d, gdy brak syntezy skórnej; X–III: 600–1000 j.m./d';return '1000–2000 j.m./d (X–III, oraz IV–IX gdy niedostateczna ekspozycja na słońce)'};
// ---------- normy ----------
var VS=[[1,110,160,30,40,70,90],[2,100,150,25,35,80,95],[5,95,140,25,30,80,100],[12,80,120,20,25,90,110],[99,60,100,15,20,100,120]];
P.vitals=function(y){for(var i=0;i<VS.length;i++)if(y<VS[i][0])return {hr:[VS[i][1],VS[i][2]],rr:[VS[i][3],VS[i][4]],sbp:[VS[i][5],VS[i][6]]};};
// AAP 2017 – tabela uproszczona (Table 6, ~90 c dla 5 c wzrostu) – przesiew; ≥13 l.: progi dorosłych
var BP={m:[[1,98,52],[2,100,55],[3,101,58],[4,102,60],[5,103,63],[6,105,66],[7,106,68],[8,107,69],[9,107,70],[10,108,72],[11,110,74],[12,113,75]],f:[[1,98,54],[2,101,58],[3,102,60],[4,103,62],[5,104,64],[6,105,67],[7,106,68],[8,107,69],[9,108,71],[10,109,72],[11,111,74],[12,114,75]]};
P.bp=function(y,sex,s,d){var a=Math.floor(y);if(a<1)return null;if(a>=13){var lvl='ok',t='prawidłowe (<120/<80)';if(s>=140||d>=90){lvl='red';t='nadciśnienie 2°'}else if(s>=130||d>=80){lvl='red';t='nadciśnienie 1°'}else if(s>=120){lvl='orange';t='podwyższone'}return {lvl:lvl,txt:t,thr:'120/80'}}
 var r=BP[sex||'m'][a-1];var hi=s>=r[1]||d>=r[2];return {lvl:hi?'orange':'ok',txt:hi?'≥ progu przesiewowego – zmierz 3× / sprawdź pełne tabele wg centyla wzrostu':'poniżej progu przesiewowego',thr:r[1]+'/'+r[2]}};
P.sleep=function(y){return y<1?'12–16 h (4–12 mies., z drzemkami)':y<3?'11–14 h':y<6?'10–13 h':y<13?'9–12 h':'8–10 h'};
// ---------- SZCZEPIENIA (PSO 2026, wariant 6w1 3+1 / podstawowy) ----------
// ma: min wiek (dni), rec: [od,do] zalecany wiek (dni), iv: min odstęp od poprzedniej dawki tego antygenu (dni), mx: max wiek (dni)
var W=7,M=30.4375;
P.PSO={
 base:[
  {id:'BCG',n:'Gruźlica (BCG)',ma:0,rec:[0,1],note:'do wypisu z oddziału noworodkowego'},
  {id:'HBV1',n:'WZW B – 1',ma:0,rec:[0,1]},
  {id:'RV1',n:'Rotawirusy – 1',ma:6*W,rec:[6*W,2*M+30],mx:12*W,note:'1. dawka najpóźniej do 12 tyg. ż. (Rotarix do 24 tyg. całość, RotaTeq do 32 tyg.) – DO WERYFIKACJI wg ChPL'},
  {id:'HBV2',n:'WZW B – 2',ma:6*W,rec:[6*W,2*M+30],iv:4*W,g:'HBV'},
  {id:'DTP1',n:'DTP – 1',ma:6*W,rec:[6*W,2*M+30],g:'DTP'},
  {id:'Hib1',n:'Hib – 1',ma:6*W,rec:[6*W,2*M+30],g:'Hib'},
  {id:'PCV1',n:'Pneumokoki – 1',ma:6*W,rec:[6*W,2*M+30],g:'PCV'},
  {id:'RV2',n:'Rotawirusy – 2',ma:10*W,rec:[10*W,4*M+30],iv:4*W,mx:24*W,g:'RV'},
  {id:'DTP2',n:'DTP – 2',ma:14*W,rec:[14*W,4*M+30],iv:4*W,g:'DTP'},
  {id:'IPV1',n:'Polio IPV – 1',ma:12*W,rec:[12*W,4*M+30],g:'IPV'},
  {id:'Hib2',n:'Hib – 2',ma:14*W,rec:[14*W,4*M+30],iv:4*W,g:'Hib'},
  {id:'PCV2',n:'Pneumokoki – 2',ma:14*W,rec:[14*W,4*M+30],iv:8*W,g:'PCV'},
  {id:'DTP3',n:'DTP – 3',ma:5*M,rec:[5*M,6*M+30],iv:4*W,g:'DTP'},
  {id:'Hib3',n:'Hib – 3',ma:5*M,rec:[5*M,6*M+30],iv:4*W,g:'Hib'},
  {id:'IPV2',n:'Polio IPV – 2',ma:5*M,rec:[5*M,6*M+30],iv:8*W,g:'IPV'},
  {id:'HBV3',n:'WZW B – 3',ma:6*M,rec:[6*M,7*M+30],iv:8*W,g:'HBV'},
  {id:'MMR1',n:'MMR – 1',ma:12*M,rec:[12*M,15*M+30],g:'MMR'},
  {id:'PCV3',n:'Pneumokoki – 3 (przypominająca)',ma:12*M,rec:[12*M,15*M+30],iv:8*W,g:'PCV'},
  {id:'DTP4',n:'DTP – 4',ma:15*M,rec:[15*M,18*M+30],iv:6*M,g:'DTP'},
  {id:'Hib4',n:'Hib – 4',ma:15*M,rec:[15*M,18*M+30],iv:6*M,g:'Hib'},
  {id:'IPV3',n:'Polio IPV – 3',ma:15*M,rec:[15*M,18*M+30],iv:6*M,g:'IPV'},
  {id:'DTaP5',n:'DTaP – 1. przypominająca (6 r.ż.)',ma:5*365.25,rec:[5*365.25,6*365.25],g:'DTP'},
  {id:'IPV4',n:'Polio IPV – przypominająca (6 r.ż.)',ma:5*365.25,rec:[5*365.25,6*365.25],g:'IPV'},
  {id:'MMR2',n:'MMR – 2 (6 r.ż.)',ma:5*365.25,rec:[5*365.25,6*365.25],iv:4*W,g:'MMR'},
  {id:'Tdap',n:'Tdap – 2. przypominająca (14 r.ż.)',ma:13*365.25,rec:[13*365.25,14*365.25],g:'DTP'},
  {id:'Td',n:'Td – 3. przypominająca (19 r.ż.)',ma:18*365.25,rec:[18*365.25,19*365.25],g:'DTP'}
 ],
 six:{'DTP1':'6w1 – 1','DTP2':'6w1 – 2','DTP3':'6w1 – 3','DTP4':'6w1 – 4 (16–18 mies.)'}
};
// wariant: 'pod' (podstawowy DTwP), '5w1' (DTaP-IPV-Hib), '6w1' (3+1)
P.schedule=function(variant){var L=JSON.parse(JSON.stringify(P.PSO.base));if(variant==='5w1'||variant==='6w1'){
 // w wysokoskojarzonych IPV razem z DTaP (2,4,6–7,16–18 mies.)
 L=L.filter(function(d){return !/^IPV[123]$/.test(d.id)&&!/^Hib\d$/.test(d.id)});
 L.forEach(function(d){var m=/^DTP(\d)$/.exec(d.id);if(m){d.n=(variant==='6w1'?'6w1 DTaP-IPV-Hib-HBV':'5w1 DTaP-IPV-Hib')+' – '+m[1];if(m[1]==='2'){d.ma=14*W}}});
 if(variant==='6w1')L=L.filter(function(d){return !/^HBV[23]$/.test(d.id)});}
 return L};
// done: {id: 'YYYY-MM-DD' lub true}
P.vaxStatus=function(dob,today,variant,done){var L=P.schedule(variant),age=P.days(dob,today),last={},out=[];
 L.forEach(function(d){var g=d.g||d.id.replace(/\d+$/,''),dd=done[d.id];
  var earliest=P.addDays(dob,Math.ceil(d.ma));if(d.iv&&last[g]&&last[g]!==true)earliest=[earliest,P.addDays(last[g],d.iv)].sort()[1];
  var st;if(dd){st='done';last[g]=dd}else{last[g]=last[g]||null;
   if(d.mx&&age>d.mx)st='late';else if(age<d.ma)st='future';else if(age>d.rec[1]+30)st='overdue';else st='due';
   if(d.iv&&last[g]===null&&/\d$/.test(d.id)&&+d.id.slice(-1)>1){var prev=L.filter(function(x){return (x.g||x.id.replace(/\d+$/,''))===g&&L.indexOf(x)<L.indexOf(d)});if(prev.some(function(x){return !done[x.id]})&&st!=='future'&&st!=='late')st='blocked'}
   last[g]=last[g];}
  out.push({id:d.id,n:d.n,st:st,date:st==='done'?(dd===true?'':dd):earliest,recFrom:P.addDays(dob,Math.ceil(d.rec[0])),recTo:P.addDays(dob,Math.ceil(d.rec[1])),note:d.note||''})});
 return out};
if(typeof module!=='undefined')module.exports=P;G.PP=P;
})(typeof window!=='undefined'?window:globalThis);
