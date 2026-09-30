export const state = {
  search: "", bundesland: "", angebot: "",
  seite: 1,
  proSeite: 50,          // Server-Maximum ist 500 (routers/centers.py)
  selected: new Map(),   // id -> {name, email}; bleibt über Seiten/Filter erhalten
};
