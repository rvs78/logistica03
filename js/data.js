/* Operació ERCC · dades del joc (generades a partir del material en paper) */
(function(){
"use strict";
var G = {"res": [{"code": "USAR", "name": "Equip de cerca i rescat urbà", "cost": 8, "tr": 3, "cat": "RESCAT"}, {"code": "EMT", "name": "Equip mèdic d'emergència / hospital de campanya", "cost": 9, "tr": 3, "cat": "SANITARI"}, {"code": "HEL", "name": "Helicòpter de rescat", "cost": 6, "tr": 0, "cat": "RESCAT · AERI"}, {"code": "AVA", "name": "Avió amfibi antiincendis", "cost": 10, "tr": 0, "cat": "EXTINCIÓ · AERI"}, {"code": "AVT", "name": "Avió de transport (pont aeri)", "cost": 7, "tr": 0, "cat": "TRANSPORT · AERI"}, {"code": "BFT", "name": "Bombers forestals terrestres", "cost": 5, "tr": 2, "cat": "EXTINCIÓ"}, {"code": "BOM", "name": "Bombament d'aigua d'alta capacitat", "cost": 5, "tr": 3, "cat": "INTERVENCIÓ"}, {"code": "QBR", "name": "Detecció i descontaminació química", "cost": 8, "tr": 3, "cat": "RISC QUÍMIC"}, {"code": "POT", "name": "Potabilització d'aigua", "cost": 4, "tr": 3, "cat": "SUBMINISTRAMENTS"}, {"code": "CAM", "name": "Campament / albergs (tendes)", "cost": 4, "tr": 3, "cat": "ALLOTJAMENT"}, {"code": "COS", "name": "Cossos de seguretat (ordre públic)", "cost": 3, "tr": 2, "cat": "ORDRE PÚBLIC"}, {"code": "ALI", "name": "Aliments", "cost": 2, "tr": 2, "cat": "ABASTIMENT"}, {"code": "MED", "name": "Medicaments i material sanitari", "cost": 3, "tr": 2, "cat": "SANITARI"}, {"code": "EPI", "name": "Equips de protecció individual", "cost": 2, "tr": 2, "cat": "PROTECCIÓ"}, {"code": "GEN", "name": "Generadors elèctrics", "cost": 2, "tr": 2, "cat": "SUBMINISTRAMENTS"}, {"code": "CRE", "name": "Creu Roja (albergs, aliments, abric, higiene)", "cost": 1, "tr": 2, "cat": "HUMANITARI"}, {"code": "ONG", "name": "ONG sanitària", "cost": 1, "tr": 2, "cat": "HUMANITARI · SANITARI"}], "countries": [{"id": "IT", "name": "Itàlia", "upper": "ITÀLIA", "title": "Terratrèmol als Apenins", "time": "Dimarts, 03:30 h", "lead": "Un terratrèmol de magnitud 6,2 sacseja els Apenins centrals mentre tothom dorm. La sacsejada dura 40 segons. Quan es fa de dia, les imatges són dures: tres pobles de muntanya tenen el nucli antic per terra.", "facts": [["Zona afectada", "3 pobles en un radi de 8 km"], ["Població de la zona", "2.800 habitants"], ["Víctimes potencials", "450 (ferits i persones atrapades)"], ["Durada del terratrèmol", "40 segons (+ possibles rèpliques)"], ["Rescats previstos", "diversos dies"], ["Carreteres", "secundàries tallades; l'autopista funciona"]], "news": ["Edificis antics col·lapsats: hi ha persones sota les runes.", "Tota la zona està sense llum. Fa 4 °C i moltes famílies dormen al carrer.", "L'hospital comarcal està desbordat de ferits.", "Els serveis d'emergència italians han activat tots els seus recursos, però no n'hi ha prou."], "need": ["USAR", "USAR", "EMT", "HEL", "CAM", "GEN", "MED", "ALI", "COS", "CRE"], "own": ["USAR", "EMT", "CAM", "MED", "ALI", "COS"], "extra": ["AVA", "POT", "CAM", "EPI"], "gir": "USAR", "why": {"USAR": "Persones atrapades sota les runes", "EMT": "Hospital comarcal desbordat", "HEL": "Evacuar ferits greus des de pobles aïllats", "CAM": "Famílies dormint al carrer", "GEN": "Tota la zona sense llum", "MED": "Atenció de ferits", "ALI": "Població desallotjada", "COS": "Seguretat de la zona i dels habitatges buits", "CRE": "Abric i higiene amb 4 °C"}}, {"id": "DE", "name": "Alemanya", "upper": "ALEMANYA", "title": "El Rin creix sense parar", "time": "Dijous, 18:00 h", "lead": "Fa cinc dies que plou sense parar. El servei meteorològic avisa: el Rin es desbordarà d'aquí a unes 30 hores. Encara no ha passat res… però el rellotge corre.", "facts": [["Zona en risc", "25 km de ribera (ciutats i pobles)"], ["Persones en zona inundable", "6.000"], ["Víctimes potencials", "6.000 si no s'actua a temps"], ["Desbordament previst", "d'aquí a 30 hores"], ["Durada prevista de la inundació", "4–5 dies"], ["Evacuació", "possible, si es fa abans de la crescuda"]], "news": ["Una planta potabilitzadora és a la ribera: si s'inunda, no hi haurà aigua de boixeta neta.", "Una subestació elèctrica és en zona de risc: hi pot haver talls de llum.", "Hi ha una residència de gent gran a primera línia de riu.", "Els alcaldes demanen saber ara mateix què han de fer."], "need": ["BOM", "BOM", "HEL", "POT", "CAM", "GEN", "ALI", "COS", "CRE", "MED"], "own": ["BOM", "HEL", "GEN", "CRE", "COS", "MED"], "extra": ["USAR", "GEN", "CRE", "AVT"], "gir": "GEN", "why": {"BOM": "Treure aigua de barris i infraestructures", "HEL": "Rescat de persones aïllades per l'aigua", "POT": "La potabilitzadora pot quedar sota l'aigua", "CAM": "Allotjar els evacuats", "GEN": "Subestació en risc: talls de llum", "ALI": "Abastir els evacuats", "COS": "Evacuació preventiva ordenada", "CRE": "Albergs i higiene", "MED": "Residència de gent gran"}}, {"id": "GR", "name": "Grècia", "upper": "GRÈCIA", "title": "Foc a l'Àtica", "time": "Diumenge, 14:00 h", "lead": "Tres mesos sense ploure, 38 °C i un vent de 70 km/h. Un incendi forestal s'ha descontrolat al nord d'Atenes i avança cap a les urbanitzacions.", "facts": [["Fronts actius", "3, amb 18 km de front total"], ["Persones evacuades", "3.500 (2 urbanitzacions)"], ["Víctimes potencials", "1.200 (cremats, intoxicats per fum, desallotjats)"], ["Inici de l'incendi", "fa 3 hores; s'escampa molt de pressa"], ["Durada prevista", "diversos dies"], ["Condicions", "vent fort, calor extrema, sequera"]], "news": ["Els mitjans aeris grecs no donen l'abast.", "Hi ha persones amb cremades i molts casos d'intoxicació per fum.", "Les famílies desallotjades no tenen on dormir aquesta nit.", "Les carreteres d'evacuació s'han de controlar per evitar embussos."], "need": ["AVA", "AVA", "BFT", "BFT", "HEL", "MED", "CAM", "ALI", "COS", "CRE"], "own": ["AVA", "BFT", "HEL", "MED", "CRE", "COS"], "extra": ["CRE", "POT", "ONG", "GEN"], "gir": "AVA", "why": {"AVA": "Mitjans aeris desbordats", "BFT": "Atacar els fronts per terra", "HEL": "Rescat en zones envoltades pel foc", "MED": "Cremats i intoxicats per fum", "CAM": "Desallotjats sense on dormir", "ALI": "Abastir els desallotjats", "COS": "Controlar les vies d'evacuació", "CRE": "Abric i higiene dels desallotjats"}}, {"id": "BE", "name": "Bèlgica", "upper": "BÈLGICA", "title": "Núvol tòxic al port d'Anvers", "time": "Dilluns, 09:15 h", "lead": "Un dipòsit d'una planta química del port d'Anvers té una fuita. S'ha format un núvol tòxic i el vent l'empeny cap als barris més propers.", "facts": [["Radi de confinament", "4 km"], ["Població dins del radi", "22.000 persones confinades a casa"], ["Víctimes potencials", "300 intoxicats"], ["Control previst de la fuita", "entre 6 i 10 hores"], ["Aigua", "possible contaminació de la xarxa"], ["Causa", "fallada en una instal·lació industrial"]], "news": ["Arriben a urgències persones amb tos, irritació d'ulls i dificultat per respirar.", "Es demana a la població que tanqui portes i finestres i no surti.", "Cal saber quina substància és i netejar (descontaminar) la zona.", "El personal d'emergències necessita protecció per entrar a la zona."], "need": ["QBR", "QBR", "EPI", "EPI", "EMT", "MED", "COS", "POT", "CRE", "ALI"], "own": ["QBR", "EPI", "EMT", "MED", "COS", "ALI"], "extra": ["ONG", "CAM", "ALI", "BOM"], "gir": "HEL", "why": {"QBR": "Identificar la substància i descontaminar", "EPI": "Protegir el personal que entra a la zona", "EMT": "Intoxicats a urgències", "MED": "Tractar intoxicacions", "COS": "Fer complir el confinament", "POT": "Possible contaminació de l'aigua", "CRE": "Suport a la població confinada", "ALI": "Abastir la població confinada"}}, {"id": "FR", "name": "França", "upper": "FRANÇA", "title": "Brot d'una malaltia respiratòria", "time": "Dimecres, 08:00 h", "lead": "Fa tres setmanes van aparèixer els primers casos d'una malaltia respiratòria greu. Avui els contagis s'han disparat a tres regions del nord del país.", "facts": [["Zona afectada", "3 regions del nord"], ["Casos confirmats", "4.200 i pujant"], ["Víctimes potencials", "més de 4.000"], ["Ocupació dels hospitals", "120 %"], ["Durada prevista", "setmanes"], ["Mesura actual", "confinament de les zones més afectades"]], "news": ["Els hospitals estan saturats: no hi ha llits per a tothom.", "Molts professionals sanitaris s'han contagiat.", "S'estan acabant les mascaretes i els equips de protecció.", "No es pot traslladar els malalts a altres zones: cal atendre'ls on són."], "need": ["EPI", "EPI", "MED", "MED", "EMT", "EMT", "ONG", "AVT", "COS", "ALI"], "own": ["EPI", "MED", "MED", "EMT", "COS", "ALI"], "extra": ["HEL", "BFT", "CRE", "POT"], "gir": null, "why": {"EPI": "S'acaben mascaretes i equips", "MED": "Tractar els malalts", "EMT": "Hospitals al 120 %: hospital de campanya", "ONG": "Reforç de personal sanitari", "AVT": "Pont aeri de material sanitari", "COS": "Controlar les zones de confinament", "ALI": "Abastir les zones confinades"}}, {"id": "PL", "name": "Polònia", "upper": "POLÒNIA", "title": "Crisi humanitària a la frontera", "time": "Divendres, 07:00 h", "lead": "Un conflicte armat en un país veí ha fet fugir milers de persones. En deu dies, 15.000 persones han arribat a la frontera oriental de Polònia amb poc més que la roba que porten.", "facts": [["Persones arribades", "15.000 en 10 dies"], ["Zona afectada", "3 passos fronterers en 40 km"], ["Víctimes potencials", "15.000"], ["Ritme d'arribada", "unes 1.500 persones cada dia"], ["Durada prevista", "mesos"], ["Temperatura nocturna", "–2 °C"]], "news": ["Hi ha famílies amb infants i gent gran dormint a l'aire lliure.", "Falten aigua potable, menjar i llocs on dormir.", "Moltes persones amb malalties cròniques s'han quedat sense medicació.", "Cal organitzar els passos fronterers perquè no hi hagi aglomeracions."], "need": ["CAM", "CAM", "ALI", "ALI", "CRE", "ONG", "MED", "POT", "COS", "GEN"], "own": ["CAM", "ALI", "ALI", "MED", "COS", "GEN"], "extra": ["EPI", "ALI", "HEL", "USAR"], "gir": null, "why": {"CAM": "Persones dormint a l'aire lliure", "ALI": "Falta menjar", "CRE": "Albergs, abric i higiene", "ONG": "Atenció sanitària als desplaçats", "MED": "Malalts crònics sense medicació", "POT": "Falta aigua potable", "COS": "Ordre als passos fronterers", "GEN": "Llum i calefacció als campaments (–2 °C)"}}], "gir": [{"country": "IT", "title": "RÈPLICA SÍSMICA", "text": "Una rèplica de magnitud 5,1 fa caure més edificis. Hi ha noves persones atrapades.", "need": "Necessiteu 1 equip de cerca i rescat urbà (USAR) més."}, {"country": "GR", "title": "EL VENT CANVIA", "text": "El vent gira de cop i s'obre un quart front a prop d'un poble.", "need": "Necessiteu 1 avió amfibi antiincendis (AVA) més."}, {"country": "DE", "title": "APAGADA", "text": "L'aigua arriba abans d'hora a una segona subestació. El tall de llum s'estén.", "need": "Necessiteu 1 generador elèctric (GEN) més."}, {"country": "BE", "title": "FERITS GREUS", "text": "Tres treballadors de la planta estan greus i s'han d'evacuar de seguida.", "need": "Necessiteu 1 helicòpter de rescat (HEL) més."}], "reserve": ["QBR", "EMT", "CAM", "AVA"], "assign": [{"code": "USAR", "to": "IT", "from": "DE", "round": 1}, {"code": "HEL", "to": "IT", "from": "FR", "round": 1}, {"code": "GEN", "to": "IT", "from": "DE", "round": 1}, {"code": "CRE", "to": "IT", "from": "GR", "round": 1}, {"code": "USAR", "to": "IT", "from": "PL", "round": 2}, {"code": "BOM", "to": "DE", "from": "BE", "round": 1}, {"code": "POT", "to": "DE", "from": "IT", "round": 1}, {"code": "CAM", "to": "DE", "from": "IT", "round": 1}, {"code": "ALI", "to": "DE", "from": "BE", "round": 1}, {"code": "GEN", "to": "DE", "from": "GR", "round": 2}, {"code": "AVA", "to": "GR", "from": "IT", "round": 1}, {"code": "BFT", "to": "GR", "from": "FR", "round": 1}, {"code": "CAM", "to": "GR", "from": "BE", "round": 1}, {"code": "ALI", "to": "GR", "from": "PL", "round": 1}, {"code": "AVA", "to": "GR", "from": "ERCC", "round": 2}, {"code": "QBR", "to": "BE", "from": "ERCC", "round": 1}, {"code": "EPI", "to": "BE", "from": "IT", "round": 1}, {"code": "POT", "to": "BE", "from": "GR", "round": 1}, {"code": "CRE", "to": "BE", "from": "DE", "round": 1}, {"code": "HEL", "to": "BE", "from": "PL", "round": 2}, {"code": "EPI", "to": "FR", "from": "PL", "round": 1}, {"code": "EMT", "to": "FR", "from": "ERCC", "round": 1}, {"code": "ONG", "to": "FR", "from": "GR", "round": 1}, {"code": "AVT", "to": "FR", "from": "DE", "round": 1}, {"code": "CAM", "to": "PL", "from": "ERCC", "round": 1}, {"code": "CRE", "to": "PL", "from": "FR", "round": 1}, {"code": "ONG", "to": "PL", "from": "BE", "round": 1}, {"code": "POT", "to": "PL", "from": "FR", "round": 1}]};

/* ---- Equips */
G.teams = G.countries.map(function(c){ return {id:c.id, name:c.name}; }).concat([{id:"ERCC", name:"ERCC · Centre de Coordinació"}]);
G.byId = {}; G.countries.forEach(function(c){ G.byId[c.id] = c; });
G.resById = {}; G.res.forEach(function(r){ G.resById[r.code] = r; });

/* ---- Rols (l'últim camp és opcional: grups de 3) */
G.roles = {
  country: [
    {k:"coord", name:"Coordinació", nick:"El cap de l'operació", icon:"flag",
     what:"Dirigeixes el grup, escoltes tothom i preneu les decisions. Vigiles el temps i que la fulla de comandament estigui completa.",
     comp:"Lideratge i presa de decisions sota pressió"},
    {k:"log", name:"Logística", nick:"El magatzem", icon:"package",
     what:"Controles les cartes: què teniu, què us falta i què us sobra. Fas el càlcul del cost logístic.",
     comp:"Gestió de recursos i càlcul"},
    {k:"enll", name:"Enllaç", nick:"El diplomàtic", icon:"messages",
     what:"Vas a preguntar als altres grups i portes els formularis a l'ERCC. L'enllaç canvia cada ronda.",
     comp:"Comunicació i negociació: preguntar, explicar i convèncer"},
    {k:"anal", name:"Anàlisi", nick:"L'ull tècnic", icon:"zoom-scan", optional:true,
     what:"Classifiques el desastre amb els criteris de classe, estimes les víctimes i dedueixes què necessita la població.",
     comp:"Pensament crític: aplicar criteris tècnics a un cas real",
     opt:"Si sou 3, deixeu-lo buit: Coordinació també fa d'Anàlisi."}
  ],
  ercc: [
    {k:"cap", name:"Cap de sala", icon:"gavel",
     what:"Dones el vistiplau final: acceptes o rebutges cada transferència. Decideixes a qui va la reserva.",
     comp:"Priorització i resolució de conflictes"},
    {k:"reg", name:"Registre", icon:"clipboard-list",
     what:"Reps els formularis, els numeres i els apuntes al registre de sol·licituds.",
     comp:"Organització i rigor amb la documentació"},
    {k:"apa", name:"Aparellament", icon:"arrows-exchange",
     what:"Comproves que la sol·licitud està ben justificada i que el país que dona hi està d'acord.",
     comp:"Verificació i pensament crític"},
    {k:"seg", name:"Seguiment", icon:"chart-bar", optional:true,
     what:"Actualitzes el panell de països i marques els desastres resolts. Presentes el resultat final.",
     comp:"Visió de conjunt i comunicació oral",
     opt:"Si sou 3, deixeu-lo buit: Cap de sala també fa de Seguiment."}
  ]
};

/* ---- Criteris de classificació (U1/U2) */
G.criteria = [
  {k:"causa", label:"Causa", opts:[["natural","Natural","leaf"],["tecnologica","Tecnològica","building-factory-2"],["sociologica","Sociològica","users-group"],["biologica","Biològica","virus"]]},
  {k:"evolucio", label:"Evolució", opts:[["sobtada","Sobtada","bolt"],["lenta","Lenta","hourglass"]]},
  {k:"instauracio", label:"Velocitat d'instauració", opts:[["rapida","Ràpida","run"],["lenta","Lenta","walk"]]},
  {k:"durada", label:"Durada del succés", opts:[["curta","Curta (< 1 h)"],["mitja","Mitja (2–24 h)"],["perllongada","Perllongada (> 24 h)"]]},
  {k:"extensio", label:"Extensió", opts:[["petita","Petita (< 1 km)"],["mitja","Mitja (1–10 km)"],["gran","Gran (> 10 km)"]]},
  {k:"afectacio", label:"Afectació", opts:[["moderada","Moderada (25–99)"],["mitja","Mitja (100–999)"],["greu","Greu (> 1.000)"]]},
  {k:"evacuable", label:"Es pot evacuar?", opts:[["si","Sí"],["no","No: cal atendre in situ"]]},
  {k:"fase", label:"Fase actual", opts:[["interdesastre","Interdesastre","clock"],["alerta","Alerta","alert-triangle"],["impacte","Impacte","bolt"],["emergencia","Emergència","ambulance"],["reconstruccio","Reconstrucció","tools"]]}
];

/* ---- Solucionari de classificació (Bèlgica: evacuable admet les dues respostes) */
G.key = {
  IT:{causa:"natural",evolucio:"sobtada",instauracio:"rapida",durada:"curta",extensio:"mitja",afectacio:"mitja",evacuable:["si"],fase:"emergencia",victimes:450},
  DE:{causa:"natural",evolucio:"lenta",instauracio:"lenta",durada:"perllongada",extensio:"gran",afectacio:"greu",evacuable:["si"],fase:"alerta",victimes:6000},
  GR:{causa:"natural",evolucio:"sobtada",instauracio:"rapida",durada:"perllongada",extensio:"gran",afectacio:"greu",evacuable:["si"],fase:"emergencia",victimes:1200},
  BE:{causa:"tecnologica",evolucio:"sobtada",instauracio:"rapida",durada:"mitja",extensio:"mitja",afectacio:"mitja",evacuable:["si","no"],fase:"emergencia",victimes:300},
  FR:{causa:"biologica",evolucio:"lenta",instauracio:"lenta",durada:"perllongada",extensio:"gran",afectacio:"greu",evacuable:["no"],fase:"emergencia",victimes:4200},
  PL:{causa:"sociologica",evolucio:"lenta",instauracio:"lenta",durada:"perllongada",extensio:"gran",afectacio:"greu",evacuable:["si"],fase:"emergencia",victimes:15000}
};

/* ---- Mesures per fases: paraules clau per a la valoració orientativa */
G.measureKeys = {
  prep:["pla","simulacre","formaci","prevenci","previs","avis","avís","alerta","preventiv","reserv","estoc","vigil","protocol","inform","mapa","construcci","tallafoc","franja","neteja del bosc","prepar","sismorresist","autoprotecci","acollida","plans"],
  resp:["rescat","triatge","atenci","evacu","hospital","alberg","extinci","apagar","confin","descontamin","bombe","distribu","aigua","aliment","seguretat","campament","ajuda","tractar","atendre","helic","refugi","metge","sanitari","medicament"],
  rec:["reconstru","rehabilit","netej","psicol","ajudes","torna","restabl","reforest","repar","retorn","integraci","avalua","recuper","reobr","reforç","normalitat","allotjament estable","indemnitz"]
};
G.measures = [
  {k:"prep", name:"Preparació", when:"abans", icon:"clipboard-check"},
  {k:"resp", name:"Resposta", when:"durant", icon:"ambulance"},
  {k:"rec",  name:"Recuperació", when:"després", icon:"seeding"}
];

/* ---- Rúbrica (mateixos pesos que el paper) */
G.rubric = {
  country:[
    {k:"classif", name:"Classificació", w:30, icon:"zoom-scan",
     lv:["Menys de 4 criteris correctes.","4–5 criteris correctes.","6–7 criteris correctes.","8 criteris correctes i fase encertada."]},
    {k:"needs", name:"Necessitats i justificació", w:25, icon:"users",
     lv:["No relacionen els recursos amb l'escenari.","Necessitats genèriques; triatge de cartes amb errors.","La majoria de necessitats i cartes ben triades.","Dedueixen les necessitats de les dades i trien bé les cartes."]},
    {k:"phases", name:"Gestió per fases", w:20, icon:"clipboard-check",
     lv:["Cap mesura adequada.","Una mesura adequada o confusió de fases.","Dues mesures adequades.","Una mesura adequada de preparació, resposta i recuperació."]},
    {k:"cost", name:"Cost logístic", w:15, icon:"calculator",
     lv:["No fet o incoherent.","Errors en dos components.","Un error menor.","A, B i C ben calculats i coherents amb les cartes."]},
    {k:"roles", name:"Participació dels rols", w:10, icon:"users",
     lv:["Una persona ho fa tot.","Dos rols poc actius.","Un rol poc actiu.","Tots exerceixen el rol; l'enllaç rota; reflexions completes."]}
  ],
  ercc:[
    {k:"registre", name:"Registre", w:30, icon:"clipboard-list",
     lv:["Sense registre útil.","Registre incomplet.","Algun buit puntual.","Totes les sol·licituds amb estat; panell al dia."]},
    {k:"valid", name:"Validació i reserva", w:30, icon:"building-warehouse",
     lv:["Ho accepten tot sense revisar.","Validen sense criteri.","Validen bé però gasten la reserva aviat.","Rebutgen les mal justificades i la reserva va on cal."]},
    {k:"present", name:"Presentació final", w:25, icon:"presentation",
     lv:["No presenten.","Presentació confusa.","Dades correctes, poca reflexió.","Dades clares, resolts i no resolts, valor de la coordinació."]},
    {k:"coord", name:"Coordinació interna", w:15, icon:"users",
     lv:["Desorganització.","Rols barrejats.","Algun embús puntual.","Cada rol fa la seva funció."]}
  ]
};

/* ---- Contingut de la guia (wizard) */
G.clock = [
  ["0–5","Briefing","El docent us dona el material. Repartiu-vos els rols."],
  ["5–12","Anàlisi","Llegiu el vostre desastre. Ompliu els blocs 1 i 2 de la fulla de comandament."],
  ["12–19","Ronda 1","Consulteu altres grups i envieu sol·licituds a l'ERCC."],
  ["19–26","Ronda 2","Atenció! L'ERCC anuncia les cartes de gir: alguns desastres empitjoren."],
  ["26–33","Ronda 3","Última oportunitat. Ja no es poden demanar CRE ni ONG."],
  ["33–40","Resolució","Obriu el sobre de resolució quan el docent ho digui. Ho heu aconseguit?"],
  ["40–48","Costos","Calculeu el cost logístic."],
  ["48–55","Posada en comú","L'ERCC presenta el dashboard. Premeu «Guardar» i descarregueu el PDF."]
];
G.mission = [
  ["Llegiu el vostre desastre i classifiqueu-lo.","Prepareu el dashboard i repartiu-vos els rols."],
  ["Esbrineu què necessiteu: què teniu, què us falta i què us sobra.","Rebeu les sol·licituds dels països i comproveu-les."],
  ["Pregunteu als altres grups qui té el que us falta.","Autoritzeu les transferències i apunteu-ho tot."],
  ["Demaneu-ho a l'ERCC amb un formulari ben justificat.","A la ronda 2, anuncieu les cartes de gir."],
  ["Doneu el que us sobra a qui ho necessiti.","Gestioneu la vostra reserva (rescEU) amb cap."],
  ["Calculeu el cost logístic de la vostra resposta.","Al final, presenteu el resultat a tota la classe."]
];
G.rules = [
  ["messages","Preguntar és lliure.","L'enllaç pot anar a qualsevol grup a preguntar què té o què li falta. Feu-ho tant com vulgueu!"],
  ["arrows-exchange","Les cartes només es mouen a través de l'ERCC.","Mai no doneu una carta directament a un altre país."],
  ["forms","Sense justificació, no hi ha ajuda.","L'ERCC rebutjarà els formularis que no expliquin el desastre i per què necessiteu el recurs."],
  ["hourglass","Creu Roja (CRE) i ONG són barates però lentes:","a la ronda 3 ja no es poden demanar."],
  ["users","Tothom té un rol.","L'enllaç canvia cada ronda: tots sortireu a negociar almenys una vegada."]
];
G.steps4 = [
  ["messages","Preguntar","L'enllaç va als altres grups: «Teniu un helicòpter? Ens el cediríeu?» Ho apunta al registre de consultes."],
  ["forms","Demanar","Ompliu el formulari de sol·licitud en paper: quin recurs, quin país us el dona i per què el necessiteu."],
  ["clipboard-check","Validar","L'ERCC comprova que el formulari està ben justificat i que el país que dona hi està d'acord."],
  ["package","Rebre","El país que dona entrega la carta a l'ERCC i l'ERCC us la porta. Tots dos ho apunteu a l'app!"]
];
G.helpSteps = [
  ["alert-triangle","El desastre supera la capacitat del país."],
  ["speakerphone","El país demana ajuda a l'ERCC i diu què necessita."],
  ["world","L'ERCC fa arribar la petició als altres països."],
  ["heart-handshake","Els països ofereixen els recursos que poden donar."],
  ["plane-arrival","El país afectat accepta l'ajuda i l'ERCC en coordina l'arribada."]
];
G.principles = [
  ["heart","Humanitat","ajudar on hi hagi patiment"],
  ["scale","Neutralitat","no prendre partit"],
  ["equal","Imparcialitat","primer qui més ho necessita"],
  ["link-off","Independència","sense interessos polítics"]
];
G.erccQuestions = [
  "Quants desastres s'han resolt? Quins no, i per què?",
  "Quantes transferències heu coordinat? Quines sol·licituds heu rebutjat i per què?",
  "Què hauria passat si no hi hagués hagut un centre de coordinació?"
];

window.GAME = G;
})();
