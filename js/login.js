/* Accés: equip + nom i cognoms per rol + contrasenya comuna (es compara la seva empremta SHA-256) */
(function(){
  "use strict";
  var PASS_SHA256 = "a017f2a772b109f4ab9073155516fd71797d3a1fc329f228f35fb087050f8eb8";
  var SKEY = "ercc-session";
  var G = window.GAME, E = window.ERCC;
  var form = document.getElementById("lgForm"), err = document.getElementById("lgErr");
  var teamSel = document.getElementById("lgTeam"), namesBox = document.getElementById("lgNames"), grid = document.getElementById("lgNameGrid");
  E.applyPrefs();

  G.teams.forEach(function(t){ var o = document.createElement("option"); o.value = t.id; o.textContent = t.name; teamSel.appendChild(o); });

  function roles(team){ return team === "ERCC" ? G.roles.ercc : G.roles.country; }
  function drawNames(){
    var team = teamSel.value;
    if (!team){ namesBox.hidden = true; grid.innerHTML = ""; return; }
    var prev = E.loadState(team), keep = {};
    Array.prototype.forEach.call(grid.querySelectorAll("input"), function(i){ keep[i.dataset.k] = i.value; });
    grid.innerHTML = roles(team).map(function(r){
      var v = keep[r.k] != null ? keep[r.k] : (prev && prev.names && prev.names[r.k]) || "";
      return '<div class="namerow"><span class="badge">' + E.ic(r.icon) + '</span><div><label for="nm_' + r.k + '">' + E.esc(r.name) +
        (r.optional ? ' <span class="opt">(opcional)</span>' : "") + '</label><input type="text" id="nm_' + r.k + '" data-k="' + r.k + '" autocomplete="off" placeholder="Nom i cognoms" value="' + E.esc(v) + '">' +
        (r.optional ? '<p class="hint">' + E.esc(r.opt) + "</p>" : "") + "</div></div>";
    }).join("");
    namesBox.hidden = false;
  }
  teamSel.addEventListener("change", function(){ err.textContent = ""; drawNames(); var f = grid.querySelector("input"); if (f) f.focus(); });

  function hex(buf){ return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function clean(s){ return s.replace(/\s+/g, " ").trim(); }
  function sameNames(a, b){ return Object.keys(b).every(function(k){ return clean(a[k] || "").toLowerCase() === clean(b[k] || "").toLowerCase(); }); }

  function enter(team, names, fresh){
    document.getElementById("login").hidden = true; document.getElementById("app").hidden = false;
    try { localStorage.setItem(SKEY, JSON.stringify({team:team, names:names})); } catch(e) {}
    E.start(team, names, fresh);
  }

  var saved = null; try { saved = JSON.parse(localStorage.getItem(SKEY) || "null"); } catch(e) {}
  if (saved && saved.team && saved.names){ enter(saved.team, saved.names); return; }
  teamSel.focus();

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var team = teamSel.value;
    if (!team){ err.textContent = "Tria primer quin equip sou."; teamSel.focus(); return; }
    var names = {}, missing = null, short = null;
    roles(team).forEach(function(r){
      var inp = document.getElementById("nm_" + r.k), v = clean(inp.value);
      names[r.k] = v;
      if (!r.optional && !v && !missing) missing = inp;
      if (v && v.split(" ").length < 2 && !short) short = inp;
    });
    if (missing){ err.textContent = "Falta el nom del rol «" + missing.previousElementSibling.textContent.replace(" (opcional)", "") + "». Només l'últim rol pot quedar buit."; missing.focus(); return; }
    if (short){ err.textContent = "Escriviu el nom i, com a mínim, un cognom."; short.focus(); return; }
    var pass = document.getElementById("lgPass").value;
    if (!window.crypto || !crypto.subtle){ err.textContent = "Aquest navegador no pot validar l'accés. Feu servir Chrome, Edge, Firefox o Safari actualitzats."; return; }
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass)).then(function(buf){
      if (hex(buf) !== PASS_SHA256){ err.textContent = "La contrasenya no és correcta. Torneu-ho a provar."; document.getElementById("lgPass").select(); return; }
      err.textContent = "";
      var prev = E.loadState(team);
      if (prev && prev.names && !sameNames(prev.names, names)){
        E.modal('<h2 id="modalTitle">Ja hi ha una partida desada d\'aquest equip</h2><p>En aquest navegador hi ha treball desat de <b>' + E.esc(team === "ERCC" ? "l'ERCC" : G.byId[team].name) +
          "</b> amb altres noms. Què voleu fer?</p><div class=\"row\" style=\"justify-content:flex-end;margin-top:14px\"><button class=\"btn ghost\" id=\"mKeep\">Continuar-la</button><button class=\"btn\" id=\"mNew\">Començar de zero</button></div>",
          function(box){ box.querySelector("#mKeep").onclick = function(){ document.getElementById("modal").hidden = true; enter(team, names, false); };
                         box.querySelector("#mNew").onclick = function(){ document.getElementById("modal").hidden = true; enter(team, names, true); }; });
        return;
      }
      enter(team, names, false);
    });
  });
})();
