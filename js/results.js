/* Operació ERCC · resultat: puntuació per rúbrica, detall per accions, gràfics i PDF per a Classroom */
(function(){
"use strict";
var G = window.GAME;

/* ------------------------------------------------------------ utilitats */
function num(v){ if (v == null) return null; var s = String(v).replace(/\./g, "").replace(",", ".").match(/-?\d+(\.\d+)?/); return s ? parseFloat(s[0]) : null; }
function filled(s, n){ return String(s || "").replace(/\s+/g, " ").trim().length >= (n || 10); }
function level(f, cuts){ cuts = cuts || [.85, .65, .4]; return f >= cuts[0] ? 4 : f >= cuts[1] ? 3 : f >= cuts[2] ? 2 : 1; }
function countBy(arr){ var o = {}; arr.forEach(function(x){ o[x] = (o[x] || 0) + 1; }); return o; }
function hasKey(text, keys){ var t = String(text || "").toLowerCase(); return keys.some(function(k){ return t.indexOf(k) >= 0; }); }
function teamLabel(S){ return S.team === "ERCC" ? "ERCC · Centre de Coordinació" : G.byId[S.team].name; }
function dec(n){ return String(n).replace(".", ","); }
function grade(p){ return p >= 90 ? "Excel·lent" : p >= 70 ? "Notable" : p >= 60 ? "Bé" : p >= 50 ? "Suficient" : "Insuficient"; }

/* ============================================================ PUNTUACIÓ · PAÍS */
function scoreCountry(S, UI){
  var c = G.byId[S.team], d = S.c, key = G.key[S.team], R = G.rubric.country, out = [];
  var mem = UI.members(), size = mem.length;

  /* 1. Classificació */
  var ev = [], ok = 0;
  G.criteria.forEach(function(cr){
    var v = d.classif[cr.k], right = Array.isArray(key[cr.k]) ? key[cr.k].indexOf(v) >= 0 : key[cr.k] === v;
    if (right) ok++;
    var lab = v ? cr.opts.filter(function(o){ return o[0] === v; })[0][1] : "sense resposta";
    ev.push({ok:right, t:cr.label + ": " + lab});
  });
  out.push({r:R[0], lv:level(ok / 8, [1, .75, .5]), ev:ev, sum:ok + " de 8 criteris correctes"});

  /* 2. Necessitats i justificació */
  var ownC = countBy(c.own), extC = countBy(c.extra), utilC = {}, sobC = {};
  d.cards.forEach(function(x){ if (x.st === "util") utilC[x.code] = (utilC[x.code] || 0) + 1; if (x.st === "sobra") sobC[x.code] = (sobC[x.code] || 0) + 1; });
  var triage = 0; Object.keys(countBy(c.own.concat(c.extra))).forEach(function(k){ triage += Math.min(utilC[k] || 0, ownC[k] || 0) + Math.min(sobC[k] || 0, extC[k] || 0); });
  var needAll = c.need.concat(c.gir ? [c.gir] : []), missing = countBy(needAll);
  d.cards.forEach(function(x){ if (x.st === "util" && missing[x.code]) missing[x.code]--; });
  var reb = d.rebudes.filter(function(x){ return x.code; }), useful = 0, mm = JSON.parse(JSON.stringify(missing));
  reb.forEach(function(x){ if (mm[x.code] > 0){ useful++; mm[x.code]--; } });
  var vic = num(d.victimes), vicOk = vic != null && vic >= key.victimes * .5 && vic <= key.victimes * 2;
  var needTxt = (filled(d.needPop, 15) ? 1 : 0) + (filled(d.needTeam, 15) ? 1 : 0);
  var fN = triage / 10 * .45 + needTxt / 2 * .2 + (vicOk ? .1 : 0) + (reb.length ? useful / reb.length : 0) * .25;
  out.push({r:R[1], lv:level(fN), sum:triage + "/10 cartes ben triades · " + useful + "/" + reb.length + " cartes rebudes útils", ev:[
    {ok:triage >= 8, t:"Triatge de les 10 cartes (necessitem / sobra): " + triage + " encerts"},
    {ok:vicOk, t:"Víctimes estimades: " + (d.victimes || "sense resposta") + (vicOk ? "" : " (referència de l'escenari: " + key.victimes.toLocaleString("ca-ES") + ")")},
    {ok:filled(d.needPop, 15), t:"Necessitats de la població descrites"},
    {ok:filled(d.needTeam, 15), t:"Necessitats dels equips descrites"},
    {ok:reb.length > 0 && useful === reb.length, t:"Cartes rebudes que realment necessitàveu: " + useful + " de " + reb.length}
  ]});

  /* 3. Gestió per fases (orientativa: el docent revisa el text) */
  var ph = G.measures.map(function(m){
    var t = d.measures[m.k], f = filled(t, 12), kw = f && hasKey(t, G.measureKeys[m.k]);
    return {m:m, f:f, kw:kw};
  });
  var adequate = ph.filter(function(p){ return p.kw; }).length, partial = ph.filter(function(p){ return p.f && !p.kw; }).length;
  out.push({r:R[2], lv:Math.min(4, 1 + adequate + (partial >= 2 ? 1 : 0) * (adequate < 3 ? 1 : 0)), auto:true,
    sum:adequate + " mesures adequades de 3", ev:ph.map(function(p){
      return {ok:p.kw, t:p.m.name + ": " + (p.f ? (p.kw ? "mesura coherent amb la fase" : "escrita, però no queda clar que sigui de " + p.m.name.toLowerCase()) : "sense resposta")}; })});

  /* 4. Cost logístic */
  var A = 0, B = 0, C = 0;
  d.cards.forEach(function(x){ var r = G.resById[x.code]; if (x.st === "util") A += r.cost; if (x.st === "sobra" && x.to) C += r.cost; });
  reb.forEach(function(x){ B += G.resById[x.code].tr; });
  var T = A + B + C, st = d.cost, comp = [["A", A], ["B", B], ["C", C], ["T", T]], k4 = 0;
  var ce = comp.map(function(p){ var v = num(st[p[0]]), good = v != null && v === p[1]; if (good) k4++;
    return {ok:good, t:(p[0] === "T" ? "Total" : p[0]) + ": heu escrit " + (v == null ? "—" : v) + " · amb les vostres cartes surt " + p[1] + " UL"}; });
  out.push({r:R[3], lv:k4 === 4 ? 4 : k4 === 3 ? 3 : k4 === 2 ? 2 : 1, sum:k4 + " de 4 càlculs correctes", ev:ce, calc:{A:A, B:B, C:C, T:T, sA:num(st.A), sB:num(st.B), sC:num(st.C), sT:num(st.T)}});

  /* 5. Participació dels rols */
  var reflRoles = G.roles.country.filter(function(r){ return (S.names[r.k] || "").trim(); });
  var refl = reflRoles.filter(function(r){ return filled(d.reflect[r.k], 10); }).length;
  var enl = {}; ["r1", "r2", "r3"].forEach(function(r){ if (d.enllac[r]) enl[d.enllac[r]] = 1; });
  var rot = Object.keys(enl).length, rotOk = rot >= Math.min(3, size);
  var cons = d.consultes.filter(function(x){ return x.g && x.code; }).length;
  var fR = refl / Math.max(1, reflRoles.length) * .5 + (rotOk ? .25 : rot / 3 * .25) + Math.min(1, cons / 3) * .25;
  out.push({r:R[4], lv:level(fR), sum:refl + "/" + reflRoles.length + " reflexions · " + rot + " enllaços diferents · " + cons + " consultes", ev:[
    {ok:refl === reflRoles.length, t:"Reflexions de rol escrites: " + refl + " de " + reflRoles.length},
    {ok:rotOk, t:"L'enllaç ha rotat entre " + rot + " persones"},
    {ok:cons >= 3, t:"Consultes a altres grups registrades: " + cons}
  ]});

  var cov = UI.coverage(c, d);
  var rounds = [1, 2, 3].map(function(r){ return {r:r,
    cons:d.consultes.filter(function(x){ return x.r === String(r); }).length,
    reb:d.rebudes.filter(function(x){ return x.r === String(r) && x.code; }).length,
    don:d.cards.filter(function(x){ return x.st === "sobra" && x.to && x.r === String(r); }).length}; });
  return {items:out, cov:cov, rounds:rounds, extra:{donades:d.cards.filter(function(x){ return x.st === "sobra" && x.to; }).length, rebudes:reb.length, consultes:cons}};
}

/* ============================================================ PUNTUACIÓ · ERCC */
function scoreErcc(S){
  var e = S.e, R = G.rubric.ercc, out = [], reg = e.registre;
  var complete = reg.filter(function(r){ return r.r && r.to && r.code && r.from && r.j && r.st && r.st !== "pen"; }).length;
  var fReg = reg.length ? Math.min(reg.length, 28) / 28 * .6 + complete / reg.length * .4 : 0;
  out.push({r:R[0], lv:level(fReg), sum:reg.length + " sol·licituds · " + complete + " completes", ev:[
    {ok:reg.length >= 20, t:"Sol·licituds registrades: " + reg.length + " (en una partida completa n'hi ha unes 28)"},
    {ok:reg.length > 0 && complete === reg.length, t:"Files amb totes les dades i un estat final: " + complete + " de " + reg.length}]});

  var valid = {QBR:["BE"], EMT:["FR"], CAM:["DE", "GR", "PL"], AVA:["GR"]}, rOk = 0, rev = [];
  G.reserve.forEach(function(k){ var to = e.reserva[k].to, good = to && valid[k].indexOf(to) >= 0; if (good) rOk++;
    rev.push({ok:!!good, t:"rescEU " + k + ": " + (to ? "lliurada a " + G.byId[to].name : "no lliurada") + (good ? "" : " (qui la necessitava: " + valid[k].map(function(x){ return G.byId[x].name; }).join(", ") + ")")}); });
  var judged = reg.filter(function(r){ return r.j && r.st && r.st !== "pen"; });
  var cons = judged.filter(function(r){ return (r.j === "no") === (r.st === "reb"); }).length;
  var rej = reg.filter(function(r){ return r.st === "reb"; }).length;
  var fV = rOk / 4 * .6 + (judged.length ? cons / judged.length : 0) * .4;
  out.push({r:R[1], lv:level(fV), sum:rOk + "/4 cartes rescEU ben assignades · " + rej + " rebutjades", ev:rev.concat([
    {ok:judged.length > 0 && cons === judged.length, t:"Decisions coherents (no justificada = rebutjada): " + cons + " de " + judged.length}])});

  var key = G.key, pOk = 0, pev = [];
  G.countries.forEach(function(c){ var v = e.panel[c.id], n = 0;
    if (filled(v.des, 4)) n++; if (v.causa === key[c.id].causa) n++; if (v.afect === key[c.id].afectacio) n++; if (v.resolt) n++;
    pOk += n; pev.push({ok:n === 4, t:c.name + ": " + n + "/4 dades correctes al panell"}); });
  var ans = e.present.filter(function(t){ return filled(t, 20); }).length;
  var fP = pOk / 24 * .6 + ans / 3 * .4;
  out.push({r:R[2], lv:level(fP), sum:pOk + "/24 dades del panell · " + ans + "/3 respostes", ev:pev.concat([{ok:ans === 3, t:"Preguntes de la presentació respostes: " + ans + " de 3"}])});

  var reflRoles = G.roles.ercc.filter(function(r){ return (S.names[r.k] || "").trim(); });
  var refl = reflRoles.filter(function(r){ return filled(e.reflect[r.k], 10); }).length;
  var girs = Object.keys(e.girs).filter(function(k){ return e.girs[k]; }).length;
  var fC = refl / Math.max(1, reflRoles.length) * .7 + girs / 4 * .3;
  out.push({r:R[3], lv:level(fC), sum:refl + "/" + reflRoles.length + " reflexions · " + girs + "/4 girs anunciats", ev:[
    {ok:refl === reflRoles.length, t:"Reflexions de rol escrites: " + refl + " de " + reflRoles.length},
    {ok:girs === 4, t:"Cartes de gir anunciades: " + girs + " de 4"}]});

  var st = {pen:0, acc:0, reb:0, lli:0}; reg.forEach(function(r){ if (st[r.st] != null) st[r.st]++; });
  var byC = G.countries.map(function(c){ return {id:c.id, n:reg.filter(function(r){ return r.to === c.id; }).length}; });
  var rounds = [1, 2, 3].map(function(r){ return {r:r, n:reg.filter(function(x){ return x.r === String(r); }).length}; });
  var resolved = G.countries.filter(function(c){ return e.panel[c.id].resolt === "si"; }).length;
  return {items:out, st:st, byC:byC, rounds:rounds, resolved:resolved};
}

function compute(S, UI){
  var r = S.team === "ERCC" ? scoreErcc(S) : scoreCountry(S, UI);
  r.items.forEach(function(it){ it.pts = Math.round(it.lv / 4 * it.r.w * 10) / 10; });
  r.total = Math.round(r.items.reduce(function(a, it){ return a + it.pts; }, 0) * 10) / 10;
  return r;
}

/* ============================================================ GRÀFICS (SVG) */
function barsH(items){ /* rúbrica: barres horitzontals obtingut / màxim */
  var h = 34, W = 520, L = 190, top = 6, H = top + items.length * h + 4;
  var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Punts per criteri de la rúbrica">';
  items.forEach(function(it, i){
    var y = top + i * h, w = (W - L - 70), f = it.pts / it.r.w;
    s += '<text x="0" y="' + (y + 17) + '" font-size="13">' + it.r.name + "</text>" +
      '<rect x="' + L + '" y="' + (y + 5) + '" width="' + w + '" height="16" rx="5" fill="var(--soft)"/>' +
      '<rect x="' + L + '" y="' + (y + 5) + '" width="' + Math.max(2, w * f) + '" height="16" rx="5" fill="' + (f >= .75 ? "var(--ok)" : f >= .5 ? "var(--c4)" : "var(--bad)") + '"/>' +
      '<text x="' + (W - 2) + '" y="' + (y + 18) + '" font-size="13" text-anchor="end" font-weight="700">' + it.pts + " / " + it.r.w + "</text>";
  });
  return s + "</svg>";
}
function donut(parts, center, label){
  var tot = parts.reduce(function(a, p){ return a + p.v; }, 0) || 1, R = 54, C = 2 * Math.PI * R, off = 0;
  var s = '<svg viewBox="0 0 160 160" role="img" aria-label="' + label + '"><g transform="rotate(-90 80 80)">';
  s += '<circle cx="80" cy="80" r="' + R + '" fill="none" stroke="var(--soft)" stroke-width="22"/>';
  parts.forEach(function(p){ var len = p.v / tot * C; if (p.v) s += '<circle cx="80" cy="80" r="' + R + '" fill="none" stroke="' + p.c + '" stroke-width="22" stroke-dasharray="' + len + " " + (C - len) + '" stroke-dashoffset="' + (-off) + '"/>'; off += len; });
  return s + '</g><text x="80" y="78" text-anchor="middle" font-size="26" font-weight="700">' + center[0] + '</text><text x="80" y="98" text-anchor="middle" font-size="12">' + center[1] + "</text></svg>";
}
function barsV(groups, series, label){ /* barres verticals agrupades */
  var W = 340, H = 190, B = 26, Lp = 26, max = 1;
  groups.forEach(function(g){ series.forEach(function(s){ max = Math.max(max, g.v[s.k] || 0); }); });
  max = Math.ceil(max * 1.15);
  var gw = (W - Lp - 6) / groups.length, bw = Math.min(26, (gw - 12) / series.length);
  var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + label + '">';
  for (var t = 0; t <= 2; t++){ var yy = H - B - (H - B - 12) * t / 2; s += '<line x1="' + Lp + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" stroke="var(--line)" stroke-width="1"/>' +
    '<text x="' + (Lp - 5) + '" y="' + (yy + 4) + '" font-size="10" text-anchor="end">' + Math.round(max * t / 2) + "</text>"; }
  groups.forEach(function(g, i){
    var x0 = Lp + i * gw + (gw - bw * series.length) / 2;
    series.forEach(function(se, j){ var v = g.v[se.k] || 0, hh = (H - B - 12) * v / max;
      s += '<rect x="' + (x0 + j * bw) + '" y="' + (H - B - hh) + '" width="' + (bw - 3) + '" height="' + hh + '" rx="3" fill="' + se.c + '"><title>' + se.n + ": " + v + "</title></rect>";
      if (v) s += '<text x="' + (x0 + j * bw + (bw - 3) / 2) + '" y="' + (H - B - hh - 3) + '" font-size="10" text-anchor="middle">' + v + "</text>"; });
    s += '<text x="' + (Lp + i * gw + gw / 2) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" font-weight="700">' + g.l + "</text>";
  });
  return s + "</svg>";
}
function legend(series){ return '<div class="legend">' + series.map(function(s){ return '<span><i style="background:' + s.c + '"></i>' + s.n + "</span>"; }).join("") + "</div>"; }

/* ============================================================ VISTA */
function render(S, view, UI){
  var r = compute(S, UI), ic = UI.ic, esc = UI.esc, isE = S.team === "ERCC";
  var names = UI.members().map(function(m){ return '<div><span class="small muted">' + esc(m.role) + "</span><br><b>" + esc(m.name) + "</b></div>"; }).join("");
  var rub = r.items.map(function(it){
    return '<div class="ri"><span class="bubble" style="width:36px;height:36px">' + ic(it.r.icon) + "</span><div><b>" + it.r.name + "</b> " +
      '<span class="lvdots" aria-label="Nivell ' + it.lv + ' de 4">' + [1, 2, 3, 4].map(function(k){ return '<i class="' + (k <= it.lv ? "on" : "") + '"></i>'; }).join("") + "</span>" +
      (it.auto ? ' <span class="auto">orientativa</span>' : "") +
      '<div class="bar"><i style="width:' + (it.pts / it.r.w * 100) + '%"></i></div><div class="lv">Nivell ' + it.lv + " · " + esc(it.r.lv[it.lv - 1]) + "</div></div>" +
      '<span class="pts">' + dec(it.pts) + " / " + it.r.w + "</span></div>";
  }).join("");
  var acts = r.items.map(function(it){
    return '<div class="card">' + '<div class="band">' + ic(it.r.icon) + "<span>" + it.r.name + "</span><small>" + dec(it.pts) + " / " + it.r.w + " punts · " + esc(it.sum) + "</small></div>" +
      '<table class="tbl"><tbody>' + it.ev.map(function(e){ return "<tr><td>" + (e.ok ? '<span class="okc">' + ic("circle-check") + '</span>' : '<span class="koc">' + ic("circle-x") + "</span>") + "</td><td>" + esc(e.t) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }).join("");
  var charts;
  if (isE){
    charts = '<div class="card chart"><b>Estat de les sol·licituds</b>' + donut([{v:r.st.lli, c:"var(--ok)"}, {v:r.st.acc, c:"var(--c3)"}, {v:r.st.reb, c:"var(--bad)"}, {v:r.st.pen, c:"var(--line)"}],
        [String(r.st.lli + r.st.acc + r.st.reb + r.st.pen), "sol·licituds"], "Estat de les sol·licituds") +
        legend([{n:"Lliurades " + r.st.lli, c:"var(--ok)"}, {n:"Acceptades " + r.st.acc, c:"var(--c3)"}, {n:"Rebutjades " + r.st.reb, c:"var(--bad)"}, {n:"Pendents " + r.st.pen, c:"var(--line)"}]) + "</div>" +
      '<div class="card chart"><b>Sol·licituds per país</b>' + barsV(r.byC.map(function(x){ return {l:x.id, v:{n:x.n}}; }), [{k:"n", n:"Sol·licituds", c:"var(--c2)"}], "Sol·licituds per país") + "</div>" +
      '<div class="card chart"><b>Activitat per ronda</b>' + barsV(r.rounds.map(function(x){ return {l:"R" + x.r, v:{n:x.n}}; }), [{k:"n", n:"Sol·licituds", c:"var(--c3)"}], "Sol·licituds per ronda") + "</div>";
  } else {
    var cv = r.cov, cc = r.items[3].calc;
    charts = '<div class="card chart"><b>Necessitats cobertes</b>' + donut([{v:cv.got, c:"var(--ok)"}, {v:cv.total - cv.got, c:"var(--bad)"}], [cv.got + "/" + cv.total, "cartes"], "Necessitats cobertes") +
        legend([{n:"Cobertes " + cv.got, c:"var(--ok)"}, {n:"Us falten " + (cv.total - cv.got), c:"var(--bad)"}]) + "</div>" +
      '<div class="card chart"><b>Cost logístic (UL)</b>' + barsV([{l:"A", v:{s:cc.sA || 0, k:cc.A}}, {l:"B", v:{s:cc.sB || 0, k:cc.B}}, {l:"C", v:{s:cc.sC || 0, k:cc.C}}, {l:"Total", v:{s:cc.sT || 0, k:cc.T}}],
        [{k:"s", n:"El vostre càlcul", c:"var(--c2)"}, {k:"k", n:"Segons les vostres cartes", c:"var(--c3)"}], "Cost logístic") +
        legend([{n:"El vostre càlcul", c:"var(--c2)"}, {n:"Segons les vostres cartes", c:"var(--c3)"}]) + "</div>" +
      '<div class="card chart"><b>Activitat per ronda</b>' + barsV(r.rounds.map(function(x){ return {l:"R" + x.r, v:{c:x.cons, r:x.reb, d:x.don}}; }),
        [{k:"c", n:"Consultes", c:"var(--c3)"}, {k:"r", n:"Rebudes", c:"var(--ok)"}, {k:"d", n:"Donades", c:"var(--c2)"}], "Activitat per ronda") +
        legend([{n:"Consultes", c:"var(--c3)"}, {n:"Cartes rebudes", c:"var(--ok)"}, {n:"Cartes donades", c:"var(--c2)"}]) + "</div>";
  }
  var resolvedLine = isE ? r.resolved + " de 6 desastres marcats com a resolts" : "Necessitats cobertes: " + r.cov.got + " de " + r.cov.total;
  view.innerHTML =
    '<div class="pagehead"><div><div class="kicker">Resultat · ' + esc(teamLabel(S)) + "</div><h1>" + ic("chart-bar") + " Com ha anat l'operació?</h1></div></div>" +
    '<div class="grid2"><div class="card">' + '<div class="band">' + ic("award") + "<span>Puntuació</span><small>segons la rúbrica</small></div>" +
      '<div class="scorebig"><b>' + String(r.total).replace(".", ",") + "</b><span>/ 100</span></div>" +
      '<p><span class="grade">' + grade(r.total) + "</span> · nota " + String(Math.round(r.total) / 10).replace(".", ",") + " / 10</p>" +
      '<p class="small muted">' + esc(resolvedLine) + "</p></div>" +
      '<div class="card">' + '<div class="band">' + ic("users") + "<span>Equip</span><small>" + esc(teamLabel(S)) + '</small></div><div class="grid2" style="gap:8px">' + names + "</div></div></div>" +
    '<div class="card">' + '<div class="band">' + ic("list-check") + "<span>Valoració segons la rúbrica</span></div>" + '<div class="rub">' + rub + "</div>" +
      '<p class="small muted" style="margin-top:10px">' + ic("info-circle") + " La puntuació es calcula automàticament a partir del que heu omplert. Els criteris marcats com a <span class=\"auto\">orientativa</span> depenen de textos que el docent revisarà.</p></div>" +
    '<h2 style="margin:22px 0 10px">Gràfics</h2><div class="charts">' + charts + "</div>" +
    '<h2 style="margin:22px 0 10px">Puntuació per accions</h2><div class="acts">' + acts + "</div>" +
    '<div class="card">' + '<div class="band">' + ic("notes") + "<span>Notes o observacions</span><small>s'inclouen al PDF</small></div>" +
      '<textarea id="notes" rows="4" aria-label="Notes o observacions" placeholder="Què ha funcionat? Què canviaríeu? Hi ha res que el docent hagi de saber?">' + esc(S.notes) + "</textarea></div>" +
    '<div class="card noprint" style="text-align:center">' +
      '<p style="margin:0 auto 12px">Premeu <b>Guardar</b> per descarregar el PDF amb el resultat i els vostres noms. Després <b>pugeu-lo a la tasca de Google Classroom</b>.</p>' +
      '<div class="row" style="justify-content:center"><button type="button" class="btn ghost" id="backEdit">' + ic("chevron-left") + "Tornar a editar</button>" +
      '<button type="button" class="btn" id="pdfBtn">' + ic("file-download") + "Guardar i descarregar el PDF</button></div></div>";
  var notes = view.querySelector("#notes");
  notes.addEventListener("input", function(){ S.notes = notes.value; UI.save(); });
  view.querySelector("#backEdit").onclick = function(){ UI.go(S.team); };
  view.querySelector("#pdfBtn").onclick = function(){ S.notes = notes.value; S.pdfAt = Date.now(); UI.save(true); pdf(S, compute(S, UI), UI); };
}

/* ============================================================ PDF (jsPDF, A4) */
function pdfText(s){ /* jsPDF amb lletres estàndard: només Latin-1 */
  return String(s == null ? "" : s).replace(/[‘’]/g, "'").replace(/[“”«»]/g, '"').replace(/[–—]/g, "-")
    .replace(/→/g, "->").replace(/…/g, "...").replace(/ /g, " ").replace(/[^\x00-\xFF]/g, "");
}
function pdf(S, r, UI){
  if (!window.jspdf || !window.jspdf.jsPDF){ UI.toast("Encara s'està carregant el generador de PDF. Torneu-ho a provar en uns segons."); return; }
  var doc = new window.jspdf.jsPDF({unit:"mm", format:"a4"}), W = 210, M = 16, y = 0, isE = S.team === "ERCC";
  var T = function(s){ return pdfText(s); };
  var ink = [17, 22, 20], soft = [232, 237, 229], okc = [29, 107, 57], bad = [163, 32, 28], amb = [138, 90, 0], acc = [176, 64, 12], blue = [42, 93, 159];
  var need = function(h){ if (y + h > 282){ footer(); doc.addPage(); y = 16; } };
  var footer = function(){ doc.setFontSize(8); doc.setTextColor(110); doc.text(T("Operació ERCC · 0053 Logística sanitària en emergències · TES"), M, 290);
    doc.text(String(doc.getNumberOfPages()), W - M, 290, {align:"right"}); doc.setTextColor(ink[0], ink[1], ink[2]); };
  var band = function(t){ need(12); doc.setFillColor(20, 26, 23); doc.rect(M, y, W - 2 * M, 8, "F"); doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5);
    doc.text(T(t), M + 3, y + 5.5); doc.setTextColor(ink[0], ink[1], ink[2]); y += 12; };
  var para = function(t, size, style){ doc.setFont("helvetica", style || "normal"); doc.setFontSize(size || 10); var ls = doc.splitTextToSize(T(t), W - 2 * M);
    ls.forEach(function(l){ need(5); doc.text(l, M, y); y += (size || 10) * .45; }); };

  /* Capçalera */
  doc.setFillColor(20, 26, 23); doc.rect(0, 0, W, 34, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text(T("OPERACIÓ ERCC"), M, 15);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(T("Informe de resultat · " + teamLabel(S)), M, 22);
  doc.text(T(new Date(S.finishedAt || Date.now()).toLocaleString("ca-ES")), M, 28);
  doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.text(T(String(r.total).replace(".", ",")), W - M - 18, 19, {align:"right"});
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text("/ 100", W - M, 19, {align:"right"}); doc.text(T(grade(r.total) + " · " + String(Math.round(r.total) / 10).replace(".", ",") + " / 10"), W - M, 27, {align:"right"});
  doc.setTextColor(ink[0], ink[1], ink[2]); y = 44;

  band("Equip");
  var mem = UI.members(); doc.setFontSize(10);
  mem.forEach(function(m, i){ var x = M + (i % 2) * 89, yy = y + Math.floor(i / 2) * 10; doc.setFont("helvetica", "normal"); doc.setTextColor(90); doc.text(T(m.role), x, yy);
    doc.setTextColor(ink[0], ink[1], ink[2]); doc.setFont("helvetica", "bold"); doc.text(T(m.name), x, yy + 4.5); });
  y += Math.ceil(mem.length / 2) * 10 + 2;

  band("Valoració segons la rúbrica");
  r.items.forEach(function(it){
    need(16); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.text(T(it.r.name + (it.auto ? " (orientativa)" : "")), M, y);
    doc.text(T(String(it.pts).replace(".", ",") + " / " + it.r.w), W - M, y, {align:"right"});
    var bw = W - 2 * M, f = it.pts / it.r.w, col = f >= .75 ? okc : f >= .5 ? amb : bad;
    doc.setFillColor(soft[0], soft[1], soft[2]); doc.roundedRect(M, y + 2, bw, 3.5, 1.5, 1.5, "F");
    doc.setFillColor(col[0], col[1], col[2]); doc.roundedRect(M, y + 2, Math.max(1.5, bw * f), 3.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(80);
    doc.text(doc.splitTextToSize(T("Nivell " + it.lv + " de 4 · " + it.r.lv[it.lv - 1] + " · " + it.sum), W - 2 * M), M, y + 10);
    doc.setTextColor(ink[0], ink[1], ink[2]); y += 16;
  });

  /* Gràfic de barres (resum) */
  band(isE ? "Sol·licituds per país" : "Necessitats i cost logístic");
  need(52);
  var drawBars = function(groups, series, x0, w, h){
    var max = 1; groups.forEach(function(g){ series.forEach(function(s){ max = Math.max(max, g.v[s.k] || 0); }); }); max = Math.ceil(max * 1.15);
    doc.setDrawColor(200); doc.line(x0, y + h, x0 + w, y + h);
    var gw = w / groups.length, bw = Math.min(8, (gw - 4) / series.length);
    groups.forEach(function(g, i){ var gx = x0 + i * gw + (gw - bw * series.length) / 2;
      series.forEach(function(s, j){ var v = g.v[s.k] || 0, hh = (h - 6) * v / max; doc.setFillColor(s.c[0], s.c[1], s.c[2]); doc.rect(gx + j * bw, y + h - hh, bw - 1, hh, "F");
        doc.setFontSize(7); if (v) doc.text(String(v), gx + j * bw + (bw - 1) / 2, y + h - hh - 1, {align:"center"}); });
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.text(T(g.l), x0 + i * gw + gw / 2, y + h + 4, {align:"center"}); doc.setFont("helvetica", "normal"); });
  };
  var leg = function(series, x, yy){ doc.setFontSize(8); series.forEach(function(s, i){ doc.setFillColor(s.c[0], s.c[1], s.c[2]); doc.rect(x, yy + i * 5 - 2.5, 3, 3, "F"); doc.text(T(s.n), x + 5, yy + i * 5); }); };
  if (isE){
    drawBars(r.byC.map(function(x){ return {l:x.id, v:{n:x.n}}; }), [{k:"n", c:acc}], M, 100, 40);
    leg([{n:"Lliurades: " + r.st.lli, c:okc}, {n:"Acceptades: " + r.st.acc, c:blue}, {n:"Rebutjades: " + r.st.reb, c:bad}, {n:"Pendents: " + r.st.pen, c:[180, 180, 180]}, {n:"Desastres resolts: " + r.resolved + " / 6", c:ink}], M + 112, y + 8);
  } else {
    var cc = r.items[3].calc;
    drawBars([{l:"A", v:{s:cc.sA || 0, k:cc.A}}, {l:"B", v:{s:cc.sB || 0, k:cc.B}}, {l:"C", v:{s:cc.sC || 0, k:cc.C}}, {l:"Total", v:{s:cc.sT || 0, k:cc.T}}], [{k:"s", c:acc}, {k:"k", c:blue}], M, 100, 40);
    leg([{n:"El vostre càlcul", c:acc}, {n:"Segons les vostres cartes", c:blue}, {n:"Necessitats cobertes: " + r.cov.got + " / " + r.cov.total, c:okc},
         {n:"Consultes: " + r.extra.consultes + " · Rebudes: " + r.extra.rebudes + " · Donades: " + r.extra.donades, c:ink}], M + 112, y + 8);
  }
  y += 50;

  band("Puntuació per accions");
  r.items.forEach(function(it){
    need(10); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(T(it.r.name + " · " + String(it.pts).replace(".", ",") + " / " + it.r.w), M, y); y += 5;
    it.ev.forEach(function(e){ var ls = doc.splitTextToSize(T(e.t), W - 2 * M - 14); need(ls.length * 4.3 + 1);
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); var c = e.ok ? okc : bad; doc.setTextColor(c[0], c[1], c[2]); doc.text(e.ok ? "SI" : "NO", M + 2, y);
      doc.setTextColor(ink[0], ink[1], ink[2]); doc.setFont("helvetica", "normal"); doc.text(ls, M + 12, y); y += ls.length * 4.3 + .8; });
    y += 3;
  });

  band("Notes o observacions de l'equip");
  para(S.notes && S.notes.trim() ? S.notes : "(sense observacions)", 10);
  y += 4;
  need(10); doc.setFontSize(8); doc.setTextColor(110);
  doc.text(doc.splitTextToSize(T("Puntuació calculada automàticament per l'aplicació a partir del treball de l'equip. Els criteris orientatius depenen de textos que revisa el docent."), W - 2 * M), M, y);
  footer();

  var slug = T(teamLabel(S)).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/_+$/, "");
  var d = new Date(), stamp = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  doc.save("Operacio_ERCC_" + slug + "_" + stamp + ".pdf");
  UI.toast("PDF descarregat. Pugeu-lo a Classroom.");
}

window.Results = {render:render, compute:compute, pdf:pdf};
})();
