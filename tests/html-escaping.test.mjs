import assert from "node:assert/strict";
import test from "node:test";

// Match the existing tests' lightweight host; inspect the actual HTML sinks.
global.window = { customCards: [], devicePixelRatio: 1 };
global.getComputedStyle = () => ({ getPropertyValue: () => "" });
const registry = new Map();
global.customElements = {
  get: (name) => registry.get(name),
  define: (name, cls) => registry.set(name, cls)
};
global.HTMLElement = class {
  attachShadow() {
    this.shadowRoot = { innerHTML: "", getElementById: () => null };
    return this.shadowRoot;
  }
  setAttribute() {}
};
global.requestAnimationFrame = (callback) => callback();
await import("../tidewise-card.js");
const TideWiseCard = registry.get("tidewise-card");
const TideWiseCardEditor = registry.get("tidewise-card-editor");

const payload = `"><img src=x onerror=alert('tidewise')>&`;
const escaped = "&quot;&gt;&lt;img src=x onerror=alert(&#39;tidewise&#39;)&gt;&amp;";

function createCard(config = {}) {
  const card = new TideWiseCard();
  const root = { innerHTML: "" };
  card.shadowRoot.getElementById = (id) => id === "root" ? root : null;
  card._config = {
    title: "TideWise",
    provider: "noaa_coops",
    station: "8661070",
    units: "english",
    show_fishing_score: false,
    ...config
  };
  const now = Date.now();
  card._data = {
    predictions: [
      { t: new Date(now - 3600000).toISOString(), v: "1" },
      { t: new Date(now + 3600000).toISOString(), v: "2" }
    ],
    hilo: []
  };
  return { card, root };
}

test("card title is escaped at the HTML sink", () => {
  const { card, root } = createCard({ title: payload });
  card._renderData();
  assert.ok(root.innerHTML.includes(`<div class="title">${escaped}</div>`));
  assert.ok(!root.innerHTML.includes("<img"));
});

for (const [provider, prefix, field] of [
  ["noaa_coops", "NOAA", "station"],
  ["chs_iwls", "CHS", "ca_station_code"],
  ["ukho_entity", "UKHO", "ukho_entity"],
  ["generic_entity", "HA", "tide_entity"]
]) {
  test(`${provider} station label is escaped`, () => {
    const entityBacked = provider.endsWith("_entity");
    const { card, root } = createCard({
      provider,
      [field]: entityBacked ? "sensor.tide" : payload
    });
    card._hass = {
      states: { "sensor.tide": { attributes: { friendly_name: `${payload} Tides` } } }
    };
    card._renderData();
    assert.ok(root.innerHTML.includes(`<div class="subtitle">${prefix} ${escaped}</div>`));
    assert.ok(!root.innerHTML.includes("<img"));
  });
  if (provider.endsWith("_entity")) {
    test(`${provider} entity ID fallback is escaped`, () => {
      const { card, root } = createCard({ provider, [field]: payload });
      card._renderData();
      assert.ok(root.innerHTML.includes(`<div class="subtitle">${prefix} ${escaped}</div>`));
    });
  }
}

test("error messages render markup, quotes and ampersands as text", () => {
  const { card, root } = createCard();
  for (const prefix of ["", "CHS tide data unavailable: ", "Tide entity not found: "]) {
    card._renderError(prefix + payload);
    assert.equal(root.innerHTML, `<div class="error">${prefix}${escaped}</div>`);
  }
});

test("ordinary text, existing entities and error fallback retain their meaning", () => {
  const { card, root } = createCard({ title: "Harbor &amp; Bay" });
  card._renderData();
  assert.ok(root.innerHTML.includes('<div class="title">Harbor &amp;amp; Bay</div>'));
  assert.ok(root.innerHTML.includes('<div class="subtitle">NOAA 8661070</div>'));
  card._renderError("Station unavailable");
  assert.equal(root.innerHTML, '<div class="error">Station unavailable</div>');
  for (const value of ["", null, undefined]) {
    card._renderError(value);
    assert.equal(root.innerHTML, '<div class="error">Could not load tide data</div>');
  }
});

test("CHS editor escapes API station IDs, names and codes", () => {
  const editor = new TideWiseCardEditor();
  editor._canadaStations = [{
    id: payload, name: payload, code: payload, region: "atlantic"
  }];
  editor.setConfig({ provider: "chs_iwls", ca_station: payload });
  assert.ok(editor.shadowRoot.innerHTML.includes(
    `<option value="${escaped}" selected>${escaped} (${escaped})</option>`
  ));
  assert.ok(!editor.shadowRoot.innerHTML.includes("<img"));
});

for (const provider of ["noaa_coops", "chs_iwls", "ukho_entity", "generic_entity"]) {
  test(`${provider} editor escapes configuration attribute values`, () => {
    const editor = new TideWiseCardEditor();
    editor._canadaStations = [];
    editor.setConfig({
      provider,
      station: "custom-station",
      title: payload,
      time_offset_minutes: payload,
      height_offset: payload,
      latitude: payload,
      longitude: payload,
      grid_options: { columns: payload }
    });
    for (const id of [
      "title", "latitude", "longitude", "gridColumns",
      ...(provider === "noaa_coops" ? [] : ["timeOffsetMinutes", "heightOffset"])
    ]) {
      const input = editor.shadowRoot.innerHTML.match(new RegExp(`<input id="${id}"[^>]*>`))?.[0];
      assert.ok(input?.includes(`value="${escaped}"`), `${id} must escape its value`);
    }
    assert.ok(!editor.shadowRoot.innerHTML.includes("<img"));
  });
}
