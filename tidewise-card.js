/*
 * TideWise Card v0.5.0
 * NOAA and DFO/Canada tides with optional bite-window fishing quality scoring.
 *
 * Legacy alias: custom:cherry-grove-tides-card
 */

const CARD_VERSION = "0.5.0";
const CARD_TYPES = ["tidewise-card", "cherry-grove-tides-card"];
const STATION_PRESETS = [
  { station: "8410140", name: "Eastport, ME", lat: 44.9046, lon: -66.9829 },
  { station: "8418150", name: "Portland, ME", lat: 43.6581, lon: -70.2442 },
  { station: "8443970", name: "Boston, MA", lat: 42.3539, lon: -71.0503 },
  { station: "8452660", name: "Newport, RI", lat: 41.5043, lon: -71.3261 },
  { station: "8510560", name: "Montauk, NY", lat: 41.0483, lon: -71.9594 },
  { station: "8518750", name: "New York, NY", lat: 40.7006, lon: -74.0142 },
  { station: "8531680", name: "Sandy Hook, NJ", lat: 40.4669, lon: -74.0094 },
  { station: "8534720", name: "Atlantic City, NJ", lat: 39.3567, lon: -74.4181 },
  { station: "8536110", name: "Cape May, NJ", lat: 38.9683, lon: -74.9600 },
  { station: "8557380", name: "Lewes, DE", lat: 38.7828, lon: -75.1193 },
  { station: "8570283", name: "Ocean City, MD", lat: 38.3283, lon: -75.0917 },
  { station: "8638863", name: "Chesapeake Bay Bridge Tunnel, VA", lat: 36.9667, lon: -76.1133 },
  { station: "8638610", name: "Hampton Roads, VA", lat: 36.9428, lon: -76.3286 },
  { station: "8651370", name: "Duck, NC", lat: 36.1833, lon: -75.7467 },
  { station: "8656483", name: "Beaufort, NC", lat: 34.7173, lon: -76.6707 },
  { station: "8658120", name: "Wilmington, NC", lat: 34.2267, lon: -77.9533 },
  { station: "8661070", name: "Cherry Grove / Myrtle Beach, SC", lat: 33.6550, lon: -78.9183 },
  { station: "8665530", name: "Charleston, SC", lat: 32.7808, lon: -79.9236 },
  { station: "8670870", name: "Fort Pulaski / Savannah, GA", lat: 32.0347, lon: -80.9030 },
  { station: "8720030", name: "Fernandina Beach, FL", lat: 30.6714, lon: -81.4658 },
  { station: "8720218", name: "Mayport, FL", lat: 30.3982, lon: -81.4279 },
  { station: "8723214", name: "Virginia Key / Miami, FL", lat: 25.7314, lon: -80.1618 },
  { station: "8723970", name: "Vaca Key, FL", lat: 24.7110, lon: -81.1065 },
  { station: "8724580", name: "Key West, FL", lat: 24.5557, lon: -81.8079 },
  { station: "8725110", name: "Naples, FL", lat: 26.1317, lon: -81.8075 },
  { station: "8726520", name: "St. Petersburg, FL", lat: 27.7606, lon: -82.6269 },
  { station: "8727520", name: "Cedar Key, FL", lat: 29.1350, lon: -83.0317 },
  { station: "8729840", name: "Pensacola, FL", lat: 30.4044, lon: -87.2112 },
  { station: "8735180", name: "Dauphin Island, AL", lat: 30.2500, lon: -88.0750 },
  { station: "8761724", name: "Grand Isle, LA", lat: 29.2633, lon: -89.9567 },
  { station: "8761927", name: "New Orleans / Lake Pontchartrain, LA", lat: 30.0272, lon: -90.1133 },
  { station: "8771450", name: "Galveston, TX", lat: 29.3100, lon: -94.7933 },
  { station: "8775237", name: "Port Aransas, TX", lat: 27.8397, lon: -97.0725 },
  { station: "8779770", name: "Port Isabel, TX", lat: 26.0612, lon: -97.2155 },
  { station: "9410170", name: "San Diego, CA", lat: 32.7156, lon: -117.1767 },
  { station: "9410230", name: "La Jolla, CA", lat: 32.8669, lon: -117.2571 },
  { station: "9410660", name: "Los Angeles, CA", lat: 33.7200, lon: -118.2720 },
  { station: "9413450", name: "Monterey, CA", lat: 36.6089, lon: -121.8914 },
  { station: "9414290", name: "San Francisco, CA", lat: 37.8063, lon: -122.4659 },
  { station: "9419750", name: "Crescent City, CA", lat: 41.7456, lon: -124.1844 },
  { station: "9432780", name: "Charleston, OR", lat: 43.3450, lon: -124.3220 },
  { station: "9435380", name: "Newport / South Beach, OR", lat: 44.6254, lon: -124.0449 },
  { station: "9439040", name: "Astoria, OR", lat: 46.2073, lon: -123.7683 },
  { station: "9440910", name: "Toke Point, WA", lat: 46.7075, lon: -123.9669 },
  { station: "9444900", name: "Port Townsend, WA", lat: 48.1112, lon: -122.7597 },
  { station: "9447130", name: "Seattle, WA", lat: 47.6026, lon: -122.3393 },
  { station: "9449880", name: "Friday Harbor, WA", lat: 48.5453, lon: -123.0125 },
  { station: "1612340", name: "Honolulu, HI", lat: 21.3033, lon: -157.8645 },
  { station: "9755371", name: "San Juan, PR", lat: 18.4589, lon: -66.1164 },
  { station: "9751639", name: "Charlotte Amalie, VI", lat: 18.3306, lon: -64.9258 }
];

// null = not fetched yet; [] = fetch failed or in-progress; [{...}] = loaded
// Session-persistent: fetched at most once per page load across all editor instances.
let _dfoStationCache = null;

const STYLES = `
  :host {
    --wave: #2a7a94; --wave-dark: #1a5f72; --gold: #e8b84b;
    --low-color: #2a7a94; --high-color: #0a7a70; --text: #0a1e28; --text-muted: #1e4d5e;
    --elite: #16a34a; --prime: #2563eb; --good: #0891b2; --fair: #f59e0b; --slow: #dc2626;
    --font-main: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif;
    --font-mono: "SF Mono", "Roboto Mono", "Courier New", monospace;
    display: block; font-family: var(--font-main); color: var(--text);
  }
  .card-outer {
    background: linear-gradient(135deg, rgba(255,255,255,0.70), rgba(222,244,248,0.58));
    backdrop-filter: blur(12px) saturate(1.08); -webkit-backdrop-filter: blur(12px) saturate(1.08);
    border-radius: 22px; padding: 8px 16px 8px;
    border: 1px solid rgba(255,255,255,0.40); box-shadow: 0 5px 24px rgba(10,50,70,0.14);
    position: relative; overflow: hidden;
  }
  ha-card { background: transparent !important; box-shadow: none !important; border-radius: 22px !important; }
  .card-outer::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(42,122,148,0.62), transparent); }
  .header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
  .title { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1.05; letter-spacing: 0; overflow-wrap: anywhere; min-width: 0; max-width: 100%; }
  .subtitle { font-size: 13px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 650; white-space: nowrap; padding-top: 8px; }
  .current-row { display: flex; align-items: center; gap: 13px; flex-wrap: wrap; background: rgba(255,255,255,0.35); border: 1px solid rgba(42,122,148,0.20); border-radius: 14px; padding: 7px 13px; margin-bottom: 6px; }
  .current-icon { font-size: 22px; animation: bob 3s ease-in-out infinite; flex-shrink: 0; }
  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  .current-label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wave-dark); margin-bottom: 2px; font-weight: 750; }
  .current-value { font-family: var(--font-mono); font-size: 36px; font-weight: 800; color: var(--text); line-height: 1; }
  .current-unit { font-size: 18px; color: var(--text-muted); font-weight: 650; }
  .direction-chip { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 18px; color: var(--wave-dark); font-weight: 750; flex-shrink: 0; }
  .condition-chip { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--wave-dark); background: rgba(255,255,255,0.48); border: 1px solid rgba(42,122,148,0.22); border-radius: 99px; padding: 4px 10px; white-space: nowrap; font-weight: 800; flex-shrink: 0; }
  .condition-spacer { flex: 1 1 auto; min-width: 12px; }
  .pulse-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--wave); box-shadow: 0 0 0 3px rgba(42,122,148,0.25); animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
  .chart-section { margin-bottom: 5px; }
  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; }
  .section-label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); font-weight: 750; white-space: nowrap; }
  .fish-badge-row { display: flex; align-items: center; gap: 7px; min-width: 0; }
  .fish-score { font-size: 13px; font-weight: 850; padding: 2px 9px; border-radius: 99px; white-space: nowrap; }
  .score-elite { background: rgba(30,160,100,0.18); color: #0d8050; }
  .score-prime { background: rgba(42,122,148,0.18); color: var(--wave-dark); }
  .score-good { background: rgba(42,122,148,0.12); color: var(--wave-dark); }
  .score-fair { background: rgba(232,184,75,0.20); color: #8a6a10; }
  .score-slow { background: rgba(192,80,48,0.14); color: #8a3018; }
  .water-temp-chip { font-size: 13px; color: var(--wave-dark); background: rgba(255,255,255,0.52); border: 1px solid rgba(42,122,148,0.25); border-radius: 99px; padding: 2px 9px; white-space: nowrap; font-weight: 800; }
  .fish-moon { font-size: 13px; color: var(--text-muted); font-weight: 650; white-space: nowrap; }
  .chart-wrap { position: relative; height: 95px; border-radius: 10px; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }
  .x-row { display: flex; justify-content: space-between; margin-top: 2px; padding: 0 2px; }
  .x-tick { font-size: 13px; font-weight: 650; color: var(--text-muted); }
  .fish-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 2px; margin-bottom: 2px; }
  .fish-reason { font-size: 12px; color: var(--text-muted); font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .fish-next { font-size: 12px; color: var(--wave-dark); font-weight: 800; white-space: nowrap; flex-shrink: 0; }
  .fish-legend { display: flex; align-items: center; gap: 12px; margin: 2px 0 6px; padding-left: 2px; min-width: 0; flex-wrap: nowrap; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-muted); font-weight: 750; white-space: nowrap; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .legend-dot.elite{background:var(--elite)} .legend-dot.prime{background:var(--prime)} .legend-dot.good{background:var(--good)} .legend-dot.fair{background:var(--fair)} .legend-dot.slow{background:var(--slow)}
  .legend-item.elite{color:#0f7a38} .legend-item.prime{color:#1d4ed8} .legend-item.good{color:#0e7490} .legend-item.fair{color:#9a5b00} .legend-item.slow{color:#a51f1f}
  .tides-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .tide-pill { background: rgba(255,255,255,0.35); border: 1px solid rgba(42,122,148,0.20); border-radius: 12px; padding: 5px 12px; }
  .pill-label { font-size: 13px; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 3px; font-weight: 750; }
  .pill-label.low{color:var(--low-color)} .pill-label.high{color:var(--high-color)}
  .pill-time { font-family: var(--font-mono); font-size: 26px; font-weight: 800; color: var(--text); line-height: 1.1; }
  .pill-arrow { font-size: 16px; margin-right: 4px; }
  .pill-arrow.low{color:var(--low-color)} .pill-arrow.high{color:var(--high-color)}
  .pill-ft { font-size: 16px; color: var(--text-muted); font-weight: 650; }
  .loading,.error { text-align: center; padding: 30px 20px; color: var(--text-muted); font-size: 14px; }
  .error{color:#c04444}
  .spinner { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.40); border-top-color: var(--wave); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
  @keyframes spin { to{transform:rotate(360deg)} }

  :host([dark]) {
    --wave: #4ab0cc; --wave-dark: #2a90aa; --gold: #e8b84b;
    --low-color: #4ab0cc; --high-color: #2ab8a8; --text: #e0f0ff; --text-muted: #90b8cc;
  }
  :host([dark]) .card-outer {
    background: linear-gradient(135deg, rgba(5,20,45,0.82), rgba(8,28,55,0.72));
    border: 1px solid rgba(74,176,204,0.25);
    box-shadow: 0 5px 24px rgba(0,0,0,0.50);
  }
  :host([dark]) .card-outer::before {
    background: linear-gradient(90deg, transparent, rgba(74,176,204,0.50), transparent);
  }
  :host([dark]) .current-row {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(74,176,204,0.22);
  }
  :host([dark]) .tide-pill {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(74,176,204,0.22);
  }
  :host([dark]) .score-elite { background: rgba(22,163,74,0.25); }
  :host([dark]) .score-prime { background: rgba(37,99,235,0.25); }
  :host([dark]) .score-good  { background: rgba(8,145,178,0.25); }
  :host([dark]) .score-fair  { background: rgba(245,158,11,0.25); }
  :host([dark]) .score-slow  { background: rgba(220,38,38,0.25); }
`;

class TideWiseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._data = null;
    this._autoData = {};
    this._refreshInterval = null;
    this._clockInterval = null;
    this._chartCanvas = null;
    this._stationMeta = null;
    this._fishBand = null;
  }

  static getStubConfig() {
    return {
      title: "TideWise",
      station: "8661070",
      units: "english",
      mode: "general",
      show_fishing_score: true,
      auto_sources: true,
      auto_surf_forecast: true
    };
  }

  static getConfigElement() {
    return document.createElement("tidewise-card-editor");
  }

  set hass(hass) { this._hass = hass; }

  setConfig(config) {
    if (!config.station) throw new Error("TideWise requires a station ID.");
    const previousConfig = this._config || {};
    this._config = {
      title: config.title || "TideWise",
      station: String(config.station),
      provider: this._resolveProvider(config),
      units: config.units || "english",
      weather_entity: config.weather_entity || "",
      water_temp_entity: config.water_temp_entity || "",
      wave_height_entity: config.wave_height_entity || "",
      rain_today_entity: config.rain_today_entity || "",
      pressure_trend_entity: config.pressure_trend_entity || "",
      wind_speed_entity: config.wind_speed_entity || "",
      wind_direction_entity: config.wind_direction_entity || "",
      pressure_entity: config.pressure_entity || "",
      cloud_cover_entity: config.cloud_cover_entity || "",
      rip_current_risk_entity: config.rip_current_risk_entity || "",
      unsafe_to_swim_entity: config.unsafe_to_swim_entity || "",
      latitude: Number(config.latitude) || 33.688,
      longitude: Number(config.longitude) || -78.886,
      mode: String(config.mode || "general").toLowerCase(),
      show_fishing_score: config.show_fishing_score !== false,
      auto_sources: config.auto_sources !== false,
      auto_surf_forecast: config.auto_surf_forecast !== false,
      nws_office: String(config.nws_office || "").trim().toUpperCase(),
      dark_mode: config.dark_mode === true
    };
    this.toggleAttribute("dark", this._config.dark_mode);
    this._stationMeta = null;
    if (this._config.provider === "dfo") this._fetchDfoStationMeta();
    if (previousConfig.station !== this._config.station || previousConfig.mode !== this._config.mode) this._fishBand = null;
    this._render();
    this._fetchData();
  }

  _resolveProvider(config) {
    if (config.provider === "dfo") return "dfo";
    if (config.provider === "noaa") return "noaa";
    if (/^[0-9a-f]{24}$/i.test(String(config.station || ""))) return "dfo";
    return "noaa";
  }

  connectedCallback() {
    this._refreshInterval = setInterval(() => this._fetchData(), 15 * 60 * 1000);
    this._clockInterval = setInterval(() => this._updateLive(), 60 * 1000);
  }

  disconnectedCallback() {
    clearInterval(this._refreshInterval);
    clearInterval(this._clockInterval);
  }

  async _fetchData() {
    if (this._config.provider === "dfo") return this._fetchDfoData();
    return this._fetchNoaaData();
  }

  async _fetchNoaaData() {
    const { station, units } = this._config;
    const today = this._dateStr(0);
    const tomorrow = this._dateStr(1);
    const base = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const cp = `station=${station}&datum=MLLW&time_zone=lst_ldt&units=${units}&application=tidewise_card&format=json`;
    try {
      const autoPromise = this._config.auto_sources ? this._fetchAutoSources().catch((err) => ({ error: err.message })) : Promise.resolve({});
      const [cr, hr, autoData] = await Promise.all([
        fetch(`${base}?begin_date=${today}&end_date=${tomorrow}&${cp}&product=predictions&interval=6`),
        fetch(`${base}?begin_date=${today}&end_date=${tomorrow}&${cp}&product=predictions&interval=hilo`),
        autoPromise
      ]);
      const cj = await cr.json();
      const hj = await hr.json();
      if (hj.error) throw new Error(this._friendlyNoaaError(hj.error?.message));
      const hilo = hj.predictions || [];
      let predictions = cj.predictions || [];
      if (cj.error && hilo.length >= 2) predictions = this._buildPredictionsFromHilo(hilo);
      else if (cj.error) throw new Error(this._friendlyNoaaError(cj.error?.message));
      this._data = { predictions, hilo, intervalFallback: Boolean(cj.error && predictions.length) };
      this._autoData = autoData || {};
      this._renderData();
    } catch (err) {
      this._renderError(err.message);
    }
  }

  async _fetchDfoData() {
    const { station, units } = this._config;
    const base = "https://api-iwls.dfo-mpo.gc.ca/api/v1";
    const from = this._dfoDateStr(0);
    const to = this._dfoDateStr(2);
    try {
      const autoPromise = this._config.auto_sources
        ? this._fetchDfoAutoSources().catch((err) => ({ error: err.message }))
        : Promise.resolve({});
      const [predRes, hiloRes, autoData] = await Promise.all([
        fetch(`${base}/stations/${station}/data?time-series-code=wlp&from=${from}&to=${to}&resolution=FIFTEEN_MINUTES`),
        fetch(`${base}/stations/${station}/data?time-series-code=wlp-hilo&from=${from}&to=${to}`),
        autoPromise
      ]);
      if (!predRes.ok) throw new Error(this._friendlyDfoError(predRes.status, station));
      if (!hiloRes.ok) throw new Error(this._friendlyDfoError(hiloRes.status, station));
      const toFeet = units === "english";
      const hilo = this._normalizeDfoHilo(await hiloRes.json(), toFeet);
      let predictions = this._normalizeDfoPredictions(await predRes.json(), toFeet);
      if (!predictions.length && hilo.length >= 2) predictions = this._buildPredictionsFromHilo(hilo);
      if (!predictions.length) throw new Error("DFO did not return tide predictions for this station. Verify the station has 'wlp' in its timeSeries.");
      this._data = { predictions, hilo, intervalFallback: false };
      this._autoData = autoData || {};
      this._renderData();
    } catch (err) {
      this._renderError(err.message);
    }
  }

  _friendlyNoaaError(message) {
    const raw = String(message || "").trim();
    if (raw.toLowerCase().includes("no predictions data")) {
      return "NOAA did not return tide predictions for this station. Try a nearby NOAA tide station or a known preset.";
    }
    return raw || "NOAA error";
  }

  _friendlyDfoError(httpStatus, station) {
    if (httpStatus === 404) return `DFO station not found. Check the station UUID or choose a preset.`;
    if (httpStatus === 429) return "DFO API rate limit reached. The card will retry in 15 minutes.";
    return `DFO API error (HTTP ${httpStatus}). Check your station ID.`;
  }

  _dfoDateStr(offsetDays = 0) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() + offsetDays);
    return d.toISOString();
  }

  _normalizeDfoPredictions(rawArray, toFeet) {
    if (!Array.isArray(rawArray)) return [];
    return rawArray
      .filter((item) => item && item.eventDate && item.value !== undefined)
      .map((item) => {
        const date = new Date(item.eventDate);
        const m = toFeet ? item.value * 3.28084 : item.value;
        return { t: this._formatNoaaTime(date), v: m.toFixed(3) };
      })
      .filter((item) => !item.t.includes("NaN"));
  }

  _normalizeDfoHilo(rawArray, toFeet) {
    if (!Array.isArray(rawArray) || rawArray.length === 0) return [];
    const sorted = rawArray
      .filter((item) => item && item.eventDate && item.value !== undefined)
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    return sorted.map((item, i) => {
      const date = new Date(item.eventDate);
      const m = toFeet ? item.value * 3.28084 : item.value;
      const neighbor = sorted[i + 1] ?? sorted[i - 1];
      const isHigh = neighbor ? item.value > neighbor.value : true;
      return { t: this._formatNoaaTime(date), v: m.toFixed(3), type: isHigh ? "H" : "L" };
    });
  }

  async _fetchDfoAutoSources() {
    // ECCC (Environment Canada) weather API planned as a future enhancement.
    return {};
  }

  async _fetchDfoStationMeta() {
    const { station } = this._config;
    const cached = (_dfoStationCache || []).find((p) => p.station === station);
    if (cached) {
      this._stationMeta = { code: cached.code, name: cached.name };
      return;
    }
    try {
      const res = await fetch(`https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${station}`);
      if (!res.ok) { this._stationMeta = { code: station, name: "" }; return; }
      const json = await res.json();
      this._stationMeta = { code: json.code || station, name: json.officialName || "" };
    } catch {
      this._stationMeta = { code: station, name: "" };
    }
  }

  _subtitleLabel() {
    if (this._config.provider === "dfo") {
      const code = this._stationMeta?.code || this._config.station;
      return `CHS ${code}`;
    }
    return `NOAA ${this._config.station}`;
  }

  _buildPredictionsFromHilo(hilo) {
    const events = (hilo || [])
      .map((item) => ({ ...item, time: this._parsePredictionTime(item.t), value: parseFloat(item.v) }))
      .filter((item) => Number.isFinite(item.time.getTime()) && Number.isFinite(item.value))
      .sort((a, b) => a.time - b.time);
    if (events.length < 2) return [];

    const stepMs = 6 * 60 * 1000;
    const predictions = [];
    for (let i = 0; i < events.length - 1; i++) {
      const a = events[i];
      const b = events[i + 1];
      const spanMs = b.time.getTime() - a.time.getTime();
      if (spanMs <= 0) continue;
      for (let tMs = a.time.getTime(); tMs < b.time.getTime(); tMs += stepMs) {
        const f = (tMs - a.time.getTime()) / spanMs;
        const eased = (1 - Math.cos(Math.PI * f)) / 2;
        const value = a.value + (b.value - a.value) * eased;
        predictions.push({ t: this._formatNoaaTime(new Date(tMs)), v: value.toFixed(3) });
      }
    }
    const last = events[events.length - 1];
    predictions.push({ t: this._formatNoaaTime(last.time), v: last.value.toFixed(3) });
    return predictions;
  }

  _formatNoaaTime(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  _dateStr(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  async _fetchAutoSources() {
    const [coops, nws] = await Promise.all([
      this._fetchCoopsObservations().catch((err) => ({ error: err.message })),
      this._fetchNwsForecast().catch((err) => ({ error: err.message }))
    ]);
    const surf = this._config.auto_surf_forecast ? await this._fetchNwsSurfForecast(nws).catch((err) => ({ error: err.message })) : {};
    return {
      coops: coops || {},
      nws: nws || {},
      surf: surf || {},
      updated: new Date().toISOString()
    };
  }

  async _fetchCoopsObservations() {
    const { station, units } = this._config;
    const base = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";
    const common = `station=${station}&time_zone=lst_ldt&units=${units}&application=tidewise_card&format=json&date=latest`;
    const products = [
      ["water_temperature", "waterTemp"],
      ["wind", "wind"],
      ["air_pressure", "pressure"]
    ];
    const results = await Promise.all(products.map(async ([product, key]) => {
      const res = await fetch(`${base}?${common}&product=${product}`);
      if (!res.ok) return [key, null];
      const json = await res.json();
      if (json.error) return [key, null];
      const item = Array.isArray(json.data) ? json.data[0] : null;
      return [key, item || null];
    }));
    return Object.fromEntries(results.filter(([, value]) => value));
  }

  async _fetchNwsForecast() {
    const { lat, lon } = this._getHomeLatLon();
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return {};
    const headers = { Accept: "application/geo+json" };
    const pointRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, { headers });
    if (!pointRes.ok) return {};
    const point = await pointRes.json();
    const hourlyUrl = point?.properties?.forecastHourly;
    if (!hourlyUrl) return {};
    const hourlyRes = await fetch(hourlyUrl, { headers });
    if (!hourlyRes.ok) return {};
    const hourly = await hourlyRes.json();
    const period = hourly?.properties?.periods?.[0] || null;
    return { point: point.properties || {}, period };
  }

  async _fetchNwsSurfForecast(nwsData) {
    const office = this._config.nws_office || String(nwsData?.point?.cwa || "").toUpperCase();
    if (!office) return {};
    const productText = await this._fetchLegacyNwsSurfProduct(office);
    if (productText) return this._parseSurfForecastText(productText, office);
    const headers = { Accept: "application/geo+json" };
    const listRes = await fetch(`https://api.weather.gov/products/types/SRF/locations/${office}`, { headers });
    if (!listRes.ok) return {};
    const list = await listRes.json();
    const first = list?.["@graph"]?.[0] || list?.features?.[0] || null;
    const productUrl = first?.["@id"] || first?.id || first?.properties?.["@id"] || first?.properties?.id;
    if (!productUrl) return {};
    const productRes = await fetch(productUrl, { headers });
    if (!productRes.ok) return {};
    const product = await productRes.json();
    const text = product?.productText || product?.properties?.productText || "";
    return this._parseSurfForecastText(text, office);
  }

  async _fetchLegacyNwsSurfProduct(office) {
    const url = `https://forecast.weather.gov/product.php?site=${office}&issuedby=${office}&product=SRF&format=TXT`;
    const res = await fetch(url);
    if (!res.ok) return "";
    return res.text();
  }

  _parseSurfForecastText(text, office) {
    const raw = String(text || "");
    if (!raw.trim()) return {};
    const normalized = raw.replace(/\r/g, "");
    return {
      office,
      ripRisk: this._parseSurfRipRisk(normalized),
      surfHeightFt: this._parseSurfHeightFt(normalized),
      waterTempF: this._parseSurfWaterTempF(normalized),
      source: "NWS SRF"
    };
  }

  _parseSurfRipRisk(text) {
    const lower = text.toLowerCase();
    if (/(high\s+rip\s+current\s+risk|dangerous\s+rip\s+currents|high\s+surf\s+and\s+dangerous\s+rip\s+currents|rip\s+current\s+risk\s+is\s+high|rip\s+current\s+risk\.*\s*high)/i.test(lower)) return "high";
    if (/(moderate\s+rip\s+current\s+risk|rip\s+current\s+risk\s+is\s+moderate|moderate\s+surf\s+and\s+rip\s+currents|rip\s+current\s+risk\.*\s*moderate)/i.test(lower)) return "moderate";
    if (/(low\s+rip\s+current\s+risk|rip\s+current\s+risk\s+is\s+low|rip\s+current\s+risk\.*\s*low)/i.test(lower)) return "low";
    return null;
  }

  _parseSurfHeightFt(text) {
    const patterns = [
      /surf\s+height\.+\s*([0-9]+)\s+to\s+([0-9]+)\s+feet/i,
      /surf\s+height\s+([0-9]+)\s+to\s+([0-9]+)\s+feet/i,
      /surf\s+height\.+\s*([0-9]+)\s+feet/i,
      /surf\s+height\s+([0-9]+)\s+feet/i,
      /surf\s+([0-9]+)\s+to\s+([0-9]+)\s+feet/i,
      /surf\s+height:\s*([0-9]+)(?:\s*(?:to|-)\s*([0-9]+))?\s*ft/i
    ];
    return this._firstRangeAverage(text, patterns);
  }

  _parseSurfWaterTempF(text) {
    const qualitative = text.match(/water\s+temperature\.*\s*in\s+the\s+(upper|mid|lower)\s+([0-9]+)s/i)
      || text.match(/water\s+temperature\s+in\s+the\s+(upper|mid|lower)\s+([0-9]+)s/i);
    if (qualitative) {
      const band = qualitative[1].toLowerCase();
      const base = Number(qualitative[2]);
      if (Number.isFinite(base)) {
        if (band === "upper") return (base + 5 + base + 9) / 2;
        if (band === "mid") return (base + 3 + base + 7) / 2;
        if (band === "lower") return (base + base + 4) / 2;
      }
    }
    const patterns = [
      /water\s+temperature\.+\s*around\s+([0-9]+)/i,
      /water\s+temperature\s+around\s+([0-9]+)/i,
      /water\s+temperature\.+\s*([0-9]+)\s*(?:degrees?|f)?/i,
      /water\s+temp\.+\s*([0-9]+)\s*(?:degrees?|f)?/i,
      /water\s+temperature\.*\s*([0-9]+)(?:\s*(?:to|-)\s*([0-9]+))?/i,
      /water\s+temp\.*\s*([0-9]+)(?:\s*(?:to|-)\s*([0-9]+))?/i
    ];
    return this._firstRangeAverage(text, patterns);
  }

  _firstRangeAverage(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (!match) continue;
      const a = Number(match[1]);
      const b = match[2] !== undefined ? Number(match[2]) : a;
      if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
    }
    return null;
  }

  _parsePredictionTime(t) {
    const [dp, tp] = String(t || "").split(" ");
    if (!dp || !tp) return new Date(NaN);
    const [y, mo, d] = dp.split("-").map(Number);
    const [h, m] = tp.split(":").map(Number);
    return new Date(y, mo - 1, d, h, m);
  }

  _rollingPredictions(predictions, now) {
    if (!Array.isArray(predictions) || !predictions.length) return [];
    const start = now.getTime() - 6 * 60 * 1000;
    const end = now.getTime() + 24 * 60 * 60 * 1000;
    const rolling = predictions.filter((p) => {
      const t = this._parsePredictionTime(p.t).getTime();
      return Number.isFinite(t) && t >= start && t <= end;
    });
    return rolling.length >= 4 ? rolling : predictions;
  }

  _xAxisHtml(predictions) {
    if (!predictions || predictions.length < 2) {
      return `<div class="x-row"><span class="x-tick">Now</span><span class="x-tick">+6h</span><span class="x-tick">+12h</span><span class="x-tick">+18h</span><span class="x-tick">+24h</span></div>`;
    }
    const start = this._parsePredictionTime(predictions[0].t).getTime();
    const end = this._parsePredictionTime(predictions[predictions.length - 1].t).getTime();
    const labels = [];
    for (let i = 0; i <= 4; i++) {
      if (i === 0) {
        labels.push(`<span class="x-tick">Now</span>`);
      } else {
        const tMs = start + ((end - start) * i / 4);
        const rounded = new Date(Math.round(tMs / 3600000) * 3600000);
        const h = rounded.getHours();
        const ap = h >= 12 ? "PM" : "AM";
        labels.push(`<span class="x-tick">${((h % 12) || 12)}${ap}</span>`);
      }
    }
    return `<div class="x-row">${labels.join("")}</div>`;
  }

  _getEntity(id) { if (!id) return null; return this._hass?.states?.[id] || null; }

  _parseNumericState(rawState) {
    const raw = String(rawState ?? "").trim();
    const range = raw.match(/([0-9]+(?:[.][0-9]+)?)[ \t]*[-\u2013\u2014][ \t]*([0-9]+(?:[.][0-9]+)?)/);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
    }
    const single = raw.match(/-?[0-9]+(?:[.][0-9]+)?/);
    if (!single) return null;
    const val = Number(single[0]);
    return Number.isFinite(val) ? val : null;
  }

  _getNumericEntity(id) {
    const ent = this._getEntity(id);
    if (!ent) return null;
    const val = this._parseNumericState(ent.state);
    if (!Number.isFinite(val)) return null;
    return { value: val, unit: ent.attributes?.unit_of_measurement || ent.state || "", state: ent.state, attributes: ent.attributes || {} };
  }

  _getWeatherState() {
    const states = this._hass?.states || {};
    if (this._config.weather_entity && states[this._config.weather_entity]) return states[this._config.weather_entity];
    const keys = Object.keys(states).filter((k) => k.startsWith("weather."));
    if (!keys.length) return this._getAutoWeatherState();
    const preferred = keys.find((k) => {
      const fn = String(states[k]?.attributes?.friendly_name || "").toLowerCase();
      return fn.includes("home") || fn.includes("weather");
    });
    const weather = states[preferred || keys[0]] || null;
    if (weather) return weather;
    return this._getAutoWeatherState();
  }

  _getHomeLatLon() {
    const home = this._hass?.states?.["zone.home"];
    return {
      lat: this._config.latitude || Number(home?.attributes?.latitude) || 33.688,
      lon: this._config.longitude || Number(home?.attributes?.longitude) || -78.886
    };
  }

  _getWindSpeedMph(weather) {
    const direct = this._getNumericEntity(this._config.wind_speed_entity);
    if (direct) {
      const unit = String(direct.unit || "").toLowerCase();
      if (unit.includes("km")) return direct.value * 0.621371;
      if (unit.includes("m/s")) return direct.value * 2.23694;
      if (unit.includes("kn")) return direct.value * 1.15078;
      return direct.value;
    }
    const attrs = weather?.attributes || {};
    const raw = Number(attrs.wind_speed);
    const unit = String(attrs.wind_speed_unit || attrs.unit_of_measurement || "").toLowerCase();
    if (Number.isFinite(raw) && unit.includes("km")) return raw * 0.621371;
    if (Number.isFinite(raw) && unit.includes("m/s")) return raw * 2.23694;
    if (Number.isFinite(raw) && unit.includes("kn")) return raw * 1.15078;
    if (Number.isFinite(raw)) return raw;
    const coopsWind = this._parseCoopsWindSpeedMph();
    if (coopsWind !== null) return coopsWind;
    return this._parseNwsWindSpeedMph();
  }

  _getWindBearing(weather) {
    const d = this._getNumericEntity(this._config.wind_direction_entity);
    if (d) return d.value;
    const bearing = Number(weather?.attributes?.wind_bearing);
    if (Number.isFinite(bearing)) return bearing;
    const coopsBearing = Number(this._autoData?.coops?.wind?.d);
    return Number.isFinite(coopsBearing) ? coopsBearing : this._parseNwsWindDirection();
  }

  _formatWind(speedMph, bearing) {
    if (!Number.isFinite(speedMph)) return "";
    const speed = this._config.units === "metric" ? `${Math.round(speedMph * 1.60934)} km/h` : `${Math.round(speedMph)} mph`;
    const direction = this._formatWindDirection(bearing);
    return `Wind ${speed}${direction ? " " + direction : ""}`;
  }

  _formatWindDirection(bearing) {
    const b = Number(bearing);
    if (!Number.isFinite(b)) return "";
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round((((b % 360) + 360) % 360) / 22.5) % 16];
  }

  _getPressureHpa(weather) {
    const direct = this._getNumericEntity(this._config.pressure_entity);
    if (direct) {
      const unit = String(direct.unit || "").toLowerCase();
      if (unit.includes("inhg") || unit.includes("in hg")) return direct.value * 33.8639;
      return direct.value;
    }
    const attrs = weather?.attributes || {};
    const raw = Number(attrs.pressure);
    const unit = String(attrs.pressure_unit || attrs.unit_of_measurement || "").toLowerCase();
    if (Number.isFinite(raw)) {
      if (unit.includes("inhg") || unit.includes("in hg")) return raw * 33.8639;
      return raw;
    }
    const autoPressure = this._parseAutoPressureHpa();
    return autoPressure;
  }

  _getWaterTempF() {
    const e = this._getNumericEntity(this._config.water_temp_entity);
    if (e) {
      const unit = String(e.unit || "").toLowerCase();
      return unit.includes("c") ? e.value * 9 / 5 + 32 : e.value;
    }
    const coopsTemp = this._parseCoopsWaterTempF();
    if (coopsTemp !== null) return coopsTemp;
    const surfTemp = Number(this._autoData?.surf?.waterTempF);
    return Number.isFinite(surfTemp) ? surfTemp : null;
  }

  _formatWaterTemp(tempF) {
    if (!Number.isFinite(tempF)) return "";
    if (this._config.units === "metric") return `${Math.round((tempF - 32) * 5 / 9)}°C`;
    return `${Math.round(tempF)}°F`;
  }

  _getWaveHeightFt() {
    const e = this._getNumericEntity(this._config.wave_height_entity);
    if (e) {
      const unit = String(e.unit || "").toLowerCase();
      return unit.includes("m") ? e.value * 3.28084 : e.value;
    }
    const surfHeight = Number(this._autoData?.surf?.surfHeightFt);
    return Number.isFinite(surfHeight) ? surfHeight : null;
  }
  _getRainTodayIn() { const e = this._getNumericEntity(this._config.rain_today_entity); if (!e) return null; const unit = String(e.unit || "").toLowerCase(); return unit.includes("mm") ? e.value / 25.4 : e.value; }

  _getAutoWeatherState() {
    const period = this._autoData?.nws?.period;
    if (!period) return null;
    return {
      state: this._normalizeNwsShortForecast(period.shortForecast),
      attributes: {
        wind_speed: this._parseNwsWindSpeedMph(),
        wind_bearing: this._parseNwsWindDirection()
      }
    };
  }

  _normalizeNwsShortForecast(shortForecast) {
    const text = String(shortForecast || "").toLowerCase();
    if (!text) return "unknown";
    if (text.includes("thunder")) return "lightning-rainy";
    if (text.includes("rain") || text.includes("showers")) return "rainy";
    if (text.includes("fog")) return "fog";
    if (text.includes("sunny") || text.includes("clear")) return "sunny";
    if (text.includes("partly")) return "partlycloudy";
    if (text.includes("cloud")) return "cloudy";
    return text;
  }

  _parseCoopsWaterTempF() {
    const item = this._autoData?.coops?.waterTemp;
    const val = Number(item?.v);
    if (!Number.isFinite(val)) return null;
    return this._config.units === "metric" ? val * 9 / 5 + 32 : val;
  }

  _parseCoopsWindSpeedMph() {
    const val = Number(this._autoData?.coops?.wind?.s);
    if (!Number.isFinite(val)) return null;
    return this._config.units === "metric" ? val * 2.23694 : val * 1.15078;
  }

  _parseAutoPressureHpa() {
    const val = Number(this._autoData?.coops?.pressure?.v);
    if (!Number.isFinite(val)) return null;
    return this._config.units === "english" ? val * 33.8639 : val;
  }

  _parseNwsWindSpeedMph() {
    const raw = String(this._autoData?.nws?.period?.windSpeed || "");
    const range = raw.match(/([0-9]+)\s*(?:to|-)\s*([0-9]+)/i);
    if (range) return (Number(range[1]) + Number(range[2])) / 2;
    const single = raw.match(/[0-9]+/);
    return single ? Number(single[0]) : null;
  }

  _parseNwsWindDirection() {
    const raw = String(this._autoData?.nws?.period?.windDirection || "").toUpperCase();
    const map = { N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5 };
    return map[raw] ?? NaN;
  }

  _getPressureTrend() {
    const ent = this._getEntity(this._config.pressure_trend_entity);
    if (!ent) return null;
    const raw = String(ent.state || "").toLowerCase();
    if (raw.includes("fall")) return "falling";
    if (raw.includes("rise")) return "rising";
    if (raw.includes("steady") || raw.includes("stable")) return "steady";
    const num = Number(ent.state);
    if (Number.isFinite(num)) {
      if (num <= -0.04) return "falling";
      if (num >= 0.04) return "rising";
      return "steady";
    }
    return null;
  }

  _getRipCurrentRisk() { const e = this._getEntity(this._config.rip_current_risk_entity); if (e) return String(e.state || "").toLowerCase().trim(); return this._autoData?.surf?.ripRisk || null; }
  _getUnsafeToSwim() { const e = this._getEntity(this._config.unsafe_to_swim_entity); if (!e) return null; const raw = String(e.state || "").toLowerCase().trim(); return raw === "on" || raw === "true" || raw === "unsafe" || raw === "dangerous"; }
  _normalizeCondition(condition) { return String(condition || "").toLowerCase().replace(/[-_]/g, " ").trim(); }

  _moonPosition(date, lat, lon) {
    const JD = date.getTime() / 86400000 + 2440587.5;
    const d = JD - 2451545.0;
    const L = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
    const Mr = (((134.963 + 13.064993 * d) % 360 + 360) % 360) * Math.PI / 180;
    const Fr = (((93.272 + 13.229350 * d) % 360 + 360) % 360) * Math.PI / 180;
    const lam = (L + 6.289 * Math.sin(Mr)) * Math.PI / 180;
    const beta = 5.128 * Math.sin(Fr) * Math.PI / 180;
    const eps = (23.439 - 0.0000004 * d) * Math.PI / 180;
    const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lam);
    const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));
    const cosA = Math.cos(lam) * Math.cos(beta);
    const sinA = Math.sin(lam) * Math.cos(beta) * Math.cos(eps) - Math.sin(beta) * Math.sin(eps);
    const RA = ((Math.atan2(sinA, cosA) * 12 / Math.PI) % 24 + 24) % 24;
    const GMST = ((6.697375 + 0.0657098242 * d + date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) % 24 + 24) % 24;
    const LMST = ((GMST + lon / 15) % 24 + 24) % 24;
    return { HA: ((LMST - RA) % 24 + 24) % 24, dec };
  }

  _moonAge(date) { const JD = date.getTime() / 86400000 + 2440587.5; return (((JD - 2451545.0) % 29.530588861) + 29.530588861) % 29.530588861; }

  _moonPhaseName(age) {
    if (age < 1.5) return "&#127761; New Moon";
    if (age < 7.4) return "&#127762; Waxing Crescent";
    if (age < 9.0) return "&#127763; First Quarter";
    if (age < 14.8) return "&#127764; Waxing Gibbous";
    if (age < 16.3) return "&#127765; Full Moon";
    if (age < 22.1) return "&#127766; Waning Gibbous";
    if (age < 23.6) return "&#127767; Last Quarter";
    if (age < 28.0) return "&#127768; Waning Crescent";
    return "&#127761; New Moon";
  }

  _solunarScore(HA) {
    const H = ((HA % 24) + 24) % 24;
    const major = Math.max(0, 1 - Math.min(Math.min(H, 24 - H), Math.abs(H - 12)) / 1.5);
    const minor = Math.max(0, 0.55 * (1 - Math.min(Math.abs(H - 6), Math.abs(H - 18)) / 0.75));
    return Math.max(major, minor);
  }

  _moonMultiplier(age) {
    const c = Math.min(Math.min(age, 29.53 - age), Math.abs(age - 14.77));
    return 1.0 + 0.15 * Math.max(0, 1 - c / 3.5);
  }

  _modeWeights() {
    const mode = this._config.mode || "general";
    const modes = {
      general: { tide: 0.28, wind: 0.16, waterTemp: 0.14, weather: 0.12, clarity: 0.10, light: 0.09, solunar: 0.06, pressure: 0.05 },
      surf: { tide: 0.22, wind: 0.20, waterTemp: 0.13, weather: 0.12, clarity: 0.16, light: 0.08, solunar: 0.05, pressure: 0.04 },
      inlet: { tide: 0.34, wind: 0.14, waterTemp: 0.13, weather: 0.10, clarity: 0.10, light: 0.09, solunar: 0.06, pressure: 0.04 },
      flounder: { tide: 0.34, wind: 0.12, waterTemp: 0.17, weather: 0.09, clarity: 0.14, light: 0.06, solunar: 0.04, pressure: 0.04 },
      trout_redfish: { tide: 0.30, wind: 0.13, waterTemp: 0.15, weather: 0.10, clarity: 0.13, light: 0.12, solunar: 0.04, pressure: 0.03 },
      sheepshead: { tide: 0.36, wind: 0.12, waterTemp: 0.10, weather: 0.10, clarity: 0.10, light: 0.04, solunar: 0.03, pressure: 0.05 }
    };
    return modes[mode] || modes.general;
  }

  _windScore(speedMph, bearing) {
    if (speedMph === null || speedMph === undefined) return { score: 0.70, cap: 1.00, label: "wind unknown" };
    let score;
    let cap = 1.0;
    if (speedMph <= 5) score = 0.95;
    else if (speedMph <= 10) score = 0.85;
    else if (speedMph <= 15) score = 0.65;
    else if (speedMph <= 20) score = 0.42;
    else if (speedMph <= 25) score = 0.25;
    else score = 0.10;
    if (speedMph >= 18) cap = Math.min(cap, 0.60);
    if (speedMph >= 23) cap = Math.min(cap, 0.42);
    if (speedMph >= 28) cap = Math.min(cap, 0.30);
    const b = Number(bearing);
    let dirNote = "";
    if (Number.isFinite(b) && speedMph >= 9) {
      const onshore = b >= 35 && b <= 145;
      const offshore = b >= 220 && b <= 320;
      if (onshore) { score -= 0.12; dirNote = "onshore wind"; }
      else if (offshore) { score += 0.06; dirNote = "offshore wind"; }
    }
    return { score: Math.max(0, Math.min(1, score)), cap, label: dirNote || `${Math.round(speedMph)} mph wind` };
  }

  _weatherScore(weather) {
    const condition = this._normalizeCondition(weather?.state);
    if (!condition || condition === "unknown" || condition === "unavailable") return { score: 0.70, cap: 1.0, label: "weather unknown" };
    let score = 0.75;
    let cap = 1.0;
    let label = "decent weather";
    if (condition.includes("lightning") || condition.includes("thunder")) { score = 0.02; cap = 0.22; label = "storms nearby"; }
    else if (condition.includes("pouring") || condition.includes("heavy rain")) { score = 0.20; cap = 0.40; label = "heavy rain"; }
    else if (condition.includes("rain") || condition.includes("shower") || condition.includes("drizzle")) { score = 0.52; cap = 0.72; label = "rain around"; }
    else if (condition.includes("fog") || condition.includes("mist")) { score = 0.45; cap = 0.70; label = "low visibility"; }
    else if (condition.includes("clear") || condition.includes("sunny")) { score = 0.80; label = "clear weather"; }
    else if (condition.includes("partly")) { score = 0.86; label = "partly cloudy"; }
    else if (condition.includes("cloudy") || condition.includes("overcast")) { score = 0.78; label = "cloud cover helps"; }
    return { score, cap, label };
  }

  _pressureScore(pressureHpa, trend) {
    let score = 0.58;
    let label = "pressure unknown";
    if (pressureHpa !== null && pressureHpa !== undefined) {
      if (pressureHpa >= 1008 && pressureHpa <= 1023) { score = 0.76; label = "pressure favorable"; }
      else if (pressureHpa >= 1002 && pressureHpa < 1008) { score = 0.62; label = "lower pressure"; }
      else if (pressureHpa > 1023 && pressureHpa <= 1029) { score = 0.60; label = "higher pressure"; }
      else if (pressureHpa < 998) { score = 0.35; label = "very low pressure"; }
      else if (pressureHpa > 1030) { score = 0.42; label = "very high pressure"; }
    }
    if (trend === "falling") { score += 0.10; label = "falling pressure"; }
    else if (trend === "rising") { score -= 0.08; label = "rising pressure"; }
    else if (trend === "steady") { score += 0.04; label = "steady pressure"; }
    return { score: Math.max(0, Math.min(1, score)), label };
  }

  _lightScore(hour) {
    if (hour >= 5.5 && hour <= 8.5) return { score: 0.92, label: "morning bite" };
    if (hour >= 18.25 && hour <= 21.25) return { score: 0.88, label: "evening bite" };
    if (hour >= 8.5 && hour <= 10.0) return { score: 0.65, label: "post sunrise" };
    if (hour >= 16.5 && hour < 18.25) return { score: 0.62, label: "pre sunset" };
    if (hour >= 10 && hour <= 15) return { score: 0.38, label: "midday lull" };
    if (hour >= 22 || hour <= 4.5) return { score: 0.15, label: "overnight" };
    return { score: 0.42, label: "off window" };
  }

  _waterTempScore(tempF) {
    if (tempF === null || tempF === undefined) return { score: 0.68, cap: 1.0, label: "water temp unknown" };
    let score = 0.60;
    let cap = 1.0;
    let label = `${Math.round(tempF)}° water`;
    if (tempF >= 68 && tempF <= 82) { score = 0.92; label = "water temp prime"; }
    else if (tempF >= 62 && tempF < 68) { score = 0.74; label = "cool but fishable"; }
    else if (tempF > 82 && tempF <= 86) { score = 0.72; label = "warm water"; }
    else if (tempF >= 55 && tempF < 62) { score = 0.52; cap = Math.min(cap, 0.72); label = "cold water"; }
    else if (tempF > 86 && tempF <= 90) { score = 0.46; cap = Math.min(cap, 0.70); label = "hot water"; }
    else if (tempF < 50) { score = 0.25; cap = Math.min(cap, 0.55); label = "very cold water"; }
    else if (tempF > 90) { score = 0.24; cap = Math.min(cap, 0.55); label = "stressed hot water"; }
    return { score, cap, label };
  }

  _waveScore(waveFt) {
    if (waveFt === null || waveFt === undefined) return { score: 0.70, cap: 1.0, label: "waves unknown" };
    let score = 0.75;
    let cap = 1.0;
    let label = `${waveFt.toFixed(1)} ft seas`;
    if (waveFt <= 1.5) { score = 0.92; label = "calm surf"; }
    else if (waveFt <= 2.5) { score = 0.78; label = "manageable surf"; }
    else if (waveFt <= 3.5) { score = 0.55; cap = Math.min(cap, 0.72); label = "choppy surf"; }
    else if (waveFt <= 5.0) { score = 0.32; cap = Math.min(cap, 0.48); label = "rough surf"; }
    else { score = 0.12; cap = Math.min(cap, 0.32); label = "bad surf"; }
    return { score, cap, label };
  }

  _rainScore(rainIn) {
    if (rainIn === null || rainIn === undefined) return { score: 0.78, cap: 1.0, label: "rain total unknown" };
    let score = 0.85;
    let cap = 1.0;
    let label = "little runoff";
    if (rainIn >= 0.10 && rainIn < 0.35) { score = 0.72; label = "some runoff"; }
    else if (rainIn >= 0.35 && rainIn < 0.75) { score = 0.52; cap = Math.min(cap, 0.72); label = "runoff penalty"; }
    else if (rainIn >= 0.75 && rainIn < 1.50) { score = 0.36; cap = Math.min(cap, 0.58); label = "heavy runoff"; }
    else if (rainIn >= 1.50) { score = 0.20; cap = Math.min(cap, 0.42); label = "muddy runoff"; }
    return { score, cap, label };
  }

  _ripCurrentScore(risk, unsafeToSwim) {
    if (unsafeToSwim === true) return { score: 0.18, cap: 0.35, label: "unsafe surf" };
    if (!risk) return { score: 0.78, cap: 1.0, label: "rip risk unknown" };
    if (risk.includes("high") || risk.includes("danger")) return { score: 0.18, cap: 0.38, label: "high rip risk" };
    if (risk.includes("moderate")) return { score: 0.58, cap: 0.72, label: "moderate rip risk" };
    if (risk.includes("low")) return { score: 0.88, cap: 1.0, label: "low rip risk" };
    return { score: 0.72, cap: 1.0, label: `${risk} rip risk` };
  }

  _clarityScore(wind, wave, rain, weather) {
    let score = 0.82;
    let cap = 1.0;
    const labels = [];
    if (wind.label.includes("onshore")) { score -= 0.16; labels.push("onshore dirtying water"); }
    if (wind.score < 0.50) { score -= 0.12; labels.push("wind-stirred water"); }
    if (wave.score < 0.55) { score -= 0.16; cap = Math.min(cap, 0.72); labels.push("rough surf"); }
    if (rain.score < 0.60) { score -= 0.18; cap = Math.min(cap, rain.cap); labels.push(rain.label); }
    if (weather.label.includes("heavy rain") || weather.label.includes("rain around")) score -= 0.08;
    return { score: Math.max(0, Math.min(1, score)), cap, label: labels[0] || "clarity likely decent" };
  }

  _tideScore(predictions, i) {
    const steps = predictions.length;
    const iA = Math.max(0, i - 4);
    const iB = Math.min(steps - 1, i + 4);
    const iPrev = Math.max(0, i - 1);
    const iNext = Math.min(steps - 1, i + 1);
    const current = parseFloat(predictions[i].v);
    const previous = parseFloat(predictions[iPrev].v);
    const next = parseFloat(predictions[iNext].v);
    const tideRate = Math.abs(parseFloat(predictions[iB].v) - parseFloat(predictions[iA].v));
    const movementScore = Math.min(tideRate / 2.2, 1.0);
    const rising = next > previous;
    const falling = next < previous;
    let directionBonus = 0.55;
    let directionLabel = "slack tide";
    if (rising) { directionBonus = 0.82; directionLabel = "incoming tide"; }
    else if (falling) { directionBonus = 0.74; directionLabel = "outgoing tide"; }
    let score = movementScore * 0.72 + directionBonus * 0.28;
    if (movementScore < 0.12) { score = Math.min(score, 0.36); directionLabel = "near slack tide"; }
    else if (movementScore < 0.22) score = Math.min(score, 0.55);
    return { score: Math.max(0, Math.min(1, score)), movementScore, rising, falling, label: directionLabel, height: current };
  }

  _scoreBand(score, previousBand = null) {
    if (previousBand === "elite" && score >= 0.82) return "elite";
    if (previousBand === "prime" && score >= 0.67 && score < 0.87) return "prime";
    if (previousBand === "good" && score >= 0.52 && score < 0.72) return "good";
    if (previousBand === "fair" && score >= 0.37 && score < 0.57) return "fair";
    if (score >= 0.87) return "elite";
    if (score >= 0.72) return "prime";
    if (score >= 0.57) return "good";
    if (score >= 0.42) return "fair";
    return "slow";
  }

  _scoreLabel(score, previousBand = null) {
    const band = this._scoreBand(score, previousBand);
    const labels = {
      elite: { text: "&#128293; Elite", cls: "score-elite", band },
      prime: { text: "Prime", cls: "score-prime", band },
      good: { text: "Good", cls: "score-good", band },
      fair: { text: "Fair", cls: "score-fair", band },
      slow: { text: "Slow", cls: "score-slow", band }
    };
    return labels[band];
  }

  _fishColor(score) {
    const band = this._scoreBand(score);
    if (band === "elite") return [22, 163, 74];
    if (band === "prime") return [37, 99, 235];
    if (band === "good") return [8, 145, 178];
    if (band === "fair") return [245, 158, 11];
    return [220, 38, 38];
  }

  _smoothScores(scores) {
    return scores.map((score, i) => {
      const prev = scores[Math.max(0, i - 1)];
      const next = scores[Math.min(scores.length - 1, i + 1)];
      return prev * 0.25 + score * 0.50 + next * 0.25;
    });
  }

  _buildFishingScores(predictions) {
    const weights = this._modeWeights();
    const { lat, lon } = this._getHomeLatLon();
    const weather = this._getWeatherState();
    const windMph = this._getWindSpeedMph(weather);
    const windBearing = this._getWindBearing(weather);
    const pressureHpa = this._getPressureHpa(weather);
    const waterTempF = this._getWaterTempF();
    const waveFt = this._getWaveHeightFt();
    const rainIn = this._getRainTodayIn();
    const pressureTrend = this._getPressureTrend();
    const ripRiskRaw = this._getRipCurrentRisk();
    const unsafeToSwim = this._getUnsafeToSwim();
    const wind = this._windScore(windMph, windBearing);
    const weatherScore = this._weatherScore(weather);
    const pressure = this._pressureScore(pressureHpa, pressureTrend);
    const waterTemp = this._waterTempScore(waterTempF);
    const wave = this._waveScore(waveFt);
    const rain = this._rainScore(rainIn);
    const rip = this._ripCurrentScore(ripRiskRaw, unsafeToSwim);
    const clarity = this._clarityScore(wind, wave, rain, weatherScore);
    const age = this._moonAge(new Date());
    const moonMult = this._moonMultiplier(age);
    const now = new Date();
    const nowMs = now.getTime();
    const maxFutureMs = nowMs + 12 * 60 * 60 * 1000;
    const steps = predictions.length;
    const scores = [];
    const details = [];
    let bestIdx = null;
    let bestScore = -1;
    let currentIdx = 0;
    let currentDistance = Infinity;

    for (let i = 0; i < steps; i++) {
      const t = this._parsePredictionTime(predictions[i].t);
      const tMs = t.getTime();
      const hour = t.getHours() + t.getMinutes() / 60;
      const distance = Math.abs(tMs - nowMs);
      if (distance < currentDistance) { currentDistance = distance; currentIdx = i; }
      const moon = this._moonPosition(t, lat, lon);
      const solunar = this._solunarScore(moon.HA);
      const tide = this._tideScore(predictions, i);
      const light = this._lightScore(hour);
      let rawScore = tide.score * weights.tide + wind.score * weights.wind + waterTemp.score * weights.waterTemp + weatherScore.score * weights.weather + clarity.score * weights.clarity + light.score * weights.light + solunar * weights.solunar + pressure.score * weights.pressure;
      rawScore *= moonMult;
      let cap = 1.0;
      cap = Math.min(cap, wind.cap, weatherScore.cap, waterTemp.cap, wave.cap, rain.cap, rip.cap, clarity.cap);
      if (tide.movementScore < 0.10) cap = Math.min(cap, 0.48);
      if (tide.movementScore < 0.20) cap = Math.min(cap, 0.62);
      if (hour >= 10 && hour <= 15) cap = Math.min(cap, 0.78);
      const finalScore = Math.max(0, Math.min(1, Math.min(rawScore, cap)));
      scores.push(finalScore);
      const detail = { time: t, score: finalScore, tide, wind, weather: weatherScore, waterTemp, wave, rain, rip, clarity, light, solunar, pressure, moonMult, cap };
      details.push(detail);
      if (tMs >= nowMs && tMs <= maxFutureMs && finalScore > bestScore) { bestScore = finalScore; bestIdx = i; }
    }

    const smoothedScores = this._smoothScores(scores);
    details.forEach((detail, i) => { detail.score = smoothedScores[i] ?? detail.score; });
    bestIdx = null;
    bestScore = -1;
    details.forEach((detail, i) => {
      const tMs = detail.time.getTime();
      if (tMs >= nowMs && tMs <= maxFutureMs && detail.score > bestScore) {
        bestScore = detail.score;
        bestIdx = i;
      }
    });
    const currentScore = smoothedScores[currentIdx] || scores[currentIdx] || 0;
    const currentDetail = details[currentIdx];
    const bestWindow = this._buildBestWindow(details, bestIdx);
    const reason = this._buildReason(currentDetail);
    return { scores: smoothedScores, rawScores: scores, details, currentScore, currentDetail, age, bestWindow, reason };
  }

  _buildBestWindow(details, bestIdx) {
    if (bestIdx === null || bestIdx === undefined || !details[bestIdx]) return "";
    const peak = details[bestIdx];
    const threshold = Math.max(0.40, peak.score - 0.10);
    let start = bestIdx;
    let end = bestIdx;
    while (start > 0 && details[start - 1].score >= threshold) start--;
    while (end < details.length - 1 && details[end + 1].score >= threshold) end++;
    const maxSpanPoints = 15;
    if (end - start > maxSpanPoints) {
      start = Math.max(0, bestIdx - Math.floor(maxSpanPoints / 2));
      end = Math.min(details.length - 1, bestIdx + Math.ceil(maxSpanPoints / 2));
    }
    return `${this._formatClock(details[start].time)}-${this._formatClock(details[end].time)}`;
  }

  _buildReason(detail) {
    if (!detail) return "Waiting on fishing inputs";
    const parts = [];
    if (detail.weather.cap <= 0.25) return "Storms nearby, safety first";
    if (detail.weather.cap <= 0.45) parts.push(detail.weather.label);
    if (detail.wind.cap <= 0.42) parts.push("wind is rough");
    else if (detail.wind.score >= 0.80) parts.push("light wind");
    else if (detail.wind.score < 0.50) parts.push("wind penalty");
    if (detail.wave.score < 0.55) parts.push(detail.wave.label);
    if (detail.rip && detail.rip.score < 0.65) parts.push(detail.rip.label);
    if (detail.waterTemp.score >= 0.85) parts.push("water temp prime");
    else if (detail.waterTemp.score < 0.55) parts.push(detail.waterTemp.label);
    if (detail.clarity.score < 0.60) parts.push(detail.clarity.label);
    if (detail.tide.movementScore < 0.12) parts.push("near slack tide");
    else parts.push(detail.tide.label);
    if (detail.light.score >= 0.80) parts.push(detail.light.label);
    else if (detail.light.score < 0.30) parts.push("poor light window");
    if (detail.solunar >= 0.70) parts.push("moon window");
    if (detail.pressure.score >= 0.72) parts.push(detail.pressure.label);
    if (this._config.auto_sources && this._config.provider !== "dfo" && (this._autoData?.coops || this._autoData?.nws)) parts.push("NOAA/NWS inputs");
    if (!parts.length) parts.push("mixed but fishable");
    return parts.slice(0, 3).join(" + ");
  }

  _render() {
    this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="card-outer" id="root"><div class="loading"><div class="spinner"></div>Fetching tide data...</div></div></ha-card>`;
  }

  _renderError(msg) {
    const root = this.shadowRoot.getElementById("root");
    if (root) root.innerHTML = `<div class="error">${msg || "Could not load tide data"}</div>`;
  }

  _renderData() {
    if (!this._data) return;
    const { predictions, hilo } = this._data;
    if (!predictions.length) { this._renderError("No predictions returned"); return; }
    const unitLabel = this._config.units === "metric" ? "m" : "ft";
    const now = new Date();
    const cur = this._interpolateHeight(predictions, now);
    const nxt = this._interpolateHeight(predictions, new Date(now.getTime() + 600000));
    const rising = nxt > cur;
    const upcoming = hilo.filter((p) => this._parseHiloTime(p.t) > now);
    const nextLow = upcoming.find((p) => p.type === "L");
    const nextHigh = upcoming.find((p) => p.type === "H");
    const chartPredictions = this._rollingPredictions(predictions, now);
    const fish = this._config.show_fishing_score ? this._buildFishingScores(chartPredictions) : null;
    const scoreInfo = fish ? this._scoreLabel(fish.currentScore, this._fishBand) : null;
    if (scoreInfo) this._fishBand = scoreInfo.band;
    const phaseName = fish ? this._moonPhaseName(fish.age) : "";
    const waterTempLabel = this._formatWaterTemp(this._getWaterTempF());
    const weather = this._getWeatherState();
    const windLabel = this._formatWind(this._getWindSpeedMph(weather), this._getWindBearing(weather));
    const headerBadges = [
      waterTempLabel ? `<span class="water-temp-chip">Water ${waterTempLabel}</span>` : "",
      fish ? `<span class="fish-moon">${phaseName}</span>` : "",
      fish ? `<span class="fish-score ${scoreInfo.cls}">${scoreInfo.text}</span>` : ""
    ].filter(Boolean).join("");
    const root = this.shadowRoot.getElementById("root");

    root.innerHTML = `
      <div class="header">
        <div class="title">${this._config.title}</div>
        <div class="subtitle">${this._subtitleLabel()}</div>
      </div>
      <div class="current-row">
        <div class="current-icon">&#127754;</div>
        <div>
          <div class="current-label">Current Tide</div>
          <div class="current-value">${cur.toFixed(1)}<span class="current-unit"> ${unitLabel}</span></div>
        </div>
        <div class="condition-spacer"></div>
        ${windLabel ? `<div class="condition-chip">${windLabel}</div>` : ""}
        <div class="direction-chip">
          <div class="pulse-dot"></div>
          <span>${rising ? "▲ Rising" : "▼ Falling"}</span>
        </div>
      </div>
      <div class="chart-section">
        <div class="chart-header">
          <div class="section-label">${this._config.show_fishing_score ? "&#127907; Tide &amp; Fishing" : "Tide Forecast"}</div>
          ${headerBadges ? `<div class="fish-badge-row">${headerBadges}</div>` : ""}
        </div>
        <div class="chart-wrap"><canvas id="tideCanvas"></canvas></div>
        ${this._xAxisHtml(chartPredictions)}
      </div>
      ${fish ? `
        <div class="fish-footer">
          <div class="fish-reason">${fish.reason}</div>
          <div class="fish-next">${fish.bestWindow ? "Best: " + fish.bestWindow : ""}</div>
        </div>
        <div class="fish-legend">
          <div class="legend-item elite"><div class="legend-dot elite"></div>Elite</div>
          <div class="legend-item prime"><div class="legend-dot prime"></div>Prime</div>
          <div class="legend-item good"><div class="legend-dot good"></div>Good</div>
          <div class="legend-item fair"><div class="legend-dot fair"></div>Fair</div>
          <div class="legend-item slow"><div class="legend-dot slow"></div>Slow</div>
        </div>` : ""}
      <div class="tides-grid">
        ${this._pillHtml("low", nextLow, unitLabel)}
        ${this._pillHtml("high", nextHigh, unitLabel)}
      </div>
    `;

    requestAnimationFrame(() => {
      this._chartCanvas = this.shadowRoot.getElementById("tideCanvas");
      this._drawChart(chartPredictions, now, cur, unitLabel, fish?.scores || null, fish?.details || null, [nextHigh, nextLow].filter(Boolean), this._config.dark_mode);
    });
  }

  _pillHtml(type, tide, unitLabel) {
    const label = type === "low" ? "Low" : "High";
    const arrow = type === "low" ? "↓" : "↑";
    const labelRow = `<div style="margin-bottom:3px"><div class="pill-label ${type}">Next ${label} Tide</div></div>`;
    if (!tide) {
      return `<div class="tide-pill">${labelRow}<div class="pill-time" style="font-size:18px;color:var(--text-muted)">No data</div></div>`;
    }
    return `
      <div class="tide-pill">
        ${labelRow}
        <div style="display:flex;align-items:baseline;gap:10px;">
          <div class="pill-time"><span class="pill-arrow ${type}">${arrow}</span>${this._formatClock(this._parseHiloTime(tide.t))}</div>
          <div class="pill-ft">${parseFloat(tide.v).toFixed(1)} ${unitLabel}</div>
        </div>
      </div>`;
  }

  _drawChart(predictions, now, cur, unitLabel, fishScores, fishDetails, tideEvents = [], dark = false) {
    const canvas = this._chartCanvas;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 340;
    const H = canvas.offsetHeight || 95;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const vals = predictions.map((p) => parseFloat(p.v));
    const minV = Math.min(...vals) - 0.5;
    const maxV = Math.max(...vals) + 0.5;
    const padL = 34;
    const padR = 8;
    const padT = 8;
    const padB = 12;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const startMs = this._parsePredictionTime(predictions[0].t).getTime();
    const endMs = this._parsePredictionTime(predictions[predictions.length - 1].t).getTime();
    const spanMs = Math.max(1, endMs - startMs);
    const toX = (p) => padL + ((this._parsePredictionTime(p.t).getTime() - startMs) / spanMs) * cW;
    const toY = (v) => padT + cH - ((v - minV) / (maxV - minV)) * cH;

    ctx.strokeStyle = dark ? "rgba(255,255,255,0.10)" : "rgba(10,30,45,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const v = minV + (i / 3) * (maxV - minV);
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = dark ? "rgba(224,240,255,0.70)" : "rgba(10,30,45,0.65)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(v.toFixed(1), padL - 3, y + 3);
    }

    for (let i = 0; i < predictions.length - 1; i++) {
      const x1 = toX(predictions[i]);
      const x2 = toX(predictions[i + 1]);
      const y1 = toY(parseFloat(predictions[i].v));
      const y2 = toY(parseFloat(predictions[i + 1].v));
      const score = fishScores ? (fishScores[i] + fishScores[i + 1]) / 2 : 0.58;
      const [r, g, b] = this._fishColor(score);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, H - padB);
      ctx.lineTo(x1, H - padB);
      ctx.closePath();
      ctx.fillStyle = `rgba(${r},${g},${b},${fishScores ? 0.68 : 0.42})`;
      ctx.fill();
    }

    if (fishDetails && fishDetails.length) {
      const nowMs = now.getTime();
      const maxFutureMs = nowMs + 12 * 60 * 60 * 1000;
      let bestIdx = 0;
      let bestScore = -1;
      fishDetails.forEach((d, i) => {
        const tMs = d.time.getTime();
        if (tMs >= nowMs && tMs <= maxFutureMs && d.score > bestScore) { bestScore = d.score; bestIdx = i; }
      });
      if (bestScore >= 0.55 && predictions[bestIdx]) {
        const x = toX(predictions[bestIdx]);
        const glow = ctx.createLinearGradient(x - 12, 0, x + 12, 0);
        glow.addColorStop(0, "rgba(255,255,255,0)");
        glow.addColorStop(0.5, "rgba(255,255,255,0.34)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - 12, padT, 24, cH);
      }
    }

    tideEvents.forEach((ev) => {
      const evTime = this._parseHiloTime(ev.t);
      const evMs = evTime.getTime();
      if (!Number.isFinite(evMs) || evMs < startMs || evMs > endMs) return;
      const ex = padL + ((evMs - startMs) / spanMs) * cW;
      const evHeight = parseFloat(ev.v);
      const ey = Number.isFinite(evHeight) ? toY(evHeight) : padT + cH / 2;
      const isHigh = ev.type === "H";
      const label = `${isHigh ? "H" : "L"} ${this._formatClock(evTime).replace(" ", "")}`;
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = isHigh ? "rgba(10,122,112,0.72)" : "rgba(42,122,148,0.72)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(ex, padT);
      ctx.lineTo(ex, H - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fillStyle = isHigh ? "#0a7a70" : "#2a7a94";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = "bold 9px monospace";
      const lw = ctx.measureText(label).width;
      let lx = ex - lw / 2 - 4;
      let ly = ey + (isHigh ? -20 : 10);
      if (lx < padL) lx = padL;
      if (lx + lw + 8 > W - padR) lx = W - padR - lw - 8;
      if (ly < padT) ly = ey + 10;
      if (ly > H - padB - 16) ly = ey - 20;
      ctx.fillStyle = dark ? "rgba(8,28,55,0.88)" : "rgba(255,255,255,0.88)";
      ctx.strokeStyle = dark ? "rgba(74,176,204,0.55)" : "rgba(42,122,148,0.45)";
      ctx.lineWidth = 1;
      this._roundedRect(ctx, lx, ly, lw + 8, 15, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = dark ? "#e0f0ff" : "#0a1e28";
      ctx.textAlign = "left";
      ctx.fillText(label, lx + 4, ly + 10);
    });

    ctx.beginPath();
    predictions.forEach((p, i) => {
      const x = toX(p);
      const y = toY(parseFloat(p.v));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = dark ? "#4ab0cc" : "#2a7a94";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    const nx = Math.max(padL, Math.min(W - padR, padL + ((now.getTime() - startMs) / spanMs) * cW));
    const ny = toY(cur);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = "rgba(232,184,75,0.70)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(nx, padT);
    ctx.lineTo(nx, H - padB);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(nx, ny, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#e8b84b";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const lbl = `NOW  ${cur.toFixed(1)}${unitLabel}`;
    ctx.font = "bold 9px monospace";
    const tw = ctx.measureText(lbl).width;
    let bx = nx - tw / 2 - 5;
    let by = ny - 22;
    if (bx < padL) bx = padL;
    if (bx + tw + 10 > W - padR) bx = W - padR - tw - 10;
    if (by < padT) by = ny + 8;
    ctx.fillStyle = dark ? "rgba(8,28,55,0.92)" : "rgba(255,255,255,0.92)";
    ctx.strokeStyle = dark ? "rgba(74,176,204,0.60)" : "rgba(42,122,148,0.55)";
    ctx.lineWidth = 1;
    this._roundedRect(ctx, bx, by, tw + 10, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = dark ? "#e0f0ff" : "#0a1e28";
    ctx.textAlign = "left";
    ctx.fillText(lbl, bx + 5, by + 11);
  }

  _roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  _updateLive() { if (this._data) this._renderData(); }

  _interpolateHeight(predictions, target) {
    const targetMs = target.getTime();
    for (let i = 0; i < predictions.length - 1; i++) {
      const tA = this._parsePredictionTime(predictions[i].t).getTime();
      const tB = this._parsePredictionTime(predictions[i + 1].t).getTime();
      if (targetMs >= tA && targetMs <= tB) {
        const f = (targetMs - tA) / (tB - tA);
        return parseFloat(predictions[i].v) + f * (parseFloat(predictions[i + 1].v) - parseFloat(predictions[i].v));
      }
    }
    return parseFloat(predictions[predictions.length - 1].v);
  }

  _parseHiloTime(t) {
    const [dp, tp] = t.split(" ");
    const [y, mo, d] = dp.split("-").map(Number);
    const [h, m] = tp.split(":").map(Number);
    return new Date(y, mo - 1, d, h, m);
  }

  _formatClock(date) {
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    return `${((h % 12) || 12)}:${m} ${ap}`;
  }

  getCardSize() { return 5; }
}

class TideWiseCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  set hass(hass) {
    const wasNull = !this._hass;
    this._hass = hass;
    const home = this._homeLatLon();
    let needsRender = wasNull;
    if (this._config) {
      if (this._config.latitude === undefined && home.lat) { this._config.latitude = home.lat; needsRender = true; }
      if (this._config.longitude === undefined && home.lon) { this._config.longitude = home.lon; needsRender = true; }
    }
    if (needsRender) this._render();
  }

  setConfig(config) {
    this._config = {
      title: "TideWise",
      station: "8661070",
      provider: "noaa",
      units: "english",
      mode: "general",
      show_fishing_score: true,
      auto_sources: true,
      auto_surf_forecast: true,
      grid_options: { rows: "full", columns: 18 },
      ...config
    };
    const home = this._homeLatLon();
    if (this._config.latitude === undefined && home.lat) this._config.latitude = home.lat;
    if (this._config.longitude === undefined && home.lon) this._config.longitude = home.lon;
    this._render();
  }

  _homeLatLon() {
    const home = this._hass?.states?.["zone.home"];
    const lat = Number(home?.attributes?.latitude);
    const lon = Number(home?.attributes?.longitude);
    return { lat: Number.isFinite(lat) ? lat : null, lon: Number.isFinite(lon) ? lon : null };
  }

  _presetForStation(station) {
    return STATION_PRESETS.find((item) => item.station === String(station))
      || (_dfoStationCache || []).find((item) => item.station === String(station));
  }

  _isGeneratedTitle(title) {
    const value = String(title || "").trim();
    return value === "" || value === "TideWise"
      || STATION_PRESETS.some((item) => value === `${item.name} Tides`)
      || (_dfoStationCache || []).some((item) => value === `${item.name} Tides`);
  }

  async _loadDfoStations() {
    if (_dfoStationCache !== null) return;
    _dfoStationCache = [];
    try {
      const res = await fetch("https://api-iwls.dfo-mpo.gc.ca/api/v1/stations");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const all = await res.json();
      _dfoStationCache = all
        .filter((s) => {
          if (s.type === "DISCONTINUED" || s.type === "VIRTUAL" || s.type === "UNKNOWN") return false;
          const codes = (s.timeSeries || []).map((ts) => ts.code);
          return codes.includes("wlp") && codes.includes("wlp-hilo");
        })
        .map((s) => ({ station: s.id, code: s.code, name: s.officialName, lat: s.latitude, lon: s.longitude }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
      _dfoStationCache = [];
    }
    this._render();
  }

  _emitConfig(nextConfig) {
    this._config = nextConfig;
    const event = new Event("config-changed", { bubbles: true, composed: true });
    event.detail = { config: nextConfig };
    this.dispatchEvent(event);
    this._render();
  }

  _setValue(key, value) {
    const next = { ...this._config, [key]: value };
    this._emitConfig(next);
  }

  _setNumber(key, value) {
    const num = Number(value);
    const next = { ...this._config };
    if (Number.isFinite(num)) next[key] = num;
    else delete next[key];
    this._emitConfig(next);
  }

  _setGridValue(key, value) {
    const grid = { ...(this._config.grid_options || {}) };
    if (key === "columns" && value !== "full") {
      const num = Number(value);
      grid.columns = Number.isFinite(num) ? num : 18;
    } else {
      grid[key] = value;
    }
    this._emitConfig({ ...this._config, grid_options: grid });
  }

  _applyStation(station) {
    const preset = this._presetForStation(station);
    const next = { ...this._config, station: String(station) };
    if (preset) {
      if (this._isGeneratedTitle(next.title)) next.title = `${preset.name} Tides`;
      next.latitude = preset.lat;
      next.longitude = preset.lon;
    }
    this._emitConfig(next);
  }

  _useHomeLocation() {
    const home = this._homeLatLon();
    if (!home.lat || !home.lon) return;
    this._emitConfig({ ...this._config, latitude: home.lat, longitude: home.lon });
  }

  _renderStationSection(config) {
    const isDfo = config.provider === "dfo";
    if (!isDfo) {
      const selectedPreset = STATION_PRESETS.find((p) => p.station === String(config.station)) ? String(config.station) : "custom";
      return `
        <label>
          NOAA tide station
          <select id="stationPreset">
            ${STATION_PRESETS.map((item) => `<option value="${item.station}" ${selectedPreset === item.station ? "selected" : ""}>${item.name} (${item.station})</option>`).join("")}
            <option value="custom" ${selectedPreset === "custom" ? "selected" : ""}>Custom station ID</option>
          </select>
        </label>
        <label>
          Custom NOAA station ID
          <input id="station" value="${this._escape(config.station || "")}" placeholder="8661070">
        </label>`;
    }
    const cache = _dfoStationCache;
    const selectedDfo = (cache || []).find((p) => p.station === String(config.station)) ? String(config.station) : "custom";
    let dfoSelect;
    if (cache === null) {
      dfoSelect = `<select id="dfoStationPreset" disabled><option>Loading Canadian stations…</option></select>`;
    } else if (cache.length === 0) {
      dfoSelect = `<select id="dfoStationPreset" disabled><option>Could not load — enter UUID manually</option></select>`;
    } else {
      dfoSelect = `<select id="dfoStationPreset">
        ${cache.map((item) => `<option value="${item.station}" ${selectedDfo === item.station ? "selected" : ""}>${this._escape(item.name)} (${item.code})</option>`).join("")}
        <option value="custom" ${selectedDfo === "custom" ? "selected" : ""}>Custom station UUID</option>
      </select>`;
    }
    return `
      <label>
        DFO / CHS tide station
        ${dfoSelect}
      </label>
      <label>
        Custom DFO station UUID
        <input id="station" value="${this._escape(config.station || "")}" placeholder="24-character hex UUID">
        <span style="font-size:11px;color:var(--secondary-text-color,#536471)">Find UUIDs at api-iwls.dfo-mpo.gc.ca/api/v1/stations</span>
      </label>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const config = this._config || {};
    const isDfo = config.provider === "dfo";
    const home = this._homeLatLon();
    const grid = config.grid_options || {};
    if (isDfo && _dfoStationCache === null) this._loadDfoStations();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          color: var(--primary-text-color, #1f2933);
          font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
        }
        .wrap { display: grid; gap: 16px; }
        .section { display: grid; gap: 10px; }
        .title { font-size: 14px; font-weight: 700; color: var(--primary-text-color, #1f2933); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
        .wide { grid-column: 1 / -1; }
        label { display: grid; gap: 5px; font-size: 12px; font-weight: 700; color: var(--secondary-text-color, #536471); }
        input, select {
          box-sizing: border-box;
          width: 100%;
          min-height: 40px;
          padding: 8px 10px;
          border: 1px solid var(--divider-color, #d0d7de);
          border-radius: 8px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #1f2933);
          font: inherit;
        }
        .row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        button {
          min-height: 36px;
          padding: 7px 12px;
          border: 1px solid var(--divider-color, #d0d7de);
          border-radius: 8px;
          background: var(--secondary-background-color, #f6f8fa);
          color: var(--primary-text-color, #1f2933);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .check { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--primary-text-color, #1f2933); }
        .check input { width: auto; min-height: auto; }
        .hint { font-size: 12px; line-height: 1.35; color: var(--secondary-text-color, #536471); }
        .check-disabled { opacity: 0.5; }
      </style>
      <div class="wrap">
        <div class="section">
          <div class="title">Location</div>
          <div class="grid">
            <label>
              Data provider
              <select id="provider">
                <option value="noaa" ${!isDfo ? "selected" : ""}>NOAA (US)</option>
                <option value="dfo" ${isDfo ? "selected" : ""}>DFO / CHS (Canada)</option>
              </select>
            </label>
          </div>
          <div class="grid">
            ${this._renderStationSection(config)}
          </div>
          <div class="grid">
            <label>
              Fishing/forecast latitude
              <input id="latitude" type="number" step="0.000001" value="${config.latitude ?? ""}" placeholder="33.688">
            </label>
            <label>
              Fishing/forecast longitude
              <input id="longitude" type="number" step="0.000001" value="${config.longitude ?? ""}" placeholder="-78.886">
            </label>
          </div>
          <div class="row">
            <button id="stationLocation" type="button">Use NOAA station location</button>
            <button id="homeLocation" type="button" ${home.lat && home.lon ? "" : "disabled"}>Use HA home location</button>
            <span class="hint">For best fishing scores, use coordinates near the tide gauge, beach, inlet, or fishing area. ${home.lat && home.lon ? `HA home: ${home.lat.toFixed(4)}, ${home.lon.toFixed(4)}` : "HA home location is not available in zone.home."}</span>
          </div>
        </div>

        <div class="section">
          <div class="title">Card</div>
          <div class="grid">
            <label class="wide">
              Title
              <input id="title" value="${this._escape(config.title || "")}" placeholder="TideWise">
            </label>
            <label>
              Units
              <select id="units">
                <option value="english" ${config.units !== "metric" ? "selected" : ""}>English (ft)</option>
                <option value="metric" ${config.units === "metric" ? "selected" : ""}>Metric (m)</option>
              </select>
            </label>
            <label>
              Fishing mode
              <select id="mode">
                ${["general", "surf", "inlet", "flounder", "trout_redfish", "sheepshead"].map((mode) => `<option value="${mode}" ${config.mode === mode ? "selected" : ""}>${mode.replace("_", " / ")}</option>`).join("")}
              </select>
            </label>
          </div>
          <label class="check">
            <input id="darkMode" type="checkbox" ${config.dark_mode ? "checked" : ""}>
            Dark mode
          </label>
          <label class="check">
            <input id="showFishing" type="checkbox" ${config.show_fishing_score !== false ? "checked" : ""}>
            Show fishing score
          </label>
          <label class="check${isDfo ? " check-disabled" : ""}">
            <input id="autoSources" type="checkbox" ${config.auto_sources !== false ? "checked" : ""} ${isDfo ? "disabled" : ""}>
            ${isDfo ? "Fetch auto sources (NOAA/NWS unavailable for Canada)" : "Fetch NOAA/NWS auto sources"}
          </label>
          <label class="check${isDfo ? " check-disabled" : ""}">
            <input id="autoSurfForecast" type="checkbox" ${config.auto_surf_forecast !== false ? "checked" : ""} ${isDfo ? "disabled" : ""}>
            ${isDfo ? "NWS surf/rip forecast (US only)" : "Try NWS surf/rip forecast"}
          </label>
        </div>

        <div class="section">
          <div class="title">Dashboard Size</div>
          <div class="grid">
            <label>
              Rows
              <select id="gridRows">
                <option value="full" ${grid.rows === "full" ? "selected" : ""}>Full</option>
                <option value="auto" ${grid.rows === "auto" ? "selected" : ""}>Auto</option>
              </select>
            </label>
            <label>
              Columns
              <input id="gridColumns" value="${grid.columns ?? 18}" placeholder="18 or full">
            </label>
          </div>
          <div class="hint">Recommended: rows full, columns 18. Use columns full on narrower dashboards.</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById("provider")?.addEventListener("change", (event) => {
      const next = { ...this._config, provider: event.target.value };
      if (event.target.value === "dfo") {
        const first = (_dfoStationCache || [])[0];
        if (first) {
          next.station = first.station;
          next.latitude = first.lat;
          next.longitude = first.lon;
          if (this._isGeneratedTitle(next.title)) next.title = `${first.name} Tides`;
        }
        if (_dfoStationCache === null) this._loadDfoStations();
      } else {
        next.station = STATION_PRESETS[0].station;
        next.latitude = STATION_PRESETS[0].lat;
        next.longitude = STATION_PRESETS[0].lon;
        if (this._isGeneratedTitle(next.title)) next.title = `${STATION_PRESETS[0].name} Tides`;
      }
      this._emitConfig(next);
    });
    this.shadowRoot.getElementById("stationPreset")?.addEventListener("change", (event) => {
      const value = event.target.value;
      if (value !== "custom") this._applyStation(value);
    });
    this.shadowRoot.getElementById("dfoStationPreset")?.addEventListener("change", (event) => {
      const value = event.target.value;
      if (value !== "custom") this._applyStation(value);
    });
    this.shadowRoot.getElementById("station")?.addEventListener("change", (event) => this._setValue("station", String(event.target.value || "").trim()));
    this.shadowRoot.getElementById("latitude")?.addEventListener("change", (event) => this._setNumber("latitude", event.target.value));
    this.shadowRoot.getElementById("longitude")?.addEventListener("change", (event) => this._setNumber("longitude", event.target.value));
    this.shadowRoot.getElementById("stationLocation")?.addEventListener("click", () => this._useNoaaStationLocation());
    this.shadowRoot.getElementById("homeLocation")?.addEventListener("click", () => this._useHomeLocation());
    this.shadowRoot.getElementById("title")?.addEventListener("change", (event) => this._setValue("title", event.target.value || "TideWise"));
    this.shadowRoot.getElementById("units")?.addEventListener("change", (event) => this._setValue("units", event.target.value));
    this.shadowRoot.getElementById("mode")?.addEventListener("change", (event) => this._setValue("mode", event.target.value));
    this.shadowRoot.getElementById("darkMode")?.addEventListener("change", (event) => this._setValue("dark_mode", event.target.checked));
    this.shadowRoot.getElementById("showFishing")?.addEventListener("change", (event) => this._setValue("show_fishing_score", event.target.checked));
    this.shadowRoot.getElementById("autoSources")?.addEventListener("change", (event) => this._setValue("auto_sources", event.target.checked));
    this.shadowRoot.getElementById("autoSurfForecast")?.addEventListener("change", (event) => this._setValue("auto_surf_forecast", event.target.checked));
    this.shadowRoot.getElementById("gridRows")?.addEventListener("change", (event) => this._setGridValue("rows", event.target.value));
    this.shadowRoot.getElementById("gridColumns")?.addEventListener("change", (event) => this._setGridValue("columns", event.target.value));
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[char]));
  }
}

class CherryGroveTidesCard extends TideWiseCard {}

if (!customElements.get(CARD_TYPES[0])) customElements.define(CARD_TYPES[0], TideWiseCard);
if (!customElements.get(CARD_TYPES[1])) customElements.define(CARD_TYPES[1], CherryGroveTidesCard);
if (!customElements.get("tidewise-card-editor")) customElements.define("tidewise-card-editor", TideWiseCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tidewise-card",
  name: "TideWise",
  description: "NOAA and DFO/Canada tides with optional bite-window fishing quality scoring",
  preview: true
});

console.info(
  `%c TIDEWISE CARD %c v${CARD_VERSION} `,
  "background:#0d3a5c;color:#7ecbca;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px",
  "background:#7ecbca;color:#0d3a5c;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"
);
console.info(`TideWise v${CARD_VERSION} loaded (NOAA + DFO/Canada)`);
