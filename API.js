// EINZIGE Stelle mit fetch(). Angepasst an routers/centers.py:
// GET /api/centers?search&bundesland&angebot&limit&offset -> {total, items}
async function get(url, signal) {
  // redirect:"manual": Die Middleware antwortet bei abgelaufener Session mit einem
  // Redirect auf /auth/login statt 401. So erkennen wir das, statt HTML als JSON zu lesen.
  // AP6-FEHLT (AP1): Backend soll für /api/* echtes 401 liefern, dann reicht der Statuscheck.
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal, redirect: "manual" });
  if (res.type === "opaqueredirect" || res.status === 401) {
    window.location.href = "/auth/login?next=" + encodeURIComponent(location.pathname);
    return null;
  }
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

export const api = {
  zentren({ search, bundesland, angebot, seite, proSeite }, signal) {
    const p = new URLSearchParams({ limit: proSeite, offset: (seite - 1) * proSeite });
    if (search) p.set("search", search);
    if (bundesland) p.set("bundesland", bundesland);
    if (angebot) p.set("angebot", angebot);
    return get("/api/centers?" + p, signal);
  },
  bundeslaender: () => get("/api/bundeslaender"),
  // AP6-FEHLT (AP5): historieMelden(meta), historie(params)  -> Endpunkte gibt es noch nicht.
  // AP6-FEHLT (AP2/AP1): anlegen/aendern/loeschen -> erst nach PostgreSQL + Rollen + CSRF.
  //   Achtung: CORSMiddleware erlaubt aktuell nur GET (main.py).
};
