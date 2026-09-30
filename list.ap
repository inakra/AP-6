import { state } from "./state.js";

// Bundesland-Kürzel -> Name (API liefert nur Kürzel, z.B. "SN")
export const BL = { BW: "Baden-Württemberg", BY: "Bayern", BE: "Berlin", BB: "Brandenburg", HB: "Bremen",
  HH: "Hamburg", HE: "Hessen", MV: "Mecklenburg-Vorpommern", NI: "Niedersachsen", NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz", SL: "Saarland", SN: "Sachsen", ST: "Sachsen-Anhalt", SH: "Schleswig-Holstein", TH: "Thüringen" };
const ANGEBOTE = { pflegestuetzpunkt: "Pflegestützpunkt", pflegeberatung: "Pflegeberatung", wohnberatung: "Wohnberatung",
  demenzberatung: "Demenzberatung", angehoerigenberatung: "Angehörigenberatung", betreuungsberatung: "Betreuungsberatung" };

const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text) n.textContent = text;   // textContent statt innerHTML: kein XSS über Daten
  if (cls) n.className = cls;
  return n;
};

export function renderListe(daten, beiAuswahl, neuLaden) {
  const { items, total } = daten;
  const ul = document.getElementById("center-list");
  ul.replaceChildren();
  for (const c of items) {
    const li = el("li", null, "center-item");
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.id = "center-" + c.id;
    cb.checked = state.selected.has(c.id);
    cb.disabled = !c.email;
    cb.addEventListener("change", () => {
      cb.checked ? state.selected.set(c.id, { name: c.name, email: c.email }) : state.selected.delete(c.id);
      beiAuswahl();
    });
    const label = el("label"); label.htmlFor = cb.id;
    label.append(el("div", c.name, "name"),
      el("div", [c.adresse, [c.plz, c.ort].filter(Boolean).join(" "), BL[c.bundesland] || c.bundesland].filter(Boolean).join(" · "), "meta"));
    const tags = Object.keys(ANGEBOTE).filter((k) => c[k]).map((k) => ANGEBOTE[k]);
    if (tags.length) label.append(el("div", tags.join(", "), "meta"));
    if (c.telefon) label.append(el("div", "Tel.: " + c.telefon, "meta"));
    // AP6-FEHLT: Detailansicht (Website, Leistungen, Karte); Datenquelle und "zuletzt aktualisiert"
    //   (updated_at steht in der CSV, fehlt aber in models.py/schemas.py -> AP2/AP4).
    if (!c.email) label.append(el("div", "Keine E-Mail-Adresse hinterlegt – kann nicht ausgewählt werden.", "no-email"));
    li.append(cb, label);
    ul.append(li);
  }
  document.getElementById("result-count").textContent = items.length
    ? `${total} Treffer, Seite ${state.seite} von ${Math.max(1, Math.ceil(total / state.proSeite))}`
    : "Keine Treffer. Suchbegriff kürzen oder Filter zurücksetzen.";
  renderPager(total, neuLaden);
}

function renderPager(total, neuLaden) {
  const nav = document.getElementById("pager");
  nav.replaceChildren();
  const letzte = Math.ceil(total / state.proSeite);
  if (letzte <= 1) return;
  const btn = (text, ziel, aus) => {
    const b = el("button", text); b.type = "button"; b.disabled = aus;
    b.onclick = () => { state.seite = ziel; neuLaden(); window.scrollTo({ top: 0 }); };
    return b;
  };
  nav.append(btn("Zurück", state.seite - 1, state.seite <= 1), el("span", `Seite ${state.seite} von ${letzte}`),
    btn("Weiter", state.seite + 1, state.seite >= letzte));
}
