// Rechte an EINER Stelle. ACHTUNG: Ausblenden ist keine Sicherheit, das Backend muss prüfen.
// AP6-FEHLT (AP1): Rollen fehlen im Session-User (auth.py speichert nur sub/email/name).
//   Nötig: Rollen-Claim in der Session + Ausgabe über /auth/me oder im Template.
let rechte = new Set(["suche.lesen", "mail.erstellen"]); // vorläufig: jeder Login darf beides
export const hatRecht = (r) => rechte.has(r);
export const setzeRechte = (liste) => { rechte = new Set(liste); };
export function wendeRechteAn() {
  document.querySelectorAll("[data-recht]").forEach((el) => { el.hidden = !hatRecht(el.dataset.recht); });
}
