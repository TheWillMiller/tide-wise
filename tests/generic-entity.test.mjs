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
    tide_time_mode: "as_is",
    tide_time_zone: "",
    time_offset_minutes: 0,
    height_offset: 0,
    ...config
  };
  return card;
}

{
  const card = createCard();
  const hilo = card._buildGenericEntityHilo({
    attributes: {
      predictions: [
        { time: "12/06/2026 06:14", height: 0.42, type: "low" },
        { time: "12/06/2026 12:28", height: 0.91, type: "high" },
        { time: "12/06/2026 18:37", height: 0.31, type: "low" }
      ]
    }
  });

  assert(hilo.length === 3, "day-first prediction rows should parse");
  assert(hilo[0].t === "2026-06-12 06:14", `day-first local time changed to ${hilo[0].t}`);
  assert(hilo[0].type === "L" && hilo[1].type === "H", "explicit high/low type mapping failed");
}

{
  const card = createCard({ units: "english" });
  const hilo = card._buildGenericEntityHilo({
    attributes: {
      events: [
        ["2026-06-12T06:14:00+02:00", 1.0, "L"],
        ["2026-06-12T12:28:00+02:00", 2.0, "H"]
      ]
    }
  });

  assert(hilo[0].v === "3.281", `metric-to-English conversion failed: ${hilo[0].v}`);
}

{
  const card = createCard({ tide_time_mode: "utc" });
  const parsed = card._parseGenericEntityTime("2026-06-12 06:14");

  assert(parsed.toISOString() === "2026-06-12T06:14:00.000Z", `UTC parse failed: ${parsed.toISOString()}`);
}

{
  const card = createCard({ tide_time_mode: "utc" });
  const hilo = card._buildGenericEntityHilo({
    attributes: {
      tide_predictions: [
        { time_utc: "2026-06-12 06:14", height_m: 0.44, tide: "laagwater" },
        { time_utc: "2026-06-12 12:28", height_m: 0.92, tide: "hoogwater" }
      ]
    }
  });

  assert(hilo.length === 2, "alternate field aliases should parse");
  assert(hilo[0].type === "L" && hilo[1].type === "H", "alternate tide labels should map to high/low");
  assert(hilo[1].v === "0.920", `alternate height alias failed: ${hilo[1].v}`);
}

{
  const card = createCard();
  const parsed = card._parseGenericEntityTime("31/02/2026 06:14");

  assert(Number.isNaN(parsed.getTime()), "invalid day-first dates should not roll over");
}

console.log("generic entity tests passed");
