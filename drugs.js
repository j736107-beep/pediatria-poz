// Dawki – źródła: ChPL (rejestry.ezdrowie.gov.pl), Rekomendacje postępowania w pozaszpitalnych zakażeniach układu oddechowego (NPOA 2016, akt.),
// BNFc. Każdą dawkę weryfikuje lekarz. Pole lbl: 'ChPL' / 'Rekomendacje' / 'BNFc'.
(function(G){
var R='Rekomendacje NPOA 2016',C='ChPL';
var D=[
{id:'para',n:'Paracetamol',grp:'Przeciwgorączkowe',prod:[
  {n:'zawiesina 120 mg/5 ml (np. Panadol dla dzieci)',c:24},{n:'zawiesina 250 mg/5 ml',c:50},{n:'roztwór 100 mg/ml (krople, Pedicetamol)',c:100},
  {n:'czopek 50 mg',u:50,supp:1},{n:'czopek 80 mg',u:80,supp:1},{n:'czopek 125 mg',u:125,supp:1},{n:'czopek 250 mg',u:250,supp:1},{n:'czopek 500 mg',u:500,supp:1},
  {n:'tabletka 500 mg',u:500,tab:1}],
 reg:[{n:'p.o. 15 mg/kg co 6 h (min. odstęp 4 h)',kd:15,nd:4,maxD:1000,maxDay:4000,maxKgDay:60,lbl:C,src:'ChPL paracetamol; 10–15 mg/kg/dawkę, max 60 mg/kg/d'},
      {n:'p.r. 15–20 mg/kg co 6 h',kd:15,nd:4,maxD:1000,maxDay:4000,maxKgDay:60,lbl:C,src:'ChPL czopki paracetamol; max 60 mg/kg/d'}],
 warn:function(p){return p.mo<3?['orange','<3 mies.: max 60 mg/kg/d, odstęp ≥6 h; gorączka <3 mies. – pilna ocena']:null}},
{id:'ibu',n:'Ibuprofen',grp:'Przeciwgorączkowe',prod:[{n:'zawiesina 100 mg/5 ml (Nurofen dla dzieci, Ibum)',c:20},{n:'zawiesina 200 mg/5 ml (Nurofen Forte, Ibum Forte)',c:40},{n:'czopek 60 mg',u:60,supp:1},{n:'czopek 125 mg',u:125,supp:1},{n:'tabletka 200 mg',u:200,tab:1},{n:'tabletka 400 mg',u:400,tab:1}],
 reg:[{n:'10 mg/kg co 6–8 h',kd:10,nd:3,maxD:400,maxDay:1200,maxKgDay:30,lbl:C,src:'ChPL ibuprofen (OTC): 20–30 mg/kg/d w 3–4 dawkach, max 1200 mg/d'}],
 minMo:3,minW:5,warn:function(p){return p.mo<3||p.w<5?['red','ChPL: od 3. mies. i ≥5 kg']:null},ci:'odwodnienie, ospa wietrzna – unikać'},
{id:'amox',n:'Amoksycylina',grp:'Antybiotyki',prod:[{n:'zawiesina 250 mg/5 ml (Ospamox, Duomox)',c:50},{n:'zawiesina 500 mg/5 ml (Ospamox)',c:100},{n:'tabl. 500 mg',u:500,tab:1},{n:'tabl. 750 mg',u:750,tab:1},{n:'tabl. 1000 mg',u:1000,tab:1}],
 reg:[{n:'standard 50 mg/kg/d w 2 dawkach (angina, zap. zatok)',kday:50,nd:2,maxD:1000,maxDay:2000,maxKgDay:90,lbl:R,days:'angina: 10 dni',src:'NPOA 2016: angina 50 mg/kg/d w 1–2 dawkach (max 1 g 1× lub 2×500 mg) przez 10 dni'},
      {n:'wysoka 80–90 mg/kg/d w 2 dawkach (OZUŚ, pozaszpitalne zap. płuc)',kday:90,nd:2,maxD:2000,maxDay:4000,maxKgDay:90,lbl:R,days:'OZUŚ: <2 l. 10 dni, ≥2 l. 5–7 dni; zap. płuc 7–10 dni',src:'NPOA 2016: OZUŚ 75–90 mg/kg/d w 2 dawkach (max 2×2 g – DO WERYFIKACJI wg ChPL max 3 g/d)'}],
 ci:'nadwrażliwość na beta-laktamy; mononukleoza – wysypka'},
{id:'amc',n:'Amoksycylina + klawulanian',grp:'Antybiotyki',prod:[
  {n:'4:1 – 125/31,25 mg/5 ml (Augmentin 125)',c:25,ratio:4,kmax:40},{n:'4:1 – 250/62,5 mg/5 ml',c:50,ratio:4,kmax:40},
  {n:'7:1 – 400/57 mg/5 ml (Augmentin 400, Amoksiklav 457)',c:80,ratio:7,kmax:70},{n:'7:1 – tabl. 875/125 mg',u:875,tab:1,ratio:7,kmax:70},
  {n:'14:1 – 600/42,9 mg/5 ml (Augmentin ES)',c:120,ratio:14,kmax:90}],
 reg:[{n:'wg proporcji preparatu (dawka amoksycyliny)',kday:'auto',nd:2,maxD:1000,maxDay:2000,lbl:C,days:'OZUŚ: <2 l. 10 dni, ≥2 l. 5–7 dni',src:'ChPL Augmentin: 4:1 – 20–40 mg/kg/d w 3 dawkach; 7:1 – 25–45 (do 70) mg/kg/d w 2 dawkach; 14:1 (ES) – 90 mg/kg/d w 2 dawkach (≥3 mies., <40 kg)'}],
 note:'Dawka dobowa klawulanianu: ≤10 mg/kg/d (14:1: 6,4 mg/kg/d).',ci:'cholestaza po amoksycylinie z klawulanianem w wywiadzie'},
{id:'cxm',n:'Cefuroksym aksetyl',grp:'Antybiotyki',prod:[{n:'zawiesina 125 mg/5 ml (Zinnat)',c:25},{n:'zawiesina 250 mg/5 ml (Zinnat)',c:50},{n:'tabl. 250 mg',u:250,tab:1},{n:'tabl. 500 mg',u:500,tab:1}],
 reg:[{n:'OZUŚ / zap. płuc 30 mg/kg/d w 2 dawkach',kday:30,nd:2,maxD:500,maxDay:1000,maxKgDay:30,lbl:C,days:'5–10 dni',src:'ChPL Zinnat: 3 mies.–18 l.: 10 mg/kg 2× (max 250 mg 2×); OZUŚ 15 mg/kg 2× (max 500 mg 2×)'},
      {n:'angina / ZUM 20 mg/kg/d w 2 dawkach',kday:20,nd:2,maxD:250,maxDay:500,maxKgDay:30,lbl:C,days:'angina 10 dni; ZUM 7–10 dni',src:'ChPL Zinnat'}],minMo:3,warn:function(p){return p.mo<3?['red','ChPL: od 3. mies. życia']:null}},
{id:'cfx',n:'Cefaleksyna / cefadroksyl',grp:'Antybiotyki',prod:[{n:'cefadroksyl zaw. 250 mg/5 ml (Duracef, Biodroxil)',c:50},{n:'cefadroksyl zaw. 500 mg/5 ml',c:100},{n:'cefadroksyl kaps. 500 mg',u:500,tab:1},{n:'cefaleksyna zaw. 250 mg/5 ml',c:50,dw:1}],
 reg:[{n:'cefadroksyl angina 30 mg/kg/d 1×/d',kday:30,nd:1,maxD:1000,maxDay:1000,maxKgDay:30,lbl:R,days:'10 dni',src:'NPOA 2016: cefadroksyl 30 mg/kg/d w 1–2 dawkach, 10 dni'},
      {n:'cefadroksyl 30 mg/kg/d w 2 dawkach (skóra, ZUM)',kday:30,nd:2,maxD:1000,maxDay:2000,maxKgDay:50,lbl:C,days:'7–10 dni',src:'ChPL cefadroksyl'},
      {n:'cefaleksyna 25–50 mg/kg/d w 2–4 dawkach',kday:50,nd:4,maxD:1000,maxDay:4000,maxKgDay:100,lbl:C,days:'7–10 dni',src:'ChPL cefaleksyna – DO WERYFIKACJI dostępność preparatu w PL'}]},
{id:'azi',n:'Azytromycyna',grp:'Antybiotyki',prod:[{n:'zawiesina 100 mg/5 ml (Sumamed, Azitrox)',c:20},{n:'zawiesina 200 mg/5 ml',c:40},{n:'tabl. 250 mg',u:250,tab:1},{n:'tabl. 500 mg',u:500,tab:1}],
 reg:[{n:'10 mg/kg 1×/d przez 3 dni',kd:10,nd:1,maxD:500,maxDay:500,maxKgDay:10,lbl:C,days:'3 dni (łącznie 30 mg/kg)',src:'ChPL azytromycyna: 10 mg/kg 1×/d 3 dni (max 1500 mg łącznie)'},
      {n:'angina (alergia na beta-laktamy) 12 mg/kg 1×/d przez 5 dni',kd:12,nd:1,maxD:500,maxDay:500,maxKgDay:12,lbl:R,days:'5 dni',src:'NPOA 2016 / ChPL – 12 mg/kg (max 500 mg) 5 dni'}]},
{id:'clr',n:'Klarytromycyna',grp:'Antybiotyki',prod:[{n:'zawiesina 125 mg/5 ml (Klacid, Fromilid)',c:25},{n:'zawiesina 250 mg/5 ml',c:50},{n:'tabl. 250 mg',u:250,tab:1},{n:'tabl. 500 mg',u:500,tab:1}],
 reg:[{n:'15 mg/kg/d w 2 dawkach',kday:15,nd:2,maxD:500,maxDay:1000,maxKgDay:15,lbl:C,days:'angina 10 dni; inne 5–10 dni',src:'ChPL Klacid: 7,5 mg/kg 2×/d, max 500 mg 2×'}],minMo:6,warn:function(p){return p.mo<6?['orange','ChPL: od 6. mies. życia']:null},ci:'interakcje (CYP3A4), wydłużony QT'},
{id:'pen',n:'Fenoksymetylpenicylina',grp:'Antybiotyki',unit:'j.m.',prod:[{n:'zawiesina Ospen 400 (400 000 j.m./5 ml)',c:80000},{n:'zawiesina Ospen 750 (750 000 j.m./5 ml)',c:150000},{n:'tabl. 1 000 000 j.m.',u:1e6,tab:1},{n:'tabl. 1 500 000 j.m.',u:1.5e6,tab:1}],
 reg:[{n:'angina 100 000 j.m./kg/d w 2 dawkach',kday:100000,nd:2,maxD:1500000,maxDay:3000000,maxKgDay:200000,lbl:R,days:'10 dni',src:'NPOA 2016: <40 kg 100 000–200 000 j.m./kg/d w 2–3 dawkach; >40 kg 2–3 mln j.m./d; 10 dni'}]},
{id:'fur',n:'Furazydyna (nitrofurantoina)',grp:'ZUM',prod:[{n:'tabl. 50 mg (Furaginum)',u:50,tab:1},{n:'tabl. 100 mg (Furaginum Max)',u:100,tab:1}],
 reg:[{n:'leczenie 5–7 mg/kg/d w 2–3 dawkach',kday:6,nd:3,maxD:100,maxDay:300,maxKgDay:7,lbl:C,days:'7–8 dni',src:'ChPL Furaginum – DO WERYFIKACJI (dzieci, max dawka)'},
      {n:'profilaktyka 1–2 mg/kg 1×/d wieczorem',kday:1.5,nd:1,maxD:100,maxDay:100,maxKgDay:2,lbl:C,days:'wg wskazań',src:'Zalecenia PTNFD – DO WERYFIKACJI'}],minMo:3,warn:function(p){return p.mo<3?['red','przeciwwskazana u niemowląt <3 mies. (ryzyko hemolizy) – DO WERYFIKACJI wg ChPL']:null},ci:'niewydolność nerek (GFR<45), niedobór G6PD; tylko dolne drogi moczowe'},
{id:'pred',n:'Prednizolon / deksametazon',grp:'Sterydy',prod:[{n:'deksametazon – dawka w mg',u:0.001,mgonly:1},{n:'prednizon/prednizolon – tabl. 5 mg (Encorton)',u:5,tab:1},{n:'prednizon/prednizolon – tabl. 20 mg',u:20,tab:1}],
 reg:[{n:'krup – deksametazon 0,15 mg/kg p.o. jednorazowo',kd:0.15,nd:1,maxD:10,maxDay:10,maxKgDay:0.6,lbl:'Wytyczne',days:'1 dawka',src:'Krup: deksametazon 0,15–0,6 mg/kg (max 10 mg) – NICE CKS/PTP; 0,15 mg/kg wystarcza w łagodnym'},
      {n:'krup ciężki – deksametazon 0,6 mg/kg',kd:0.6,nd:1,maxD:10,maxDay:10,maxKgDay:0.6,lbl:'Wytyczne',days:'1 dawka',src:'Krup: 0,6 mg/kg (max 10 mg; niektóre źródła 16 mg)'},
      {n:'astma (zaostrzenie) – prednizolon 1–2 mg/kg 1×/d',kd:1,nd:1,maxD:40,maxDay:40,maxKgDay:2,lbl:'GINA',days:'3–5 dni',src:'GINA 2024: 1–2 mg/kg/d, max 40 mg (<6 l. max 20 mg – DO WERYFIKACJI)'}]},
{id:'bud',n:'Budezonid nebulizacja',grp:'Wziewne',fixed:1,prod:[{n:'zawiesina 0,25 mg/ml (Pulmicort)',c:0.25},{n:'zawiesina 0,5 mg/ml (Pulmicort)',c:0.5},{n:'zawiesina 0,125 mg/ml',c:0.125}],
 reg:[{n:'krup 2 mg jednorazowo (lub 2× 1 mg co 30 min)',fix:function(p){return 2},nd:1,lbl:C,days:'1 dawka',src:'ChPL Pulmicort: krup u dzieci od 6 mies. – 2 mg'},
      {n:'astma 0,25–0,5 mg 2×/d (6 mies.–12 l.)',fix:function(p){return p.y<12?0.5:1},nd:2,lbl:C,days:'leczenie przewlekłe',src:'ChPL Pulmicort: 6 mies.–12 l. 0,25–0,5 mg 2×/d (max 1 mg 2×)'}],minMo:6,warn:function(p){return p.mo<6?['orange','ChPL: od 6. mies.']:null}},
{id:'salb',n:'Salbutamol',grp:'Wziewne',fixed:1,prod:[{n:'MDI 100 µg/dawkę + komora (spacer)',puff:0.1},{n:'nebulizacja 2,5 mg/2,5 ml (Salbutamol WZF/Steri-Neb)',c:1}],
 reg:[{n:'zaostrzenie: MDI co 20 min ×3 w 1. godzinie',fix:function(p){return p.y<6?0.6:1},nd:3,lbl:'GINA',days:'potem co 3–4 h wg potrzeby',src:'GINA 2024: <6 l. 2–6 wdechów (200–600 µg), ≥6 l. 4–10 wdechów co 20 min w 1. h'},
      {n:'nebulizacja 2,5 mg (≥5 l./>20 kg: 5 mg)',fix:function(p){return p.y>=5||p.w>20?5:2.5},nd:3,lbl:'BNFc',days:'co 20 min ×3, potem wg stanu',src:'BNFc: 1 mies.–4 l. 2,5 mg; 5–11 l. 2,5–5 mg'}]},
{id:'ond',n:'Ondansetron',grp:'Przewód pokarmowy',fixed:1,prod:[{n:'syrop 4 mg/5 ml (Zofran)',c:0.8},{n:'tabl./ODT 4 mg',u:4,tab:1},{n:'tabl./ODT 8 mg',u:8,tab:1}],
 reg:[{n:'wymioty w nieżycie żołądkowo-jelitowym – jednorazowo wg masy',fix:function(p){return p.w<8?null:p.w<15?2:p.w<=30?4:8},nd:1,lbl:'Wytyczne',days:'1 dawka (przed ORS)',src:'ESPGHAN 2014 / badania ED: 8–15 kg 2 mg, 15–30 kg 4 mg, >30 kg 8 mg (0,15 mg/kg) – poza ChPL, DO WERYFIKACJI'}],
 minMo:6,warn:function(p){return p.mo<6||p.w<8?['red','<6 mies. / <8 kg – nie stosować (poza wskazaniami)']:['orange','wydłużony QT – ostrożnie']}},
{id:'cet',n:'Cetyryzyna',grp:'Przeciwhistaminowe',fixed:1,prod:[{n:'krople 10 mg/ml (1 kropla = 0,5 mg)',c:10,drops:20},{n:'syrop 1 mg/ml',c:1},{n:'tabl. 10 mg',u:10,tab:1}],
 reg:[{n:'dawka wg wieku (ChPL)',fix:function(p){return p.y<2?null:p.y<6?2.5:p.y<12?5:10},nd:function(p){return p.y<12?2:1},lbl:C,days:'wg potrzeby',src:'ChPL cetyryzyna: 2–6 l. 2,5 mg 2×/d; 6–12 l. 5 mg 2×/d; ≥12 l. 10 mg 1×/d'}],
 minMo:24,warn:function(p){return p.y<2?['red','ChPL: od 2. r.ż. (część ChPL kropli: 1–2 l. 0,25 mg/kg 2× – DO WERYFIKACJI)']:null}},
{id:'des',n:'Desloratadyna',grp:'Przeciwhistaminowe',fixed:1,prod:[{n:'roztwór 0,5 mg/ml (Aerius)',c:0.5},{n:'tabl. 5 mg',u:5,tab:1}],
 reg:[{n:'dawka wg wieku 1×/d (ChPL)',fix:function(p){return p.y<1?null:p.y<6?1.25:p.y<12?2.5:5},nd:1,lbl:C,days:'wg potrzeby',src:'ChPL Aerius: 1–5 l. 1,25 mg; 6–11 l. 2,5 mg; ≥12 l. 5 mg 1×/d'}],minMo:12,warn:function(p){return p.y<1?['red','ChPL: od 1. r.ż.']:null}},
{id:'vitd',n:'Witamina D3',grp:'Profilaktyka',fixed:1,unit:'j.m.',prod:[{n:'kapsułka twist-off 400 j.m.',u:400,tab:1},{n:'kapsułka 1000 j.m.',u:1000,tab:1}],
 reg:[{n:'profilaktyka wg wieku (Rekomendacje PL 2023)',fix:function(p){return p.mo<6?400:p.mo<12?400:p.y<11?800:1000},nd:1,lbl:'Rekomendacje',days:'codziennie',src:'Płudowski i wsp., Wytyczne profilaktyki niedoboru wit. D, Polska 2023'}]}
];
// obliczenia dla wybranego leku/preparatu/schematu
function calc(P,d,pr,rg,pt){var U=d.unit||'mg',res={unit:U,lbl:rg.lbl,src:rg.src,days:rg.days,warn:d.warn?d.warn(pt):null,lines:[],lvl:'ok'};
 var nd=typeof rg.nd==='function'?rg.nd(pt):rg.nd,dose,day;
 if(rg.fix){dose=rg.fix(pt);if(dose==null){res.lvl='red';res.lines.push('Brak dawkowania dla tego wieku/masy');return res}day=dose*nd;
  if(d.id==='vitd'){res.extra=P.vitD({mo:pt.mo,preterm:pt.preterm})}}
 else{if(!(pt.w>0)){res.lvl='orange';res.lines.push('Podaj masę ciała');return res}
  if(d.id==='amc'&&pr.ratio===4)nd=3;var kday=rg.kday==='auto'?(pr.kmax||40):rg.kday,o={w:pt.w,n:nd,maxDose:rg.maxD,maxDay:rg.maxDay,unit:U};if(rg.kd!=null)o.perKgDose=rg.kd;else o.perKgDay=kday;
  if(d.id==='amc'){o.maxDay=pr.ratio===14?Math.min(90*pt.w,3000):pr.ratio===7?Math.min(70*pt.w,1750*2):Math.min(40*pt.w,1500);o.maxDose=o.maxDay/nd;}
  var r=P.dose(o);dose=r.mg;day=r.day;res.flags=r.flags;if(r.capped)res.lvl='orange';
  res.perKg=P.r(day/pt.w,1)+' '+U+'/kg/d';
  if(d.id==='amc'){var clav=day/pr.ratio/pt.w,cmax=pr.ratio===14?6.4:10;res.clav='klawulanian: '+P.r(clav,1)+' mg/kg/d (max '+cmax+')';if(clav>cmax*1.01){res.lvl='red';res.clav+=' – ZA DUŻO'}}}
 var fmt=function(x){return U==='j.m.'?Math.round(x).toLocaleString('pl-PL'):P.r(x,x<1?3:x<10?2:1)};
 res.dose=dose;res.day=day;res.nd=nd;res.doseTxt=fmt(dose)+' '+U;res.dayTxt=fmt(day)+' '+U+'/d';
 if(pr.c){var ml=dose/pr.c;res.ml=ml;res.qty=P.roundMl(ml)+' ml';if(pr.drops)res.qty+=' = '+Math.round(ml*pr.drops)+' kropli';}
 else if(pr.puff){res.qty=Math.round(dose/pr.puff)+' wdechów (po 100 µg)'}
 else if(pr.u&&!pr.mgonly){var n=dose/pr.u,q=Math.round(n*2)/2;res.qty=(pr.supp?Math.max(1,Math.round(n))+' czopek ('+pr.u+' '+U+')':q+' tabl.');
  if(pr.supp){var act=pr.u;if(Math.abs(act-dose)/dose>0.34){res.lvl=act>dose?'red':'orange';res.lines.push('Czopek '+act+' mg = '+P.r(act/pt.w,1)+' mg/kg – dobierz inną moc')}}
  else if(Math.abs(q-n)/n>0.2||q===0){res.lvl=res.lvl==='red'?'red':'orange';res.lines.push('Tabletka nie dzieli się na tę dawkę – wybierz płyn')}}
 if(rg.maxDay&&day>rg.maxDay*1.001)res.lvl='red';
 if(rg.maxKgDay&&pt.w>0&&day/pt.w>rg.maxKgDay*1.05)res.lvl='red';
 if(res.warn&&res.warn[0]==='red')res.lvl='red';
 return res}
var X={list:D,calc:calc};if(typeof module!=='undefined')module.exports=X;G.DRUGS=X;
})(typeof window!=='undefined'?window:globalThis);
