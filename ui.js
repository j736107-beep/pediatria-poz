(function(){var P=PP,$=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var VER='1.1';$('#ver').textContent='v'+VER;
var C={},cur='leki',ST={};// C: dziecko (tylko w pamięci), ST: stan modułów
function today(){return P.iso(new Date())}
function kid(){var o={w:P.num(C.w),h:P.num(C.h),sex:C.sex||'',ga:P.num(C.ga),dob:C.dob||''};o.age=o.dob?P.age(o.dob,today()):null;o.mo=o.age?o.age.months:NaN;o.y=o.age?o.age.years:NaN;o.preterm=o.ga>=22&&o.ga<37;
 o.corr=o.dob&&o.preterm?P.corrected(o.dob,today(),o.ga):null;o.gmo=o.corr?Math.max(0,o.corr.months):o.mo;if(o.w>0&&o.h>0){o.bmi=P.bmi(o.w,o.h);o.bsa=P.bsa(o.w,o.h)}return o}
function pd(s){return s?s.split('-').reverse().join('.'):''}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function src(s){return '<div class="src">'+esc(s).replace(/DO WERYFIKACJI/g,'<span class="dw">DO WERYFIKACJI</span>')+'</div>'}
function box(l,h){return '<div class="box '+(l||'')+'">'+h+'</div>'}
// ---------- pasek dziecka ----------
function bar(){var k=kid(),s=[];$('#pesel').classList.toggle('bad',!!C.peselErr);
 if(C.peselErr)s.push('<span class="r">'+C.peselErr+'</span>');
 if(k.age)s.push(P.ageTxt(k.age));if(k.corr)s.push('skoryg.: '+k.corr.txt);if(k.bmi)s.push('BMI '+P.r(k.bmi,1)+' · BSA '+P.r(k.bsa,2)+' m²');
 $('#sum').innerHTML=s.join(' · ')||'podaj PESEL lub datę urodzenia';$$('#sex button').forEach(function(b){b.classList.toggle('on',b.dataset.s===C.sex)})}
$('#pesel').addEventListener('input',function(){var v=this.value.replace(/\D/g,'');C.peselErr='';if(v.length===11){var r=P.pesel(v);if(r.ok){C.dob=r.dob;C.sex=r.sex;$('#dob').value=r.dob}else C.peselErr=r.err}else if(v.length)C.peselErr='';upd()});
$('#dob').addEventListener('input',function(){C.dob=this.value;upd()});
['w','h','ga'].forEach(function(id){$('#'+id).addEventListener('input',function(){C[id]=this.value;upd()})});
$$('#sex button').forEach(function(b){b.onclick=function(){C.sex=b.dataset.s;upd()}});
$('#reset').onclick=function(){C={};ST={};sirenStop();beacon(false);['pesel','dob','w','h','ga'].forEach(function(i){$('#'+i).value=''});upd()};
// ---------- moduły ----------
var MODS=[['leki','💊 Dawki leków'],['centyle','📈 Siatki centylowe'],['bilans','📋 Bilanse'],['szczep','💉 Szczepienia'],['infek','🌡 Gorączka / infekcje'],['odw','💧 Odwodnienie'],['zyw','🍼 Żywienie'],['alarm','🚨 Objawy alarmowe'],['normy','❤️ Normy dla wieku']];
$('#side').innerHTML=MODS.map(function(m){return '<button data-m="'+m[0]+'">'+m[1]+'</button>'}).join('');
$$('#side button').forEach(function(b){b.onclick=function(){cur=b.dataset.m;render()}});
function need(k,what){var m=[];if(what.indexOf('age')>=0&&!k.age)m.push('wiek (PESEL/data ur.)');if(what.indexOf('w')>=0&&!(k.w>0))m.push('masę');if(what.indexOf('sex')>=0&&!k.sex)m.push('płeć');if(what.indexOf('h')>=0&&!(k.h>0))m.push('wzrost');return m.length?box('orange','Uzupełnij na górze: <b>'+m.join(', ')+'</b>'):''}
var R={};
// 1. LEKI
R.leki=function(k){var s=ST.leki=ST.leki||{d:'para',p:0,g:0},L=DRUGS.list,d=L.filter(function(x){return x.id===s.d})[0];
 var grp={},h='<h2>Dawki leków</h2><div class="drugs">';L.forEach(function(x){if(!grp[x.grp]){grp[x.grp]=1;h+='<div class="dg">'+x.grp+'</div>'}h+='<button data-d="'+x.id+'" class="'+(x.id===s.d?'on':'')+'">'+x.n+'</button>'});h+='</div>';
 if(s.p>=d.prod.length)s.p=0;if(s.g>=d.reg.length)s.g=0;
 h+='<div class="row"><label>Preparat <select id="dp">'+d.prod.map(function(p,i){return '<option value="'+i+'"'+(i==s.p?' selected':'')+'>'+esc(p.n)+'</option>'}).join('')+'</select></label></div>';
 h+='<div class="row"><label>Schemat <select id="dr">'+d.reg.map(function(r,i){return '<option value="'+i+'"'+(i==s.g?' selected':'')+'>'+esc(r.n)+'</option>'}).join('')+'</select></label></div>';
 var pt={w:k.w,mo:isNaN(k.mo)?120:k.mo,y:isNaN(k.y)?10:k.y,preterm:k.preterm};
 var r=DRUGS.calc(P,d,d.prod[s.p],d.reg[s.g],pt);
 if(!k.age)h+=box('orange','Brak wieku – ograniczenia wiekowe nie są sprawdzane.');
 var o='<h3>'+d.n+' <span class="tag">'+esc(r.lbl)+'</span></h3>';
 if(r.doseTxt){o+='<div class="big">'+(r.qty?esc(r.qty)+' ':'')+'<span class="mut">=</span> '+r.doseTxt+' × '+r.nd+'/d</div><div>dobowo: <b>'+r.dayTxt+'</b>'+(r.perKg?' ('+r.perKg+')':'')+(r.days?' · czas: <b>'+esc(r.days)+'</b>':'')+'</div>';
  if(r.clav)o+='<div class="'+(r.lvl==='red'?'r':'mut')+'">'+r.clav+'</div>'}
 (r.flags||[]).concat(r.lines).forEach(function(f){o+='<div class="o">⚠ '+esc(f)+'</div>'});
 if(r.warn)o+='<div class="'+(r.warn[0]==='red'?'r':'o')+'">⚠ '+esc(r.warn[1])+'</div>';
 if(r.extra)o+='<div>Zalecenie wg wieku: <b>'+esc(r.extra)+'</b></div>';
 if(d.note)o+='<div class="mut">'+esc(d.note)+'</div>';if(d.ci)o+='<div class="mut">Uwaga: '+esc(d.ci)+'</div>';
 h+=box(r.lvl,o+src(r.src));
 // ręczne sprawdzenie dawki
 var rg=d.reg[s.g];if(rg.maxDay&&!rg.fix){h+='<div class="box"><h3>Sprawdź dawkę z recepty</h3><div class="row"><label>dawka <input id="cd" inputmode="decimal" value="'+(s.cd||'')+'"> '+(d.unit||'mg')+'</label><label>× <input id="cn" inputmode="numeric" value="'+(s.cn||r.nd||'')+'" style="width:3em">/d</label><span id="cres"></span></div></div>'}
 ST.plan=ST.plan||{items:[],probio:null,ctrl:'48–72 h',note:''};h+=planHtml();return h};
R.leki.bind=function(k){var s=ST.leki;$$('.drugs button').forEach(function(b){b.onclick=function(){s.d=b.dataset.d;s.p=0;s.g=0;render()}});$('#dp').onchange=function(){s.p=+this.value;render()};$('#dr').onchange=function(){s.g=+this.value;render()};
 var cd=$('#cd');if(cd){var f=function(){s.cd=cd.value;s.cn=$('#cn').value;var d=DRUGS.list.filter(function(x){return x.id===s.d})[0],rg=d.reg[s.g],v=P.num(s.cd),n=P.num(s.cn);if(!(v>0&&n>0&&k.w>0)){$('#cres').innerHTML='';return}
  var c=P.check({dose:v,n:n,w:k.w,maxDose:rg.maxD,maxDay:rg.maxDay,maxKgDay:rg.maxKgDay,unit:d.unit});$('#cres').innerHTML='<b class="'+(c.lvl==='red'?'r':c.lvl==='orange'?'o':'g')+'">'+P.r(v*n/k.w,1)+' '+(d.unit||'mg')+'/kg/d '+(c.msg.length?'– '+c.msg.join(', '):'– OK')+'</b>'};cd.oninput=f;$('#cn').oninput=f;f()}planBind(k)};
function planBind(k){var pl=ST.plan;$('#padd').onclick=function(){var it=planItem(k);if(!it){alert('Podaj masę ciała, aby obliczyć dawkę.');return}pl.items.push(it);render()};$('#pprint').onclick=function(){planPrint(k)};var c=$('#pclr');if(c)c.onclick=function(){pl.items=[];pl.probio=null;render()};
 $$('[data-pi]').forEach(function(e){e.oninput=function(){pl.items[+e.dataset.pi][e.dataset.f]=e.value}});$$('[data-pdel]').forEach(function(b){b.onclick=function(){pl.items.splice(+b.dataset.pdel,1);render()}});
 $('#pprob').onchange=function(){pl.probio=this.checked};$('#pctrl').oninput=function(){pl.ctrl=this.value};$('#pnote').oninput=function(){pl.note=this.value}}
// 2. CENTYLE
R.centyle=function(k){var h='<h2>Siatki centylowe</h2>'+need(k,['age','sex']);if(!k.age||!k.sex)return h;
 var mo=k.gmo;if(k.corr)h+='<div class="mut">Użyto wieku skorygowanego ('+k.corr.txt+').</div>';
 var hc=ST.hc||'';h+='<div class="row"><label>Obwód głowy <input id="hc" inputmode="decimal" value="'+hc+'"> cm</label></div>';
 var it=[['wfa','Masa',k.w,'kg'],['lhfa',mo<24?'Długość':'Wzrost',k.h,'cm'],['bmi','BMI',k.bmi,'kg/m²'],['hcfa','Obwód głowy',P.num(hc),'cm']];
 h+='<div class="grid">';it.forEach(function(x){if(!(x[2]>0))return;if(x[0]==='hcfa'&&mo>60){h+=box('','<h3>'+x[1]+'</h3>norma WHO tylko do 5 r.ż.');return}
  if(x[0]==='bmi'&&mo<0)return;var g=P.growth(LMS,x[0],k.sex,Math.max(0,mo),x[2]);if(!g){h+=box('','<h3>'+x[1]+'</h3>poza zakresem tabel');return}var f=P.growthFlag(x[0],g,mo);
  var p3=P.lmsX(-1.881,g.L,g.M,g.S),p97=P.lmsX(1.881,g.L,g.M,g.S);
  h+=box(f[0],'<h3>'+x[1]+': '+P.r(x[2],1)+' '+x[3]+'</h3><div class="big">'+(g.c<0.1?'<0,1':g.c>99.9?'>99,9':P.r(g.c,1))+' c <span class="mut">SDS '+P.r(g.z,2)+'</span></div><div>'+f[1]+' · 3 c = '+P.r(p3,1)+', 50 c = '+P.r(g.M,1)+', 97 c = '+P.r(p97,1)+'</div>'+src(g.src+' – metoda LMS'))});
 h+='</div>';if(mo>60)h+=box('orange','<b>Siatki OLAF/OLA (Polska, 3–18 l.)</b> nie są wbudowane – brak publicznych tabel LMS. Powyżej 5 r.ż. użyto CDC 2000. <span class="dw">DO WERYFIKACJI</span> z siatkami OLAF w dokumentacji.');
 if(k.preterm&&mo<24)h+='<div class="mut">Wcześniak: centyle wg wieku skorygowanego do 24 mies.</div>';return h};
R.centyle.bind=function(){var e=$('#hc');if(e)e.onchange=function(){ST.hc=this.value;render()}};
// 3. BILANSE
R.bilans=function(k){var h='<h2>Bilanse zdrowia</h2>',sel=ST.bil;if(sel==null){sel=0;if(k.age){BIL.forEach(function(b,i){if(k.age.days>=b.a[0]-20)sel=i})}}
 h+='<div class="drugs">'+BIL.map(function(b,i){return '<button data-b="'+i+'" class="'+(i==sel?'on':'')+'">'+b.k+'</button>'}).join('')+'</div>';var b=BIL[sel];
 var ck=function(a,t){return '<h3>'+t+'</h3>'+a.map(function(x){return '<label style="display:block;font-weight:500"><input type="checkbox">'+esc(x)+'</label>'}).join('')};
 h+='<div class="grid">'+box('',ck(b.ms,'Kamienie milowe'))+box('',ck(b.sc,'Badania / przesiewy'))+box('',ck(b.doc,'Do dokumentacji'))+'</div>';
 if(k.w>0||k.h>0)h+=box('','Pomiary: masa '+(k.w||'—')+' kg, wzrost '+(k.h||'—')+' cm'+(k.bmi?', BMI '+P.r(k.bmi,1):'')+' – centyle w module „Siatki centylowe”.');
 h+=bilNext(sel)+'<button class="pbtn" id="pr">🖨 Drukuj kartę bilansu</button>'+src(BIL_SRC);ST._bsel=sel;return h};
R.bilans.bind=function(k){$$('[data-b]').forEach(function(b){b.onclick=function(){ST.bil=+b.dataset.b;render()}});var bn=$('#bnd');if(bn)bn.onchange=function(){ST.bnd=this.value};$('#pr').onclick=function(){var b=BIL[ST._bsel],t=function(a,n){return '<tr><th>'+n+'</th><td>'+a.map(function(x){return (x.checked?'☑ ':'☐ ')+esc(x.t)}).join('<br>')+'</td></tr>'};
 var cbs=$$('#main .box input[type=checkbox]'),i=0,map=function(a){return a.map(function(x){return {t:x,checked:cbs[i++].checked}})};var A=map(b.ms),B=map(b.sc),Cc=map(b.doc);
 $('#printArea').innerHTML='<h1>Bilans zdrowia – '+b.k+'</h1><p>Data: '+today()+' · dziecko ur. '+(C.dob||'……')+' · wiek '+(k.age?P.ageTxt(k.age):'……')+' · masa '+(k.w||'…')+' kg · wzrost '+(k.h||'…')+' cm'+(k.bmi?' · BMI '+P.r(k.bmi,1):'')+'</p><p>Imię i nazwisko: ……………………………………</p><table>'+t(A,'Kamienie milowe')+t(B,'Badania')+t(Cc,'Dokumentacja')+'<tr><th>Uwagi / zalecenia</th><td style="height:35mm"></td></tr>'+(ST._nb?'<tr><th>Następny bilans</th><td><b>'+esc(ST._nb.k)+'</b>'+((ST.bnd||ST._nb.from)?' – termin: <b>'+pd(ST.bnd||ST._nb.from)+'</b> ('+dow(ST.bnd||ST._nb.from)+')'+(ST._nb.to?' · okno do '+pd(ST._nb.to):''):'')+'</td></tr>':'')+'</table>'+pEmg()+pSig()+'<p style="font-size:8pt">'+esc(BIL_SRC)+' · Pediatria POZ v'+VER+'</p>';window.print()}};
// 4. SZCZEPIENIA
R.szczep=function(k){var s=ST.vx=ST.vx||{v:'6w1',done:{}},h='<h2>Szczepienia – PSO 2026</h2>'+need(k,['age']);if(!k.dob)return h;
 h+='<div class="row"><label>Wariant <select id="vv"><option value="6w1">6w1 (DTaP-IPV-Hib-HBV) 3+1</option><option value="5w1">5w1 (DTaP-IPV-Hib) + WZW B</option><option value="pod">podstawowy (DTwP, Hib, IPV osobno)</option></select></label><button class="tg" id="vall">✓ zaznacz wszystkie do dziś</button></div>';
 var L=P.vaxStatus(C.dob,today(),s.v,s.done),lab={done:'✅ wykonane',due:'🟠 należy się teraz',overdue:'🔴 zaległe',future:'⏳ później',blocked:'⏸ po wcześniejszej dawce',late:'⛔ za późno (limit wieku)'};
 var nO=L.filter(function(x){return x.st==='overdue'}).length,nD=L.filter(function(x){return x.st==='due'}).length;
 h+=box(nO?'red':nD?'orange':'ok','<b>'+(nO?nO+' zaległe':'')+(nO&&nD?' · ':'')+(nD?nD+' do wykonania teraz':'')+(!nO&&!nD?'Brak zaległości wg zaznaczonych dawek':'')+'</b>');
 h+='<table class="t"><tr><th>✓</th><th>Szczepienie</th><th>Status</th><th>Najwcześniej / wykonano</th><th>Zalecany wiek</th></tr>'+L.map(function(x){return '<tr class="'+x.st+'"><td><input type="checkbox" data-v="'+x.id+'"'+(s.done[x.id]?' checked':'')+'></td><td>'+esc(x.n)+(x.note?'<div class="mut">'+esc(x.note).replace(/DO WERYFIKACJI/,'<span class="dw">DO WERYFIKACJI</span>')+'</div>':'')+'</td><td>'+lab[x.st]+'</td><td>'+(x.st==='done'?'<input type="date" data-vd="'+x.id+'" value="'+(s.done[x.id]===true?'':s.done[x.id])+'">':pd(x.date))+'</td><td class="mut">'+pd(x.recFrom)+' – '+pd(x.recTo)+'</td></tr>'}).join('')+'</table>';
 h+=vaxBox(L);
 h+=box('','<h3>Nadrabianie – minimalne odstępy</h3>DTP/DTaP pierwotne: ≥4 tyg.; 3.→4. dawka ≥6 mies. · PCV (2+1): ≥8 tyg., dawka przypominająca po 12. mies. · IPV ≥4–8 tyg. · WZW B: 1→2 ≥4 tyg., 2→3 ≥8 tyg. (3. dawka ≥16 tyg. od 1.) · MMR 1→2 ≥4 tyg. · RV: 1. dawka do 12 tyg., schemat do 24 (Rotarix) / 32 tyg. (RotaTeq) · Szczepionki żywe: razem lub ≥4 tyg. odstępu.<br>Zalecane (PSO II.A): grypa (od 6 mies.), meningokoki B i ACWY, ospa wietrzna (bezpłatnie w grupach ryzyka), HPV 9–14 l. (bezpłatnie w programie), COVID-19, WZW A, kleszczowe zap. mózgu.'+src('PSO 2026 – Komunikat GIS z 31.10.2025 (Dz. Urz. MZ 2025 poz. 85). Odstępy minimalne – DO WERYFIKACJI w ChPL konkretnej szczepionki'));
 h+=box('','<h3>Przeciwwskazania (skrót)</h3>Trwałe: ciężka reakcja anafilaktyczna po poprzedniej dawce / składniku · encefalopatia ≤7 dni po szczepionce z krztuścem (bez innej przyczyny). Żywe (MMR, VZV, RV, BCG): ciężki niedobór odporności, immunosupresja (prednizon ≥2 mg/kg lub ≥20 mg/d ≥14 dni), ciąża; RV – wgłobienie w wywiadzie, SCID. Odroczenie: ostra choroba z gorączką lub umiarkowany/ciężki stan. <b>Nie są</b> przeciwwskazaniem: katar, łagodna infekcja bez gorączki, antybiotykoterapia, wcześniactwo, alergia nie na składnik szczepionki.'+src('PSO 2026 cz. IV; Zalecenia ACIP General Best Practice'));return h};
R.szczep.bind=function(k){var s=ST.vx;if(!s)return;var vv=$('#vv');vv.value=s.v;vv.onchange=function(){s.v=this.value;s.done={};render()};
 $$('[data-v]').forEach(function(c){c.onchange=function(){if(c.checked)s.done[c.dataset.v]=true;else delete s.done[c.dataset.v];render()}});
 $$('[data-vd]').forEach(function(c){c.onchange=function(){s.done[c.dataset.vd]=c.value||true;render()}});
 var e=$('#vnd');if(e){e.onchange=function(){s.nd=this.value;render()};$('#vnh').oninput=function(){s.nh=this.value};$('#vpr').onclick=function(){vaxPrint(k)}}
 $('#vall').onclick=function(){P.vaxStatus(C.dob,today(),s.v,{}).forEach(function(x){if(x.st!=='future'&&x.st!=='late')s.done[x.id]=true});render()}};
// 5. INFEKCJE
R.infek=function(k){var t=ST.it||'nice',h='<h2>Gorączka i infekcje</h2><div class="drugs">'+[['nice','Gorączka <5 l. (NICE)'],['cen','Angina – McIsaac'],['aom','OZUŚ'],['krup','Krup – Westley'],['pneu','Zapalenie płuc'],['uti','ZUM']].map(function(x){return '<button data-t="'+x[0]+'" class="'+(t===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>';
 var v=ST.iv=ST.iv||{};
 if(t==='nice'){var cols=['g1','y1','r1'],sel=v.nice||{};h+='<table class="t ntl"><tr><th></th><th>🟢 niskie ryzyko</th><th>🟡 pośrednie</th><th>🔴 wysokie</th></tr>'+NICE.items.map(function(it,i){return '<tr><th>'+it[0]+'</th>'+[1,2,3].map(function(j){return '<td class="'+cols[j-1]+'"><label><input type="radio" name="n'+i+'" value="'+j+'"'+(sel[i]==j?' checked':'')+'>'+esc(it[j])+'</label></td>'}).join('')+'</tr>'}).join('')+'</table>';
  var mx=Math.max.apply(null,[0].concat(Object.keys(sel).map(function(x){return +sel[x]})));if(k.age&&k.mo<3)mx=Math.max(mx,3);
  h+=mx?box(mx===3?'red':mx===2?'orange':'ok',mx===3?'<b>🔴 Wysokie ryzyko ciężkiej choroby</b> – pilne skierowanie do szpitala':mx===2?'<b>🟡 Ryzyko pośrednie</b> – ocena twarzą w twarz, siatka bezpieczeństwa lub skierowanie, rozważ badania (CRP, mocz)':'<b>🟢 Niskie ryzyko</b> – leczenie w domu, informacja dla rodziców'):'';h+=src(NICE.src)}
 if(t==='cen'){var c=v.cen||{};h+='<div class="box">'+[['t','Temperatura >38 °C'],['noCough','Brak kaszlu'],['nodes','Bolesne, powiększone węzły szyjne przednie'],['exud','Obrzęk/wysięk na migdałkach']].map(function(x){return '<label style="display:block"><input type="checkbox" data-c="'+x[0]+'"'+(c[x[0]]?' checked':'')+'>'+x[1]+'</label>'}).join('')+'</div>';
  var age=isNaN(k.y)?10:k.y,r=P.mcisaac({t:c.t,noCough:c.noCough,nodes:c.nodes,exud:c.exud,age:age});h+=box(r.lvl,'<div class="big">'+r.s+' pkt</div>'+r.txt+'<div class="mut">Wiek '+(k.age?'z paska':'– brak, przyjęto 3–14 l.')+' (+1 pkt). <3 l. – paciorkowcowe zapalenie rzadkie. Leczenie: fenoksymetylpenicylina lub amoksycylina 10 dni; alergia – cefadroksyl / makrolid.</div>'+src('Rekomendacje NPOA 2016 (skala Centora w modyfikacji McIsaaca)'))}
 if(t==='aom'){var a=v.aom||{};h+='<div class="box">'+[['bilat','Obustronne OZUŚ'],['otorrhea','Wyciek z ucha'],['severe','Ciężki przebieg: T ≥39 °C, silny ból >48 h, zły stan ogólny']].map(function(x){return '<label style="display:block"><input type="checkbox" data-a="'+x[0]+'"'+(a[x[0]]?' checked':'')+'>'+x[1]+'</label>'}).join('')+'</div>';
  if(!k.age)h+=need(k,['age']);else{var r2=P.aom({mo:k.mo,bilat:a.bilat,otorrhea:a.otorrhea,severe:a.severe});h+=box(r2.lvl,'<b>'+r2.txt+'</b><div>Lek 1. rzutu: amoksycylina 75–90 mg/kg/d w 2 dawkach (moduł Dawki). Czas: <b>'+P.aomDays(k.mo,a.severe)+' dni</b>. Niepowodzenie po 48–72 h: amoksycylina+klawulanian 14:1 (90 mg/kg/d) / cefuroksym.</div>'+src('Rekomendacje NPOA 2016; Polskie zalecenia OZUŚ 2019 – DO WERYFIKACJI aktualizacji 2023'))}}
 if(t==='krup'){var w=v.kr||{},F=[['str','Stridor',[['0','brak'],['1','przy pobudzeniu'],['2','w spoczynku']]],['ret','Zaciąganie',[['0','brak'],['1','łagodne'],['2','umiarkowane'],['3','ciężkie']]],['air','Wejście powietrza',[['0','prawidłowe'],['1','osłabione'],['2','znacznie osłabione']]],['cyan','Sinica',[['0','brak'],['4','przy pobudzeniu'],['5','w spoczynku']]],['cons','Świadomość',[['0','prawidłowa'],['5','zaburzona']]]];
  h+='<div class="grid">'+F.map(function(f){return '<label>'+f[1]+' <select data-k="'+f[0]+'">'+f[2].map(function(o){return '<option value="'+o[0]+'"'+(w[f[0]]==o[0]?' selected':'')+'>'+o[0]+' – '+o[1]+'</option>'}).join('')+'</select></label>'}).join('')+'</div>';var r3=P.westley(w);h+=box(r3.lvl,'<div class="big">'+r3.s+' pkt</div>'+r3.txt+(k.w>0?'<div>Deksametazon dla '+k.w+' kg: 0,15 mg/kg = <b>'+P.r(Math.min(10,0.15*k.w),1)+' mg</b>; 0,6 mg/kg = <b>'+P.r(Math.min(10,0.6*k.w),1)+' mg</b> (max 10 mg)</div>':'')+src('Skala Westleya (1978); postępowanie: Rekomendacje NPOA / NICE CKS Croup'))}
 if(t==='pneu'){h+=box('','<h3>Objawy ciężkie – rozważ szpital</h3>'+PNEU.red.map(function(x){return '<label style="display:block"><input type="checkbox">'+esc(x)+'</label>'}).join('')+(k.age?'<div>Tachypnoe dla wieku: RR > '+(k.mo<2?60:k.mo<12?50:k.y<5?40:30)+'/min (WHO)</div>':'')+src(PNEU.src))}
 if(t==='uti'){h+=box('','<ul>'+UTI.pts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+src(UTI.src))}
 return h};
R.infek.bind=function(){var v=ST.iv;$$('[data-t]').forEach(function(b){b.onclick=function(){ST.it=b.dataset.t;render()}});
 $$('.ntl input').forEach(function(r){r.onchange=function(){v.nice=v.nice||{};v.nice[r.name.slice(1)]=r.value;render()}});
 $$('[data-c]').forEach(function(c){c.onchange=function(){v.cen=v.cen||{};v.cen[c.dataset.c]=c.checked;render()}});
 $$('[data-a]').forEach(function(c){c.onchange=function(){v.aom=v.aom||{};v.aom[c.dataset.a]=c.checked;render()}});
 $$('[data-k]').forEach(function(c){c.onchange=function(){v.kr=v.kr||{};v.kr[c.dataset.k]=c.value;render()}})};
// 6. ODWODNIENIE
R.odw=function(k){var c=ST.cds=ST.cds||{},F=[['a','Wygląd ogólny',['prawidłowy','spragniony, niespokojny / senny, drażliwy','senny, wiotki, zimny, spocony; może być nieprzytomny']],['e','Gałki oczne',['prawidłowe','lekko zapadnięte','bardzo zapadnięte']],['m','Błony śluzowe (język)',['wilgotne','„lepkie”','suche']],['t','Łzy',['są','zmniejszone','brak']]];
 var h='<h2>Odwodnienie</h2><div class="grid">'+F.map(function(f){return '<label>'+f[1]+' <select data-o="'+f[0]+'">'+f[2].map(function(o,i){return '<option value="'+i+'"'+(c[f[0]]==i?' selected':'')+'>'+i+' – '+o+'</option>'}).join('')+'</select></label>'}).join('')+'</div>';
 var r=P.cds(c);h+=box(r.lvl,'<div class="big">CDS '+r.s+'/8</div>'+r.txt+src('Clinical Dehydration Scale (Friedman 2004); ESPGHAN/ESPID 2014'));
 h+=need(k,['w']);if(k.w>0){var o=P.ors(k.w),hs=P.holliday(k.w);
  h+=box('','<h3>Nawadnianie doustne (ORS, niskoosmolarny)</h3>w ciągu 4 h: <b>'+P.r(o.lo,0)+'–'+P.r(o.hi,0)+' ml</b> (50–100 ml/kg) ≈ <b>'+P.r(o.lo/4,0)+'–'+P.r(o.hi/4,0)+' ml/h</b>, po 5–10 ml co 1–2 min<br>+ uzupełnianie strat: <b>'+P.r(10*k.w,0)+' ml</b> po każdym luźnym stolcu, <b>'+P.r(2*k.w,0)+' ml</b> po wymiotach'+src('ESPGHAN/ESPID 2014; WHO'))+
  box('','<h3>Zapotrzebowanie podstawowe (Holliday-Segar 4-2-1)</h3><b>'+P.r(hs.day,0)+' ml/d</b> = <b>'+P.r(hs.h,0)+' ml/h</b>'+src('Holliday & Segar 1957 (100/50/20 ml/kg/d)'))}return h};
R.odw.bind=function(){$$('[data-o]').forEach(function(c){c.onchange=function(){ST.cds[c.dataset.o]=+c.value;render()}})};
// 7. ŻYWIENIE
function zywBase(k){var h='<h2>Żywienie niemowląt</h2>'+need(k,['age','w']);if(!k.age||!(k.w>0))return h;
 if(k.mo<12){var f=P.formula({w:k.w,ageDays:k.age.days});h+=box('','<h3>Mleko modyfikowane</h3><div class="big">'+f.per+' ml × '+f.feeds+'/d</div>dobowo ok. <b>'+f.day+' ml</b> · '+f.note+src('ESPGHAN / PTGHiŻD – Schemat żywienia niemowląt 2021 (orientacyjnie)'))}
 h+=box('','<h3>Witamina D</h3><b>'+P.vitD({mo:k.mo,preterm:k.preterm})+'</b>'+src('Płudowski i wsp. Wytyczne profilaktyki i leczenia niedoboru wit. D w Polsce 2023'));
 if(k.mo<4)h+=box('','<h3>Witamina K</h3>Po urodzeniu 0,5–1 mg i.m. Dzieci karmione piersią: <b>25 µg/d p.o.</b> od 8. dnia do 12. tyg. życia (mleko modyfikowane – nie wymaga) <span class="dw">DO WERYFIKACJI</span> wg aktualnego stanowiska PTN/PTP'+src('Stanowisko PTN 2016 – profilaktyka krwawienia z niedoboru wit. K'));
 h+=box('','<h3>Rozszerzanie diety</h3>Od 17. tyg. (nie później niż 26. tyg.); gluten w 4–12 mies.; alergeny (jajo, orzeszki) bez opóźniania; mleko krowie jako napój po 12 mies.; bez soli i cukru; żelazo – mięso/żółtko od początku.'+src('Schemat żywienia niemowląt PTGHiŻD 2021'));return h};
R.zyw=function(k){return zywBase(k)+allergy(k)};
// 8. NORMY
R.normy=function(k){var h='<h2>Normy dla wieku</h2>'+need(k,['age']);if(!k.age)return h;var v=P.vitals(k.y);
 h+='<div class="grid">'+box('','<h3>Tętno</h3><div class="big">'+v.hr.join('–')+'/min</div>')+box('','<h3>Oddechy</h3><div class="big">'+v.rr.join('–')+'/min</div>')+box('','<h3>Ciśnienie skurczowe</h3><div class="big">'+v.sbp.join('–')+' mmHg</div><div class="mut">hipotensja: SBP < '+(k.y<1?70:k.y<10?Math.round(70+2*k.y):90)+'</div>')+box('','<h3>SpO₂</h3><div class="big">≥95%</div><div class="mut">&lt;92% – skierowanie</div>')+box('','<h3>Sen</h3><div class="big">'+P.sleep(k.y)+'</div>'+src('AASM 2016'))+'</div>'+src('APLS 6th ed. (zakresy prawidłowe); hipotensja: PALS');
 var b=ST.bp||{};h+=box('','<h3>Ciśnienie tętnicze – przesiew (≥1 r.ż.)</h3><div class="row"><label>SBP <input id="bs" inputmode="numeric" value="'+(b.s||'')+'"></label><label>DBP <input id="bd" inputmode="numeric" value="'+(b.d||'')+'"></label></div><div id="bpr"></div>'+src('AAP Clinical Practice Guideline 2017 (Flynn), Table 6 – uproszczona tabela przesiewowa; pełna klasyfikacja wg centyla wzrostu (Table 4/5) – DO WERYFIKACJI w tabelach AAP'));return h};
R.normy.bind=function(k){var e=$('#bs');if(!e)return;var f=function(){ST.bp={s:$('#bs').value,d:$('#bd').value};var s=P.num(ST.bp.s),d=P.num(ST.bp.d);if(!(s>0&&d>0)){$('#bpr').innerHTML='';return}var r=P.bp(k.y,k.sex||'m',s,d);
 $('#bpr').innerHTML=r?'<b class="'+(r.lvl==='red'?'r':r.lvl==='orange'?'o':'g')+'">'+r.txt+'</b> <span class="mut">(próg '+r.thr+')</span>':'<span class="mut">&lt;1 r.ż. – brak tabeli</span>'};e.oninput=f;$('#bd').oninput=f;f()};
// ================= v1.1 =================
function escA(s){return esc(s).replace(/"/g,'&quot;')}
function dow(s){return ['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'][P.D(s).getUTCDay()]}
var EMG='W sytuacjach nagłych natychmiast wezwij pogotowie (112 lub 999) i jednocześnie zadzwoń do lekarza prowadzącego: +48 607 380 545.';
function pEmg(){return '<div class="pemg">☎ '+EMG+'</div>'}
var DOC='Lekarz prowadzący',TEL='+48 607 380 545';
function pKid(k){return '<table class="pk"><tr><td><b>Dziecko:</b> ……………………………………………………</td><td><b>ur.:</b> '+(C.dob?pd(C.dob):'……………')+'</td><td><b>wiek:</b> '+(k.age?P.ageTxt(k.age):'……')+'</td><td><b>masa:</b> '+(k.w>0?k.w+' kg':'…… kg')+'</td></tr></table>'}
function pHead(t,sub){return '<div class="ph"><div><h1>'+t+'</h1>'+(sub?'<div class="phs">'+sub+'</div>':'')+'</div><div class="phr">Data: <b>'+pd(today())+'</b></div></div>'}
function pSig(){return '<div class="sig"><div>Data: ……………………</div><div>Podpis lekarza:<br><br>……………………………………</div><div class="stamp">pieczątka lekarza</div></div>'}
function pFoot(){return '<div class="pf">Pediatria POZ v'+VER+' · narzędzie pomocnicze – zalecenia ustalił i zweryfikował lekarz</div>'}
function doPrint(html){$('#printArea').innerHTML=html;window.print()}
function nWord(n){return n===1?'dawka':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'dawki':'dawek'}
// ---- plan dla rodzica (moduł leków) ----
function planItem(k){var s=ST.leki,d=DRUGS.list.filter(function(x){return x.id===s.d})[0],pr=d.prod[s.p],rg=d.reg[s.g];
 var pt={w:k.w,mo:isNaN(k.mo)?120:k.mo,y:isNaN(k.y)?10:k.y,preterm:k.preterm},r=DRUGS.calc(P,d,pr,rg,pt);if(!r.doseTxt)return null;
 var pa=PAR[d.id]||{},single=r.nd===1&&/1 dawka|jednoraz/i.test(rg.days||''),prn=!!pa.prn,maxN=prn?pa.maxN:r.nd;
 var mx=single?'jednorazowo':'maks. '+maxN+' '+nWord(maxN)+' na dobę'+(r.ml&&prn?' (łącznie '+P.roundMl(r.ml*maxN)+' ml)':'');
 return {id:d.id,n:d.n,prod:pr.n,qty:(r.qty?r.qty+' ('+r.doseTxt+')':r.doseTxt),sched:P.parSched(d.id,r.nd,prn,single),days:prn?'do ustąpienia gorączki/bólu (maks. 3 dni bez kontaktu z lekarzem)':(r.days||''),max:mx,how:pa.how||'',abx:d.grp==='Antybiotyki'}}
function planHtml(){var pl=ST.plan,I=pl.items,ab=I.some(function(x){return x.abx});var pb=pl.probio==null?ab:pl.probio;
 var h='<div class="box par"><h3>📄 Wydruk dla rodzica – plan leczenia</h3><div class="row"><button class="pbtn" id="padd">➕ Dodaj ten lek do planu</button><button class="pbtn pr2" id="pprint">🖨 Wydruk dla rodzica</button>'+(I.length?'<button class="tg" id="pclr">wyczyść plan</button>':'')+'</div>';
 if(I.length)h+='<table class="t pl"><tr><th>Lek</th><th>Ile podać</th><th>Kiedy / jak często</th><th>Jak długo</th><th></th></tr>'+I.map(function(x,i){return '<tr><td><b>'+esc(x.n)+'</b><div class="mut">'+esc(x.prod)+'</div></td><td><input data-pi="'+i+'" data-f="qty" value="'+escA(x.qty)+'"></td><td><input data-pi="'+i+'" data-f="sched" value="'+escA(x.sched)+'"></td><td><input data-pi="'+i+'" data-f="days" value="'+escA(x.days)+'"></td><td><button class="tg" data-pdel="'+i+'">✕</button></td></tr>'}).join('')+'</table>';
 else h+='<div class="mut">Plan jest pusty – „Wydruk dla rodzica” wydrukuje bieżący lek. Dodaj kolejne leki, aby wydrukować wszystkie na jednej kartce. Pola w tabeli można poprawiać.</div>';
 h+='<div class="row"><label><input type="checkbox" id="pprob"'+(pb?' checked':'')+'> zalecić probiotyk (LGG / S. boulardii)</label><label>Kontrola, jeśli brak poprawy po <input id="pctrl" value="'+escA(pl.ctrl)+'" style="width:7em"></label></div>';
 h+='<label style="display:block;font-weight:700">Dodatkowe zalecenia <textarea id="pnote" rows="2" style="width:100%">'+esc(pl.note)+'</textarea></label>'+src(PROBIO_SRC)+'</div>';return h}
function planPrint(k){var pl=ST.plan,I=pl.items.length?pl.items:[planItem(k)].filter(Boolean);if(!I.length){alert('Podaj masę ciała, aby obliczyć dawkę.');return}
 var ab=I.some(function(x){return x.abx}),pb=pl.probio==null?ab:pl.probio,fev=I.some(function(x){return x.id==='para'||x.id==='ibu'});
 var h=pHead('Zalecenia dla rodzica / opiekuna','Plan podawania leków')+pKid(k);
 h+='<table class="pt"><tr><th style="width:24%">Lek</th><th style="width:17%">Ile podać (1 dawka)</th><th style="width:25%">Kiedy i jak często</th><th style="width:14%">Jak długo</th><th>Jak podawać</th></tr>'+I.map(function(x){return '<tr><td><b>'+esc(x.n)+'</b><br><small>'+esc(x.prod)+'</small></td><td class="q">'+esc(x.qty)+'</td><td>'+esc(x.sched)+'<br><small><b>'+esc(x.max)+'</b></small></td><td>'+esc(x.days)+'</td><td><small>'+esc(x.how)+'</small></td></tr>'}).join('')+'</table>';
 var L=[];if(ab)L.push('<b>Antybiotyk podawaj do końca zaleconego czasu</b>, nawet jeśli dziecko szybko poczuje się lepiej. Nie zostawiaj resztek „na później”. Pominiętą dawkę podaj jak najszybciej; nie podawaj podwójnej dawki.');
 if(pb)L.push(PROBIO.replace(/^Probiotyk/,'<b>Probiotyk</b>'));
 if(fev)L.push('<b>Gorączka:</b> lek podawaj, gdy dziecko źle się czuje lub temperatura ≥38,5 °C – celem jest komfort dziecka, nie „zbicie” gorączki do zera. Paracetamol – nie częściej niż co 6 h (min. 4 h), maks. 4 dawki/dobę; ibuprofen – co 6–8 h, maks. 3 dawki/dobę. Nie podawaj obu leków jednocześnie; zmień lek tylko, jeśli po 2–3 h od pierwszego gorączka i złe samopoczucie się utrzymują – <b>zapisuj godziny podania</b>. Dużo pić; lekkie ubranie.');
 L.push('Odmierzaj płyny <b>strzykawką lub miarką z opakowania</b> (nie łyżeczką kuchenną). Przechowuj leki poza zasięgiem dzieci.');
 if(pl.note)L.push(esc(pl.note));
 h+='<ul class="pl2">'+L.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
 h+='<div class="pbox"><b>Kontrola:</b> jeśli po <b>'+esc(pl.ctrl||'48–72 h')+'</b> leczenia nie ma poprawy (gorączka się utrzymuje, dziecko je i pije gorzej, pojawiają się nowe objawy) – zgłoś się na wizytę kontrolną. Termin kontroli: ……………………… godz. ………</div>';
 h+='<div class="pred"><b>🚑 NATYCHMIAST jedź na SOR (szpitalny oddział ratunkowy) lub dzwoń 112, gdy:</b><ul>'+SOR.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>';
 h+='<div class="pbox"><b>Pytania i pogorszenie stanu w godzinach pracy przychodni:</b> '+DOC+', tel. <b>'+TEL+'</b>. Wieczorem, w nocy i w święta – nocna i świąteczna opieka zdrowotna; w stanie zagrożenia życia – 112.</div>';
 doPrint(h+pEmg()+pSig()+pFoot())}
// ---- przypomnienie o szczepieniu ----
function vaxBox(L){var nv=P.nextVax(L,today()),s=ST.vx;if(!nv)return box('ok','<h3>🗓 Najbliższe szczepienie</h3>Brak kolejnych szczepień obowiązkowych w kalendarzu.');
 var dt=s.nd||nv.date;s._nv=nv;
 return box('','<h3>🗓 Najbliższe szczepienie – przypomnienie dla rodzica</h3><div>'+nv.items.map(function(x){return '• '+esc(x.n)}).join('<br>')+'</div><div class="row"><label>Termin <input type="date" id="vnd" value="'+dt+'"></label><label>godz. <input id="vnh" value="'+escA(s.nh||'')+'" placeholder="np. 10:30" style="width:6em"></label><span class="mut">'+(nv.now?'należy się już teraz':'najwcześniej / zalecane od '+pd(nv.date))+' · '+dow(dt)+'</span><button class="pbtn" id="vpr">🖨 Drukuj przypomnienie</button></div>')}
function vaxPrint(k){var s=ST.vx,nv=s._nv,dt=s.nd||nv.date;
 var h=pHead('Przypomnienie o szczepieniu dziecka')+pKid(k)+'<div class="big2">Termin: <b>'+pd(dt)+'</b> ('+dow(dt)+')'+(s.nh?', godz. <b>'+esc(s.nh)+'</b>':', godz. ………')+'</div>';
 h+='<div class="pbox"><b>Szczepienie:</b><ul>'+nv.items.map(function(x){return '<li>'+esc(x.n)+'</li>'}).join('')+'</ul></div>';
 h+='<ul class="pl2"><li>Zabierz <b>książeczkę zdrowia dziecka</b> (i kartę szczepień, jeśli jest osobno).</li><li>Szczepimy dziecko zdrowe. Katar bez gorączki zwykle <b>nie</b> jest przeszkodą. Jeśli dziecko ma gorączkę lub jest chore – zadzwoń, aby przełożyć termin.</li><li>Po szczepieniu zostań w przychodni ok. 15–30 minut.</li><li>Po szczepieniu może wystąpić gorączka, rozdrażnienie, zaczerwienienie lub obrzęk w miejscu wkłucia – zwykle mija w 1–3 dni. Przy gorączce można podać paracetamol (dawka według masy ciała).</li></ul>';
 h+='<div class="pbox">Zmiana terminu / pytania: '+DOC+', tel. <b>'+TEL+'</b></div>';doPrint(h+pEmg()+pSig()+pFoot())}
// ---- następny bilans ----
function bilNext(sel){var nb=P.nextBilans(BIL,sel,C.dob,today());ST._nb=nb;if(!nb)return box('','<h3>Następny bilans</h3>To ostatni bilans – przekazanie do POZ dla dorosłych.');
 return box('ok','<h3>📅 Następny bilans: '+esc(nb.k)+'</h3>'+(nb.from?'termin od <b>'+pd(nb.from)+'</b> do <b>'+pd(nb.to)+'</b> <span class="mut">('+dow(nb.from)+')</span>':'<span class="mut">podaj datę urodzenia, aby obliczyć termin</span>')+'<div class="row"><label>Umówiony termin <input type="date" id="bnd" value="'+(ST.bnd||nb.from||'')+'"></label></div>')}
// ---- objawy alarmowe: syrena i światło (TYLKO w tym module) ----
var SIR=null;
function sirenStart(){if(SIR)return;try{var A=window.AudioContext||window.webkitAudioContext;if(!A)return;var c=new A(),o=c.createOscillator(),g=c.createGain();o.type='sawtooth';g.gain.value=0.18;o.connect(g);g.connect(c.destination);o.frequency.value=650;o.start();
 var cyc=function(){var t=c.currentTime;o.frequency.cancelScheduledValues(t);o.frequency.setValueAtTime(650,t);o.frequency.linearRampToValueAtTime(1350,t+0.8);o.frequency.linearRampToValueAtTime(650,t+1.6)};cyc();SIR={c:c,o:o,i:setInterval(cyc,1600)};if(c.state==='suspended')c.resume()}catch(e){SIR=null}window.__siren=!!SIR}
function sirenStop(){if(SIR){clearInterval(SIR.i);try{SIR.o.stop();SIR.c.close()}catch(e){}SIR=null}window.__siren=false}
function beacon(on){document.body.classList.toggle('alarmOn',!!on);var b=$('#beacon');if(on&&!b){b=document.createElement('div');b.id='beacon';b.innerHTML='🚨 PILNE SKIEROWANIE DO SZPITALA 🚨';document.body.appendChild(b)}if(!on&&b)b.remove()}
function alarmSync(){var a=ST.al,on=a&&cur==='alarm'&&Object.keys(a.c).some(function(x){return a.c[x]});beacon(on);if(on&&!a.mute)sirenStart();else sirenStop()}
R.alarm=function(k){var a=ST.al=ST.al||{c:{},v:{},mute:false},n=Object.keys(a.c).filter(function(x){return a.c[x]}).length,grp='';
 var h='<h2>Objawy alarmowe – pilne skierowanie do szpitala</h2><div class="mut">Zaznacz objawy. Jeden zaznaczony objaw = pilny transport do szpitala (sygnał dźwiękowy i świetlny działa tylko w tym module, także offline).</div><div class="box red emg"><b>☎ '+EMG+'</b></div><div class="box alr">';
 ALARM.forEach(function(x,i){if(x[0]!==grp){grp=x[0];h+='<div class="dg">'+grp+'</div>'}h+='<label class="al"><input type="checkbox" data-al="'+i+'"'+(a.c[i]?' checked':'')+'> '+esc(x[1])+'</label>'});h+='</div>';
 if(n){var w=k.w>0?k.w:0;h+='<div class="box red flash"><div class="big r">🚨 PILNE SKIEROWANIE DO SZPITALA ('+n+')</div><ol>'+
  '<li><b>Transport sanitarny przychodni w trybie pilnym – z włączonymi sygnałami dźwiękowymi i świetlnymi</b>, z opiekunem i dokumentacją.</li>'+
  '<li>Bezpośrednie zagrożenie życia (zatrzymanie oddechu/krążenia, niedrożność dróg oddechowych, wstrząs bez reakcji na leczenie) lub transport niedostępny od ręki → <b>112 / Zespół Ratownictwa Medycznego</b>.</li>'+
  '<li>Do czasu przekazania: ocena ABCDE, pozycja dogodna dla dziecka, tlen (cel SpO₂ 94–98%), glikemia, nie podawać doustnie przy zaburzeniach świadomości.</li>'+
  (w?'<li>Dawki ratunkowe dla '+w+' kg: adrenalina i.m. (1 mg/ml) <b>'+P.r(Math.min(0.5,0.01*w),2)+' mg = '+P.r(Math.min(0.5,0.01*w),2)+' ml</b> (0,01 mg/kg, max 0,5 mg); midazolam podpoliczkowo <b>'+P.r(Math.min(10,0.3*w),1)+' mg</b> (0,3 mg/kg, max 10 mg) przy drgawkach >5 min.</li>':'<li class="o">Podaj masę ciała, aby obliczyć dawki ratunkowe (adrenalina, midazolam).</li>')+
  '<li>Telefonicznie uprzedź SOR / izbę przyjęć szpitala; wydrukuj skierowanie poniżej.</li></ol>'+
  '<div class="row"><button class="pbtn red" id="amute">'+(a.mute?'🔊 Włącz syrenę':'🔇 Wycisz syrenę')+'</button><button class="pbtn" id="apr">🖨 Drukuj skierowanie</button><button class="tg" id="aclr">✓ wyczyść</button></div>'+src(ALARM_SRC+'; dawki: ERC 2025 (anafilaksja), BNFc (midazolam buccal) – DO WERYFIKACJI wg ChPL')+'</div>'}
 var V=[['t','Temperatura','°C'],['hr','Tętno','/min'],['rr','Oddechy','/min'],['spo','SpO₂','%'],['crt','CRT','s'],['glu','Glikemia','mg/dl'],['avpu','AVPU','']];
 h+='<div class="box"><h3>Stan w chwili kierowania</h3><div class="row">'+V.map(function(x){return '<label>'+x[1]+' <input data-av="'+x[0]+'" value="'+escA(a.v[x[0]]||'')+'" style="width:4.5em"> '+x[2]+'</label>'}).join('')+'</div>'+
  '<label style="display:block;font-weight:700">Rozpoznanie wstępne / przyczyna skierowania<textarea data-av="dx" rows="2" style="width:100%">'+esc(a.v.dx||'')+'</textarea></label><label style="display:block;font-weight:700">Leczenie podane w przychodni (lek, dawka, godzina)<textarea data-av="tx" rows="2" style="width:100%">'+esc(a.v.tx||'')+'</textarea></label>'+(n?'':'<button class="pbtn" id="apr">🖨 Drukuj skierowanie</button>')+'</div>';return h};
R.alarm.bind=function(k){var a=ST.al;$$('[data-al]').forEach(function(c){c.onchange=function(){a.c[c.dataset.al]=c.checked;if(c.checked)a.mute=false;render()}});
 $$('[data-av]').forEach(function(e){e.oninput=function(){a.v[e.dataset.av]=e.value}});
 var m=$('#amute');if(m)m.onclick=function(){a.mute=!a.mute;render()};var c=$('#aclr');if(c)c.onclick=function(){a.c={};render()};
 var p=$('#apr');if(p)p.onclick=function(){alarmPrint(k)};alarmSync()};
function alarmPrint(k){var a=ST.al,S=ALARM.filter(function(x,i){return a.c[i]}),v=a.v,f=function(x){return v[x]?esc(v[x]):'……'};
 var h=pHead('Skierowanie do szpitala – TRYB PILNY','do Szpitalnego Oddziału Ratunkowego / Izby Przyjęć')+pKid(k)+'<p>PESEL: '+(($('#pesel')||{}).value||'……………………………')+' &nbsp; Godzina skierowania: ……………</p>';
 h+='<div class="pred"><b>Objawy alarmowe:</b><ul>'+(S.length?S.map(function(x){return '<li>'+esc(x[1])+'</li>'}).join(''):'<li>……………………………………………</li>')+'</ul></div>';
 h+='<table class="pt"><tr><th>T</th><th>Tętno</th><th>Oddechy</th><th>SpO₂</th><th>CRT</th><th>Glikemia</th><th>AVPU</th></tr><tr><td>'+f('t')+' °C</td><td>'+f('hr')+'/min</td><td>'+f('rr')+'/min</td><td>'+f('spo')+' %</td><td>'+f('crt')+' s</td><td>'+f('glu')+' mg/dl</td><td>'+f('avpu')+'</td></tr></table>';
 h+='<table class="pt"><tr><th style="width:30%">Rozpoznanie wstępne</th><td style="height:18mm">'+(v.dx?esc(v.dx):'')+'</td></tr><tr><th>Leczenie w przychodni</th><td style="height:18mm">'+(v.tx?esc(v.tx):'')+'</td></tr><tr><th>Uczulenia / choroby przewlekłe</th><td style="height:10mm"></td></tr></table>';
 h+='<div class="pbox"><b>Transport:</b> ☐ transport sanitarny przychodni – tryb pilny, z sygnałami dźwiękowymi i świetlnymi &nbsp; ☐ ZRM (112) &nbsp; · opiekun towarzyszy dziecku: ☐ tak<br>Kontakt z lekarzem kierującym: '+DOC+', tel. <b>'+TEL+'</b></div>';
 doPrint(h+pEmg()+pSig()+pFoot())}
// ---- alergia pokarmowa ----
function allergy(k){var h='<h2 style="margin-top:16px">Alergia pokarmowa – ABMK i mieszanki</h2>';
 h+=box('','<h3>Alergia na białka mleka krowiego (ABMK) – postępowanie</h3><ul>'+
 '<li><b>Karmienie piersią – kontynuować.</b> Dieta eliminacyjna matki (bez białek mleka krowiego) 2–4 tyg.; matka: wapń 1000 mg/d + witamina D.</li>'+
 '<li><b>Karmienie mieszanką:</b> 1. wybór – <b>hydrolizat o znacznym stopniu hydrolizy (eHF)</b>.</li>'+
 '<li><b>Mieszanka aminokwasowa (AAF)</b> – od razu przy: anafilaksji, ciężkiej enteropatii lub zahamowaniu wzrastania, eozynofilowym zapaleniu przełyku (EoE), alergii wielopokarmowej; także, gdy objawy nie ustępują na eHF.</li>'+
 '<li><b>Dieta diagnostyczna:</b> objawy natychmiastowe ok. 1–2 tyg., opóźnione (przewód pokarmowy, skóra) 2–4 tyg. → potem <b>próba prowokacji</b> (przy objawach natychmiastowych / anafilaksji – tylko w szpitalu). Bez poprawy – ABMK mało prawdopodobna.</li>'+
 '<li>Leczenie dietą zwykle ≥6 mies. lub do 9–12 mies. życia, potem ponowna prowokacja.</li>'+
 '<li><b>Nie stosować w leczeniu ABMK:</b> mieszanek HA (częściowo hydrolizowanych), mleka koziego/owczego, napojów roślinnych jako mleka podstawowego; mieszanki sojowe nie przed 6. mies.</li></ul>'+src('ESPGHAN – Management of cow’s milk protein allergy, position paper 2023 (JPGN 2024); WAO DRACMA 2022/2024 – szczegóły czasu diety DO WERYFIKACJI ze stanowiskiem PTGHiŻD'));
 var lv=function(x){return '<span class="lv '+(x==='ryczałt'?'lr':x==='30%'?'l3':'ln')+'">'+x+'</span>'};
 h+=box('','<h3>Mieszanki – refundacja NFZ</h3><table class="t fm"><tr><th>Preparat</th><th>Typ</th><th>Opak.</th><th>Odpłatność</th><th>Dopłata pacjenta</th><th>Cena detal.</th><th>Zakres wskazań refundowanych</th></tr>'+FORM.map(function(f){return '<tr><td><b>'+esc(f[0])+'</b></td><td>'+esc(f[1])+'</td><td>'+f[2]+'</td><td>'+lv(f[3])+'</td><td>'+esc(f[4])+(f[4].match(/\d/)?' zł':'')+'</td><td>'+esc(f[5])+(f[5].match(/\d/)?' zł':'')+'</td><td class="mut">'+esc(f[6]).replace(/DO WERYFIKACJI/,'<span class="dw">DO WERYFIKACJI</span>')+'</td></tr>'}).join('')+'</table>'+
 '<div class="mut" style="margin-top:6px"><b>eHF</b> – hydrolizat o znacznym stopniu hydrolizy · <b>AAF</b> – mieszanka aminokwasowa (elementarna). <b>Ryczałt</b> = 3,20 zł + ewentualna dopłata do limitu; <b>30%</b> – pacjent płaci 30% limitu + różnicę ponad limit. Poziomy <b>bezpłatny / 50% / 100%</b>: w tej grupie żadna mieszanka nie ma poziomu bezpłatnego ani 50%; poza zakresem wskazań = 100% (pełnopłatnie). Mieszanki <b>nie są</b> w wykazie bezpłatnych leków dla dzieci do 18 r.ż. (cz. D2). Kwoty dopłat wg wykazu – w aptece mogą się różnić przy zmianie ceny.</div>'+src(REFDATE+'; Althera, Alfamino, Bebilon Amino – nie znaleziono w wykazie, DO WERYFIKACJI'));
 if(k.age&&k.w>0&&k.mo<12){var f=P.formula({w:k.w,ageDays:k.age.days}),g=f.day*0.135,c=g*30/400;h+=box('','<h3>Ile puszek na receptę?</h3>Zapotrzebowanie ok. <b>'+f.day+' ml/d</b> ≈ '+P.r(g,0)+' g proszku/d → <b>ok. '+Math.ceil(c)+' puszek po 400 g na 30 dni</b>'+src('orientacyjnie: ok. 13,5 g proszku na 100 ml – sprawdź proporcje na opakowaniu; recepta do 120 dni stosowania – DO WERYFIKACJI'))}
 return h}

function render(){var k=kid();if(cur!=='alarm'){sirenStop();beacon(false)}$$('#side button').forEach(function(b){b.classList.toggle('on',b.dataset.m===cur)});var y=$('#main').scrollTop;$('#main').innerHTML=R[cur](k)+'<p class="mut" style="margin-top:18px">Pediatria POZ v'+VER+' · Wujek Fido · narzędzie pomocnicze – dawki i decyzje weryfikuje lekarz · dane dziecka nie są zapisywane</p>';if(R[cur].bind)R[cur].bind(k);$('#main').scrollTop=y}
function upd(){bar();render()}
if(localStorage.getItem('pp_disc')===VER)$('#disc').remove();else $('#discOk').onclick=function(){localStorage.setItem('pp_disc',VER);$('#disc').remove()};
window.addEventListener('error',function(e){window.__err=(window.__err||[]).concat(String(e.message))});
upd();
})();
