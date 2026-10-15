(function(){var P=PP,$=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var VER='1.0';$('#ver').textContent='v'+VER;
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
$('#reset').onclick=function(){C={};ST={};['pesel','dob','w','h','ga'].forEach(function(i){$('#'+i).value=''});upd()};
// ---------- moduły ----------
var MODS=[['leki','💊 Dawki leków'],['centyle','📈 Siatki centylowe'],['bilans','📋 Bilanse'],['szczep','💉 Szczepienia'],['infek','🌡 Gorączka / infekcje'],['odw','💧 Odwodnienie'],['zyw','🍼 Żywienie'],['normy','❤️ Normy dla wieku']];
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
 return h};
R.leki.bind=function(k){var s=ST.leki;$$('.drugs button').forEach(function(b){b.onclick=function(){s.d=b.dataset.d;s.p=0;s.g=0;render()}});$('#dp').onchange=function(){s.p=+this.value;render()};$('#dr').onchange=function(){s.g=+this.value;render()};
 var cd=$('#cd');if(cd){var f=function(){s.cd=cd.value;s.cn=$('#cn').value;var d=DRUGS.list.filter(function(x){return x.id===s.d})[0],rg=d.reg[s.g],v=P.num(s.cd),n=P.num(s.cn);if(!(v>0&&n>0&&k.w>0)){$('#cres').innerHTML='';return}
  var c=P.check({dose:v,n:n,w:k.w,maxDose:rg.maxD,maxDay:rg.maxDay,maxKgDay:rg.maxKgDay,unit:d.unit});$('#cres').innerHTML='<b class="'+(c.lvl==='red'?'r':c.lvl==='orange'?'o':'g')+'">'+P.r(v*n/k.w,1)+' '+(d.unit||'mg')+'/kg/d '+(c.msg.length?'– '+c.msg.join(', '):'– OK')+'</b>'};cd.oninput=f;$('#cn').oninput=f;f()}};
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
 h+='<button class="pbtn" id="pr">🖨 Drukuj kartę bilansu</button>'+src(BIL_SRC);ST._bsel=sel;return h};
R.bilans.bind=function(k){$$('[data-b]').forEach(function(b){b.onclick=function(){ST.bil=+b.dataset.b;render()}});$('#pr').onclick=function(){var b=BIL[ST._bsel],t=function(a,n){return '<tr><th>'+n+'</th><td>'+a.map(function(x){return (x.checked?'☑ ':'☐ ')+esc(x.t)}).join('<br>')+'</td></tr>'};
 var cbs=$$('#main .box input[type=checkbox]'),i=0,map=function(a){return a.map(function(x){return {t:x,checked:cbs[i++].checked}})};var A=map(b.ms),B=map(b.sc),Cc=map(b.doc);
 $('#printArea').innerHTML='<h1>Bilans zdrowia – '+b.k+'</h1><p>Data: '+today()+' · dziecko ur. '+(C.dob||'……')+' · wiek '+(k.age?P.ageTxt(k.age):'……')+' · masa '+(k.w||'…')+' kg · wzrost '+(k.h||'…')+' cm'+(k.bmi?' · BMI '+P.r(k.bmi,1):'')+'</p><p>Imię i nazwisko: ……………………………………</p><table>'+t(A,'Kamienie milowe')+t(B,'Badania')+t(Cc,'Dokumentacja')+'<tr><th>Uwagi</th><td style="height:40mm"></td></tr></table><p style="margin-top:15mm">Podpis i pieczątka lekarza: ……………………………</p><p style="font-size:8pt">'+esc(BIL_SRC)+' · Pediatria POZ v'+VER+'</p>';window.print()}};
// 4. SZCZEPIENIA
R.szczep=function(k){var s=ST.vx=ST.vx||{v:'6w1',done:{}},h='<h2>Szczepienia – PSO 2026</h2>'+need(k,['age']);if(!k.dob)return h;
 h+='<div class="row"><label>Wariant <select id="vv"><option value="6w1">6w1 (DTaP-IPV-Hib-HBV) 3+1</option><option value="5w1">5w1 (DTaP-IPV-Hib) + WZW B</option><option value="pod">podstawowy (DTwP, Hib, IPV osobno)</option></select></label><button class="tg" id="vall">✓ zaznacz wszystkie do dziś</button></div>';
 var L=P.vaxStatus(C.dob,today(),s.v,s.done),lab={done:'✅ wykonane',due:'🟠 należy się teraz',overdue:'🔴 zaległe',future:'⏳ później',blocked:'⏸ po wcześniejszej dawce',late:'⛔ za późno (limit wieku)'};
 var nO=L.filter(function(x){return x.st==='overdue'}).length,nD=L.filter(function(x){return x.st==='due'}).length;
 h+=box(nO?'red':nD?'orange':'ok','<b>'+(nO?nO+' zaległe':'')+(nO&&nD?' · ':'')+(nD?nD+' do wykonania teraz':'')+(!nO&&!nD?'Brak zaległości wg zaznaczonych dawek':'')+'</b>');
 h+='<table class="t"><tr><th>✓</th><th>Szczepienie</th><th>Status</th><th>Najwcześniej / wykonano</th><th>Zalecany wiek</th></tr>'+L.map(function(x){return '<tr class="'+x.st+'"><td><input type="checkbox" data-v="'+x.id+'"'+(s.done[x.id]?' checked':'')+'></td><td>'+esc(x.n)+(x.note?'<div class="mut">'+esc(x.note).replace(/DO WERYFIKACJI/,'<span class="dw">DO WERYFIKACJI</span>')+'</div>':'')+'</td><td>'+lab[x.st]+'</td><td>'+(x.st==='done'?'<input type="date" data-vd="'+x.id+'" value="'+(s.done[x.id]===true?'':s.done[x.id])+'">':pd(x.date))+'</td><td class="mut">'+pd(x.recFrom)+' – '+pd(x.recTo)+'</td></tr>'}).join('')+'</table>';
 h+=box('','<h3>Nadrabianie – minimalne odstępy</h3>DTP/DTaP pierwotne: ≥4 tyg.; 3.→4. dawka ≥6 mies. · PCV (2+1): ≥8 tyg., dawka przypominająca po 12. mies. · IPV ≥4–8 tyg. · WZW B: 1→2 ≥4 tyg., 2→3 ≥8 tyg. (3. dawka ≥16 tyg. od 1.) · MMR 1→2 ≥4 tyg. · RV: 1. dawka do 12 tyg., schemat do 24 (Rotarix) / 32 tyg. (RotaTeq) · Szczepionki żywe: razem lub ≥4 tyg. odstępu.<br>Zalecane (PSO II.A): grypa (od 6 mies.), meningokoki B i ACWY, ospa wietrzna (bezpłatnie w grupach ryzyka), HPV 9–14 l. (bezpłatnie w programie), COVID-19, WZW A, kleszczowe zap. mózgu.'+src('PSO 2026 – Komunikat GIS z 31.10.2025 (Dz. Urz. MZ 2025 poz. 85). Odstępy minimalne – DO WERYFIKACJI w ChPL konkretnej szczepionki'));
 h+=box('','<h3>Przeciwwskazania (skrót)</h3>Trwałe: ciężka reakcja anafilaktyczna po poprzedniej dawce / składniku · encefalopatia ≤7 dni po szczepionce z krztuścem (bez innej przyczyny). Żywe (MMR, VZV, RV, BCG): ciężki niedobór odporności, immunosupresja (prednizon ≥2 mg/kg lub ≥20 mg/d ≥14 dni), ciąża; RV – wgłobienie w wywiadzie, SCID. Odroczenie: ostra choroba z gorączką lub umiarkowany/ciężki stan. <b>Nie są</b> przeciwwskazaniem: katar, łagodna infekcja bez gorączki, antybiotykoterapia, wcześniactwo, alergia nie na składnik szczepionki.'+src('PSO 2026 cz. IV; Zalecenia ACIP General Best Practice'));return h};
R.szczep.bind=function(k){var s=ST.vx;if(!s)return;var vv=$('#vv');vv.value=s.v;vv.onchange=function(){s.v=this.value;s.done={};render()};
 $$('[data-v]').forEach(function(c){c.onchange=function(){if(c.checked)s.done[c.dataset.v]=true;else delete s.done[c.dataset.v];render()}});
 $$('[data-vd]').forEach(function(c){c.onchange=function(){s.done[c.dataset.vd]=c.value||true;render()}});
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
R.zyw=function(k){var h='<h2>Żywienie niemowląt</h2>'+need(k,['age','w']);if(!k.age||!(k.w>0))return h;
 if(k.mo<12){var f=P.formula({w:k.w,ageDays:k.age.days});h+=box('','<h3>Mleko modyfikowane</h3><div class="big">'+f.per+' ml × '+f.feeds+'/d</div>dobowo ok. <b>'+f.day+' ml</b> · '+f.note+src('ESPGHAN / PTGHiŻD – Schemat żywienia niemowląt 2021 (orientacyjnie)'))}
 h+=box('','<h3>Witamina D</h3><b>'+P.vitD({mo:k.mo,preterm:k.preterm})+'</b>'+src('Płudowski i wsp. Wytyczne profilaktyki i leczenia niedoboru wit. D w Polsce 2023'));
 if(k.mo<4)h+=box('','<h3>Witamina K</h3>Po urodzeniu 0,5–1 mg i.m. Dzieci karmione piersią: <b>25 µg/d p.o.</b> od 8. dnia do 12. tyg. życia (mleko modyfikowane – nie wymaga) <span class="dw">DO WERYFIKACJI</span> wg aktualnego stanowiska PTN/PTP'+src('Stanowisko PTN 2016 – profilaktyka krwawienia z niedoboru wit. K'));
 h+=box('','<h3>Rozszerzanie diety</h3>Od 17. tyg. (nie później niż 26. tyg.); gluten w 4–12 mies.; alergeny (jajo, orzeszki) bez opóźniania; mleko krowie jako napój po 12 mies.; bez soli i cukru; żelazo – mięso/żółtko od początku.'+src('Schemat żywienia niemowląt PTGHiŻD 2021'));return h};
// 8. NORMY
R.normy=function(k){var h='<h2>Normy dla wieku</h2>'+need(k,['age']);if(!k.age)return h;var v=P.vitals(k.y);
 h+='<div class="grid">'+box('','<h3>Tętno</h3><div class="big">'+v.hr.join('–')+'/min</div>')+box('','<h3>Oddechy</h3><div class="big">'+v.rr.join('–')+'/min</div>')+box('','<h3>Ciśnienie skurczowe</h3><div class="big">'+v.sbp.join('–')+' mmHg</div><div class="mut">hipotensja: SBP < '+(k.y<1?70:k.y<10?Math.round(70+2*k.y):90)+'</div>')+box('','<h3>SpO₂</h3><div class="big">≥95%</div><div class="mut">&lt;92% – skierowanie</div>')+box('','<h3>Sen</h3><div class="big">'+P.sleep(k.y)+'</div>'+src('AASM 2016'))+'</div>'+src('APLS 6th ed. (zakresy prawidłowe); hipotensja: PALS');
 var b=ST.bp||{};h+=box('','<h3>Ciśnienie tętnicze – przesiew (≥1 r.ż.)</h3><div class="row"><label>SBP <input id="bs" inputmode="numeric" value="'+(b.s||'')+'"></label><label>DBP <input id="bd" inputmode="numeric" value="'+(b.d||'')+'"></label></div><div id="bpr"></div>'+src('AAP Clinical Practice Guideline 2017 (Flynn), Table 6 – uproszczona tabela przesiewowa; pełna klasyfikacja wg centyla wzrostu (Table 4/5) – DO WERYFIKACJI w tabelach AAP'));return h};
R.normy.bind=function(k){var e=$('#bs');if(!e)return;var f=function(){ST.bp={s:$('#bs').value,d:$('#bd').value};var s=P.num(ST.bp.s),d=P.num(ST.bp.d);if(!(s>0&&d>0)){$('#bpr').innerHTML='';return}var r=P.bp(k.y,k.sex||'m',s,d);
 $('#bpr').innerHTML=r?'<b class="'+(r.lvl==='red'?'r':r.lvl==='orange'?'o':'g')+'">'+r.txt+'</b> <span class="mut">(próg '+r.thr+')</span>':'<span class="mut">&lt;1 r.ż. – brak tabeli</span>'};e.oninput=f;$('#bd').oninput=f;f()};
function render(){var k=kid();$$('#side button').forEach(function(b){b.classList.toggle('on',b.dataset.m===cur)});var y=$('#main').scrollTop;$('#main').innerHTML=R[cur](k)+'<p class="mut" style="margin-top:18px">Pediatria POZ v'+VER+' · Wujek Fido · narzędzie pomocnicze – dawki i decyzje weryfikuje lekarz · dane dziecka nie są zapisywane</p>';if(R[cur].bind)R[cur].bind(k);$('#main').scrollTop=y}
function upd(){bar();render()}
if(localStorage.getItem('pp_disc')===VER)$('#disc').remove();else $('#discOk').onclick=function(){localStorage.setItem('pp_disc',VER);$('#disc').remove()};
window.addEventListener('error',function(e){window.__err=(window.__err||[]).concat(String(e.message))});
upd();
})();
