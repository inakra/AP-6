import { api } from "./api.js";
import { state } from "./state.js";
import { renderListe, BL } from "./list.js";
import { mailtoLinks } from "./mail.js";
import { wendeRechteAn } from "./permissions.js";

const $ = (id) => document.getElementById(id);
let timer, abbruch;

// Debounce + Abbruch veralteter Anfragen (schont das nginx-Rate-Limit)
function laden(sofort = false) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    abbruch?.abort(); abbruch = new AbortController();
    $("result-count").textContent = "Lade Daten …";
    try {
      const daten = await api.zentren(state, abbruch.signal);
      if (daten) renderListe(daten, auswahlGeaendert, () => laden(true));
    } catch (e) {
      if (e.name !== "AbortError") $("result-count").textContent = "Die Liste konnte nicht geladen werden. Bitte Seite neu laden.";
    }
  }, sofort ? 0 : 300);
}

function auswahlGeaendert() {
  $("selected-count").textContent = state.selected.size;
  $("send-mail").disabled = state.selected.size === 0;
  $("mail-parts").replaceChildren();
  $("mail-warning").hidden = true;
}

function mailErstellen() {
  const teile = mailtoLinks([...state.selected.values()].map((c) => c.email).filter(Boolean));
  if (teile.length === 1) { window.location.href = teile[0].url; return; }
  // Zu groß für einen Link: Nutzer öffnet die Teile einzeln (Popup-Blocker verhindern Automatik)
  $("mail-warning").hidden = false;
  $("mail-warning").textContent = `Die Auswahl passt nicht in eine E-Mail und wird auf ${teile.length} E-Mails aufgeteilt.`;
  $("mail-parts").replaceChildren(...teile.map((t, i) => {
    const a = document.createElement("a");
    a.href = t.url; a.className = "mail-part";
    a.textContent = `E-Mail ${i + 1} von ${teile.length} (${t.anzahl} Adressen)`;
    return a;
  }));
}

function setze(key, wert) { state[key] = wert; state.seite = 1; laden(key === "search" ? false : true); }

async function start() {
  wendeRechteAn();
  try {
    for (const k of (await api.bundeslaender()) ?? []) {
      const o = document.createElement("option");
      o.value = k; o.textContent = BL[k] || k;
      $("bundesland-filter").append(o);
    }
  } catch { /* Filter bleibt auf "Alle" */ }
  $("search").addEventListener("input", (e) => setze("search", e.target.value.trim()));
  $("bundesland-filter").addEventListener("change", (e) => setze("bundesland", e.target.value));
  $("angebot-filter").addEventListener("change", (e) => setze("angebot", e.target.value));
  $("select-all").addEventListener("click", () =>
    document.querySelectorAll('#center-list input[type="checkbox"]:not(:disabled):not(:checked)')
      .forEach((cb) => { cb.checked = true; cb.dispatchEvent(new Event("change")); }));
  $("select-none").addEventListener("click", () => {
    state.selected.clear();
    document.querySelectorAll('#center-list input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    auswahlGeaendert();
  });
  $("send-mail").addEventListener("click", mailErstellen);
  auswahlGeaendert(); laden(true);
}
start();
