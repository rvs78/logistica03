# Operació ERCC · Sis països, un sol mecanisme

Activitat en grup de **0053 Logística sanitària en emergències** (CFGM TES): gestió de desastres, protecció civil i ajuda internacional.
Sis grups representen sis països europeus amb un desastre cadascun i un setè grup fa d'**ERCC** (Centre de Coordinació de la Resposta a Emergències).

L'app és el **quadern de treball digital** de cada equip. Les cartes de recurs són de paper i es mouen per la classe.

## Com funciona
1. **Accés**: l'equip tria el seu país o l'ERCC, escriu el nom i cognoms de cada rol (l'últim rol és opcional per a grups de 3) i la contrasenya del curs.
2. **Guia** en 6 passos (com el dossier en paper): què passa, missió i regles, rellotge i 4 passos per demanar un recurs, cartes, rols i fitxa de suport.
3. **Pestanyes**: cada país té context, fulla de comandament, full de logística (consultes, triatge de les 10 cartes, cartes rebudes, cost) i sobre de resolució. L'ERCC té panell de països, registre de sol·licituds, reserva rescEU, cartes de gir i guió de presentació. Les pestanyes dels altres equips són de només lectura.
4. **Guardar**: calcula la puntuació segons la rúbrica, mostra el detall per accions i gràfics, permet escriure observacions i descarrega un **PDF amb els noms** per pujar a Google Classroom.

El treball es desa automàticament al navegador (localStorage). No hi ha servidor ni base de dades: cada grup treballa al seu dispositiu.

## Fitxers
- `index.html` · accés i estructura
- `js/data.js` · escenaris, cartes, matriu, solucionari i rúbrica (generat a partir del material en paper)
- `js/app.js` · estat, guia, pestanyes i fulls editables
- `js/results.js` · puntuació, gràfics i PDF (jsPDF 2.5.1)
- `js/login.js` · accés (la contrasenya es compara per empremta SHA-256)
- `version.json` · força la recàrrega quan es publica una versió nova (cal pujar també `window.APP_VERSION` a `index.html`)

## Crèdits
Icones: [Tabler Icons](https://tabler.io/icons), llicència MIT. Lletres: Atkinson Hyperlegible, Lexend, IBM Plex Mono i Saira Stencil One (Google Fonts).
