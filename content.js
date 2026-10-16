// Treści statyczne: bilanse, gorączka, infekcje
(function(G){
G.BIL=[
 {k:'1–4 tydz.',a:[7,28],ms:['unosi głowę na chwilę w leżeniu na brzuchu','reaguje na dźwięk, fiksuje wzrok na twarzy'],sc:['porada patronażowa lekarza','ocena żółtaczki','obwód głowy','ocena stawów biodrowych (USG bioder – 4–6 tydz.)','wynik przesiewu słuchu (OAE) i badań przesiewowych (TSH, PKU, mukowiscydoza, SMA…)','odruch czerwieni źrenicznej'],doc:['masa, długość, obwód głowy','sposób karmienia, wit. D/K','szczepienia BCG/WZW B']},
 {k:'2–6 mies.',a:[60,183],ms:['2 mies.: uśmiech społeczny','3–4 mies.: trzyma głowę, chwyta, śmieje się głośno','6 mies.: obraca się, siedzi z podparciem, gaworzy'],sc:['w terminach szczepień','masa, długość, obwód głowy i klatki','profilaktyka krzywicy (wit. D)','ocena bioder, napięcia mięśniowego','Hirschberg, wodzenie wzrokiem'],doc:['rozwój fizyczny, siatki centylowe','przebyte choroby','kwalifikacja do szczepień']},
 {k:'9 mies.',a:[255,300],ms:['siedzi samodzielnie, raczkuje','chwyt pęsetowy (początki)','sylaby „ma-ma”, „ba-ba”, lęk przed obcymi'],sc:['test rozwoju reakcji słuchowych','Hirschberg, cover test','ocena szczepień'],doc:['masa, długość, obwód głowy i klatki','rozwój psychoruchowy']},
 {k:'12 mies.',a:[350,395],ms:['staje, chodzi przy meblach / samodzielnie','1–3 słowa z intencją','wskazuje palcem, gest „pa-pa”'],sc:['test reakcji słuchowych','Hirschberg, cover test','ocena szczepień (MMR, PCV)','ocena uzębienia'],doc:['rozwój fizyczny i psychoruchowy','przebyte choroby']},
 {k:'2 lata',a:[700,790],ms:['biega, wchodzi po schodach','ok. 50 słów, łączy 2 słowa','naśladuje, zabawa „na niby”'],sc:['BMI','M-CHAT-R (16–30 mies.)','ryzyko uszkodzenia słuchu','Hirschberg, cover test','ocena rozwoju mowy'],doc:['BMI i centyle','rozwój psychomotoryczny, mowa','szczepienia']},
 {k:'4 lata',a:[1430,1520],ms:['skacze na jednej nodze','rysuje koło/krzyż','zdania złożone, mowa zrozumiała dla obcych'],sc:['BMI, ciśnienie tętnicze','ostrość wzroku (tablice), widzenie stereoskopowe','test słuchu, rozwój mowy','higiena jamy ustnej','rozwój społeczny'],doc:['BMI, RR','wzrok, słuch, mowa']},
 {k:'5 lat',a:[1800,1900],ms:['gotowość szkolna (wstępnie)','ubiera się samodzielnie','opowiada historie'],sc:['BMI, RR','ostrość wzroku, widzenie barw','słuch, mowa','postawa ciała, stopy','dojrzałość szkolna'],doc:['BMI, RR','wzrok, słuch, postawa']},
 {k:'6 lat',a:[2150,2300],ms:['dojrzałość szkolna','motoryka mała (pisanie)'],sc:['BMI, RR','wzrok, słuch','postawa – skolioza, stopy','szczepienia 6 r.ż. (DTaP, IPV, MMR 2)'],doc:['gotowość szkolna','szczepienia przypominające']},
 {k:'9–10 lat',a:[3280,3800],ms:['ocena dojrzewania (Tanner)','funkcjonowanie w szkole'],sc:['BMI, RR','ostrość wzroku, widzenie barw','skolioza (test Adamsa)','dojrzewanie płciowe','nadwaga/otyłość, ryzyko metaboliczne'],doc:['BMI, RR','Tanner','postawa ciała']},
 {k:'13–14 lat',a:[4750,5450],ms:['dojrzewanie, zdrowie psychiczne','używki, aktywność fizyczna'],sc:['BMI, RR','wzrok','skolioza','Tanner','przesiew depresji (np. PHQ-A)','szczepienie Tdap (14 r.ż.), HPV'],doc:['BMI, RR, Tanner','profilaktyka uzależnień']},
 {k:'16–17 lat',a:[5840,6570],ms:['zdrowie psychiczne, ryzykowne zachowania'],sc:['BMI, RR','wzrok','postawa','orientacja zawodowa (przeciwwskazania zdrowotne)'],doc:['BMI, RR','opinia do wyboru zawodu']},
 {k:'do 19 r.ż.',a:[6570,6939],ms:['przekazanie do POZ dorosłych'],sc:['BMI, RR','szczepienie Td (19 r.ż.)'],doc:['podsumowanie dokumentacji']}
];
G.BIL_SRC='Rozporządzenie MZ w sprawie świadczeń gwarantowanych z zakresu POZ (t.j. Dz.U. 2023 poz. 1427), zał. – porady patronażowe i bilanse; kamienie milowe orientacyjne (CDC 2022/„Learn the signs”). DO WERYFIKACJI zakres szczegółowy wg aktualnego tekstu rozporządzenia.';
G.NICE={
 colour:{g:'prawidłowy kolor skóry, warg, języka',a:'bladość (wg rodzica)',r:'blada / marmurkowa / popielata / sina'},
 items:[
  ['Aktywność','reaguje prawidłowo, uśmiecha się, budzi się szybko, płacz silny/brak','słabo reaguje, nie uśmiecha się, budzi się po dłuższej stymulacji, zmniejszona aktywność','brak reakcji, wygląda na chore wg lekarza, nie budzi się / nie utrzymuje czuwania, płacz słaby, piskliwy lub ciągły'],
  ['Oddech','prawidłowy','poszerzanie skrzydełek nosa; RR >50/min (6–12 mies.), >40/min (>12 mies.); SpO₂ ≤95%; trzeszczenia','stękanie; RR >60/min; umiarkowane/ciężkie wciąganie klatki'],
  ['Krążenie i nawodnienie','prawidłowa skóra i oczy, wilgotne śluzówki','tachykardia (>160 <12 mies., >150 1–2 l., >140 2–5 l.); CRT ≥3 s; suche śluzówki; słabe jedzenie u niemowląt; zmniejszona diureza','obniżone napięcie skóry'],
  ['Inne','brak objawów z kolumn żółtej/czerwonej','T ≥39 °C w wieku 3–6 mies.; gorączka ≥5 dni; dreszcze; obrzęk kończyny/stawu; nieobciążanie kończyny','wiek 0–3 mies. z T ≥38 °C; wysypka nieblednąca; uwypuklone ciemiączko; sztywność karku; stan padaczkowy; ogniskowe objawy neurologiczne; drgawki ogniskowe']
 ],src:'NICE NG143 Fever in under 5s (2019, aktual. 2021) – sygnalizator świetlny'};
G.PNEU={red:['SpO₂ <92%','sinica','RR >70/min (niemowlę) lub >50/min (starsze)','istotna duszność, stękanie, bezdechy','nie pije / objawy odwodnienia','wiek <6 mies. (rozważ)','brak poprawy po 48 h antybiotykoterapii'],src:'BTS 2011 / Rekomendacje NPOA 2016 – wskazania do hospitalizacji; leczenie: amoksycylina 90 mg/kg/d w 2 dawkach (≥3 mies.) 7–10 dni'};
G.UTI={pts:['<3 mies. z gorączką i podejrzeniem ZUM → szpital','mocz: wydalony ze środkowego strumienia / cewnik (nie woreczek do posiewu)','ZUM z gorączką >38 °C = odmiedniczkowe zapalenie nerek','leczenie empiryczne p.o. (≥3 mies., dobry stan): cefuroksym aksetyl 30 mg/kg/d, amoksycylina+klawulanian, cefiksym; 7–10 dni; zap. pęcherza 3–5 dni (furazydyna u starszych)','USG układu moczowego po 1. gorączkowym ZUM u niemowlęcia','posiew – CFU: cewnik ≥10⁴ (≥10³ wg niektórych), środkowy strumień ≥10⁵'],src:'Zalecenia PTNFD 2015 (aktual.) – DO WERYFIKACJI; NICE NG224 (2022)'};

// ---------- v1.1: wskazówki dla rodzica (sposób podania) ----------
G.PAR={
 para:{how:'Można podać z jedzeniem lub bez. Zawiesinę wstrząsnąć przed użyciem, odmierzać strzykawką dołączoną do opakowania.',prn:1,maxN:4},
 ibu:{how:'Podawać w trakcie lub tuż po posiłku (albo z mlekiem). Zawiesinę wstrząsnąć. Nie podawać, gdy dziecko wymiotuje, ma biegunkę i mało pije (ryzyko uszkodzenia nerek) ani przy ospie wietrznej.',prn:1,maxN:3},
 amox:{how:'Można podać z jedzeniem lub bez. Zawiesinę dobrze wstrząsnąć przed każdym podaniem; po przygotowaniu przechowywać wg ulotki (zwykle w lodówce).'},
 amc:{how:'Podawać na początku posiłku (lepsza tolerancja). Zawiesinę dobrze wstrząsnąć, przechowywać w lodówce, wyrzucić po 7 dniach od przygotowania.'},
 cxm:{how:'Podawać w trakcie posiłku – lek wchłania się wtedy znacznie lepiej. Zawiesinę wstrząsnąć; ma gorzki posmak – można popić mlekiem lub sokiem.'},
 cfx:{how:'Można podać z jedzeniem lub bez. Zawiesinę wstrząsnąć przed użyciem.'},
 azi:{how:'Podawać 1 raz dziennie o tej samej porze. Zawiesinę wstrząsnąć. Lek działa jeszcze kilka dni po ostatniej dawce – to normalne, że kuracja jest krótka.'},
 clr:{how:'Można podać z jedzeniem lub bez. Zawiesinę wstrząsnąć. Poinformuj lekarza o innych przyjmowanych lekach.'},
 pen:{how:'Najlepiej na pusty żołądek – ok. 1 godzinę przed posiłkiem. Zawiesinę wstrząsnąć.'},
 fur:{how:'Podawać w trakcie lub po posiłku, popić dużą ilością płynu. Mocz może mieć ciemniejszy kolor – to niegroźne.'},
 pred:{how:'Podać rano, w trakcie lub po posiłku.'},
 bud:{how:'Inhalacja przez nebulizator z maską. Po inhalacji przemyć twarz i wypłukać usta / podać picie.'},
 salb:{how:'Inhalator zawsze z komorą inhalacyjną (spacerem): 1 wdech = 1 naciśnięcie, potem 5–6 spokojnych oddechów przez komorę. Jeśli potrzeba częściej niż co 4 h – pilny kontakt z lekarzem.'},
 ond:{how:'Podać jednorazowo; po 15–30 minutach zacząć pojenie płynem nawadniającym (ORS) małymi porcjami (łyżeczka co 1–2 min).'},
 cet:{how:'Można podać z jedzeniem lub bez, najlepiej wieczorem (może powodować senność).'},
 des:{how:'Podać 1 raz dziennie, z jedzeniem lub bez.'},
 vitd:{how:'Codziennie, najlepiej z posiłkiem zawierającym tłuszcz.'}};
// objawy – natychmiast SOR / 112 (wydruk dla rodzica)
G.SOR=['trudności w oddychaniu: szybki, świszczący lub stękający oddech, wciąganie skóry między żebrami, sinienie warg','drgawki, utrata przytomności','nadmierna senność, trudność w obudzeniu, wiotkość, brak kontaktu','wysypka, która nie blednie pod naciskiem szklanki (wybroczyny)','objawy odwodnienia: brak moczu (sucha pielucha) ponad 8 godzin, brak łez, suchy język, zapadnięte ciemiączko, odmowa picia','gorączka u niemowlęcia poniżej 3. miesiąca życia (≥38 °C)','gorączka ≥40 °C, która nie spada po leku albo trwa ponad 5 dni','sztywność karku, silny ból głowy, wymioty z bólem głowy','uporczywe wymioty (wszystko zwraca), wymioty z krwią lub zielone, krew w stolcu','silny ból brzucha, ból/obrzęk jądra','obrzęk twarzy, języka, trudność w połykaniu po leku (reakcja alergiczna)','płacz ciągły, piskliwy, nie do utulenia; zimne, marmurkowe dłonie i stopy'];
G.PROBIO='Probiotyk w czasie antybiotykoterapii (zmniejsza ryzyko biegunki poantybiotykowej): Lactobacillus rhamnosus GG (np. Dicoflor; 10–20 mld CFU/d) lub Saccharomyces boulardii (np. Enterol; 250–500 mg/d). Podawać od pierwszego dnia antybiotyku do końca kuracji, ok. 2 godziny przed lub po antybiotyku (S. boulardii można razem).';
G.PROBIO_SRC='ESPGHAN Special Interest Group on Gut Microbiota and Modifications – stanowisko 2016, aktual. 2022 (zapobieganie biegunce poantybiotykowej: LGG, S. boulardii)';
// ---------- v1.1: objawy alarmowe – pilne skierowanie do szpitala ----------
G.ALARM=[
 ['Oddech','zaburzenia oddychania: stękanie, bezdechy, ciężkie wciąganie klatki, RR znacznie powyżej normy dla wieku'],['Oddech','SpO₂ < 92% lub sinica centralna'],['Oddech','stridor spoczynkowy / podejrzenie zapalenia nagłośni / ciało obce w drogach oddechowych'],['Oddech','ciężkie zaostrzenie astmy bez poprawy po salbutamolu (mówi pojedynczymi słowami, „cicha klatka”)'],
 ['Krążenie','objawy wstrząsu: CRT > 3 s, zimne marmurkowe kończyny, tachykardia, hipotensja'],['Krążenie','anafilaksja (po podaniu adrenaliny i.m. 0,01 mg/kg, max 0,5 mg)'],['Krążenie','ciężkie odwodnienie (CDS 5–8) lub nieskuteczne nawadnianie doustne'],
 ['Neurologia','drgawki trwające > 5 min lub nawracające / pierwszy napad bez gorączki'],['Neurologia','zaburzenia świadomości, nadmierna senność, brak kontaktu (AVPU: P lub U)'],['Neurologia','objawy oponowe, uwypuklone ciemiączko, ogniskowe objawy neurologiczne'],
 ['Infekcja','wysypka krwotoczna nieblednąca + gorączka (podejrzenie sepsy meningokokowej)'],['Infekcja','niemowlę < 3 mies. z gorączką ≥ 38 °C'],['Infekcja','wysokie ryzyko wg sygnalizatora NICE (czerwone objawy)'],
 ['Inne','ostry brzuch, wymioty żółciowe/fusowate, krew w stolcu, podejrzenie wgłobienia'],['Inne','ból i obrzęk jądra (podejrzenie skrętu – czas!)'],['Inne','zatrucie / połknięcie baterii guzikowej lub magnesów'],['Inne','uraz głowy z utratą przytomności, wymiotami lub zaburzeniami świadomości'],['Inne','podejrzenie krzywdzenia dziecka (uraz nieadekwatny do wywiadu)'],['Inne','hipoglikemia < 54 mg/dl (3,0 mmol/l) lub objawy kwasicy ketonowej (cukrzyca)']];
G.ALARM_SRC='NICE NG143 (sygnalizator świetlny), NICE NG51 Sepsis, Wytyczne ERC 2025 – Pediatryczne zabiegi resuscytacyjne (rozpoznanie dziecka w stanie zagrożenia życia, ABCDE)';
// ---------- v1.1: alergia pokarmowa – mieszanki i refundacja ----------
G.REFDATE='Obwieszczenie MZ z 16.09.2026 (Dz. Urz. MZ 2026 poz. 70) – wykaz refundacyjny na 1.10.2026, cz. A2 (środki spożywcze specjalnego przeznaczenia żywieniowego)';
// [nazwa, typ, opakowanie, odpłatność, dopłata pacjenta zł, cena detal. zł, zakres wskazań refundacyjnych]
G.FORM=[
 ['Nutramigen 1 LGG Complete','eHF (od urodzenia)','400 g','30%','36,61','56,45','ABMK, objawy lub podejrzenie ABMK, nietolerancja laktozy/sacharozy, nadwrażliwość na inne białka (np. soja)'],
 ['Nutramigen 2 LGG Complete','eHF (od 6. mies.)','400 g','30%','22,63','62,39','jw.'],
 ['Nutramigen 3 LGG Complete','eHF (od 12. mies.)','400 g','30%','15,31','51,04','jw.'],
 ['Bebilon Pepti 1 Syneo','eHF (od urodzenia)','400 g','30%','28,80','46,96','wrodzone defekty metaboliczne, ABMK w tym diagnostyczna dieta eliminacyjna, inne alergie pokarmowe, biegunki przewlekłe'],
 ['Bebilon Pepti 2 Syneo','eHF (od 6. mies.)','400 g','30%','15,97','53,22','jw.'],
 ['Bebilon pepti MCT','eHF z MCT','450 g','30%','13,52','45,05','wrodzone defekty metaboliczne, alergie pokarmowe, biegunki przewlekłe'],
 ['Neocate LCP','AAF (0–12 mies.)','400 g','ryczałt','3,20','156,11','niemowlęta 0–12 mies.: ciężka ABMK, złożona nietolerancja białek pokarmowych'],
 ['Neocate Syneo','AAF (0–18 l.)','400 g','ryczałt','11,72','158,62','ciężka ABMK, złożona nietolerancja białek pokarmowych – do 18 r.ż.'],
 ['Neocate Junior (neutralny / waniliowy)','AAF (>1 r.ż.)','400 g','ryczałt','35,73 / 37,73','114,85 / 116,85','dzieci >1 r.ż.: ciężka ABMK, złożona nietolerancja białek pokarmowych'],
 ['Nutramigen PURAMINO','AAF (od urodzenia)','400 g','ryczałt','3,20','109,96','ciężka ABMK i nietolerancja wielu pokarmów, gdy eHF nie przyniosła efektu; alergia na białko soi; wskazana dieta elementarna'],
 ['Nutramigen Puramino Junior','AAF (>1 r.ż.)','400 g','ryczałt','37,70','119,54','dzieci >1 r.ż.: ciężka ABMK, alergia wielopokarmowa, wskazana dieta elementarna'],
 ['Blemil plus Elemental','AAF (od urodzenia)','400 g','ryczałt','3,42','107,59','jak Nutramigen PURAMINO'],
 ['Blemil plus Elemental Junior','AAF (>1 r.ż.)','400 g','ryczałt','3,20','85,04','dzieci >1 r.ż.: ciężka ABMK, alergia wielopokarmowa'],
 ['Althera (Nestlé)','eHF','—','brak w wykazie','pełna cena','—','nie znaleziono w wykazie na 1.10.2026 – pełnopłatna (DO WERYFIKACJI)'],
 ['Alfamino (Nestlé)','AAF','—','brak w wykazie','pełna cena','—','nie znaleziono w wykazie na 1.10.2026 – pełnopłatna (DO WERYFIKACJI)'],
 ['Bebilon Amino','AAF','—','brak w wykazie','pełna cena','—','nie znaleziono w wykazie na 1.10.2026 – pełnopłatna (DO WERYFIKACJI)']];
})(typeof window!=='undefined'?window:globalThis);
