/* Operació ERCC · aplicació principal: estat, desat local, pestanyes, assistent i fulls editables */
(function(){
"use strict";
var G = window.GAME, I = window.ICONS, IM = window.ICON_MAP;
var S = null, KEY = null, saveT = null;
var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* ------------------------------------------------------------ utilitats */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function ic(name, cls){
  return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[name] || "") + "</svg>";
}
/* Icona de recurs: icona principal + insígnia (com a les cartes de paper) */
function resIc(code, cls){
  var m = IM.res[code] || ["package", null];
  var badge = m[1] ? '<circle cx="21.5" cy="21.5" r="6.2" fill="var(--badge-bg,var(--surface))" stroke="currentColor" stroke-width="1.4"/>' +
    '<g transform="translate(17.3 17.3) scale(.35)" stroke-width="4">' + I[m[1]] + "</g>" : "";
  return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g>' + I[m[0]] + "</g>" + badge + "</svg>";
}
function teamName(id){ if (id === "ERCC") return "ERCC"; if (id === "RES") return "Reserva rescEU"; return G.byId[id] ? G.byId[id].name : id; }
function getP(o, p){ return p.split(".").reduce(function(a, k){ return a == null ? a : a[k]; }, o); }
function setP(o, p, v){ var ks = p.split("."), last = ks.pop(); var t = ks.reduce(function(a, k){ if (a[k] == null) a[k] = {}; return a[k]; }, o); t[last] = v; }
function opt(v, label, cur){ return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? " selected" : "") + ">" + esc(label) + "</option>"; }
function roleList(){ return S.team === "ERCC" ? G.roles.ercc : G.roles.country; }
function members(){ return roleList().filter(function(r){ return (S.names[r.k] || "").trim(); }).map(function(r){ return {k:r.k, role:r.name, name:S.names[r.k].trim()}; }); }
function countBy(arr){ var o = {}; arr.forEach(function(x){ o[x] = (o[x] || 0) + 1; }); return o; }

/* ------------------------------------------------------------ preferències d'accessibilitat (com logistica01) */
var PREF = "ercc-prefs";
function applyPrefs(){
  var p = {}; try { p = JSON.parse(localStorage.getItem(PREF) || "{}"); } catch(e) {}
  var r = document.documentElement;
  r.setAttribute("data-size", p.size || "m"); r.setAttribute("data-font", p.font || "atkinson");
  r.setAttribute("data-contrast", p.contrast || "normal");
  if (p.theme && p.theme !== "auto") r.setAttribute("data-theme", p.theme); else r.removeAttribute("data-theme");
  return p;
}
function initA11y(){
  var btn = $("#a11yBtn"), box = $("#a11y"), p = applyPrefs();
  ["size","font","contrast","theme"].forEach(function(n){
    var v = p[n] || {size:"m", font:"atkinson", contrast:"normal", theme:"auto"}[n];
    var el = box.querySelector('input[name="' + n + '"][value="' + v + '"]'); if (el) el.checked = true;
  });
  btn.onclick = function(){ var open = box.hidden; box.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  box.addEventListener("change", function(e){
    var q = {}; try { q = JSON.parse(localStorage.getItem(PREF) || "{}"); } catch(err) {}
    q[e.target.name] = e.target.value; try { localStorage.setItem(PREF, JSON.stringify(q)); } catch(err) {}
    applyPrefs(); if (S && S.tab === "result") render();
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !box.hidden){ box.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
}

/* ------------------------------------------------------------ estat i desat */
function blankCountry(id){
  var c = G.byId[id];
  var cards = c.own.concat(c.extra).slice().sort().map(function(code){ return {code:code, st:"", to:"", r:""}; });
  return {classif:{}, victimes:"", needPop:"", needTeam:"", measures:{prep:"", resp:"", rec:""},
          reflect:{coord:"", anal:"", log:"", enll:""}, enllac:{r1:"", r2:"", r3:""},
          consultes:[], cards:cards, rebudes:[], cost:{A:"", B:"", C:"", T:""}, env:false, resolt:"", falta:""};
}
function blankErcc(){
  var panel = {}; G.countries.forEach(function(c){ panel[c.id] = {des:"", causa:"", afect:"", falta:"", resolt:""}; });
  var res = {}; G.reserve.forEach(function(k){ res[k] = {to:"", r:""}; });
  var girs = {}; G.gir.forEach(function(g){ girs[g.country] = false; });
  return {panel:panel, registre:[], reserva:res, girs:girs, ajuda:"", present:["", "", ""], reflect:{cap:"", reg:"", apa:"", seg:""}};
}
function blank(team, names){
  return {v:1, team:team, names:names, created:Date.now(), updated:Date.now(), wizard:0, wizardDone:false,
          tab:"guia", sub:{}, finished:false, savedAt:null, notes:"",
          c: team === "ERCC" ? null : blankCountry(team), e: team === "ERCC" ? blankErcc() : null};
}
function stateKey(team){ return "ercc-state-v1-" + team; }
function loadState(team){ try { var s = JSON.parse(localStorage.getItem(stateKey(team)) || "null"); return s && s.v === 1 ? s : null; } catch(e) { return null; } }
function save(now){
  clearTimeout(saveT);
  var go = function(){
    S.updated = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); $("#saved").textContent = "Desat · " + new Date().toLocaleTimeString("ca-ES", {hour:"2-digit", minute:"2-digit"}); }
    catch(e) { $("#saved").textContent = "No s'ha pogut desar al navegador"; }
  };
  if (now) go(); else { $("#saved").textContent = "Desant…"; saveT = setTimeout(go, 400); }
}

/* ------------------------------------------------------------ modal i avisos */
function toast(msg){ var t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function(){ t.hidden = true; }, 2600); }
function modal(html, onOpen){
  var m = $("#modal"), box = $("#modalBox"), prev = document.activeElement;
  box.innerHTML = html; m.hidden = false;
  var close = function(){ m.hidden = true; box.innerHTML = ""; document.removeEventListener("keydown", key); if (prev && prev.focus) prev.focus(); };
  var key = function(e){ if (e.key === "Escape") close(); };
  document.addEventListener("keydown", key);
  m.onclick = function(e){ if (e.target === m) close(); };
  $$("[data-close]", box).forEach(function(b){ b.onclick = close; });
  var f = box.querySelector("button, input, textarea"); if (f) f.focus();
  if (onOpen) onOpen(box, close);
  return close;
}

/* ------------------------------------------------------------ peces reutilitzables */
function band(icon, text, small){ return '<div class="band">' + ic(icon) + "<span>" + text + "</span>" + (small ? "<small>" + small + "</small>" : "") + "</div>"; }
function rcard(code, extra, cls){
  var r = G.resById[code];
  return '<article class="rcard ' + (cls || "") + '" aria-label="Carta ' + esc(code) + ": " + esc(r.name) + '">' +
    '<div class="top" style="--badge-bg:var(--band)">' + resIc(code) + '<div><span class="cat">' + esc(r.cat) + "</span><b>" + code + "</b></div></div>" +
    '<div class="nm">' + esc(r.name) + "</div>" +
    (code === "CRE" || code === "ONG" ? '<div class="slow">' + ic("hourglass") + " No es pot demanar a la ronda 3</div>" : "") +
    '<div class="costs"><span title="Cost">' + ic("coins") + "Cost <b>" + r.cost + " UL</b></span><span title=\"Transport\">" + ic("truck") + "Transport <b>" + r.tr + " UL</b></span></div>" +
    (extra || "") + "</article>";
}
function chips(name, path, opts, cur, rerender){
  return '<div class="chips" role="radiogroup">' + opts.map(function(o){
    return '<label class="chip"><input type="radio" name="' + esc(name) + '" value="' + esc(o[0]) + '" data-b="' + path + '"' + (rerender ? ' data-r="1"' : "") +
      (cur === o[0] ? " checked" : "") + "><span>" + (o[2] ? ic(o[2]) : "") + esc(o[1]) + "</span></label>";
  }).join("") + "</div>";
}
function selectHTML(path, options, cur, label, rerender){
  return '<select data-b="' + path + '"' + (rerender ? ' data-r="1"' : "") + ' aria-label="' + esc(label) + '">' +
    options.map(function(o){ return opt(o[0], o[1], cur); }).join("") + "</select>";
}
function textarea(path, val, label, ph, rows){
  return '<textarea data-b="' + path + '" rows="' + (rows || 3) + '" aria-label="' + esc(label) + '" placeholder="' + esc(ph || "") + '">' + esc(val) + "</textarea>";
}
function input(path, val, label, ph, type){
  return '<input type="' + (type || "text") + '" data-b="' + path + '" value="' + esc(val) + '" aria-label="' + esc(label) + '" placeholder="' + esc(ph || "") + '"' +
    (type === "number" ? ' inputmode="numeric" min="0"' : "") + ">";
}
var ROUNDS = [["", "—"], ["1", "R1"], ["2", "R2"], ["3", "R3"]];
var YN = [["", "—"], ["si", "Sí"], ["no", "No"]];
function resOptions(){ return [["", "Tria un recurs…"]].concat(G.res.map(function(r){ return [r.code, r.code + " · " + r.name]; })); }
function phaseLine(){
  return '<div class="phases">' + IM.phase.map(function(p, i){
    return (i ? '<span class="arr" aria-hidden="true">→</span>' : "") + '<div class="ph"><span class="ic">' + ic(p[1]) + "</span>" + p[0] + "</div>";
  }).join("") + "</div>";
}
function subnav(tab, items){
  var cur = S.sub[tab] || items[0][0];
  return '<nav class="subnav" aria-label="Apartats">' + items.map(function(it){
    return '<button type="button" data-a="sub" data-s="' + it[0] + '" aria-current="' + (cur === it[0]) + '">' + ic(it[2]) + it[1] + "</button>";
  }).join("") + "</nav>";
}

/* ------------------------------------------------------------ pestanyes */
function tabsList(){
  var t = [{id:"guia", label:"Guia", icon:"book"}];
  G.countries.forEach(function(c){ t.push({id:c.id, label:c.name, icon:IM.dis[c.id]}); });
  t.push({id:"ERCC", label:"ERCC", icon:"world"});
  if (S.finished) t.push({id:"result", label:"Resultat", icon:"chart-bar"});
  return t;
}
function renderTabs(){
  $("#tabs").innerHTML = tabsList().map(function(t){
    var mine = t.id === S.team, locked = t.id !== "guia" && t.id !== "result" && !mine;
    return '<button type="button" class="tab' + (mine ? " mine" : "") + '" role="tab" data-tab="' + t.id + '" aria-selected="' + (S.tab === t.id) + '">' +
      ic(t.icon) + esc(t.label) + (mine ? '<span class="you">VOSALTRES</span>' : "") + (locked ? ic("lock", "lock") : "") + "</button>";
  }).join("");
  var sel = $('#tabs [aria-selected="true"]'); if (sel && sel.scrollIntoView) sel.scrollIntoView({block:"nearest", inline:"nearest"});
}

/* ============================================================ GUIA (assistent) */
var WIZ = [["Què passa?", "alert-triangle"], ["La missió", "target"], ["Com es juga", "clock"], ["Els recursos", "package"], ["Els rols", "users"], ["Fitxa de suport", "school"]];
function guide(){
  var i = Math.max(0, Math.min(WIZ.length - 1, S.wizard || 0)), isE = S.team === "ERCC", body = "";
  if (i === 0){
    var me = isE ? '<div class="callout">' + ic("world") + " <b>Sou l'ERCC</b>, el Centre de Coordinació de la Resposta a Emergències (Brussel·les). La vostra força és la informació.</div>"
      : '<div class="callout lockbox"><span class="bubble">' + ic(IM.dis[S.team]) + "</span><div><b>El vostre país: " + esc(G.byId[S.team].name) + "</b><br>" + esc(G.byId[S.team].title) + "</div></div>";
    body = '<div class="hero"><div class="eyebrow" style="color:inherit;opacity:.8">Activitat en grup · 55 minuts</div><h1 class="ptitle">Operació ERCC</h1>' +
      "<p>Avui Europa té un dia terrible. <b>Sis països pateixen un desastre alhora</b>: un terratrèmol, una inundació, un incendi, una fuita química, un brot de malaltia i una crisi de persones desplaçades.</p>" +
      "<p>Cap país pot resoldre el seu desastre tot sol: <b>a tots els falten recursos que tenen els altres</b>. A Brussel·les, l'<b>ERCC</b> és l'única via oficial per moure ajuda d'un país a un altre. Si cooperem bé, els sis desastres es poden resoldre.</p></div>" +
      me + '<div class="card">' + band("users", "El vostre equip") + '<div class="grid3">' + members().map(function(m){
        var r = roleList().filter(function(x){ return x.k === m.k; })[0];
        return '<div class="row"><span class="bubble">' + ic(r.icon) + '</span><div><div class="small muted">' + esc(m.role) + "</div><b>" + esc(m.name) + "</b></div></div>";
      }).join("") + "</div></div>" +
      '<div class="callout warn">' + ic("info-circle") + " <b>Com funciona l'app?</b> Les cartes són de paper i es mouen per la classe. Aquesta app és el <b>vostre quadern de treball</b>: hi apunteu tot el que analitzeu, pregunteu, demaneu i doneu. Es desa sola en aquest navegador. Al final, premeu <b>Guardar</b> per veure el resultat i descarregar el PDF per a Classroom.</div>";
  } else if (i === 1){
    body = '<div class="card">' + band("target", "La vostra missió") + '<div class="mission">' +
      '<div class="h' + (isE ? " notme" : " me") + '">Si sou un PAÍS</div><div class="h' + (isE ? " me" : " notme") + '">Si sou l\'ERCC</div>' +
      G.mission.map(function(m, k){ return '<div class="' + (isE ? "notme" : "me") + '">' + (k + 1) + ". " + esc(m[0]) + '</div><div class="' + (isE ? "me" : "notme") + '">' + (k + 1) + ". " + esc(m[1]) + "</div>"; }).join("") +
      "</div></div>" +
      '<div class="card">' + band("award", "Les 5 regles d'or") + '<ol class="rules">' + G.rules.map(function(r){
        return '<li><span class="bubble">' + ic(r[0]) + "</span><div><b>" + esc(r[1]) + "</b> " + esc(r[2]) + "</div></li>"; }).join("") + "</ol></div>";
  } else if (i === 2){
    body = '<div class="card">' + band("clock", "El rellotge de l'operació", "55 minuts") + '<div class="clock">' + G.clock.map(function(c){
        return '<div class="m">' + c[0] + '</div><div class="n">' + c[1] + '</div><div class="t">' + esc(c[2]) + "</div>"; }).join("") + "</div></div>" +
      '<div class="card">' + band("arrows-exchange", "Com es demana un recurs", "4 passos") + '<ol class="steps4">' + G.steps4.map(function(s, k){
        return '<li><span class="bubble">' + ic(s[0]) + "</span><div><b>" + (k + 1) + ". " + esc(s[1]) + "</b><br>" + esc(s[2]) + "</div></li>"; }).join("") + "</ol></div>";
  } else if (i === 3){
    body = '<div class="card">' + band("package", "Els recursos (cartes)", "UL = unitats logístiques") +
      '<p>Cada carta té un <b>cost</b> (el paga qui la fa servir o la dona) i un cost de <b>transport</b> (el paga qui la rep). Els mitjans aeris (HEL, AVA, AVT) tenen transport 0: arriben volant.</p>' +
      '<div class="rescards">' + G.res.map(function(r){ return rcard(r.code); }).join("") + "</div></div>";
  } else if (i === 4){
    body = '<div class="card">' + band(isE ? "world" : "flag", isE ? "Rols de l'ERCC" : "Rols del país") + '<div class="roles">' + roleList().map(function(r){
        var who = (S.names[r.k] || "").trim();
        return '<div class="r"><span class="bubble">' + ic(r.icon) + "</span><div><b>" + esc(r.name) + "</b>" + (r.nick ? ' <span class="muted">«' + esc(r.nick) + "»</span>" : "") +
          '<div class="who">' + (who ? esc(who) : '<span class="muted">' + esc(r.opt || "") + "</span>") + "</div><p>" + esc(r.what) + '</p><p class="small"><b>Competència:</b> ' + esc(r.comp) + "</p></div></div>";
      }).join("") + "</div>" +
      '<div class="callout">' + ic("bulb") + " En una emergència real ningú no ho fa tot. Si un rol falla, falla tota la resposta. Al final cadascú escriurà què ha après fent el seu rol.</div></div>";
  } else {
    body = '<div class="grid2"><div class="card">' + band("world", "Com s'ajuden els països europeus?") +
      "<h3>El Mecanisme de Protecció Civil de la UE</h3><p>Quan un desastre supera la capacitat d'un país, aquest pot <b>demanar ajuda</b> als altres. El Mecanisme, creat el 2001, organitza aquesta ajuda. Qualsevol país del món afectat per un desastre el pot activar.</p>" +
      "<h3>L'ERCC</h3><p>El Centre de Coordinació de la Resposta a Emergències és a Brussel·les i funciona 24 hores al dia. És el «cervell» del Mecanisme: rep les peticions, les fa arribar als països i coordina les ofertes. <b>No envia els seus propis bombers</b>: coordina els dels països.</p>" +
      "<h3>rescEU</h3><p>És una <b>reserva europea</b> de recursos (avions antiincendis, helicòpters, equips mèdics…) per quan els països no tenen prou capacitat. Al joc, és la petita reserva de l'ERCC.</p></div>" +
      '<div class="card">' + band("plane-arrival", "Com arriba l'ajuda?") + '<ol class="steps4">' + G.helpSteps.map(function(s, k){
        return '<li><span class="bubble">' + ic(s[0]) + "</span><div><b>" + (k + 1) + ".</b> " + esc(s[1]) + "</div></li>"; }).join("") + "</ol>" +
      '<h3 style="margin-top:10px">Ajuda humanitària: 4 principis</h3><div class="grid2" style="gap:8px;margin-top:8px">' + G.principles.map(function(p){
        return '<div class="row"><span class="bubble">' + ic(p[0]) + "</span><div><b>" + p[1] + '</b><br><span class="small muted">' + p[2] + "</span></div></div>"; }).join("") + "</div></div></div>" +
      '<div class="card">' + band("school", "Xuleta de classe (U1 i U2)") +
      G.criteria.filter(function(c){ return c.k !== "fase" && c.k !== "evacuable"; }).map(function(c){
        return '<div class="crit"><div class="cl">' + esc(c.label) + '</div><div class="chips">' + c.opts.map(function(o){
          return '<span class="chip"><span>' + (o[2] ? ic(o[2]) : "") + esc(o[1]) + "</span></span>"; }).join("") + "</div></div>";
      }).join("") +
      '<div class="crit"><div class="cl">Fases del desastre<div class="small muted">Alerta = predesastre</div></div>' + phaseLine() + "</div>" +
      '<div class="crit"><div class="cl">Mesures</div><div class="chips">' + G.measures.map(function(m){
        return '<span class="chip"><span>' + ic(m.icon) + "<b>" + m.name + "</b>&nbsp;(" + m.when + ")</span></span>"; }).join("") + "</div></div></div>";
  }
  var last = i === WIZ.length - 1;
  return '<div class="wiz"><div class="pagehead"><div><div class="kicker">Guia · pas ' + (i + 1) + " de " + WIZ.length + "</div><h1>" + ic(WIZ[i][1]) + " " + WIZ[i][0] + "</h1></div></div>" +
    '<ol class="wizsteps" aria-label="Passos de la guia">' + WIZ.map(function(w, k){
      return '<li class="' + (k < i ? "done" : k === i ? "now" : "") + '"' + (k === i ? ' aria-current="step"' : "") + ">" + (k + 1) + ". " + w[0] + "</li>"; }).join("") + "</ol>" +
    body +
    '<div class="wiznav"><button type="button" class="btn ghost" data-a="wizPrev"' + (i === 0 ? " disabled" : "") + ">" + ic("chevron-left") + "Enrere</button>" +
    (last ? '<button type="button" class="btn" data-a="wizDone">Anem-hi! ' + ic("player-play") + "</button>"
          : '<button type="button" class="btn" data-a="wizNext">Següent ' + ic("chevron-right") + "</button>") + "</div></div>";
}

/* ============================================================ PAÍS */
function scenario(c, own){
  return '<div class="scenehead"><div class="dis">' + ic(IM.dis[c.id]) + c.id + '</div><div><div class="kicker">Full de país · ' + esc(c.time) + "</div><h1>" + esc(c.name) + '</h1><div class="lead" style="margin:0">' + esc(c.title) + "</div></div></div>" +
    '<div class="card">' + band("alert-triangle", "Última hora", c.time) + '<p style="font-size:1.08rem">' + esc(c.lead) + "</p></div>" +
    '<div class="grid2"><div class="card">' + band("chart-bar", "Dades de l'escenari") + '<div class="facts">' + c.facts.map(function(f){ return "<div>" + esc(f[0]) + "</div><div>" + esc(f[1]) + "</div>"; }).join("") + "</div></div>" +
    '<div class="card">' + band("speakerphone", "Què ens expliquen des del terreny") + '<ul class="news">' + c.news.map(function(n){ return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div></div>" +
    (own ? '<div class="card">' + band("target", "La vostra missió") + "<ol><li>Classifiqueu el desastre (fulla de comandament).</li><li>Mireu les vostres 10 cartes: quines us serveixen i quines us sobren?</li>" +
      "<li>Penseu què <b>us falta</b>. Ningú no us ho dirà: ho heu de deduir de l'escenari!</li><li>Busqueu-ho als altres països i demaneu-ho a l'ERCC.</li><li>Doneu el que us sobra: algú altre ho necessita.</li></ol></div>" : "");
}
function country(id){
  var c = G.byId[id], own = id === S.team;
  if (!own){
    var note = S.team === "ERCC" ? "Llegiu l'escenari i apunteu al <b>panell de països</b> el desastre, la causa i l'afectació d'aquest país."
      : "Podeu llegir l'escenari de " + esc(c.name) + " per entendre què necessita. Només el seu equip pot omplir aquesta pestanya.";
    return '<div class="callout lockbox">' + ic("lock") + "<div><b>Pestanya de " + esc(c.name) + " · només lectura.</b><br>" + note + "</div></div>" + scenario(c, false);
  }
  var sub = S.sub[id] || "ctx";
  var nav = subnav(id, [["ctx", "Context", "map-pin"], ["cmd", "Fulla de comandament", "clipboard-check"], ["log", "Full de logística", "package"], ["env", "Sobre i resultat", "mail"]]);
  var html = sub === "cmd" ? command(c) : sub === "log" ? logistics(c) : sub === "env" ? envelope(c) : scenario(c, true);
  return nav + html;
}
function command(c){
  var d = S.c, hasAnal = (S.names.anal || "").trim();
  return '<div class="pagehead"><div><div class="kicker">' + esc(c.name) + " · fulla de comandament</div><h1>Què ha passat i què fem?</h1></div></div>" +
    '<div class="card">' + band("zoom-scan", "1 · Classifiquem el desastre", "responsable: Anàlisi") + G.criteria.map(function(cr){
      return '<div class="crit"><div class="cl">' + esc(cr.label) + "</div>" + chips("cl_" + cr.k, "c.classif." + cr.k, cr.opts, d.classif[cr.k]) + "</div>"; }).join("") + "</div>" +
    '<div class="card">' + band("users", "2 · Víctimes i necessitats", "responsable: Anàlisi + Coordinació") +
      '<div class="field"><label for="vic">Víctimes estimades</label>' + input("c.victimes", d.victimes, "Víctimes estimades", "Ex.: 450").replace("<input", '<input id="vic"') + "</div>" +
      '<div class="field"><label>Què necessita la població?</label>' + textarea("c.needPop", d.needPop, "Què necessita la població", "Aigua, menjar, atenció sanitària, allotjament…") + "</div>" +
      '<div class="field"><label>Què necessiten els equips per treballar?</label>' + textarea("c.needTeam", d.needTeam, "Què necessiten els equips", "Rescat, transport, energia, protecció…") + "</div></div>" +
    '<div class="card">' + band("clipboard-check", "3 · La nostra gestió", "responsable: Coordinació") + "<p>Escriviu <b>una mesura</b> de cada tipus que aplicaríeu al vostre desastre.</p>" +
      G.measures.map(function(m){ return '<div class="field"><label>' + ic(m.icon) + " " + m.name + ' <span class="muted">(' + m.when + ")</span></label>" + textarea("c.measures." + m.k, d.measures[m.k], m.name, "", 2) + "</div>"; }).join("") + "</div>" +
    '<div class="card">' + band("bulb", "4 · Què he après fent el meu rol?", "una frase cadascú") +
      G.roles.country.filter(function(r){ return r.k !== "anal" || hasAnal; }).map(function(r){
        var who = (S.names[r.k] || "").trim();
        return '<div class="field"><label>' + ic(r.icon) + " " + esc(r.name) + (who ? ' · <span class="muted">' + esc(who) + "</span>" : "") +
          (r.k === "coord" && !hasAnal ? ' <span class="muted">(també Anàlisi)</span>' : "") + "</label>" + textarea("c.reflect." + r.k, d.reflect[r.k], "Reflexió de " + r.name, "", 2) + "</div>";
      }).join("") + "</div>";
}
function logistics(c){
  var d = S.c, mem = members(), others = G.countries.filter(function(x){ return x.id !== c.id; });
  var memOpts = [["", "—"]].concat(mem.map(function(m){ return [m.name, m.name]; }));
  var grupOpts = [["", "—"]].concat(others.map(function(x){ return [x.id, x.name]; })).concat([["ERCC", "ERCC"]]);
  var fromOpts = [["", "—"]].concat(others.map(function(x){ return [x.id, x.name]; })).concat([["RES", "Reserva rescEU (ERCC)"]]);
  var toOpts = [["", "Encara no"]].concat(others.map(function(x){ return [x.id, x.name]; }));
  var cons = d.consultes.map(function(r, k){
    return "<tr><td data-l=\"Ronda\">" + selectHTML("c.consultes." + k + ".r", ROUNDS, r.r, "Ronda") + '</td><td data-l="Grup">' + selectHTML("c.consultes." + k + ".g", grupOpts, r.g, "Grup consultat") +
      '</td><td data-l="Recurs">' + selectHTML("c.consultes." + k + ".code", resOptions(), r.code, "Recurs") + '</td><td data-l="El té?">' + selectHTML("c.consultes." + k + ".te", YN, r.te, "El té") +
      '</td><td data-l="Ens el cediria?">' + selectHTML("c.consultes." + k + ".ced", YN, r.ced, "Ens el cediria") +
      '</td><td class="del"><button type="button" class="btn ghost icon small" data-a="del" data-p="c.consultes" data-i="' + k + '" aria-label="Esborra la fila">' + ic("trash") + "</button></td></tr>";
  }).join("");
  var cards = d.cards.map(function(cd, k){
    var p = "c.cards." + k;
    var ctrl = '<div class="ctrl"><div class="seg2" role="radiogroup" aria-label="Què fem amb aquesta carta">' +
      '<label><input type="radio" name="cd' + k + '" value="util" data-b="' + p + '.st" data-r="1"' + (cd.st === "util" ? " checked" : "") + "><span>La necessitem</span></label>" +
      '<label><input type="radio" name="cd' + k + '" value="sobra" data-b="' + p + '.st" data-r="1"' + (cd.st === "sobra" ? " checked" : "") + "><span>Ens sobra</span></label></div>" +
      (cd.st === "sobra" ? '<label class="small"><b>Donada a</b>' + selectHTML(p + ".to", toOpts, cd.to, "Donada a") + "</label>" +
        (cd.to ? '<label class="small"><b>Ronda</b>' + selectHTML(p + ".r", ROUNDS, cd.r, "Ronda") + "</label>" : "") : "") + "</div>";
    return rcard(cd.code, ctrl, cd.st);
  }).join("");
  var reb = d.rebudes.map(function(r, k){
    var warn = (r.code === "CRE" || r.code === "ONG") && r.r === "3" ? '<div class="small koc">' + ic("alert-triangle") + " A la ronda 3 no es poden demanar CRE ni ONG.</div>" : "";
    return '<tr><td data-l="Recurs">' + selectHTML("c.rebudes." + k + ".code", resOptions(), r.code, "Recurs rebut", true) + warn + '</td><td data-l="De qui?">' + selectHTML("c.rebudes." + k + ".from", fromOpts, r.from, "De qui") +
      '</td><td data-l="Ronda">' + selectHTML("c.rebudes." + k + ".r", ROUNDS, r.r, "Ronda", true) + '</td><td data-l="Transport" class="num">' + (r.code ? G.resById[r.code].tr + " UL" : "—") +
      '</td><td class="del"><button type="button" class="btn ghost icon small" data-a="del" data-p="c.rebudes" data-i="' + k + '" aria-label="Esborra la fila">' + ic("trash") + "</button></td></tr>";
  }).join("");
  var used = d.cards.filter(function(x){ return x.st === "util"; }), given = d.cards.filter(function(x){ return x.st === "sobra" && x.to; });
  var lst = function(arr, f){ return arr.length ? arr.map(function(x){ return "<b>" + x.code + "</b> (" + f(x) + ")"; }).join(", ") : '<span class="muted">cap</span>'; };
  return '<div class="pagehead"><div><div class="kicker">' + esc(c.name) + " · full de logística</div><h1>Les nostres cartes i els costos</h1></div></div>" +
    '<div class="card">' + band("messages", "Enllaç de cada ronda", "l'enllaç rota: tothom surt a negociar") + '<div class="grid3">' +
      ["r1", "r2", "r3"].map(function(r, k){ return '<div class="field"><label>Ronda ' + (k + 1) + "</label>" + selectHTML("c.enllac." + r, memOpts, d.enllac[r], "Enllaç ronda " + (k + 1)) + "</div>"; }).join("") + "</div></div>" +
    '<div class="card">' + band("messages", "5 · Registre de consultes", "responsable: Enllaç") +
      '<p class="small muted">Apunteu cada pregunta que feu a un altre grup. Preguntar és lliure i no mou cartes.</p>' +
      '<div class="tblwrap"><table class="tbl stack"><thead><tr><th>Ronda</th><th>Grup consultat</th><th>Recurs que preguntem</th><th>El té?</th><th>Ens el cediria?</th><th><span class="sr">Accions</span></th></tr></thead><tbody>' +
      (cons || '<tr><td colspan="6" class="muted">Encara no heu fet cap consulta.</td></tr>') + "</tbody></table></div>" +
      '<button type="button" class="btn ghost small" data-a="addCons" style="margin-top:8px">' + ic("plus") + "Afegeix una consulta</button></div>" +
    '<div class="card">' + band("package", "6 · Les nostres 10 cartes", "responsable: Logística") +
      "<p>Mireu les cartes de paper que teniu a la taula. Per a cadascuna, decidiu si <b>la necessiteu</b> per al vostre desastre o si <b>us sobra</b>. Quan la doneu a través de l'ERCC, indiqueu a qui.</p>" +
      '<div class="rescards">' + cards + "</div></div>" +
    '<div class="card">' + band("arrows-exchange", "Cartes rebudes", "les que us arriben a través de l'ERCC") +
      '<div class="tblwrap"><table class="tbl stack"><thead><tr><th>Recurs</th><th>De qui?</th><th>Ronda</th><th class="num">Transport</th><th><span class="sr">Accions</span></th></tr></thead><tbody>' +
      (reb || '<tr><td colspan="5" class="muted">Encara no heu rebut cap carta.</td></tr>') + "</tbody></table></div>" +
      '<button type="button" class="btn ghost small" data-a="addReb" style="margin-top:8px">' + ic("plus") + "Afegeix una carta rebuda</button></div>" +
    '<div class="card">' + band("calculator", "7 · Càlcul del cost logístic", "responsable: Logística") +
      '<div class="callout small"><b>A</b> = cost de les cartes pròpies que feu servir: ' + lst(used, function(x){ return G.resById[x.code].cost; }) +
      "<br><b>B</b> = transport de les cartes rebudes: " + lst(d.rebudes.filter(function(x){ return x.code; }), function(x){ return G.resById[x.code].tr; }) +
      "<br><b>C</b> = cost de les cartes que heu donat: " + lst(given, function(x){ return G.resById[x.code].cost; }) + "</div>" +
      '<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">' + [["A", "A · propis"], ["B", "B · transport"], ["C", "C · donat"], ["T", "TOTAL = A + B + C"]].map(function(x){
        return '<div class="field"><label>' + x[1] + "</label>" + input("c.cost." + x[0], d.cost[x[0]], x[1], "UL", "number") + "</div>"; }).join("") + "</div>" +
      '<p class="small muted"><i>Exemple: heu fet servir un USAR i un MED propis (A = 8 + 3 = 11), heu rebut un HEL (B = 0) i heu donat un CAM (C = 4). Total = 11 + 0 + 4 = 15 UL.</i></p></div>';
}
function coverage(c, d){
  var need = c.need.slice(); if (c.gir) need.push(c.gir);
  var have = d.cards.filter(function(x){ return x.st === "util"; }).map(function(x){ return x.code; }).concat(d.rebudes.filter(function(x){ return x.code; }).map(function(x){ return x.code; }));
  var hv = countBy(have), rows = [];
  need.forEach(function(code, k){ var ok = (hv[code] || 0) > 0; if (ok) hv[code]--; rows.push({code:code, ok:ok, gir:c.gir && k === need.length - 1}); });
  return {rows:rows, got:rows.filter(function(r){ return r.ok; }).length, total:rows.length};
}
function envelope(c){
  var d = S.c;
  var head = '<div class="pagehead"><div><div class="kicker">' + esc(c.name) + ' · sobre de resolució</div><h1>Ho hem aconseguit?</h1></div></div>';
  if (!d.env) return head + '<div class="card env">' + ic("mail", "") + '<h2 style="margin:8px 0">Sobre de resolució</h2><p style="margin:0 auto 12px">Obriu-lo <b>només quan el docent ho digui</b> (minut 33). Dins hi ha tot el que necessitàveu per resoldre el desastre.</p>' +
    '<button type="button" class="btn" data-a="openEnv">' + ic("mail-forward") + "Obre el sobre</button></div>";
  var cv = coverage(c, d), cnt = countBy(c.need.concat(c.gir ? [c.gir] : []));
  var gir = G.gir.filter(function(g){ return g.country === c.id; })[0];
  return head + '<div class="card">' + band("mail", "Sobre de resolució · " + esc(c.name), cv.got + " / " + cv.total + " cartes") +
    '<p>Comparem el que necessitàveu amb les cartes que heu marcat com a <b>«La necessitem»</b> i les que heu <b>rebut</b>.</p>' +
    cv.rows.map(function(r){
      return '<div class="need ' + (r.ok ? "ok" : "ko") + '">' + resIc(r.code) + "<b>" + r.code + (cnt[r.code] > 1 && !r.gir ? " <span class=\"muted\">×" + cnt[r.code] + "</span>" : "") + "</b><span>" +
        (r.gir ? "<b>Gir:</b> " + esc(gir ? gir.title.toLowerCase() : "") : esc(c.why[r.code] || "")) + '</span><span class="st">' + (r.ok ? ic("circle-check") + " Ho teniu" : ic("circle-x") + " Us falta") + "</span></div>";
    }).join("") + "</div>" +
    '<div class="card">' + band("target", "8 · Resultat") +
      '<div class="crit"><div class="cl">Hem resolt el desastre?</div>' + chips("resolt", "c.resolt", [["si", "Sí, del tot", "circle-check"], ["part", "En part"], ["no", "No", "circle-x"]], d.resolt) + "</div>" +
      '<div class="field" style="margin-top:10px"><label>Què ens ha faltat i per què?</label>' + textarea("c.falta", d.falta, "Què ens ha faltat i per què", "", 3) + "</div></div>";
}

/* ============================================================ ERCC */
function ercc(){
  if (S.team !== "ERCC"){
    return '<div class="callout lockbox">' + ic("lock") + "<div><b>Pestanya de l'ERCC · només lectura.</b><br>Aquí treballa l'equip del Centre de Coordinació. Per demanar un recurs, ompliu el formulari en paper i porteu-lo a la seva taula.</div></div>" +
      '<div class="card">' + band("world", "Què fa l'ERCC?") + "<p>Rep les sol·licituds de tots els països, comprova que estan ben justificades, autoritza les transferències de cartes i gestiona una petita reserva europea (rescEU). Al final presenta el resultat de l'operació a tota la classe.</p>" +
      '<ol class="steps4">' + G.steps4.map(function(s, k){ return '<li><span class="bubble">' + ic(s[0]) + "</span><div><b>" + (k + 1) + ". " + esc(s[1]) + "</b><br>" + esc(s[2]) + "</div></li>"; }).join("") + "</ol></div>";
  }
  var sub = S.sub.ERCC || "ins";
  var nav = subnav("ERCC", [["ins", "Instruccions", "info-circle"], ["pan", "Panell de països", "chart-bar"], ["reg", "Registre", "clipboard-list"], ["res", "Reserva i girs", "building-warehouse"], ["pre", "Presentació", "presentation"]]);
  return nav + (sub === "pan" ? erccPanel() : sub === "reg" ? erccReg() : sub === "res" ? erccRes() : sub === "pre" ? erccPres() : erccIns());
}
function roleWho(k){ var r = G.roles.ercc.filter(function(x){ return x.k === k; })[0]; var n = (S.names[k] || "").trim() || (k === "seg" ? (S.names.cap || "") + " (Cap de sala)" : ""); return {r:r, n:n}; }
function erccIns(){
  var step = function(k, txt){ var w = roleWho(k); return '<li><span class="bubble">' + ic(w.r.icon) + "</span><div><b>" + esc(w.r.name) + '</b> <span class="muted">' + esc(w.n) + "</span><br>" + txt + "</div></li>"; };
  return '<div class="pagehead"><div><div class="kicker">ERCC · instruccions</div><h1>Sou el cervell de l\'operació</h1></div></div>' +
    '<div class="callout">No teniu bombers ni metges propis: <b>la vostra força és la informació</b>. Sabeu què necessita cada país i qui ho pot donar. Només teniu una reserva rescEU de <b>4 cartes</b>: feu-la servir quan cap país pugui ajudar.</div>' +
    '<div class="card">' + band("clock", "Abans de començar", "minuts 0–12") + "<ul><li>Mentre els països analitzen, passeu per les taules i ompliu el <b>panell de països</b>.</li><li>Prepareu una safata per als formularis en paper i un lloc per a les cartes en trànsit.</li></ul></div>" +
    '<div class="card">' + band("forms", "Cada vegada que arriba un formulari") + '<ol class="steps4">' +
      step("reg", "Posa un número al formulari i l'apunta al <b>Registre</b> de l'app.") +
      step("apa", "Revisa: hi ha el tipus de desastre? L'afectació? Una justificació que tingui sentit? El país que dona hi està d'acord?") +
      step("cap", "Si tot és correcte: <b>Acceptada</b>. Si no: <b>Rebutjada</b> i el país ha de refer el formulari. Recull la carta del país que dona i la lliura.") +
      step("seg", "Marca l'estat <b>Lliurada</b> i actualitza el panell. Si un país ho té tot, el marca com a resolt.") + "</ol></div>" +
    '<div class="card">' + band("building-warehouse", "La reserva rescEU") + "<ul><li>Només la doneu si <b>cap país</b> pot oferir aquell recurs.</li><li>És limitada: si la gasteu massa d'hora, potser us faltarà a la ronda 2. <b>Prioritzeu!</b></li></ul></div>";
}
function erccPanel(){
  var e = S.e, causaO = [["", "—"]].concat(G.criteria[0].opts.map(function(o){ return [o[0], o[1]]; })), afO = [["", "—"]].concat(G.criteria[5].opts.map(function(o){ return [o[0], o[1]]; }));
  var resO = [["", "—"], ["si", "Sí"], ["part", "En part"], ["no", "No"]];
  return '<div class="pagehead"><div><div class="kicker">ERCC · dashboard 1</div><h1>Panell de països</h1></div></div>' +
    '<div class="card">' + band("chart-bar", "Situació de cada país") + '<div class="tblwrap"><table class="tbl stack"><thead><tr><th>País</th><th>Desastre</th><th>Causa</th><th>Afectació</th><th>Què li falta</th><th>Gir</th><th>Resolt?</th></tr></thead><tbody>' +
    G.countries.map(function(c){
      var p = "e.panel." + c.id, v = e.panel[c.id], hasG = Object.prototype.hasOwnProperty.call(e.girs, c.id);
      return '<tr><td data-l="País"><span class="row" style="gap:6px;flex-wrap:nowrap">' + ic(IM.dis[c.id]) + "<b>" + esc(c.name) + '</b></span></td><td data-l="Desastre">' + input(p + ".des", v.des, "Desastre de " + c.name, "Tipus de desastre") +
        '</td><td data-l="Causa">' + selectHTML(p + ".causa", causaO, v.causa, "Causa") + '</td><td data-l="Afectació">' + selectHTML(p + ".afect", afO, v.afect, "Afectació") +
        '</td><td data-l="Què li falta">' + input(p + ".falta", v.falta, "Què li falta a " + c.name, "Codis: USAR, HEL…") +
        '</td><td data-l="Gir">' + (hasG ? (e.girs[c.id] ? '<span class="okc">Anunciat</span>' : '<span class="muted">Pendent</span>') : "—") +
        '</td><td data-l="Resolt?">' + selectHTML(p + ".resolt", resO, v.resolt, "Resolt") + "</td></tr>";
    }).join("") + "</tbody></table></div></div>" + totals();
}
function totals(){
  var e = S.e, reg = e.registre;
  var n = function(st){ return reg.filter(function(r){ return r.st === st; }).length; };
  var res = G.countries.filter(function(c){ return e.panel[c.id].resolt === "si"; }).length;
  var resv = G.reserve.filter(function(k){ return e.reserva[k].to; }).length;
  var box = function(icn, l, v){ return '<div class="card" style="margin:0"><div class="row">' + ic(icn) + '<span class="small muted">' + l + '</span></div><div class="scorebig"><b style="font-size:2rem">' + v + "</b></div></div>"; };
  return '<div class="card">' + band("list-check", "Totals", "es calculen sols a partir del registre i del panell") + '<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">' +
    box("forms", "Sol·licituds registrades", reg.length) + box("circle-check", "Acceptades o lliurades", n("acc") + n("lli")) + box("circle-x", "Rebutjades", n("reb")) +
    box("package", "Cartes rescEU usades", resv + " / 4") + box("flag", "Desastres resolts", res + " / 6") + "</div>" +
    '<div class="field" style="margin-top:12px;max-width:340px"><label>Ajuda mobilitzada (suma de C de tots els països, UL)</label>' + input("e.ajuda", e.ajuda, "Ajuda mobilitzada", "Pregunteu-ho a cada país al final", "number") + "</div></div>";
}
function erccReg(){
  var e = S.e, cO = [["", "—"]].concat(G.countries.map(function(c){ return [c.id, c.name]; }));
  var fromO = cO.concat([["RES", "Reserva rescEU"]]);
  var stO = [["", "—"], ["pen", "Pendent"], ["acc", "Acceptada"], ["reb", "Rebutjada"], ["lli", "Lliurada"]];
  var rows = e.registre.map(function(r, k){
    var p = "e.registre." + k;
    return '<tr><td data-l="Núm." class="num"><b>' + (k + 1) + '</b></td><td data-l="Ronda">' + selectHTML(p + ".r", ROUNDS, r.r, "Ronda") + '</td><td data-l="Demana">' + selectHTML(p + ".to", cO, r.to, "País que demana") +
      '</td><td data-l="Recurs">' + selectHTML(p + ".code", [["", "—"]].concat(G.res.map(function(x){ return [x.code, x.code]; })), r.code, "Recurs") +
      '</td><td data-l="Dona">' + selectHTML(p + ".from", fromO, r.from, "País que dona") + '</td><td data-l="Justificada?">' + selectHTML(p + ".j", YN, r.j, "Justificada", true) +
      '</td><td data-l="Estat">' + selectHTML(p + ".st", stO, r.st, "Estat", true).replace("<select", '<select class="st"') +
      (r.j === "no" && (r.st === "acc" || r.st === "lli") ? '<div class="small koc">' + ic("alert-triangle") + " No justificada: hauria de ser rebutjada.</div>" : "") +
      ((r.code === "CRE" || r.code === "ONG") && r.r === "3" ? '<div class="small koc">' + ic("alert-triangle") + " CRE/ONG no es poden demanar a la ronda 3.</div>" : "") +
      '</td><td class="del"><button type="button" class="btn ghost icon small" data-a="del" data-p="e.registre" data-i="' + k + '" aria-label="Esborra la sol·licitud ' + (k + 1) + '">' + ic("trash") + "</button></td></tr>";
  }).join("");
  return '<div class="pagehead"><div><div class="kicker">ERCC · dashboard 2</div><h1>Registre de sol·licituds</h1></div><span class="spacer"></span>' +
    '<button type="button" class="btn" data-a="addReg">' + ic("plus") + "Nova sol·licitud</button></div>" +
    '<div class="card">' + band("clipboard-list", "Una fila per formulari", "responsable: Registre") + '<div class="tblwrap"><table class="tbl stack"><thead><tr><th class="num">Núm.</th><th>Ronda</th><th>Demana</th><th>Recurs</th><th>Dona</th><th>Justificada?</th><th>Estat</th><th><span class="sr">Accions</span></th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="8" class="muted">Encara no ha arribat cap formulari.</td></tr>') + "</tbody></table></div>" +
    (e.registre.length ? '<button type="button" class="btn ghost small" data-a="addReg" style="margin-top:8px">' + ic("plus") + "Nova sol·licitud</button>" : "") + "</div>" + totals();
}
function erccRes(){
  var e = S.e, cO = [["", "Encara a la reserva"]].concat(G.countries.map(function(c){ return [c.id, c.name]; }));
  return '<div class="pagehead"><div><div class="kicker">ERCC · reserva i girs</div><h1>Reserva rescEU i cartes de gir</h1></div></div>' +
    '<div class="card">' + band("building-warehouse", "Reserva rescEU", "4 cartes") + '<div class="rescards">' + G.reserve.map(function(code){
      var p = "e.reserva." + code, v = e.reserva[code];
      return rcard(code, '<div class="ctrl"><label class="small"><b>Lliurada a</b>' + selectHTML(p + ".to", cO, v.to, "Lliurada a", true) + "</label>" +
        (v.to ? '<label class="small"><b>Ronda</b>' + selectHTML(p + ".r", ROUNDS, v.r, "Ronda") + "</label>" : "") + "</div>", v.to ? "util" : "");
    }).join("") + "</div></div>" +
    '<div class="card">' + band("alert-triangle", "Cartes de gir", "inici de la ronda 2") + "<p>Quan el docent anunciï la ronda 2, el <b>Cap de sala</b> llegeix cada avís en veu alta i lliura la targeta de paper al país. Marqueu-lo com a anunciat.</p>" +
    '<div class="grid2">' + G.gir.map(function(g){
      return '<div class="card" style="margin:0;border-width:2px;border-color:var(--ink)"><div class="band">' + ic("alert-triangle") + "Avís urgent de l'ERCC · ronda 2</div>" +
        '<div class="row" style="flex-wrap:nowrap"><span class="bubble">' + ic(IM.dis[g.country]) + "</span><div><h3>" + esc(G.byId[g.country].name) + "</h3><b>" + esc(g.title) + "</b></div></div>" +
        "<p>" + esc(g.text) + '</p><div class="callout row" style="flex-wrap:nowrap">' + resIc(G.gir.length && ({IT:"USAR", GR:"AVA", DE:"GEN", BE:"HEL"})[g.country]) + "<b>" + esc(g.need) + "</b></div>" +
        '<label class="row" style="margin-top:8px;font-weight:700"><input type="checkbox" data-b="e.girs.' + g.country + '" data-r="1"' + (e.girs[g.country] ? " checked" : "") + ' style="width:22px;height:22px"> Anunciat</label></div>';
    }).join("") + "</div></div>";
}
function erccPres(){
  var e = S.e, hasSeg = (S.names.seg || "").trim();
  return '<div class="pagehead"><div><div class="kicker">ERCC · minuts 48–55</div><h1>La vostra presentació</h1></div></div>' +
    '<div class="card">' + band("presentation", "Guió per presentar a tota la classe") + G.erccQuestions.map(function(q, k){
      return '<div class="field"><label>' + (k + 1) + ". " + esc(q) + "</label>" + textarea("e.present." + k, e.present[k], q, "", 3) + "</div>"; }).join("") + "</div>" +
    '<div class="card">' + band("bulb", "Què he après fent el meu rol?", "una frase cadascú") + G.roles.ercc.filter(function(r){ return r.k !== "seg" || hasSeg; }).map(function(r){
      var who = (S.names[r.k] || "").trim();
      return '<div class="field"><label>' + ic(r.icon) + " " + esc(r.name) + (who ? ' · <span class="muted">' + esc(who) + "</span>" : "") +
        (r.k === "cap" && !hasSeg ? ' <span class="muted">(també Seguiment)</span>' : "") + "</label>" + textarea("e.reflect." + r.k, e.reflect[r.k], "Reflexió de " + r.name, "", 2) + "</div>";
    }).join("") + "</div>";
}

/* ============================================================ render i esdeveniments */
function render(){
  renderTabs();
  var v = $("#view"), t = S.tab;
  if (t === "result" && S.finished) window.Results.render(S, v, UI);
  else if (t === "guia") v.innerHTML = guide();
  else if (t === "ERCC") v.innerHTML = ercc();
  else if (G.byId[t]) v.innerHTML = country(t);
  else { S.tab = "guia"; v.innerHTML = guide(); }
}
function go(tab){ S.tab = tab; save(); render(); window.scrollTo(0, 0); }

function onField(e){
  var el = e.target.closest("[data-b]"); if (!el || !S) return;
  var val = el.type === "checkbox" ? el.checked : el.value;
  setP(S, el.getAttribute("data-b"), val);
  if (el.getAttribute("data-b").indexOf(".st") > 0 && el.getAttribute("data-b").indexOf("c.cards") === 0 && val === "util"){
    var base = el.getAttribute("data-b").replace(/\.st$/, ""); setP(S, base + ".to", ""); setP(S, base + ".r", "");
  }
  save();
  if (e.type === "change" && (el.hasAttribute("data-r") || el.tagName === "SELECT" && /c\.cards|e\.reserva/.test(el.getAttribute("data-b")))){
    var y = window.scrollY, id = el.id || null, path = el.getAttribute("data-b"); render(); window.scrollTo(0, y);
    var back = document.querySelector('[data-b="' + path + '"]' + (el.type === "radio" ? '[value="' + el.value + '"]' : "")); if (back) back.focus({preventScroll:true});
  }
}
function onAction(e){
  var b = e.target.closest("[data-a], [data-tab]"); if (!b) return;
  if (b.hasAttribute("data-tab")){ go(b.getAttribute("data-tab")); return; }
  var a = b.getAttribute("data-a"), y = window.scrollY;
  if (a === "wizNext"){ S.wizard = (S.wizard || 0) + 1; save(); render(); window.scrollTo(0, 0); return; }
  if (a === "wizPrev"){ S.wizard = Math.max(0, (S.wizard || 0) - 1); save(); render(); window.scrollTo(0, 0); return; }
  if (a === "wizDone"){ S.wizardDone = true; S.wizard = 0; go(S.team); toast("Som-hi! Aquesta és la pestanya del vostre equip."); return; }
  if (a === "sub"){ S.sub[S.tab] = b.getAttribute("data-s"); save(); render(); window.scrollTo(0, 0); return; }
  if (a === "addCons"){ S.c.consultes.push({r:"", g:"", code:"", te:"", ced:""}); }
  else if (a === "addReb"){ S.c.rebudes.push({code:"", from:"", r:""}); }
  else if (a === "addReg"){ var last = S.e.registre[S.e.registre.length - 1]; S.e.registre.push({r:last ? last.r : "1", to:"", code:"", from:"", j:"", st:"pen"}); }
  else if (a === "del"){
    var arr = getP(S, b.getAttribute("data-p")), i = +b.getAttribute("data-i");
    modal('<h2 id="modalTitle">Esborrar la fila?</h2><p>Aquesta acció no es pot desfer.</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-close>Cancel·la</button><button class="btn" id="mOk">Esborra</button></div>',
      function(box, close){ box.querySelector("#mOk").onclick = function(){ arr.splice(i, 1); save(); close(); render(); window.scrollTo(0, y); }; });
    return;
  }
  else if (a === "openEnv"){
    modal('<h2 id="modalTitle">' + ic("mail") + ' Obrir el sobre?</h2><p>Obriu-lo només quan el docent ho indiqui. Un cop obert, veureu tot el que necessitàveu.</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-close>Encara no</button><button class="btn" id="mOk">Obre\'l</button></div>',
      function(box, close){ box.querySelector("#mOk").onclick = function(){ S.c.env = true; save(); close(); render(); }; });
    return;
  }
  else return;
  save(); render(); window.scrollTo(0, y);
  if (a === "addReg" || a === "addCons" || a === "addReb"){ var sels = $$("#view tbody tr:last-child select"); if (sels[0]) sels[0].focus(); }
}
function finish(){
  modal('<h2 id="modalTitle">' + ic("device-floppy") + ' Heu acabat l\'operació?</h2><p>Calcularem la vostra puntuació segons la rúbrica i veureu el resultat. Després podreu escriure observacions i descarregar el PDF per a Classroom.</p><p class="small muted">Si cal, podreu tornar a les pestanyes i continuar editant.</p>' +
    '<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-close>Encara no</button><button class="btn" id="mOk">Guardar i veure el resultat</button></div>',
    function(box, close){ box.querySelector("#mOk").onclick = function(){ S.finished = true; S.finishedAt = Date.now(); save(true); close(); go("result"); }; });
}

/* ------------------------------------------------------------ arrencada */
var UI = {ic:ic, resIc:resIc, esc:esc, save:save, render:render, toast:toast, modal:modal, teamName:teamName, members:members, coverage:coverage, roleList:roleList, go:go};
function start(team, names, fresh){
  KEY = stateKey(team);
  var prev = loadState(team);
  S = prev && !fresh ? prev : blank(team, names);
  S.names = names;
  if (!S.wizardDone && S.tab !== "guia") S.tab = "guia";
  save(true);
  var t = team === "ERCC" ? {icon:"world", name:"ERCC"} : {icon:IM.dis[team], name:G.byId[team].name};
  $("#teamChip").innerHTML = ic(t.icon) + esc(t.name) + ' <span class="muted" style="font-weight:400">· ' + members().length + " persones</span>";
  $$("[data-icon]").forEach(function(el){ el.innerHTML = ic(el.getAttribute("data-icon")); });
  var view = $("#view");
  view.addEventListener("input", onField); view.addEventListener("change", onField);
  document.addEventListener("click", onAction);
  $("#finishBtn").onclick = finish;
  $("#logout").onclick = function(){
    modal('<h2 id="modalTitle">Sortir?</h2><p>El vostre treball queda desat en aquest navegador. Si torneu a entrar amb el mateix equip, el recuperareu.</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-close>Cancel·la</button><button class="btn" id="mOk">Surt</button></div>',
      function(box){ box.querySelector("#mOk").onclick = function(){ save(true); try { localStorage.removeItem("ercc-session"); } catch(e) {} location.reload(); }; });
  };
  initA11y();
  render();
}
window.ERCC = {start:start, loadState:loadState, applyPrefs:applyPrefs, ic:ic, esc:esc, modal:modal};
window.UI = UI;
})();
