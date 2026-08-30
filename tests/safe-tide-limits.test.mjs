global.window = { customCards: [], devicePixelRatio: 1 };
global.getComputedStyle = () => ({ getPropertyValue: () => "" });

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
const TideWiseCardEditor = registry.get("tidewise-card-editor");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createCard(config = {}) {
  const card = new TideWiseCard();
  card._config = {
    units: "english",
    theme_mode: "tidewise",
    minimum_safe_tide: null,
    maximum_safe_tide: null,
    ...config
  };
  return card;
}

{
  const card = createCard();
  card._render = () => {};
  card._fetchData = () => {};
  card.setConfig({
    provider: "noaa_coops",
    station: "8726520",
    minimum_safe_tide: 0,
    maximum_safe_tide: "4.2"
  });

  assert(card._config.minimum_safe_tide === 0, "zero should remain a valid minimum safe tide");
  assert(card._config.maximum_safe_tide === 4.2, "numeric strings should normalize to a safe-tide number");
  assert(card._safeTideLimits().length === 2, "both safe-tide limits should be available to the chart");
}

{
  const card = createCard();
  card._render = () => {};
  card._fetchData = () => {};
  card.setConfig({
    provider: "noaa_coops",
    station: "8726520",
    minimum_safe_tide: "",
    maximum_safe_tide: "not-a-number"
  });

  assert(card._config.minimum_safe_tide === null, "blank minimum safe tide should disable the line");
  assert(card._config.maximum_safe_tide === null, "invalid maximum safe tide should disable the line");
}

{
  const editor = new TideWiseCardEditor();
  editor._config = { minimum_safe_tide: 1.1 };
  editor._emitConfig = (next) => { editor._config = next; };
  editor._setOptionalNumber("minimum_safe_tide", "");
  assert(!("minimum_safe_tide" in editor._config), "clearing the editor field should remove the minimum limit");
  editor._setOptionalNumber("minimum_safe_tide", "0");
  assert(editor._config.minimum_safe_tide === 0, "the editor should preserve zero as an optional limit");
}

{
  const textLabels = [];
  const shadedAreas = [];
  const context = {
    scale() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    stroke() {},
    fill() {},
    arc() {},
    quadraticCurveTo() {},
    setLineDash() {},
    save() {},
    restore() {},
    fillRect: (...args) => shadedAreas.push(args),
    fillText: (label) => textLabels.push(label),
    measureText: (label) => ({ width: label.length * 6 })
  };
  const card = createCard({ minimum_safe_tide: 0.5, maximum_safe_tide: 3.5 });
  card._chartCanvas = {
    offsetWidth: 340,
    offsetHeight: 95,
    getContext: () => context
  };

  card._drawChart([
    { t: "2026-08-30 00:00", v: "1.0" },
    { t: "2026-08-30 06:00", v: "3.0" },
    { t: "2026-08-30 12:00", v: "1.2" }
  ], new Date(2026, 7, 30, 6, 0), 3, "ft", null, null, []);

  assert(textLabels.includes("MIN 0.5ft"), "chart should label the minimum safe tide");
  assert(textLabels.includes("MAX 3.5ft"), "chart should label the maximum safe tide");
  assert(shadedAreas.length === 2, "chart should shade water levels outside both safe-tide limits");
  assert(shadedAreas.every(([, , , height]) => height > 0), "chart scale should keep out-of-range limits inside the plot");
}

console.log("safe tide limit tests passed");
