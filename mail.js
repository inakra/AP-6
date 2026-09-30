// mailto mit BCC (Pflicht laut AP5). Nach URL-LÄNGE aufteilen (Outlook ca. 1800-2000 Zeichen).
// AP6-FEHLT (AP5): Limit mit echten Mailprogrammen testen; Betreff/Text-Maske, Vorlagen,
//   Historie-Meldung. SMTP wäre eine zweite Implementierung derselben Funktion.
const MAX_LAENGE = 1800;
export const BETREFF = "Anfrage Pflege-/Beratungsstelle";

export function mailtoLinks(adressen, betreff = BETREFF) {
  const basis = "mailto:?subject=" + encodeURIComponent(betreff) + "&bcc=";
  const teile = [];
  let cur = [], len = basis.length;
  for (const a of adressen) {
    const enc = encodeURIComponent(a);
    const add = enc.length + (cur.length ? 1 : 0);
    if (cur.length && len + add > MAX_LAENGE) {
      teile.push({ url: basis + cur.join(","), anzahl: cur.length });
      cur = []; len = basis.length;
    }
    len += enc.length + (cur.length ? 1 : 0);
    cur.push(enc);
  }
  if (cur.length) teile.push({ url: basis + cur.join(","), anzahl: cur.length });
  return teile;
}
