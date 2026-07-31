global.window = { customCards: [] };

const registry = new Map();

global.customElements = {
  get: (name) => registry.get(name),
  define: (name, cls) => registry.set(name, cls)
};

global.HTMLElement = class {
  attachShadow() {
    return { innerHTML: "", getElementById: () => null };
  }

  setAttribute() {}
};

global.requestAnimationFrame = (callback) => callback();

await import(`file:///${process.cwd().replace(/\\/g, "/")}/tidewise-card.js`);

const TideWiseCard = registry.get("tidewise-card");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createCard(config = {}) {
  const card = new TideWiseCard();
  card._config = {
    units: "metric",
    time_offset_minutes: 0,
    height_offset: 0,
    ...config
  };
  return card;
}

{
  const card = createCard({ time_offset_minutes: 60, height_offset: 0.12 });
  const rows = card._normalizeCanadaSeriesRows([
    { eventDate: "2026-07-31T08:49:00Z", value: 3.195 },
    { eventDate: "invalid", value: 4.2 },
    { eventDate: "2026-07-31T13:23:00Z", value: "invalid" }
  ]);

  assert(rows.length === 1, "invalid CHS rows should be removed");
  assert(rows[0].time.toISOString() === "2026-07-31T09:49:00.000Z", `CHS minute offset failed: ${rows[0].time.toISOString()}`);
  assert(rows[0].value.toFixed(3) === "3.315", `CHS metric height offset failed: ${rows[0].value}`);
}

{
  const card = createCard({ units: "english", height_offset: 0.25 });
  const rows = card._normalizeCanadaSeriesRows([
    { eventDate: "2026-01-31T09:49:00Z", value: 1 }
  ]);

  assert(rows[0].value.toFixed(3) === "3.531", `CHS English height conversion/offset failed: ${rows[0].value}`);
}

{
  process.env.TZ = "America/Vancouver";
  const card = createCard();
  assert(card._formatNoaaTime(new Date("2026-07-31T08:49:00Z")) === "2026-07-31 01:49", "CHS summer timestamp should follow Pacific daylight time");
  assert(card._formatNoaaTime(new Date("2026-01-31T09:49:00Z")) === "2026-01-31 01:49", "CHS winter timestamp should follow Pacific standard time");
}

{
  const card = createCard();
  assert(card._canadaStationCodeFromInput("07780") === "07780", "numeric CHS code should be accepted");
  assert(card._canadaStationCodeFromInput("code:07780") === "07780", "prefixed CHS code should be accepted");
  assert(card._canadaStationCodeFromInput("5cebf1e43d0f4a073c4bc45a") === "", "CHS object ID should not be treated as a station code");
}

console.log("Canada CHS tests passed");
