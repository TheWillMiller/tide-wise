/*
 * TideWise Card v0.9.5
 * NOAA tides with optional bite-window fishing quality scoring.
 *
 * Legacy alias: custom:cherry-grove-tides-card
 */

const CARD_VERSION = "0.9.6";
const CARD_TYPES = ["tidewise-card", "cherry-grove-tides-card"];
const TIDEWISE_PROVIDERS = {
  noaa_coops: { label: "US NOAA CO-OPS", stationLabel: "NOAA" },
  chs_iwls: { label: "Canada CHS / DFO", stationLabel: "CHS" },
  ukho_entity: { label: "UK UKHO Tides integration", stationLabel: "UKHO" },
  generic_entity: { label: "Home Assistant tide entity", stationLabel: "HA" }
};
const CANADA_REGIONS = [
  { code: "atlantic", name: "Atlantic Canada", bbox: [-68.5, 42.0, -52.0, 60.5] },
  { code: "great_lakes", name: "Great Lakes / Ontario", bbox: [-95.0, 41.0, -74.0, 50.5] },
  { code: "quebec", name: "Quebec / St. Lawrence", bbox: [-80.5, 44.5, -57.0, 63.5] },
  { code: "pacific", name: "Pacific Canada", bbox: [-140.0, 47.0, -114.0, 60.5] },
  { code: "arctic", name: "Arctic Canada", bbox: [-142.0, 58.0, -52.0, 84.0] }
];
const CANADA_STATION_SEEDS = [
  { region: "great_lakes", code: "10050", name: "Thunder Bay", seriesCode: "wlf" },
  { region: "great_lakes", code: "10220", name: "Rossport", seriesCode: "wlf" },
  { region: "great_lakes", code: "10750", name: "Michipicoten", seriesCode: "wlf" },
  { region: "great_lakes", code: "10920", name: "Gros Cap", seriesCode: "wlf" },
  { region: "great_lakes", code: "10980", name: "Sault Ste Marie - Above Locks", seriesCode: "wlf" },
  { region: "great_lakes", code: "11010", name: "Sault Ste Marie - Below Locks", seriesCode: "wlf" },
  { region: "great_lakes", code: "11070", name: "Thessalon", seriesCode: "wlf" },
  { region: "great_lakes", code: "11195", name: "Little Current", seriesCode: "wlf" },
  { region: "great_lakes", code: "11375", name: "Parry Sound", seriesCode: "wlf" },
  { region: "great_lakes", code: "11445", name: "Midland", seriesCode: "wlf" },
  { region: "great_lakes", code: "11500", name: "Collingwood", seriesCode: "wlf" },
  { region: "great_lakes", code: "11690", name: "Tobermory", seriesCode: "wlf" },
  { region: "great_lakes", code: "11860", name: "Goderich", seriesCode: "wlf" },
  { region: "great_lakes", code: "11940", name: "Point Edward", seriesCode: "wlf" },
  { region: "great_lakes", code: "11950", name: "Port Lambton", seriesCode: "wlf" },
  { region: "great_lakes", code: "11965", name: "Belle River", seriesCode: "wlf" },
  { region: "great_lakes", code: "11975", name: "Tecumseh", seriesCode: "wlp" },
  { region: "great_lakes", code: "11985", name: "La Salle", seriesCode: "wlp" },
  { region: "great_lakes", code: "11995", name: "Amherstburg", seriesCode: "wlf" },
  { region: "great_lakes", code: "12005", name: "Bar Point", seriesCode: "wlf" },
  { region: "great_lakes", code: "12065", name: "Kingsville", seriesCode: "wlf" },
  { region: "great_lakes", code: "12250", name: "Erieau", seriesCode: "wlf" },
  { region: "great_lakes", code: "12400", name: "Port Stanley", seriesCode: "wlf" },
  { region: "great_lakes", code: "12710", name: "Port Dover", seriesCode: "wlf" },
  { region: "great_lakes", code: "12865", name: "Port Colborne", seriesCode: "wlf" },
  { region: "great_lakes", code: "12954", name: "Peace Bridge Below", seriesCode: "wlp" },
  { region: "great_lakes", code: "13030", name: "Port Weller", seriesCode: "wlf" },
  { region: "great_lakes", code: "13150", name: "Burlington", seriesCode: "wlf" },
  { region: "great_lakes", code: "13320", name: "Toronto", seriesCode: "wlf" },
  { region: "great_lakes", code: "13590", name: "Cobourg", seriesCode: "wlf" },
  { region: "great_lakes", code: "13988", name: "Kingston", seriesCode: "wlf" },
  { region: "great_lakes", code: "14400", name: "Brockville", seriesCode: "wlf" },
  { region: "great_lakes", code: "14505", name: "Ogdensburg", seriesCode: "wlp" },
  { region: "great_lakes", code: "14600", name: "Iroquois Above", seriesCode: "wlf" },
  { region: "great_lakes", code: "14602", name: "Iroquois Below", seriesCode: "wlf" },
  { region: "great_lakes", code: "14660", name: "Morrisburg", seriesCode: "wlf" },
  { region: "great_lakes", code: "14870", name: "Cornwall", seriesCode: "wlf" },
  { region: "great_lakes", code: "14940", name: "Summerstown", seriesCode: "wlf" }
];
const NWS_BEACH_AREAS = [
  { id: "sc-horry", state: "SC", name: "Horry County / Grand Strand", office: "ILM", zone: "SCZ054", lat: 33.838489, lon: -78.603644 },
  { id: "sc-georgetown", state: "SC", name: "Georgetown County Beaches", office: "ILM", zone: "SCZ056", lat: 33.3490, lon: -79.1880 },
  { id: "nc-brunswick", state: "NC", name: "Brunswick County Beaches", office: "ILM", zone: "NCZ110", lat: 33.9020, lon: -78.3850 },
  { id: "nc-new-hanover", state: "NC", name: "New Hanover County Beaches", office: "ILM", zone: "NCZ108", lat: 34.1940, lon: -77.8010 },
  { id: "nc-pender", state: "NC", name: "Pender County Beaches", office: "ILM", zone: "NCZ106", lat: 34.4300, lon: -77.5500 }
];
const NWS_SRF_OFFICES = [
  { region: "Atlantic/Gulf/Caribbean", state: "AL", area: "Mobile", nws: "MOB", srf: "SRFMOB" },
  { region: "Atlantic/Gulf/Caribbean", state: "FL", area: "Jacksonville", nws: "JAX", srf: "SRFJAX" },
  { region: "Atlantic/Gulf/Caribbean", state: "FL", area: "Melbourne", nws: "MLB", srf: "SRFMLB" },
  { region: "Atlantic/Gulf/Caribbean", state: "FL", area: "Miami / South Florida", nws: "MFL", srf: "SRFMFL" },
  { region: "Atlantic/Gulf/Caribbean", state: "FL", area: "Tallahassee", nws: "TAE", srf: "SRFTAE" },
  { region: "Atlantic/Gulf/Caribbean", state: "FL", area: "Tampa Bay", nws: "TBW", srf: "SRFTBW" },
  { region: "Atlantic/Gulf/Caribbean", state: "MA", area: "Boston / Norton", nws: "BOX", srf: "SRFBOX" },
  { region: "Atlantic/Gulf/Caribbean", state: "ME", area: "Caribou", nws: "CAR", srf: "SRFCAR" },
  { region: "Atlantic/Gulf/Caribbean", state: "ME", area: "Portland / Gray", nws: "GYX", srf: "SRFGYX" },
  { region: "Atlantic/Gulf/Caribbean", state: "NC", area: "Morehead City", nws: "MHX", srf: "SRFMHX" },
  { region: "Atlantic/Gulf/Caribbean", state: "NC", area: "Wilmington", nws: "ILM", srf: "SRFILM" },
  { region: "Atlantic/Gulf/Caribbean", state: "NY", area: "New York City / Upton", nws: "OKX", srf: "SRFOKX" },
  { region: "Atlantic/Gulf/Caribbean", state: "PA/NJ", area: "Philadelphia / Mount Holly", nws: "PHI", srf: "SRFPHI" },
  { region: "Atlantic/Gulf/Caribbean", state: "PR/VI", area: "San Juan / Puerto Rico / U.S. Virgin Islands", nws: "SJU", srf: "SRFSJU" },
  { region: "Atlantic/Gulf/Caribbean", state: "SC", area: "Charleston", nws: "CHS", srf: "SRFCHS" },
  { region: "Atlantic/Gulf/Caribbean", state: "TX", area: "Brownsville", nws: "BRO", srf: "SRFBRO" },
  { region: "Atlantic/Gulf/Caribbean", state: "TX", area: "Corpus Christi", nws: "CRP", srf: "SRFCRP" },
  { region: "Atlantic/Gulf/Caribbean", state: "VA", area: "Wakefield", nws: "AKQ", srf: "SRFAKQ" },
  { region: "Great Lakes", state: "IL", area: "Chicago", nws: "LOT", srf: "SRFLOT" },
  { region: "Great Lakes", state: "IN", area: "Northern Indiana / Syracuse", nws: "IWX", srf: "SRFIWX" },
  { region: "Great Lakes", state: "MI", area: "Detroit", nws: "DTX", srf: "SRFDTX" },
  { region: "Great Lakes", state: "MI", area: "Gaylord", nws: "APX", srf: "SRFAPX" },
  { region: "Great Lakes", state: "MI", area: "Grand Rapids", nws: "GRR", srf: "SRFGRR" },
  { region: "Great Lakes", state: "MI", area: "Marquette", nws: "MQT", srf: "SRFMQT" },
  { region: "Great Lakes", state: "MN", area: "Duluth", nws: "DLH", srf: "SRFDLH" },
  { region: "Great Lakes", state: "NY", area: "Buffalo", nws: "BUF", srf: "SRFBUF" },
  { region: "Great Lakes", state: "OH", area: "Cleveland", nws: "CLE", srf: "SRFCLE" },
  { region: "Great Lakes", state: "WI", area: "Green Bay", nws: "GRB", srf: "SRFGRB" },
  { region: "Great Lakes", state: "WI", area: "Milwaukee", nws: "MKX", srf: "SRFMKX" },
  { region: "West Coast", state: "CA", area: "Eureka", nws: "EKA", srf: "SRFEKA" },
  { region: "West Coast", state: "CA", area: "Los Angeles / Oxnard", nws: "LOX", srf: "SRFLOX" },
  { region: "West Coast", state: "CA", area: "San Francisco / Monterey", nws: "MTR", srf: "SRFMTR" },
  { region: "West Coast", state: "CA", area: "San Diego", nws: "SGX", srf: "SRFSGX" },
  { region: "West Coast", state: "OR", area: "Medford", nws: "MFR", srf: "SRFMFR" },
  { region: "West Coast", state: "OR", area: "Portland", nws: "PQR", srf: "SRFPQR" },
  { region: "Pacific", state: "GU/MP", area: "Guam / Marianas", nws: "GUM", srf: "SRFGUM" },
  { region: "Pacific", state: "HI", area: "Honolulu", nws: "HFO", srf: "SRFHFO" }
];
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

const STYLES = `
  :host {
    --wave: #2a7a94; --wave-dark: #1a5f72; --gold: #e8b84b;
    --low-color: #2a7a94; --high-color: #0a7a70; --text: #0a1e28; --text-muted: #1e4d5e;
    --elite: #16a34a; --prime: #2563eb; --good: #0891b2; --fair: #f59e0b; --slow: #dc2626;
    --tw-panel-bg: rgba(255,255,255,0.35); --tw-panel-border: rgba(42,122,148,0.20);
    --tw-chip-bg: rgba(255,255,255,0.48); --tw-chip-border: rgba(42,122,148,0.22);
    --tw-chart-grid: rgba(10,30,45,0.15); --tw-chart-axis: rgba(10,30,45,0.65);
    --tw-chart-label-bg: rgba(255,255,255,0.88); --tw-chart-now-label-bg: rgba(255,255,255,0.92);
    --tw-chart-label-border: rgba(42,122,148,0.45); --tw-chart-now-label-border: rgba(42,122,148,0.55);
    --tw-chart-label-text: #0a1e28; --tw-tide-line: #2a7a94;
    --tw-marker-stroke: rgba(255,255,255,0.9); --tw-now-marker-stroke: rgba(255,255,255,0.92);
    --font-main: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif;
    --font-mono: "SF Mono", "Roboto Mono", "Courier New", monospace;
    display: block; font-family: var(--font-main); color: var(--text); container-type: inline-size;
  }
  :host([theme-mode="auto"]) {
    --wave: var(--accent-color, #2a7a94); --wave-dark: var(--primary-color, var(--accent-color, #1a5f72));
    --low-color: var(--accent-color, #2a7a94); --high-color: var(--primary-color, #0a7a70);
    --text: var(--primary-text-color, #0a1e28); --text-muted: var(--secondary-text-color, #1e4d5e);
    --tw-panel-bg: var(--secondary-background-color, rgba(255,255,255,0.35));
    --tw-panel-border: var(--divider-color, rgba(42,122,148,0.20));
    --tw-chip-bg: var(--card-background-color, rgba(255,255,255,0.48));
    --tw-chip-border: var(--divider-color, rgba(42,122,148,0.22));
    --tw-chart-grid: var(--divider-color, rgba(10,30,45,0.15));
    --tw-chart-axis: var(--secondary-text-color, rgba(10,30,45,0.65));
    --tw-chart-label-bg: var(--card-background-color, rgba(255,255,255,0.88));
    --tw-chart-now-label-bg: var(--card-background-color, rgba(255,255,255,0.92));
    --tw-chart-label-border: var(--divider-color, rgba(42,122,148,0.45));
    --tw-chart-now-label-border: var(--divider-color, rgba(42,122,148,0.55));
    --tw-chart-label-text: var(--primary-text-color, #0a1e28);
    --tw-tide-line: var(--accent-color, #2a7a94);
    --tw-marker-stroke: var(--card-background-color, rgba(255,255,255,0.9));
    --tw-now-marker-stroke: var(--card-background-color, rgba(255,255,255,0.92));
  }
  .card-outer {
    background: linear-gradient(135deg, rgba(255,255,255,0.70), rgba(222,244,248,0.58));
    backdrop-filter: blur(12px) saturate(1.08); -webkit-backdrop-filter: blur(12px) saturate(1.08);
    border-radius: 22px; padding: 8px 16px 8px;
    border: 1px solid rgba(255,255,255,0.40); box-shadow: 0 5px 24px rgba(10,50,70,0.14);
    position: relative; overflow: hidden;
  }
  :host([theme-mode="auto"]) .card-outer {
    background: var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.70)));
    border-color: var(--divider-color, rgba(255,255,255,0.40));
    box-shadow: var(--ha-card-box-shadow, 0 5px 24px rgba(10,50,70,0.14));
  }
  ha-card { background: transparent !important; box-shadow: none !important; border-radius: 22px !important; }
  .card-outer::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(42,122,148,0.62), transparent); }
  .header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
  .title { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1.05; letter-spacing: 0; overflow-wrap: anywhere; min-width: 0; max-width: 100%; }
  .subtitle { font-size: 13px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 650; white-space: nowrap; padding-top: 8px; }
  .current-row { display: flex; align-items: center; gap: 13px; flex-wrap: wrap; background: var(--tw-panel-bg); border: 1px solid var(--tw-panel-border); border-radius: 14px; padding: 7px 13px; margin-bottom: 6px; }
  .current-icon { font-size: 22px; animation: bob 3s ease-in-out infinite; flex-shrink: 0; }
  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  .current-label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wave-dark); margin-bottom: 2px; font-weight: 750; }
  .current-value { font-family: var(--font-mono); font-size: 36px; font-weight: 800; color: var(--text); line-height: 1; }
  .current-unit { font-size: 18px; color: var(--text-muted); font-weight: 650; }
  .direction-chip { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 18px; color: var(--wave-dark); font-weight: 750; flex-shrink: 0; }
  .condition-chip { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--wave-dark); background: var(--tw-chip-bg); border: 1px solid var(--tw-chip-border); border-radius: 99px; padding: 4px 10px; white-space: nowrap; font-weight: 800; flex-shrink: 0; }
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
  .water-temp-chip { font-size: 13px; color: var(--wave-dark); background: var(--tw-chip-bg); border: 1px solid var(--tw-chip-border); border-radius: 99px; padding: 2px 9px; white-space: nowrap; font-weight: 800; }
  .fish-moon { font-size: 13px; color: var(--text-muted); font-weight: 650; white-space: nowrap; }
  .chart-wrap { position: relative; height: 95px; border-radius: 10px; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }
  .x-row { display: flex; justify-content: space-between; margin-top: 2px; padding: 0 2px; }
  .x-tick { font-size: 13px; font-weight: 650; color: var(--text-muted); }
  .fish-footer { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-top: 2px; margin-bottom: 2px; }
  .fish-reason { font-size: 12px; color: var(--text-muted); font-weight: 650; line-height: 1.3; max-height: 34px; overflow-y: auto; scrollbar-width: thin; min-width: 0; flex: 1 1 auto; }
  .safety-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #8a3018; background: rgba(192,80,48,0.12); border: 1px solid rgba(192,80,48,0.18); border-radius: 99px; padding: 2px 8px; font-weight: 850; white-space: nowrap; flex-shrink: 0; }
  .fish-next { font-size: 12px; color: var(--wave-dark); font-weight: 800; white-space: nowrap; flex-shrink: 0; }
  .fish-legend { display: flex; align-items: center; gap: 12px; margin: 2px 0 6px; padding-left: 2px; min-width: 0; flex-wrap: nowrap; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-muted); font-weight: 750; white-space: nowrap; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .legend-dot.elite{background:var(--elite)} .legend-dot.prime{background:var(--prime)} .legend-dot.good{background:var(--good)} .legend-dot.fair{background:var(--fair)} .legend-dot.slow{background:var(--slow)}
  .legend-item.elite{color:#0f7a38} .legend-item.prime{color:#1d4ed8} .legend-item.good{color:#0e7490} .legend-item.fair{color:#9a5b00} .legend-item.slow{color:#a51f1f}
  .tides-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .tide-pill { background: var(--tw-panel-bg); border: 1px solid var(--tw-panel-border); border-radius: 12px; padding: 5px 12px; }
  .pill-label { font-size: 13px; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 3px; font-weight: 750; }
  .pill-label.low{color:var(--low-color)} .pill-label.high{color:var(--high-color)}
  .pill-main { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
  .pill-time { font-family: var(--font-mono); font-size: 26px; font-weight: 800; color: var(--text); line-height: 1.1; }
  .pill-arrow { font-size: 16px; margin-right: 4px; }
  .pill-arrow.low{color:var(--low-color)} .pill-arrow.high{color:var(--high-color)}
  .pill-ft { font-size: 16px; color: var(--text-muted); font-weight: 650; }
  .debug-panel { margin-top: 8px; background: rgba(10,30,40,0.06); border: 1px solid rgba(42,122,148,0.24); border-radius: 12px; color: var(--text); overflow: hidden; }
  .debug-panel summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 8px; align-items: baseline; padding: 8px 10px; }
  .debug-panel summary::-webkit-details-marker { display: none; }
  .debug-title-main::before { content: "▸"; display: inline-block; margin-right: 6px; transition: transform 0.16s ease; }
  .debug-panel[open] .debug-title-main::before { transform: rotate(90deg); }
  .debug-title { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wave-dark); font-weight: 850; }
  .debug-note { font-size: 11px; letter-spacing: 0; text-transform: none; color: var(--text-muted); font-weight: 650; }
  .debug-body { max-height: 360px; overflow-y: auto; padding: 0 10px 10px; scrollbar-width: thin; }
  .debug-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .debug-section { min-width: 0; }
  .debug-section-title { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 850; margin: 4px 0 3px; }
  .debug-line { display: flex; justify-content: space-between; gap: 8px; font-family: var(--font-mono); font-size: 10.5px; line-height: 1.35; border-top: 1px solid rgba(42,122,148,0.10); padding: 2px 0; }
  .debug-key { color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .debug-value { color: var(--text); font-weight: 800; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .debug-warn { color: #a51f1f; font-weight: 900; }
  @media (max-width: 520px) { .debug-grid { grid-template-columns: 1fr; } }
  @container (max-width: 520px) {
    .card-outer { padding: 12px 14px 12px; border-radius: 20px; }
    .header { display: block; margin-bottom: 8px; }
    .title { font-size: 25px; line-height: 1.08; margin-bottom: 8px; }
    .subtitle { display: block; padding-top: 0; font-size: 12px; white-space: normal; }
    .current-row { gap: 8px 10px; padding: 10px 12px; align-items: center; }
    .current-label { font-size: 12px; }
    .current-value { font-size: 34px; }
    .condition-spacer { display: none; }
    .condition-chip { order: 3; font-size: 12px; padding: 3px 8px; }
    .direction-chip { order: 4; margin-left: auto; font-size: 16px; gap: 6px; }
    .pulse-dot { width: 10px; height: 10px; }
    .chart-header { align-items: flex-start; flex-wrap: wrap; gap: 6px; }
    .section-label { font-size: 12px; }
    .fish-badge-row { justify-content: flex-start; flex-wrap: wrap; gap: 5px; }
    .water-temp-chip, .fish-moon, .fish-score { font-size: 12px; }
    .chart-wrap { height: 92px; }
    .x-tick { font-size: 12px; }
    .fish-footer { flex-wrap: wrap; gap: 5px 8px; }
    .fish-reason { flex: 1 0 100%; max-height: 38px; font-size: 11.5px; }
    .safety-badge { font-size: 10.5px; padding: 2px 7px; }
    .fish-next { margin-left: auto; font-size: 11.5px; }
    .fish-legend { gap: 8px; flex-wrap: wrap; margin-top: 4px; }
    .legend-item { font-size: 11.5px; gap: 4px; }
    .tides-grid { gap: 8px; }
    .tide-pill { padding: 8px 10px; }
    .pill-label { font-size: 11.5px; letter-spacing: 0.06em; }
    .pill-main { gap: 6px; flex-wrap: wrap; }
    .pill-time { font-size: 22px; line-height: 1.05; }
    .pill-ft { font-size: 14px; }
  }
  @container (max-width: 390px) {
    .title { font-size: 22px; }
    .current-value { font-size: 30px; }
    .chart-wrap { height: 86px; }
    .fish-next { flex: 1 0 100%; margin-left: 0; }
    .tides-grid { grid-template-columns: 1fr; }
    .pill-main { justify-content: space-between; }
    .pill-time { font-size: 24px; }
  }
  .loading,.error { text-align: center; padding: 30px 20px; color: var(--text-muted); font-size: 14px; }
  .error{color:#c04444}
  .spinner { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.40); border-top-color: var(--wave); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
  @keyframes spin { to{transform:rotate(360deg)} }
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
    this._fishBand = null;
    this._waitingForHassState = false;
  }

  static getStubConfig() {
    return {
      title: "TideWise",
      provider: "noaa_coops",
      station: "8661070",
      tide_entity: "",
      tide_time_mode: "as_is",
      tide_time_zone: "",
      ukho_entity: "",
      ukho_time_mode: "uk_local",
      time_offset_minutes: 0,
      height_offset: 0,
      units: "english",
      wind_units: "auto",
      mode: "general",
      theme_mode: "tidewise",
      show_fishing_score: true,
      auto_sources: true,
      auto_surf_forecast: true,
      srf_region: "",
      beach_state: "",
      beach_area: "",
      surf_zone: "",
      debug: false
    };
  }

  static getConfigElement() {
    return document.createElement("tidewise-card-editor");
  }

  set hass(hass) {
    this._hass = hass;
    if (this._waitingForHassState && this._config?.provider === "ukho_entity") {
      this._waitingForHassState = false;
      this._fetchData();
    }
    if (this._waitingForHassState && this._config?.provider === "generic_entity") {
      this._waitingForHassState = false;
      this._fetchData();
    }
  }

  setConfig(config) {
    const provider = this._normalizeProvider(config.provider);
    if (provider === "noaa_coops" && !config.station) throw new Error("TideWise requires a NOAA station ID.");
    const previousConfig = this._config || {};
    this._config = {
      title: config.title || "TideWise",
      provider,
      station: String(config.station || "8661070"),
      tide_entity: String(config.tide_entity || ""),
      tide_time_mode: this._normalizeTideTimeMode(config.tide_time_mode),
      tide_time_zone: String(config.tide_time_zone || "").trim(),
      ca_region: String(config.ca_region || "atlantic"),
      ca_station: String(config.ca_station || ""),
      ca_station_code: String(config.ca_station_code || ""),
      ca_series_code: String(config.ca_series_code || ""),
      ukho_entity: String(config.ukho_entity || ""),
      ukho_time_mode: this._normalizeUkhoTimeMode(config.ukho_time_mode),
      time_offset_minutes: Number(config.time_offset_minutes) || 0,
      height_offset: Number(config.height_offset) || 0,
      units: config.units || "english",
      wind_units: this._normalizeWindUnits(config.wind_units),
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
      theme_mode: this._normalizeThemeMode(config.theme_mode),
      show_fishing_score: config.show_fishing_score !== false,
      auto_sources: config.auto_sources !== false,
      auto_surf_forecast: config.auto_surf_forecast !== false,
      srf_region: String(config.srf_region || ""),
      beach_state: String(config.beach_state || ""),
      beach_area: String(config.beach_area || ""),
      surf_zone: String(config.surf_zone || "").trim().toUpperCase(),
      nws_office: String(config.nws_office || "").trim().toUpperCase(),
      debug: this._normalizeDebugConfig(config.debug)
    };
    this.setAttribute("theme-mode", this._config.theme_mode);
    if (previousConfig.provider !== this._config.provider || previousConfig.station !== this._config.station || previousConfig.ca_station !== this._config.ca_station || previousConfig.ca_series_code !== this._config.ca_series_code || previousConfig.ukho_entity !== this._config.ukho_entity || previousConfig.ukho_time_mode !== this._config.ukho_time_mode || previousConfig.tide_entity !== this._config.tide_entity || previousConfig.tide_time_mode !== this._config.tide_time_mode || previousConfig.tide_time_zone !== this._config.tide_time_zone || previousConfig.time_offset_minutes !== this._config.time_offset_minutes || previousConfig.height_offset !== this._config.height_offset || previousConfig.beach_area !== this._config.beach_area || previousConfig.surf_zone !== this._config.surf_zone || previousConfig.mode !== this._config.mode) this._fishBand = null;
    this._render();
    this._fetchData();
  }

  _normalizeProvider(value) {
    if (value === "chs_iwls") return "chs_iwls";
    if (value === "ukho_entity") return "ukho_entity";
    if (value === "ukho") return "ukho_entity";
    if (value === "generic_entity") return "generic_entity";
    if (value === "ha_entity") return "generic_entity";
    return "noaa_coops";
  }

  _normalizeThemeMode(value) {
    return value === "auto" ? "auto" : "tidewise";
  }

  _normalizeWindUnits(value) {
    const unit = String(value || "auto").toLowerCase();
    return ["auto", "mph", "kmh", "knots", "beaufort"].includes(unit) ? unit : "auto";
  }

  _normalizeUkhoTimeMode(value) {
    const mode = String(value || "uk_local").toLowerCase();
    return mode === "as_is" ? "as_is" : "uk_local";
  }

  _normalizeTideTimeMode(value) {
    const mode = String(value || "as_is").toLowerCase();
    return ["as_is", "utc", "time_zone"].includes(mode) ? mode : "as_is";
  }

  _normalizeDebugConfig(value) {
    if (value === true) return { enabled: true, panel: true };
    if (!value || typeof value !== "object") return { enabled: false, panel: false };
    return {
      enabled: value.enabled === true,
      panel: value.enabled === true && value.panel === true
    };
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
    if (this._config.provider === "chs_iwls") {
      await this._fetchCanadaData();
      return;
    }
    if (this._config.provider === "ukho_entity") {
      this._fetchUkEntityData();
      return;
    }
    if (this._config.provider === "generic_entity") {
      this._fetchGenericEntityData();
      return;
    }
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

  _fetchUkEntityData() {
    const entityId = String(this._config.ukho_entity || "").trim();
    if (!entityId) {
      this._renderError("Choose a UKHO Tides sensor entity. UK cards require the separate UKHO Tides Home Assistant integration to be installed and configured first.");
      return;
    }
    if (!this._hass?.states) {
      this._waitingForHassState = true;
      this._renderError("Waiting for Home Assistant state data before loading the UKHO Tides sensor.");
      return;
    }
    const entity = this._getEntity(entityId);
    if (!entity) {
      this._renderError(`UKHO Tides entity not found: ${entityId}`);
      return;
    }
    if (["unknown", "unavailable"].includes(String(entity.state || "").toLowerCase())) {
      this._renderError(`UKHO Tides entity is ${entity.state}. Check the UKHO Tides integration.`);
      return;
    }

    const hilo = this._buildUkhoEntityHilo(entity);
    if (hilo.length < 2) {
      this._renderError("UKHO Tides entity does not expose enough high/low prediction data. Check the UKHO Tides Home Assistant integration sensor.");
      return;
    }
    const predictions = this._buildPredictionsFromHilo(hilo);
    if (predictions.length < 4) {
      this._renderError("UKHO Tides entity has events, but TideWise could not build a usable tide curve.");
      return;
    }
    this._data = { predictions, hilo, intervalFallback: true, provider: "ukho_entity", timeZone: "Europe/London" };
    this._autoData = {};
    this._renderData();
  }

  _fetchGenericEntityData() {
    const entityId = String(this._config.tide_entity || "").trim();
    if (!entityId) {
      this._renderError("Choose a Home Assistant tide entity. The entity should expose tide predictions in an attribute such as predictions, tide_predictions, or events.");
      return;
    }
    if (!this._hass?.states) {
      this._waitingForHassState = true;
      this._renderError("Waiting for Home Assistant state data before loading the tide entity.");
      return;
    }
    const entity = this._getEntity(entityId);
    if (!entity) {
      this._renderError(`Tide entity not found: ${entityId}`);
      return;
    }
    if (["unknown", "unavailable"].includes(String(entity.state || "").toLowerCase())) {
      this._renderError(`Tide entity is ${entity.state}. Check the Home Assistant integration that creates it.`);
      return;
    }

    const hilo = this._buildGenericEntityHilo(entity);
    if (hilo.length < 2) {
      this._renderError("Tide entity does not expose enough high/low prediction data. Expected at least two events with time and height values.");
      return;
    }
    const predictions = this._buildPredictionsFromHilo(hilo);
    if (predictions.length < 4) {
      this._renderError("Tide entity has events, but TideWise could not build a usable tide curve.");
      return;
    }
    this._data = { predictions, hilo, intervalFallback: true, provider: "generic_entity", timeZone: this._config.tide_time_zone || "entity/browser" };
    this._autoData = {};
    this._renderData();
  }

  _buildGenericEntityHilo(entity) {
    const rows = this._tideEntityRows(entity);
    const events = rows
      .map((row) => {
        const timeRaw = Array.isArray(row)
          ? row[0]
          : row?.DateTime || row?.dateTime || row?.eventDate || row?.datetime || row?.timestamp || row?.time || row?.time_local || row?.timeLocal || row?.time_utc || row?.timeUtc || row?.date;
        const heightRaw = Array.isArray(row)
          ? row[1]
          : row?.Height ?? row?.height ?? row?.height_m ?? row?.heightM ?? row?.heightMeters ?? row?.height_metres ?? row?.heightMetres ?? row?.value ?? row?.level ?? row?.water_level ?? row?.waterLevel ?? row?.prediction;
        const explicitType = Array.isArray(row)
          ? row[2]
          : row?.type ?? row?.eventType ?? row?.tideType ?? row?.tide_type ?? row?.tide ?? row?.name ?? row?.state;
        const time = this._applyTimeOffset(this._parseGenericEntityTime(timeRaw));
        const metres = this._parseNumericState(heightRaw);
        const value = (this._config.units === "metric" ? metres : metres * 3.28084) + this._heightOffset();
        return { time, value, type: this._normalizeHiloType(explicitType) };
      })
      .filter((item) => Number.isFinite(item.time.getTime()) && Number.isFinite(item.value))
      .sort((a, b) => a.time - b.time);

    if (events.length < 2) return [];
    return this._inferHiloTypes(events).map((event) => ({
      t: this._formatNoaaTime(event.time),
      v: event.value.toFixed(3),
      type: event.type
    }));
  }

  _tideEntityRows(entity) {
    const attrs = entity?.attributes || {};
    const candidates = [
      attrs.predictions,
      attrs.tide_predictions,
      attrs.tidePredictions,
      attrs.events,
      attrs.extremes,
      attrs.high_low,
      attrs.highLow
    ];
    return candidates.find(Array.isArray) || [];
  }

  _parseGenericEntityTime(value) {
    if (value instanceof Date) return new Date(value);
    const raw = String(value || "").trim();
    if (!raw) return new Date(NaN);
    const localParts = this._parseGenericLocalDateTime(raw);
    if (localParts && (this._config.tide_time_mode === "as_is" || this._config.tide_time_mode === "time_zone")) {
      return new Date(localParts.year, localParts.month - 1, localParts.day, localParts.hour, localParts.minute, localParts.second);
    }
    if (localParts && this._config.tide_time_mode === "utc") {
      return new Date(Date.UTC(localParts.year, localParts.month - 1, localParts.day, localParts.hour, localParts.minute, localParts.second));
    }
    const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
    const hasZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw);
    if (this._config.tide_time_mode === "utc" && !hasZone) {
      return new Date(`${isoLike}Z`);
    }
    const instant = new Date(hasZone ? isoLike : raw);
    if (!Number.isFinite(instant.getTime())) return new Date(raw);
    if (this._config.tide_time_mode === "time_zone" && this._config.tide_time_zone) {
      try {
        return this._dateInTimeZone(instant, this._config.tide_time_zone);
      } catch (err) {
        return instant;
      }
    }
    return instant;
  }

  _parseGenericLocalDateTime(value) {
    const raw = String(value || "").trim();
    const iso = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (iso) {
      return this._validLocalDateTimeParts({
        year: Number(iso[1]),
        month: Number(iso[2]),
        day: Number(iso[3]),
        hour: Number(iso[4]),
        minute: Number(iso[5]),
        second: Number(iso[6] || 0)
      });
    }
    const dayFirst = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (dayFirst) {
      return this._validLocalDateTimeParts({
        year: Number(dayFirst[3]),
        month: Number(dayFirst[2]),
        day: Number(dayFirst[1]),
        hour: Number(dayFirst[4]),
        minute: Number(dayFirst[5]),
        second: Number(dayFirst[6] || 0)
      });
    }
    return null;
  }

  _validLocalDateTimeParts(parts) {
    const { year, month, day, hour, minute, second } = parts || {};
    if (![year, month, day, hour, minute, second].every(Number.isFinite)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;
    const check = new Date(year, month - 1, day, hour, minute, second);
    if (check.getFullYear() !== year || check.getMonth() !== month - 1 || check.getDate() !== day) return null;
    return parts;
  }

  _normalizeHiloType(value) {
    const raw = String(value || "").toLowerCase();
    if (/\b(high|hi|h|pleamar|alta|haute|hoogwater|hw)\b/.test(raw)) return "H";
    if (/\b(low|lo|l|bajamar|basse|laagwater|lw)\b/.test(raw)) return "L";
    return "";
  }

  _inferHiloTypes(events) {
    return events.map((event, index) => {
      if (event.type) return event;
      const prev = events[index - 1];
      const next = events[index + 1];
      let type = "";
      if (prev && next) {
        if (event.value >= prev.value && event.value > next.value) type = "H";
        if (event.value <= prev.value && event.value < next.value) type = "L";
      }
      if (!type && next) type = event.value > next.value ? "H" : "L";
      if (!type && prev) type = event.value > prev.value ? "H" : "L";
      return { ...event, type: type || (index % 2 === 0 ? "H" : "L") };
    });
  }

  _buildUkhoEntityHilo(entity) {
    const rows = Array.isArray(entity?.attributes?.predictions) ? entity.attributes.predictions : [];
    const events = rows
      .map((row) => {
        const timeRaw = Array.isArray(row)
          ? row[0]
          : row?.DateTime || row?.dateTime || row?.eventDate || row?.time || row?.date;
        const heightRaw = Array.isArray(row)
          ? row[1]
          : row?.Height ?? row?.height ?? row?.value;
        const time = this._applyTimeOffset(this._parseUkhoEntityTime(timeRaw));
        const metres = this._parseUkhoEntityHeightMetres(heightRaw);
        const value = (this._config.units === "metric" ? metres : metres * 3.28084) + this._heightOffset();
        return { time, value };
      })
      .filter((item) => Number.isFinite(item.time.getTime()) && Number.isFinite(item.value))
      .sort((a, b) => a.time - b.time);

    if (events.length < 2) return [];

    const now = new Date();
    const firstFutureIdx = events.findIndex((item) => item.time > now);
    const baseIdx = firstFutureIdx >= 0 ? firstFutureIdx : 0;
    let baseType = "H";
    const state = String(entity?.state || "").toLowerCase();
    if (state.includes("fall")) baseType = "L";
    else if (state.includes("rise")) baseType = "H";
    else if (events[baseIdx + 1]) baseType = events[baseIdx].value > events[baseIdx + 1].value ? "H" : "L";

    return events.map((event, index) => {
      const parity = (((index - baseIdx) % 2) + 2) % 2;
      const type = parity === 0 ? baseType : (baseType === "H" ? "L" : "H");
      return { t: this._formatNoaaTime(event.time), v: event.value.toFixed(3), type };
    });
  }

  _parseUkhoEntityHeightMetres(value) {
    const parsed = this._parseNumericState(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  _parseUkhoEntityTime(value) {
    if (value instanceof Date) {
      return this._config.ukho_time_mode === "as_is" ? new Date(value) : this._dateInTimeZone(value, "Europe/London");
    }
    const raw = String(value || "").trim();
    if (!raw) return new Date(NaN);
    const ukDate = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (ukDate) {
      const [, day, month, year, hour, minute, second] = ukDate;
      if (this._config.ukho_time_mode === "as_is") {
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second || 0));
      }
      return this._dateInTimeZone(new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second || 0)
      )), "Europe/London");
    }
    const hasZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw);
    const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
    if (this._config.ukho_time_mode === "as_is" && !hasZone) {
      const localInstant = new Date(isoLike);
      if (Number.isFinite(localInstant.getTime())) return localInstant;
    }
    const instant = new Date(hasZone ? isoLike : `${isoLike}Z`);
    if (!Number.isFinite(instant.getTime())) return new Date(raw);
    return this._config.ukho_time_mode === "as_is" ? instant : this._dateInTimeZone(instant, "Europe/London");
  }

  _applyTimeOffset(date) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return date;
    const minutes = Number(this._config.time_offset_minutes) || 0;
    return minutes ? new Date(date.getTime() + minutes * 60000) : date;
  }

  _heightOffset() {
    const value = Number(this._config.height_offset);
    return Number.isFinite(value) ? value : 0;
  }

  _dateInTimeZone(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(date).reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});
    return new Date(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second || 0)
    );
  }

  async _fetchCanadaData() {
    let stationId = String(this._config.ca_station || "").trim();
    if (!stationId) {
      this._renderError("Choose a Canadian CHS station.");
      return;
    }
    const now = new Date();
    const from = new Date(now.getTime() - 60 * 60 * 1000);
    const to = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    try {
      if (stationId.startsWith("code:")) {
        const resolved = await this._fetchCanadaStationByCode(stationId.slice(5));
        stationId = resolved.id;
        if (!this._config.ca_series_code && resolved.seriesCode) this._config.ca_series_code = resolved.seriesCode;
      }
      const loaded = await this._fetchCanadaSeriesRows(stationId, from, to);
      const rows = loaded.rows;
      const predictions = rows
        .filter((_, index) => index % 6 === 0)
        .map((item) => ({ t: this._formatNoaaTime(item.time), v: item.value.toFixed(3) }));
      const hilo = this._deriveHiloFromPredictions(predictions);
      this._data = { predictions, hilo, intervalFallback: false, provider: "chs_iwls", caSeriesCode: loaded.seriesCode };
      this._autoData = {};
      this._renderData();
    } catch (err) {
      this._renderError(`CHS tide data unavailable: ${err.message}`);
    }
  }

  async _fetchCanadaStationByCode(code) {
    const res = await fetch(`https://api-iwls.dfo-mpo.gc.ca/api/v1/stations?code=${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error(`CHS returned ${res.status}`);
    const station = this._arrayFromApi(await res.json()).find((item) => String(item?.code || "") === String(code));
    if (!station?.id) throw new Error(`CHS station ${code} was not found`);
    return {
      id: String(station.id),
      seriesCode: this._canadaStationSeriesCode(station)
    };
  }

  async _fetchCanadaSeriesRows(stationId, from, to) {
    const preferred = this._normalizeCanadaSeriesCode(this._config.ca_series_code);
    const seriesCodes = [preferred, "wlp", "wlf"].filter((value, index, list) => value && list.indexOf(value) === index);
    const errors = [];
    for (const seriesCode of seriesCodes) {
      try {
        const rows = await this._fetchCanadaSeriesCodeRows(stationId, seriesCode, from, to);
        if (rows.length >= 4) return { rows, seriesCode };
        errors.push(`${seriesCode}: not enough data`);
      } catch (err) {
        errors.push(`${seriesCode}: ${err.message}`);
      }
    }
    throw new Error(`CHS did not return enough water-level prediction or forecast data for this station (${errors.join("; ")}).`);
  }

  async _fetchCanadaSeriesCodeRows(stationId, seriesCode, from, to) {
    const url = `https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${encodeURIComponent(stationId)}/data?time-series-code=${encodeURIComponent(seriesCode)}&from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CHS returned ${res.status}`);
    const json = await res.json();
    return this._arrayFromApi(json)
      .map((item) => {
        const time = new Date(item.eventDate || item.date || item.time);
        const rawValue = Number(item.value);
        const value = this._config.units === "metric" ? rawValue : rawValue * 3.28084;
        return { time, value };
      })
      .filter((item) => Number.isFinite(item.time.getTime()) && Number.isFinite(item.value))
      .sort((a, b) => a.time - b.time);
  }

  _normalizeCanadaSeriesCode(value) {
    const raw = String(value || "").toLowerCase().trim();
    return raw === "wlf" ? "wlf" : raw === "wlp" ? "wlp" : "";
  }

  _canadaStationSeriesCode(station) {
    const codes = (station?.timeSeries || []).map((series) => this._normalizeCanadaSeriesCode(series?.code));
    if (codes.includes("wlp")) return "wlp";
    if (codes.includes("wlf")) return "wlf";
    return "";
  }

  _arrayFromApi(json) {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.value)) return json.value;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.items)) return json.items;
    return [];
  }

  _deriveHiloFromPredictions(predictions) {
    const events = [];
    for (let i = 1; i < predictions.length - 1; i++) {
      const prev = parseFloat(predictions[i - 1].v);
      const cur = parseFloat(predictions[i].v);
      const next = parseFloat(predictions[i + 1].v);
      if (![prev, cur, next].every(Number.isFinite)) continue;
      if (cur >= prev && cur > next) events.push({ t: predictions[i].t, v: predictions[i].v, type: "H" });
      if (cur <= prev && cur < next) events.push({ t: predictions[i].t, v: predictions[i].v, type: "L" });
    }
    return events;
  }

  _friendlyNoaaError(message) {
    const raw = String(message || "").trim();
    if (raw.toLowerCase().includes("no predictions data")) {
      return "NOAA did not return tide predictions for this station. Try a nearby NOAA tide station or a known preset.";
    }
    return raw || "NOAA error";
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
    const { lat, lon } = this._getForecastLatLon();
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
    const beachArea = this._selectedNwsBeachArea();
    const office = this._config.nws_office || beachArea?.office || String(nwsData?.point?.cwa || "").toUpperCase();
    if (!office) return {};
    const zoneId = this._config.surf_zone || beachArea?.zone || this._nwsForecastZoneId(nwsData?.point?.forecastZone);
    const productText = await this._fetchLegacyNwsSurfProduct(office);
    if (productText) return this._parseSurfForecastText(productText, office, zoneId);
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
    return this._parseSurfForecastText(text, office, zoneId);
  }

  _selectedNwsBeachArea() {
    return NWS_BEACH_AREAS.find((area) => area.id === this._config.beach_area) || null;
  }

  _selectedNwsSrfOffice() {
    return NWS_SRF_OFFICES.find((office) => office.nws === this._config.nws_office) || null;
  }

  async _fetchLegacyNwsSurfProduct(office) {
    const url = `https://forecast.weather.gov/product.php?site=${office}&issuedby=${office}&product=SRF&format=TXT`;
    const res = await fetch(url);
    if (!res.ok) return "";
    return res.text();
  }

  _nwsForecastZoneId(zoneUrl) {
    const match = String(zoneUrl || "").match(/([A-Z]{2}Z[0-9]{3})/i);
    return match ? match[1].toUpperCase() : "";
  }

  _parseSurfForecastText(text, office, zoneId = "") {
    const raw = String(text || "");
    if (!raw.trim()) return {};
    const normalized = raw.replace(/\r/g, "");
    const scoped = this._scopeSurfForecastText(normalized, zoneId);
    const forecastText = scoped.text;
    const ripPeriods = this._parseSurfRipRiskPeriods(forecastText);
    const activeRip = this._activeRipPeriod(ripPeriods, new Date());
    const fallbackRip = ripPeriods.length ? null : this._parseSurfRipRisk(forecastText);
    return {
      office,
      zone: scoped.zone || zoneId || "",
      ripRisk: activeRip?.risk || fallbackRip,
      ripPeriods,
      surfHeightFt: this._parseSurfHeightFt(forecastText),
      waterTempF: this._parseSurfWaterTempF(forecastText),
      source: "NWS SRF"
    };
  }

  _scopeSurfForecastText(text, zoneId = "") {
    const cleaned = this._stripSurfForecastDefinitions(text);
    const zone = String(zoneId || "").toUpperCase();
    if (!zone) return { text: cleaned, zone: "" };
    const blocks = cleaned.split(/\n\s*\$\$\s*\n/g).map((block) => block.trim()).filter(Boolean);
    const matched = blocks.find((block) => new RegExp(`(^|\\n)\\s*${zone}\\b`, "i").test(block));
    return { text: matched || cleaned, zone };
  }

  _stripSurfForecastDefinitions(text) {
    return String(text || "")
      .replace(/\n&&\s*\n[\s\S]*?(?=\n\s*\$\$|\s*$)/g, "\n")
      .replace(/\nRip Current Risk Category[\s\S]*?(?=\n\s*\$\$|\s*$)/gi, "\n");
  }

  _parseSurfRipRisk(text) {
    const lower = text.toLowerCase();
    const blockRisk = this._parseSurfRipRiskBlock(lower);
    if (blockRisk) return blockRisk;
    if (/(high\s+rip\s+current\s+risk|dangerous\s+rip\s+currents|high\s+surf\s+and\s+dangerous\s+rip\s+currents|rip\s+current\s+risk\s+is\s+high|rip\s+current\s+risk\.*\s*high)/i.test(lower)) return "high";
    if (/(moderate\s+rip\s+current\s+risk|rip\s+current\s+risk\s+is\s+moderate|moderate\s+surf\s+and\s+rip\s+currents|rip\s+current\s+risk\.*\s*moderate)/i.test(lower)) return "moderate";
    if (/(low\s+rip\s+current\s+risk|rip\s+current\s+risk\s+is\s+low|rip\s+current\s+risk\.*\s*low)/i.test(lower)) return "low";
    return null;
  }

  _parseSurfRipRiskBlock(text) {
    const match = String(text || "").match(/rip\s+current\s+risk\*?[\s.:\n-]*([\s\S]*?)(?=\n\s*(surf\s+height|thunderstorm|waterspout|uv\s+index|water\s+temperature|weather|high\s+temperature|winds|tides|remarks)\b|$)/i);
    if (!match) return null;
    const risks = [...match[1].matchAll(/\b(high|moderate|low)\b/gi)].map((item) => item[1].toLowerCase());
    if (risks.includes("high")) return "high";
    if (risks.includes("moderate")) return "moderate";
    if (risks.includes("low")) return "low";
    return null;
  }

  _parseSurfRipRiskPeriods(text) {
    const sections = this._splitNwsForecastSections(text);
    const periods = [];
    sections.forEach((section) => {
      const risk = this._parseSurfRipRisk(section.body);
      if (!risk) return;
      const window = this._periodWindowForLabel(section.label, section.body);
      periods.push({ risk, label: section.label, start: window.start, end: window.end });
    });
    if (!periods.length) {
      const risk = this._parseSurfRipRisk(this._stripSurfForecastDefinitions(text));
      if (risk) {
        const window = this._periodWindowForLabel("Current", text);
        periods.push({ risk, label: "Current", start: window.start, end: window.end });
      }
    }
    return periods;
  }

  _splitNwsForecastSections(text) {
    const lines = String(text || "").split("\n");
    const sections = [];
    let current = null;
    const headerPattern = /^\s*\.*\s*(rest of today|today|tonight|this afternoon|this evening|overnight|tomorrow|monday|monday night|tuesday|tuesday night|wednesday|wednesday night|thursday|thursday night|friday|friday night|saturday|saturday night|sunday|sunday night)\s*\.*\s*$/i;
    lines.forEach((line) => {
      const match = line.match(headerPattern);
      if (match) {
        if (current) sections.push(current);
        current = { label: match[1], body: "" };
      } else if (current) {
        current.body += `${line}\n`;
      }
    });
    if (current) sections.push(current);
    return sections;
  }

  _activeRipPeriod(periods, date) {
    if (!Array.isArray(periods) || !periods.length) return null;
    const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
    if (!Number.isFinite(t)) return null;
    return periods.find((item) => {
      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && t >= start && t <= end;
    }) || null;
  }

  _periodWindowForLabel(label, body = "") {
    const now = new Date();
    const lowerLabel = String(label || "").toLowerCase();
    const lowerBody = String(body || "").toLowerCase();
    const start = new Date(now);
    const end = new Date(now);
    const setTime = (date, h, m = 0) => { date.setHours(h, m, 0, 0); return date; };
    const addDays = (date, days) => { date.setDate(date.getDate() + days); return date; };
    const nextDayOffset = (name) => {
      const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const target = names.indexOf(name);
      if (target < 0) return 0;
      const diff = (target - now.getDay() + 7) % 7;
      return diff === 0 && now.getHours() >= 18 ? 7 : diff;
    };

    if (lowerBody.includes("until") || lowerBody.includes("through")) {
      const explicit = this._explicitRipEnd(now, lowerBody);
      if (explicit) return { start: now, end: explicit };
    }

    if (lowerLabel.includes("tonight") || lowerLabel.includes("night") || lowerLabel.includes("evening") || lowerLabel.includes("overnight")) {
      const dayName = lowerLabel.split(" ")[0];
      const offset = nextDayOffset(dayName);
      addDays(start, offset);
      addDays(end, offset + (lowerLabel.includes("overnight") ? 1 : 0));
      setTime(start, lowerLabel.includes("overnight") ? 0 : 18);
      setTime(end, lowerLabel.includes("overnight") ? 6 : 6);
      if (!lowerLabel.includes("overnight")) addDays(end, 1);
      return { start, end };
    }

    if (lowerLabel.includes("tomorrow")) {
      addDays(start, 1); addDays(end, 1);
      setTime(start, 6); setTime(end, 18);
      return { start, end };
    }

    const dayName = lowerLabel.split(" ")[0];
    const offset = nextDayOffset(dayName);
    addDays(start, offset); addDays(end, offset);
    if (lowerLabel.includes("afternoon")) { setTime(start, 12); setTime(end, 18); }
    else { setTime(start, 6); setTime(end, 18); }
    if (lowerLabel === "current" || (offset === 0 && now > start)) start.setTime(now.getTime());
    return { start, end };
  }

  _explicitRipEnd(now, text) {
    const explicitTime = text.match(/(?:until|through)\s+(?:around\s+)?([0-9]{1,2})(?::([0-9]{2}))?\s*(am|pm)\b/i);
    if (explicitTime) {
      let hour = Number(explicitTime[1]);
      const minute = Number(explicitTime[2] || 0);
      const ap = explicitTime[3].toLowerCase();
      if (ap === "pm" && hour < 12) hour += 12;
      if (ap === "am" && hour === 12) hour = 0;
      const end = new Date(now);
      end.setHours(hour, minute, 0, 0);
      if (end <= now) end.setDate(end.getDate() + 1);
      return end;
    }
    const phraseHours = [
      ["morning", 12],
      ["afternoon", 18],
      ["evening", 22],
      ["tonight", 6],
      ["overnight", 6],
      ["today", 18]
    ];
    const phrase = phraseHours.find(([name]) => text.includes(name));
    if (!phrase) return null;
    const end = new Date(now);
    end.setHours(phrase[1], 0, 0, 0);
    if (phrase[0] === "tonight" || phrase[0] === "overnight" || end <= now) end.setDate(end.getDate() + 1);
    return end;
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
    const autoWeather = this._getAutoWeatherState();
    if (autoWeather) return autoWeather;
    const keys = Object.keys(states).filter((k) => k.startsWith("weather."));
    if (!keys.length) return null;
    const preferred = keys.find((k) => {
      const fn = String(states[k]?.attributes?.friendly_name || "").toLowerCase();
      return fn.includes("home") || fn.includes("weather");
    });
    return states[preferred || keys[0]] || null;
  }

  _getForecastLatLon() {
    const configLat = Number(this._config.latitude);
    const configLon = Number(this._config.longitude);
    const beach = this._selectedNwsBeachArea();
    const preset = STATION_PRESETS.find((item) => item.station === String(this._config.station));
    const fallbackLat = Number(beach?.lat);
    const fallbackLon = Number(beach?.lon);
    const stationLat = Number(preset?.lat);
    const stationLon = Number(preset?.lon);
    return {
      lat: Number.isFinite(configLat) ? configLat : Number.isFinite(fallbackLat) ? fallbackLat : Number.isFinite(stationLat) ? stationLat : 33.688,
      lon: Number.isFinite(configLon) ? configLon : Number.isFinite(fallbackLon) ? fallbackLon : Number.isFinite(stationLon) ? stationLon : -78.886
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
    const windUnits = this._normalizeWindUnits(this._config.wind_units);
    let speed;
    if (windUnits === "kmh" || (windUnits === "auto" && this._config.units === "metric")) {
      speed = `${Math.round(speedMph * 1.60934)} km/h`;
    } else if (windUnits === "knots") {
      speed = `${Math.round(speedMph / 1.15078)} kt`;
    } else if (windUnits === "beaufort") {
      speed = `Bft ${this._beaufortFromMph(speedMph)}`;
    } else {
      speed = `${Math.round(speedMph)} mph`;
    }
    const direction = this._formatWindDirection(bearing);
    return `Wind ${speed}${direction ? " " + direction : ""}`;
  }

  _beaufortFromMph(speedMph) {
    const mph = Math.max(0, Number(speedMph) || 0);
    const upperBounds = [1, 4, 8, 13, 19, 25, 32, 39, 47, 55, 64, 73];
    const index = upperBounds.findIndex((limit) => mph < limit);
    return index === -1 ? 12 : index;
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
      return this._normalizePressureHpa(direct.value, unit);
    }
    const attrs = weather?.attributes || {};
    const raw = Number(attrs.pressure);
    const unit = String(attrs.pressure_unit || attrs.unit_of_measurement || "").toLowerCase();
    if (Number.isFinite(raw)) return this._normalizePressureHpa(raw, unit);
    const autoPressure = this._parseAutoPressureHpa();
    return autoPressure;
  }

  _normalizePressureHpa(value, unit = "") {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return null;
    const label = String(unit || "").toLowerCase();
    if (label.includes("inhg") || label.includes("in hg") || label.includes("inches")) return raw * 33.8639;
    if (label.includes("kpa")) return raw * 10;
    if (label === "pa" || label.includes(" pascal")) return raw / 100;
    if (label.includes("hpa") || label.includes("mbar") || label.includes("millibar") || label.includes("mb")) return raw;
    if (raw >= 25 && raw <= 35) return raw * 33.8639;
    if (raw >= 85 && raw <= 115) return raw * 10;
    if (raw >= 850 && raw <= 1100) return raw;
    if (raw >= 85000 && raw <= 110000) return raw / 100;
    return raw;
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
      entity_id: "tidewise.nws_hourly",
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
    return this._normalizePressureHpa(val, "");
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

  _getRipCurrentRisk(date = new Date()) {
    const e = this._getEntity(this._config.rip_current_risk_entity);
    if (e) return String(e.state || "").toLowerCase().trim();
    const timed = this._ripRiskForTime(date);
    return timed?.risk || this._autoData?.surf?.ripRisk || null;
  }

  _ripRiskForTime(date) {
    const periods = this._autoData?.surf?.ripPeriods;
    if (!Array.isArray(periods) || !periods.length) return null;
    const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
    if (!Number.isFinite(t)) return null;
    const period = periods.find((item) => {
      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && t >= start && t <= end;
    });
    return period || null;
  }
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

  _moonAge(date) {
    const synodicMonth = 29.530588861;
    const knownNewMoonJd = 2451550.09765; // 2000-01-06 18:14 UTC
    const jd = date.getTime() / 86400000 + 2440587.5;
    return (((jd - knownNewMoonJd) % synodicMonth) + synodicMonth) % synodicMonth;
  }

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

  _forecastConditionCap(cap, hoursAhead) {
    const value = Number(cap);
    if (!Number.isFinite(value) || value >= 1) return 1.0;
    const hours = Math.max(0, Number(hoursAhead) || 0);
    if (hours <= 3) return value;
    const relaxed = Math.max(value, 0.86);
    if (hours >= 8) return relaxed;
    const f = (hours - 3) / 5;
    return value + (relaxed - value) * f;
  }

  _buildFishingScores(predictions) {
    const weights = this._modeWeights();
    const { lat, lon } = this._getForecastLatLon();
    const weather = this._getWeatherState();
    const windMph = this._getWindSpeedMph(weather);
    const windBearing = this._getWindBearing(weather);
    const pressureHpa = this._getPressureHpa(weather);
    const waterTempF = this._getWaterTempF();
    const waveFt = this._getWaveHeightFt();
    const rainIn = this._getRainTodayIn();
    const pressureTrend = this._getPressureTrend();
    const unsafeToSwim = this._getUnsafeToSwim();
    const wind = this._windScore(windMph, windBearing);
    const weatherScore = this._weatherScore(weather);
    const pressure = this._pressureScore(pressureHpa, pressureTrend);
    const waterTemp = this._waterTempScore(waterTempF);
    const wave = this._waveScore(waveFt);
    const rain = this._rainScore(rainIn);
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
      const ripRiskRaw = this._getRipCurrentRisk(t);
      const ripPeriod = this._ripRiskForTime(t);
      const rip = this._ripCurrentScore(ripRiskRaw, unsafeToSwim);
      const componentSum = tide.score * weights.tide + wind.score * weights.wind + waterTemp.score * weights.waterTemp + weatherScore.score * weights.weather + clarity.score * weights.clarity + light.score * weights.light + solunar * weights.solunar + pressure.score * weights.pressure;
      const scoreAfterMoon = componentSum * moonMult;
      const hoursAhead = Math.max(0, (tMs - nowMs) / 3600000);
      const liveConditionCap = Math.min(wind.cap, weatherScore.cap, wave.cap, rain.cap, rip.cap, clarity.cap);
      const forecastConditionCap = this._forecastConditionCap(liveConditionCap, hoursAhead);
      let cap = Math.min(waterTemp.cap, forecastConditionCap);
      if (tide.movementScore < 0.10) cap = Math.min(cap, 0.48);
      if (tide.movementScore < 0.20) cap = Math.min(cap, 0.62);
      if (hour >= 10 && hour <= 15) cap = Math.min(cap, 0.78);
      const finalScore = Math.max(0, Math.min(1, Math.min(scoreAfterMoon, cap)));
      scores.push(finalScore);
      const detail = { time: t, score: finalScore, componentSum, scoreAfterMoon, finalScore, displayScore: finalScore, tide, wind, weather: weatherScore, waterTemp, wave, rain, rip, ripRiskRaw, ripPeriod, clarity, light, solunar, pressure, moonMult, cap, liveConditionCap, forecastConditionCap, hoursAhead };
      details.push(detail);
      if (tMs >= nowMs && tMs <= maxFutureMs && finalScore > bestScore) { bestScore = finalScore; bestIdx = i; }
    }

    const smoothedScores = this._smoothScores(scores);
    details.forEach((detail, i) => {
      detail.score = smoothedScores[i] ?? detail.score;
      detail.displayScore = detail.score;
    });
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
    const reason = this._buildReason(currentDetail, bestWindow);
    return { scores: smoothedScores, finalScores: scores, details, currentScore, currentDetail, age, bestWindow, reason };
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

  _buildReason(detail, bestWindow = "") {
    if (!detail) return "Waiting on fishing inputs";
    const band = this._scoreBand(detail.score);
    const label = band.charAt(0).toUpperCase() + band.slice(1);
    const capReasons = [];
    const negatives = [];
    const positives = [];

    if (detail.weather.cap <= 0.25) capReasons.push("storms nearby");
    else if (detail.weather.cap <= 0.45) capReasons.push(detail.weather.label);
    if (detail.rip && detail.rip.score < 0.65) {
      capReasons.push(detail.rip.label.includes("high") ? "high rip risk cap" : detail.rip.label);
    }
    if (detail.wind.cap <= 0.42) capReasons.push("rough wind cap");
    else if (detail.wind.score < 0.50) negatives.push("wind penalty");
    if (detail.wave.score < 0.55) negatives.push(detail.wave.label);
    if (detail.clarity.score < 0.60) negatives.push(detail.clarity.label);
    if (detail.tide.movementScore < 0.12) negatives.push("near slack tide");
    else positives.push(detail.tide.label);
    if (detail.light.score < 0.30) negatives.push("poor light window");

    if (detail.waterTemp.score >= 0.85) positives.push("prime water temp");
    else if (detail.waterTemp.score < 0.55) negatives.push(detail.waterTemp.label);
    if (detail.pressure.score >= 0.72) positives.push("favorable pressure");
    if (detail.wind.score >= 0.80) positives.push("light wind");
    if (detail.light.score >= 0.80) positives.push(detail.light.label);
    if (detail.solunar >= 0.70) positives.push("moon window");

    const limiting = [...capReasons, ...negatives].slice(0, 2);
    const main = limiting.join(" + ") || "mixed signals";
    const help = positives.length ? ` ${this._capitalize(positives[0])} helps.` : "";
    const window = bestWindow ? ` Better bite window ${bestWindow}.` : "";
    return `${label} now: ${main}.${help}${window}`;
  }

  _safetyBadgeHtml(detail) {
    if (!detail?.rip || detail.rip.score >= 0.65) return "";
    if (!String(detail.rip.label || "").includes("high")) return "";
    return `<div class="safety-badge">&#9888; High rip risk active</div>`;
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
    const providerInfo = TIDEWISE_PROVIDERS[this._config.provider] || TIDEWISE_PROVIDERS.noaa_coops;
    const stationLabel = this._config.provider === "chs_iwls"
      ? (this._config.ca_station_code || "Canada")
      : this._config.provider === "ukho_entity"
        ? this._ukhoEntityDisplayName()
        : this._config.provider === "generic_entity"
          ? this._tideEntityDisplayName()
          : this._config.station;
    const headerBadges = [
      waterTempLabel ? `<span class="water-temp-chip">Water ${waterTempLabel}</span>` : "",
      fish ? `<span class="fish-moon">${phaseName}</span>` : "",
      fish ? `<span class="fish-score ${scoreInfo.cls}">${scoreInfo.text}</span>` : ""
    ].filter(Boolean).join("");
    const root = this.shadowRoot.getElementById("root");

    root.innerHTML = `
      <div class="header">
        <div class="title">${this._config.title}</div>
        <div class="subtitle">${providerInfo.stationLabel} ${stationLabel}</div>
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
          <div class="fish-reason">${this._escape(fish.reason)}</div>
          ${this._safetyBadgeHtml(fish.currentDetail)}
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
      ${this._config.debug?.enabled && this._config.debug?.panel ? this._debugHtml(fish, chartPredictions, cur, rising, unitLabel) : ""}
    `;

    requestAnimationFrame(() => {
      this._chartCanvas = this.shadowRoot.getElementById("tideCanvas");
      this._drawChart(chartPredictions, now, cur, unitLabel, fish?.scores || null, fish?.details || null, [nextHigh, nextLow].filter(Boolean));
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
        <div class="pill-main">
          <div class="pill-time"><span class="pill-arrow ${type}">${arrow}</span>${this._formatClock(this._parseHiloTime(tide.t))}</div>
          <div class="pill-ft">${parseFloat(tide.v).toFixed(1)} ${unitLabel}</div>
        </div>
      </div>`;
  }

  _debugHtml(fish, predictions, cur, rising, unitLabel) {
    const detail = fish?.currentDetail;
    const { lat, lon } = this._getForecastLatLon();
    const weather = this._getWeatherState();
    const windMph = this._getWindSpeedMph(weather);
    const windBearing = this._getWindBearing(weather);
    const waterTempF = this._getWaterTempF();
    const waveFt = this._getWaveHeightFt();
    const rainIn = this._getRainTodayIn();
    const pressureHpa = this._getPressureHpa(weather);
    const ripRisk = this._getRipCurrentRisk();
    const pressureTrend = this._getPressureTrend();
    const weights = this._modeWeights();
    const displayScore = fish?.currentScore ?? detail?.displayScore ?? null;
    const finalCurrentScore = detail?.finalScore ?? null;
    const band = displayScore !== null ? this._scoreBand(displayScore, this._fishBand) : "n/a";
    const safetyWarning = detail?.rip?.score < 0.65 ? detail.rip.label : "none";
    const ripWindow = detail?.ripPeriod
      ? `${detail.ripPeriod.label || "timed"} ${this._formatDebugWindow(detail.ripPeriod.start, detail.ripPeriod.end)}`
      : "not time-specific";
    const capItems = detail ? [
      ["current safety cap", `${this._fmtDebugNumber(detail.liveConditionCap)}, applied to Now`],
      ["near-term safety cap", `${this._fmtDebugNumber(detail.liveConditionCap)}, applied for first 3 hours`],
      ["future curve globally capped", "false"],
      ["safety warning active", safetyWarning],
      ["timed rip window", ripWindow],
      ["active cap", detail.cap],
      ["wind cap", detail.wind.cap],
      ["weather cap", detail.weather.cap],
      ["water cap", detail.waterTemp.cap],
      ["wave cap", detail.wave.cap],
      ["rain cap", detail.rain.cap],
      ["rip cap", detail.rip.cap],
      ["clarity cap", detail.clarity.cap],
      ["tide movement", detail.tide.movementScore],
      ["moon multiplier", detail.moonMult]
    ] : [];
    const componentItems = detail ? [
      ["tide", detail.tide.score, weights.tide, detail.tide.label],
      ["wind", detail.wind.score, weights.wind, detail.wind.label],
      ["water", detail.waterTemp.score, weights.waterTemp, detail.waterTemp.label],
      ["weather", detail.weather.score, weights.weather, detail.weather.label],
      ["clarity", detail.clarity.score, weights.clarity, detail.clarity.label],
      ["light", detail.light.score, weights.light, detail.light.label],
      ["solunar", detail.solunar, weights.solunar, "moon window"],
      ["pressure", detail.pressure.score, weights.pressure, detail.pressure.label]
    ] : [];
    const auto = this._autoData || {};
    const rows = (items) => items.map(([key, value, extra, label]) => {
      const shown = extra !== undefined && typeof extra === "number"
        ? `${this._fmtDebugNumber(value)} x ${extra.toFixed(2)}${label ? " - " + label : ""}`
        : this._fmtDebugValue(value);
      const warn = key.toLowerCase().includes("cap") && Number(value) < 0.65 ? " debug-warn" : "";
      return `<div class="debug-line"><span class="debug-key">${this._escape(key)}</span><span class="debug-value${warn}">${this._escape(shown)}</span></div>`;
    }).join("");

    return `
      <details class="debug-panel">
        <summary>
          <span class="debug-title debug-title-main">TideWise Debug</span>
          <span class="debug-note">shown because debug is enabled in YAML</span>
        </summary>
        <div class="debug-body">
          <div class="debug-grid">
          <div class="debug-section">
            <div class="debug-section-title">Result</div>
            ${rows([
              ["debug target", "current point / Now"],
              ["curve mode", "future bite potential"],
              ["band", band],
              ["component sum", detail?.componentSum],
              ["pre-cap score", detail?.componentSum],
              ["moon multiplier", detail?.moonMult],
              ["score after moon", detail?.scoreAfterMoon],
              ["active cap", detail?.cap],
              ["final current score", finalCurrentScore],
              ["display score (smoothed)", displayScore],
              ["reason", fish?.reason || "fishing score disabled"],
              ["best window", fish?.bestWindow || "none"],
              ["current tide", `${cur.toFixed(1)} ${unitLabel} ${rising ? "rising" : "falling"}`]
            ])}
            <div class="debug-section-title">Sources</div>
            ${rows([
              ["provider", this._config.provider],
              ["station", this._debugStationLabel()],
              ["CHS series", this._config.provider === "chs_iwls" ? (this._data?.caSeriesCode || this._config.ca_series_code || "auto") : "n/a"],
              ["time zone", this._data?.timeZone || "browser/local"],
              ["coords", `${lat.toFixed(4)}, ${lon.toFixed(4)}`],
              ["predictions", `${predictions?.length || 0}${this._data?.intervalFallback ? " hilo fallback" : " interval"}`],
              ["auto updated", auto.updated || "not fetched"],
              ["CO-OPS", auto.coops?.error || (auto.coops && Object.keys(auto.coops).length ? "available" : "missing")],
              ["NWS hourly", auto.nws?.error || (auto.nws?.period ? "available" : "missing")],
              ["NWS surf/rip", auto.surf?.error || (auto.surf && Object.keys(auto.surf).length ? "available" : "missing")],
              ["NWS beach area", this._selectedNwsBeachArea()?.name || "coordinate lookup"],
              ["NWS SRF office", this._selectedNwsSrfOffice()?.area || "auto/manual"],
              ["NWS SRF office/zone", auto.surf?.office ? `${auto.surf.office} ${auto.surf.zone || "unscoped"}` : "missing"]
            ])}
          </div>
          <div class="debug-section">
            <div class="debug-section-title">Inputs</div>
            ${rows([
              ["weather", `${weather?.state || "missing"} (${this._debugSource("weather")})`],
              ["wind", `${this._fmtDebugNumber(windMph)} mph ${this._formatWindDirection(windBearing)} (${this._debugSource("wind")})`],
              ["water temp", `${this._fmtDebugNumber(waterTempF)} F (${this._debugSource("waterTemp")})`],
              ["surf/wave", `${this._fmtDebugNumber(waveFt)} ft (${this._debugSource("wave")})`],
              ["rain", `${this._fmtDebugNumber(rainIn)} in (${this._debugSource("rain")})`],
              ["rip risk", `${ripRisk || "missing"} (${this._debugSource("rip")})`],
              ["pressure", `${this._fmtDebugNumber(pressureHpa)} hPa ${pressureTrend || ""} (${this._debugSource("pressure")})`]
            ])}
            <div class="debug-section-title">Components</div>
            ${rows(componentItems)}
            <div class="debug-section-title">Caps / Limits</div>
            ${rows(capItems)}
          </div>
        </div>
        </div>
      </details>
    `;
  }

  _fmtDebugNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "missing";
  }

  _fmtDebugValue(value) {
    if (value === null || value === undefined || value === "") return "missing";
    if (typeof value === "number") return this._fmtDebugNumber(value);
    return String(value);
  }

  _formatDebugWindow(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime())) return "unknown window";
    return `${this._formatClock(startDate)}-${this._formatClock(endDate)}`;
  }

  _debugStationLabel() {
    if (this._config.provider === "chs_iwls") return `${this._config.ca_station_code || ""} ${this._config.ca_station}`.trim();
    if (this._config.provider === "ukho_entity") return this._config.ukho_entity || "missing";
    if (this._config.provider === "generic_entity") return this._config.tide_entity || "missing";
    return this._config.station;
  }

  _ukhoEntityDisplayName() {
    const entity = this._getEntity(this._config.ukho_entity);
    return String(entity?.attributes?.friendly_name || this._config.ukho_entity || "entity").replace(/\s+Tides?$/i, "");
  }

  _tideEntityDisplayName() {
    const entity = this._getEntity(this._config.tide_entity);
    return String(entity?.attributes?.friendly_name || this._config.tide_entity || "entity").replace(/\s+Tides?$/i, "");
  }

  _capitalize(text) {
    const value = String(text || "");
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  _debugSource(kind) {
    const hasEntity = (id) => Boolean(id && this._getEntity(id));
    const weatherState = this._getWeatherState();
    const isNwsWeather = weatherState?.entity_id === "tidewise.nws_hourly";
    if (kind === "weather") {
      if (hasEntity(this._config.weather_entity)) return `entity ${this._config.weather_entity}`;
      if (isNwsWeather) return "NWS hourly";
      return weatherState ? "Home Assistant weather fallback" : "missing";
    }
    if (kind === "wind") {
      if (hasEntity(this._config.wind_speed_entity)) return `entity ${this._config.wind_speed_entity}`;
      if (isNwsWeather && weatherState?.attributes?.wind_speed !== undefined) return "NWS hourly";
      if (weatherState?.attributes?.wind_speed !== undefined) return "weather entity";
      if (this._autoData?.coops?.wind) return "NOAA CO-OPS";
      if (this._autoData?.nws?.period?.windSpeed) return "NWS hourly";
      return "missing";
    }
    if (kind === "waterTemp") {
      if (hasEntity(this._config.water_temp_entity)) return `entity ${this._config.water_temp_entity}`;
      if (this._autoData?.coops?.waterTemp) return "NOAA CO-OPS";
      if (Number.isFinite(Number(this._autoData?.surf?.waterTempF))) return "NWS SRF";
      return "missing";
    }
    if (kind === "wave") {
      if (hasEntity(this._config.wave_height_entity)) return `entity ${this._config.wave_height_entity}`;
      if (Number.isFinite(Number(this._autoData?.surf?.surfHeightFt))) return "NWS SRF";
      return "missing";
    }
    if (kind === "rain") return hasEntity(this._config.rain_today_entity) ? `entity ${this._config.rain_today_entity}` : "missing";
    if (kind === "rip") {
      if (hasEntity(this._config.rip_current_risk_entity)) return `entity ${this._config.rip_current_risk_entity}`;
      if (this._autoData?.surf?.ripRisk) return "NWS SRF";
      return "missing";
    }
    if (kind === "pressure") {
      if (hasEntity(this._config.pressure_entity)) return `entity ${this._config.pressure_entity}`;
      if (weatherState?.attributes?.pressure !== undefined) return "weather entity";
      if (this._autoData?.coops?.pressure) return "NOAA CO-OPS";
      return "missing";
    }
    return "unknown";
  }

  _themeColor(name, fallback) {
    const value = getComputedStyle(this).getPropertyValue(name).trim();
    return value && !value.includes("var(") ? value : fallback;
  }

  _chartColors() {
    if (this._config.theme_mode === "auto") {
      const accent = this._themeColor("--accent-color", this._themeColor("--primary-color", "#2a7a94"));
      const cardBg = this._themeColor("--card-background-color", "rgba(255,255,255,0.88)");
      const divider = this._themeColor("--divider-color", "rgba(42,122,148,0.45)");
      return {
        grid: divider,
        axis: this._themeColor("--secondary-text-color", "rgba(10,30,45,0.65)"),
        labelBg: cardBg,
        nowLabelBg: cardBg,
        labelBorder: divider,
        nowLabelBorder: divider,
        labelText: this._themeColor("--primary-text-color", "#0a1e28"),
        tideLine: accent,
        highMarker: this._themeColor("--primary-color", "#0a7a70"),
        lowMarker: accent,
        nowMarker: this._themeColor("--warning-color", "#e8b84b"),
        markerStroke: cardBg,
        nowMarkerStroke: cardBg
      };
    }
    return {
      grid: this._themeColor("--tw-chart-grid", "rgba(10,30,45,0.15)"),
      axis: this._themeColor("--tw-chart-axis", "rgba(10,30,45,0.65)"),
      labelBg: this._themeColor("--tw-chart-label-bg", "rgba(255,255,255,0.88)"),
      nowLabelBg: this._themeColor("--tw-chart-now-label-bg", "rgba(255,255,255,0.92)"),
      labelBorder: this._themeColor("--tw-chart-label-border", "rgba(42,122,148,0.45)"),
      nowLabelBorder: this._themeColor("--tw-chart-now-label-border", "rgba(42,122,148,0.55)"),
      labelText: this._themeColor("--tw-chart-label-text", "#0a1e28"),
      tideLine: this._themeColor("--tw-tide-line", "#2a7a94"),
      highMarker: this._themeColor("--high-color", "#0a7a70"),
      lowMarker: this._themeColor("--low-color", "#2a7a94"),
      nowMarker: this._themeColor("--gold", "#e8b84b"),
      markerStroke: this._themeColor("--tw-marker-stroke", "rgba(255,255,255,0.9)"),
      nowMarkerStroke: this._themeColor("--tw-now-marker-stroke", "rgba(255,255,255,0.92)")
    };
  }

  _drawChart(predictions, now, cur, unitLabel, fishScores, fishDetails, tideEvents = []) {
    const canvas = this._chartCanvas;
    if (!canvas) return;
    const theme = this._chartColors();
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

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const v = minV + (i / 3) * (maxV - minV);
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = theme.axis;
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
      ctx.fillStyle = isHigh ? theme.highMarker : theme.lowMarker;
      ctx.fill();
      ctx.strokeStyle = theme.markerStroke;
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
      ctx.fillStyle = theme.labelBg;
      ctx.strokeStyle = theme.labelBorder;
      ctx.lineWidth = 1;
      this._roundedRect(ctx, lx, ly, lw + 8, 15, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = theme.labelText;
      ctx.textAlign = "left";
      ctx.fillText(label, lx + 4, ly + 10);
    });

    ctx.beginPath();
    predictions.forEach((p, i) => {
      const x = toX(p);
      const y = toY(parseFloat(p.v));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = theme.tideLine;
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
    ctx.fillStyle = theme.nowMarker;
    ctx.fill();
    ctx.strokeStyle = theme.nowMarkerStroke;
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
    ctx.fillStyle = theme.nowLabelBg;
    ctx.strokeStyle = theme.nowLabelBorder;
    ctx.lineWidth = 1;
    this._roundedRect(ctx, bx, by, tw + 10, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = theme.labelText;
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

  _escape(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[char]));
  }

  getCardSize() { return 5; }
}

class TideWiseCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._rendered = false;
    this._canadaStations = null;
    this._canadaStationsLoading = false;
    this._canadaStationsError = "";
    this._mapCenter = null;
    this._mapZoom = 12;
    this._mapDrag = null;
    this._mapRenderFrame = null;
    this._suppressMapClick = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) this._render();
  }

  setConfig(config) {
    this._config = {
      title: "TideWise",
      provider: "noaa_coops",
      station: "8661070",
      tide_entity: "",
      tide_time_mode: "as_is",
      tide_time_zone: "",
      ca_region: "atlantic",
      ca_station: "",
      ca_station_code: "",
      ca_series_code: "",
      ukho_entity: "",
      ukho_time_mode: "uk_local",
      time_offset_minutes: 0,
      height_offset: 0,
      srf_region: "",
      beach_state: "",
      beach_area: "",
      surf_zone: "",
      nws_office: "",
      units: "english",
      wind_units: "auto",
      mode: "general",
      theme_mode: "tidewise",
      show_fishing_score: true,
      auto_sources: true,
      auto_surf_forecast: true,
      grid_options: { rows: "full", columns: 18 },
      ...config
    };
    this._config.provider = this._normalizeProvider(this._config.provider);
    this._config.theme_mode = this._normalizeThemeMode(this._config.theme_mode);
    this._config.wind_units = this._normalizeWindUnits(this._config.wind_units);
    this._config.ukho_time_mode = this._normalizeUkhoTimeMode(this._config.ukho_time_mode);
    this._config.tide_time_mode = this._normalizeTideTimeMode(this._config.tide_time_mode);
    this._applyDefaultForecastPoint();
    this._syncMapCenterToConfig(this._config);
    this._render();
  }

  _applyDefaultForecastPoint() {
    if (!this._config) return;
    const hasLat = Number.isFinite(Number(this._config.latitude));
    const hasLon = Number.isFinite(Number(this._config.longitude));
    if (hasLat && hasLon) return;
    const beach = this._selectedBeachArea();
    const preset = this._presetForStation(this._config.station);
    const point = beach || preset;
    if (!point) return;
    const lat = Number(point.lat);
    const lon = Number(point.lon);
    if (!hasLat && Number.isFinite(lat)) this._config.latitude = lat;
    if (!hasLon && Number.isFinite(lon)) this._config.longitude = lon;
  }

  _currentForecastPoint() {
    const lat = Number(this._config?.latitude);
    const lon = Number(this._config?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
    const beach = this._selectedBeachArea();
    const preset = this._presetForStation(this._config?.station);
    const point = beach || preset;
    const fallbackLat = Number(point?.lat);
    const fallbackLon = Number(point?.lon);
    return {
      lat: Number.isFinite(fallbackLat) ? fallbackLat : 33.688,
      lon: Number.isFinite(fallbackLon) ? fallbackLon : -78.886
    };
  }

  _syncMapCenterToConfig(config = this._config) {
    const lat = Number(config?.latitude);
    const lon = Number(config?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) this._mapCenter = { lat, lon };
  }

  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _roundCoord(value) {
    return Math.round(Number(value) * 1000000) / 1000000;
  }

  _mapState() {
    const point = this._currentForecastPoint();
    if (!this._mapCenter || !Number.isFinite(this._mapCenter.lat) || !Number.isFinite(this._mapCenter.lon)) {
      this._mapCenter = { ...point };
    }
    this._mapZoom = Math.round(this._clamp(Number(this._mapZoom) || 12, 3, 18));
    return {
      point,
      center: this._mapCenter,
      zoom: this._mapZoom,
      label: `${point.lat.toFixed(5)}, ${point.lon.toFixed(5)}`,
      zoomLabel: `Zoom ${this._mapZoom}`
    };
  }

  _wrapLon(lon) {
    return ((((Number(lon) || 0) + 180) % 360) + 360) % 360 - 180;
  }

  _projectLatLon(lat, lon, zoom = this._mapZoom) {
    const scale = 256 * 2 ** zoom;
    const clampedLat = this._clamp(Number(lat) || 0, -85.05112878, 85.05112878);
    const wrappedLon = this._wrapLon(lon);
    const sinLat = Math.sin(clampedLat * Math.PI / 180);
    return {
      x: (wrappedLon + 180) / 360 * scale,
      y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
    };
  }

  _unprojectLatLon(x, y, zoom = this._mapZoom) {
    const scale = 256 * 2 ** zoom;
    const lon = x / scale * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / scale;
    const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return {
      lat: this._clamp(lat, -85.05112878, 85.05112878),
      lon: this._wrapLon(lon)
    };
  }

  _mapPointFromEvent(event) {
    const map = this.shadowRoot.getElementById("forecastMap");
    if (!map) return null;
    const rect = map.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const state = this._mapState();
    const centerPx = this._projectLatLon(state.center.lat, state.center.lon, state.zoom);
    const x = centerPx.x + (event.clientX - rect.left) - rect.width / 2;
    const y = centerPx.y + (event.clientY - rect.top) - rect.height / 2;
    return this._unprojectLatLon(x, y, state.zoom);
  }

  _renderForecastMapTiles() {
    const map = this.shadowRoot.getElementById("forecastMap");
    const tileRoot = this.shadowRoot.getElementById("mapTiles");
    const pin = this.shadowRoot.getElementById("mapPin");
    const coords = this.shadowRoot.getElementById("mapCoords");
    if (!map || !tileRoot || !pin) return;
    const rect = map.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const state = this._mapState();
    const zoom = state.zoom;
    const tileSize = 256;
    const tilesPerSide = 2 ** zoom;
    const centerPx = this._projectLatLon(state.center.lat, state.center.lon, zoom);
    const topLeft = {
      x: centerPx.x - rect.width / 2,
      y: centerPx.y - rect.height / 2
    };
    const minTileX = Math.floor(topLeft.x / tileSize);
    const maxTileX = Math.floor((topLeft.x + rect.width) / tileSize);
    const minTileY = Math.floor(topLeft.y / tileSize);
    const maxTileY = Math.floor((topLeft.y + rect.height) / tileSize);
    const imgs = [];
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      if (ty < 0 || ty >= tilesPerSide) continue;
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        const wrappedX = ((tx % tilesPerSide) + tilesPerSide) % tilesPerSide;
        const left = Math.round(tx * tileSize - topLeft.x);
        const top = Math.round(ty * tileSize - topLeft.y);
        imgs.push(`<img src="https://tile.openstreetmap.org/${zoom}/${wrappedX}/${ty}.png" alt="" draggable="false" style="left:${left}px;top:${top}px;">`);
      }
    }
    tileRoot.innerHTML = imgs.join("");
    const pointPx = this._projectLatLon(state.point.lat, state.point.lon, zoom);
    pin.style.left = `${pointPx.x - topLeft.x}px`;
    pin.style.top = `${pointPx.y - topLeft.y}px`;
    if (coords) coords.textContent = state.label;
  }

  _queueMapTileRender() {
    if (this._mapRenderFrame) return;
    this._mapRenderFrame = requestAnimationFrame(() => {
      this._mapRenderFrame = null;
      this._renderForecastMapTiles();
    });
  }

  _beachStates() {
    return [...new Set([
      ...NWS_BEACH_AREAS.map((area) => area.state),
      ...NWS_SRF_OFFICES.flatMap((office) => office.state.split("/"))
    ])].sort();
  }

  _beachAreasForState(state) {
    return NWS_BEACH_AREAS.filter((area) => area.state === state).sort((a, b) => a.name.localeCompare(b.name));
  }

  _selectedBeachArea() {
    return NWS_BEACH_AREAS.find((area) => area.id === this._config.beach_area) || null;
  }

  _srfRegions() {
    return [...new Set(NWS_SRF_OFFICES.map((office) => office.region))].sort();
  }

  _srfOfficesForRegion(region) {
    return NWS_SRF_OFFICES.filter((office) => office.region === region).sort((a, b) => `${a.state} ${a.area}`.localeCompare(`${b.state} ${b.area}`));
  }

  _selectedSrfOffice() {
    return NWS_SRF_OFFICES.find((office) => office.nws === this._config.nws_office) || null;
  }

  _forecastAreasForState(state) {
    const selectedState = String(state || "");
    if (!selectedState) return [];
    const preciseAreas = this._beachAreasForState(selectedState).map((area) => ({
      kind: "beach",
      value: `beach:${area.id}`,
      label: `${area.name} (${area.office})`,
      area
    }));
    const offices = NWS_SRF_OFFICES
      .filter((office) => office.state.split("/").includes(selectedState))
      .sort((a, b) => a.area.localeCompare(b.area))
      .map((office) => ({
        kind: "office",
        value: `office:${office.nws}`,
        label: `${office.area} (${office.nws})`,
        office
      }));
    return [...preciseAreas, ...offices];
  }

  _selectedForecastAreaValue() {
    if (this._config.beach_area) return `beach:${this._config.beach_area}`;
    if (this._config.nws_office) return `office:${this._config.nws_office}`;
    return "";
  }

  _presetForStation(station) {
    return STATION_PRESETS.find((item) => item.station === String(station));
  }

  _isGeneratedTitle(title) {
    const value = String(title || "").trim();
    return value === ""
      || value === "TideWise"
      || STATION_PRESETS.some((item) => value === `${item.name} Tides`)
      || (this._canadaStations || []).some((item) => value === `${item.name} Tides`);
  }

  _normalizeThemeMode(value) {
    return value === "auto" ? "auto" : "tidewise";
  }

  _normalizeWindUnits(value) {
    const unit = String(value || "auto").toLowerCase();
    return ["auto", "mph", "kmh", "knots", "beaufort"].includes(unit) ? unit : "auto";
  }

  _normalizeUkhoTimeMode(value) {
    const mode = String(value || "uk_local").toLowerCase();
    return mode === "as_is" ? "as_is" : "uk_local";
  }

  _normalizeTideTimeMode(value) {
    const mode = String(value || "as_is").toLowerCase();
    return ["as_is", "utc", "time_zone"].includes(mode) ? mode : "as_is";
  }

  _normalizeProvider(value) {
    if (value === "chs_iwls") return "chs_iwls";
    if (value === "ukho_entity") return "ukho_entity";
    if (value === "ukho") return "ukho_entity";
    if (value === "generic_entity") return "generic_entity";
    if (value === "ha_entity") return "generic_entity";
    return "noaa_coops";
  }

  _emitConfig(nextConfig, options = {}) {
    const oldLat = Number(this._config?.latitude);
    const oldLon = Number(this._config?.longitude);
    this._config = nextConfig;
    const newLat = Number(nextConfig?.latitude);
    const newLon = Number(nextConfig?.longitude);
    const pointChanged = oldLat !== newLat || oldLon !== newLon;
    if (!options.keepMapCenter && pointChanged) this._syncMapCenterToConfig(nextConfig);
    const event = new Event("config-changed", { bubbles: true, composed: true });
    event.detail = { config: nextConfig };
    this.dispatchEvent(event);
    this._render();
  }

  _setValue(key, value) {
    const next = { ...this._config, [key]: value };
    this._emitConfig(next);
  }

  _setForecastPoint(lat, lon, options = {}) {
    const nextLat = this._roundCoord(lat);
    const nextLon = this._roundCoord(lon);
    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLon)) return;
    this._emitConfig({ ...this._config, latitude: nextLat, longitude: nextLon }, options);
  }

  _handleMapPick(event) {
    if (this._suppressMapClick) {
      this._suppressMapClick = false;
      return;
    }
    const point = this._mapPointFromEvent(event);
    if (point) this._setForecastPoint(point.lat, point.lon, { keepMapCenter: true });
  }

  _handleMapKey(event) {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      this._zoomMap(1);
      return;
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      this._zoomMap(-1);
      return;
    }
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const point = this._currentForecastPoint();
    const step = (event.shiftKey ? 0.01 : 0.0025) * Math.max(1, 14 - this._mapZoom);
    const delta = {
      ArrowUp: [step, 0],
      ArrowDown: [-step, 0],
      ArrowLeft: [0, -step],
      ArrowRight: [0, step]
    }[event.key];
    this._setForecastPoint(point.lat + delta[0], point.lon + delta[1], { keepMapCenter: true });
  }

  _zoomMap(delta) {
    this._mapZoom = Math.round(this._clamp((Number(this._mapZoom) || 12) + delta, 3, 18));
    this._render();
  }

  _centerMapOnPoint() {
    const point = this._currentForecastPoint();
    this._mapCenter = { ...point };
    this._render();
  }

  _handleMapPointerDown(event) {
    const map = this.shadowRoot.getElementById("forecastMap");
    if (!map) return;
    this._mapDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      center: { ...this._mapState().center },
      moved: false
    };
    map.setPointerCapture?.(event.pointerId);
    map.classList.add("is-dragging");
  }

  _handleMapPointerMove(event) {
    if (!this._mapDrag || this._mapDrag.pointerId !== event.pointerId) return;
    const dx = event.clientX - this._mapDrag.startX;
    const dy = event.clientY - this._mapDrag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) this._mapDrag.moved = true;
    const zoom = this._mapState().zoom;
    const startPx = this._projectLatLon(this._mapDrag.center.lat, this._mapDrag.center.lon, zoom);
    this._mapCenter = this._unprojectLatLon(startPx.x - dx, startPx.y - dy, zoom);
    this._queueMapTileRender();
  }

  _handleMapPointerUp(event) {
    const map = this.shadowRoot.getElementById("forecastMap");
    if (this._mapDrag?.moved) this._suppressMapClick = true;
    this._mapDrag = null;
    map?.classList.remove("is-dragging");
    try { map?.releasePointerCapture?.(event.pointerId); } catch (err) { /* noop */ }
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

  _ukhoEntityOptions() {
    const states = this._hass?.states || {};
    return Object.keys(states)
      .filter((entityId) => {
        const entity = states[entityId];
        return entityId.startsWith("sensor.") && Array.isArray(entity?.attributes?.predictions);
      })
      .sort((a, b) => {
        const an = String(states[a]?.attributes?.friendly_name || a);
        const bn = String(states[b]?.attributes?.friendly_name || b);
        return an.localeCompare(bn);
      })
      .map((entityId) => ({
        entityId,
        name: String(states[entityId]?.attributes?.friendly_name || entityId)
      }));
  }

  _tideEntityOptions() {
    const states = this._hass?.states || {};
    return Object.keys(states)
      .filter((entityId) => {
        const entity = states[entityId];
        const attrs = entity?.attributes || {};
        return entityId.startsWith("sensor.") && [
          attrs.predictions,
          attrs.tide_predictions,
          attrs.tidePredictions,
          attrs.events,
          attrs.extremes,
          attrs.high_low,
          attrs.highLow
        ].some(Array.isArray);
      })
      .sort((a, b) => {
        const an = String(states[a]?.attributes?.friendly_name || a);
        const bn = String(states[b]?.attributes?.friendly_name || b);
        return an.localeCompare(bn);
      })
      .map((entityId) => ({
        entityId,
        name: String(states[entityId]?.attributes?.friendly_name || entityId)
      }));
  }

  _applyUkhoEntity(entityId) {
    const next = { ...this._config, provider: "ukho_entity", ukho_entity: String(entityId || "").trim() };
    const entity = this._hass?.states?.[next.ukho_entity];
    const name = String(entity?.attributes?.friendly_name || "").trim();
    if (name && this._isGeneratedTitle(next.title)) {
      next.title = `${name.replace(/\s+Tides?$/i, "")} Tides`;
    }
    this._emitConfig(next);
  }

  _applyTideEntity(entityId) {
    const next = { ...this._config, provider: "generic_entity", tide_entity: String(entityId || "").trim() };
    const entity = this._hass?.states?.[next.tide_entity];
    const name = String(entity?.attributes?.friendly_name || "").trim();
    if (name && this._isGeneratedTitle(next.title)) {
      next.title = `${name.replace(/\s+Tides?$/i, "")} Tides`;
    }
    this._emitConfig(next);
  }

  async _useNoaaStationLocation() {
    const station = String(this._config.station || "").trim();
    if (!station) return;
    const button = this.shadowRoot.getElementById("stationLocation");
    if (button) button.disabled = true;
    try {
      const res = await fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${encodeURIComponent(station)}.json`);
      const json = await res.json();
      const stationInfo = json?.stations?.[0];
      const lat = Number(stationInfo?.lat);
      const lon = Number(stationInfo?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
      const next = { ...this._config, latitude: lat, longitude: lon };
      const stationName = String(stationInfo?.name || "").trim();
      const state = String(stationInfo?.state || "").trim();
      if (stationName && this._isGeneratedTitle(next.title)) next.title = `${stationName}${state ? ", " + state : ""} Tides`;
      this._emitConfig(next);
    } catch (err) {
      // Keep the editor usable if NOAA metadata is unavailable.
    } finally {
      if (button) button.disabled = false;
    }
  }

  _regionForCanadaStation(station) {
    const lat = Number(station?.latitude);
    const lon = Number(station?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "";
    return CANADA_REGIONS.find((region) => {
      const [minLon, minLat, maxLon, maxLat] = region.bbox;
      return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    })?.code || "";
  }

  _stationHasCanadaPredictions(station) {
    return Boolean(this._canadaStationSeriesCode(station));
  }

  _normalizeCanadaSeriesCode(value) {
    const raw = String(value || "").toLowerCase().trim();
    return raw === "wlf" ? "wlf" : raw === "wlp" ? "wlp" : "";
  }

  _canadaStationSeriesCode(station) {
    const codes = (station?.timeSeries || []).map((series) => this._normalizeCanadaSeriesCode(series?.code));
    if (codes.includes("wlp")) return "wlp";
    if (codes.includes("wlf")) return "wlf";
    return "";
  }

  _stationIsUsableCanadaPredictionStation(station) {
    const type = String(station?.type || "").toLowerCase();
    if (station?.operating === false) return false;
    if (type.includes("discontinued")) return false;
    return this._stationHasCanadaPredictions(station);
  }

  async _loadCanadaStations() {
    if (this._canadaStations || this._canadaStationsLoading) return;
    this._canadaStationsLoading = true;
    this._canadaStationsError = "";
    this._render();
    try {
      const res = await fetch("https://api-iwls.dfo-mpo.gc.ca/api/v1/stations");
      if (!res.ok) throw new Error(`CHS returned ${res.status}`);
      const json = await res.json();
      const apiStations = this._arrayFromApi(json)
        .filter((station) => station?.id && station?.officialName && this._stationIsUsableCanadaPredictionStation(station))
        .map((station) => ({
          id: String(station.id),
          code: String(station.code || ""),
          seriesCode: this._canadaStationSeriesCode(station),
          name: String(station.officialName || ""),
          type: String(station.type || ""),
          lat: Number(station.latitude),
          lon: Number(station.longitude),
          region: this._regionForCanadaStation(station)
        }))
        .filter((station) => station.region)
      const apiCodes = new Set(apiStations.map((station) => station.code).filter(Boolean));
      const seededStations = CANADA_STATION_SEEDS
        .filter((station) => !apiCodes.has(station.code))
        .map((station) => ({
          id: `code:${station.code}`,
          code: station.code,
          seriesCode: station.seriesCode,
          name: station.name,
          type: "CHS station",
          lat: null,
          lon: null,
          region: station.region,
          seed: true
        }));
      this._canadaStations = apiStations.concat(seededStations).sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      this._canadaStationsError = err.message || "Could not load CHS stations";
    } finally {
      this._canadaStationsLoading = false;
      this._render();
    }
  }

  _arrayFromApi(json) {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.value)) return json.value;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.items)) return json.items;
    return [];
  }

  _canadaRegionStations(regionCode) {
    return (this._canadaStations || []).filter((station) => station.region === regionCode);
  }

  async _resolveCanadaStationByCode(code) {
    const res = await fetch(`https://api-iwls.dfo-mpo.gc.ca/api/v1/stations?code=${encodeURIComponent(code)}`);
    if (!res.ok) throw new Error(`CHS returned ${res.status}`);
    const station = this._arrayFromApi(await res.json()).find((item) => String(item?.code || "") === String(code));
    if (!station?.id) throw new Error(`CHS station ${code} was not found`);
    return {
      id: String(station.id),
      code: String(station.code || code),
      seriesCode: this._canadaStationSeriesCode(station) || "",
      name: String(station.officialName || `CHS ${code}`),
      lat: Number(station.latitude),
      lon: Number(station.longitude),
      region: this._regionForCanadaStation(station) || "great_lakes"
    };
  }

  async _applyCanadaStation(stationId) {
    const station = (this._canadaStations || []).find((item) => item.id === stationId);
    let selected = station;
    if (station?.seed) {
      try {
        selected = await this._resolveCanadaStationByCode(station.code);
      } catch (err) {
        const next = { ...this._config, provider: "chs_iwls", ca_station: "", ca_station_code: station.code, ca_series_code: station.seriesCode, ca_region: station.region };
        if (this._isGeneratedTitle(next.title)) next.title = `${station.name} Tides`;
        this._emitConfig(next);
        return;
      }
    }
    const next = { ...this._config, provider: "chs_iwls", ca_station: String(selected?.id || stationId) };
    if (selected) {
      next.ca_station_code = selected.code;
      next.ca_series_code = selected.seriesCode;
      next.ca_region = selected.region;
      if (Number.isFinite(selected.lat)) next.latitude = selected.lat;
      if (Number.isFinite(selected.lon)) next.longitude = selected.lon;
      if (this._isGeneratedTitle(next.title)) next.title = `${selected.name} Tides`;
    }
    this._emitConfig(next);
  }

  _render() {
    if (!this.shadowRoot) return;
    this._rendered = true;
    const config = this._config || {};
    const provider = this._normalizeProvider(config.provider);
    const selectedPreset = this._presetForStation(config.station) ? String(config.station) : "custom";
    const ukhoEntityOptions = this._ukhoEntityOptions();
    const selectedUkhoEntityKnown = ukhoEntityOptions.some((item) => item.entityId === config.ukho_entity);
    const tideEntityOptions = this._tideEntityOptions();
    const selectedTideEntityKnown = tideEntityOptions.some((item) => item.entityId === config.tide_entity);
    const grid = config.grid_options || {};
    const canadaRegion = config.ca_region || "atlantic";
    const canadaStations = this._canadaRegionStations(canadaRegion);
    const beachState = config.beach_state || "";
    const forecastAreas = this._forecastAreasForState(beachState);
    const selectedForecastArea = this._selectedForecastAreaValue();
    const mapState = this._mapState();
    const tideOffsetUnit = config.units === "metric" ? "m" : "ft";
    if (provider === "chs_iwls" && !this._canadaStations && !this._canadaStationsLoading) {
      setTimeout(() => this._loadCanadaStations(), 0);
    }
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
        .map-card {
          grid-column: 1 / -1;
          display: grid;
          gap: 8px;
          padding: 10px;
          border: 1px solid var(--divider-color, #d0d7de);
          border-radius: 12px;
          background: var(--secondary-background-color, rgba(246,248,250,0.78));
        }
        .map-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; flex-wrap: wrap; }
        .map-title { font-size: 13px; font-weight: 850; color: var(--primary-text-color, #1f2933); }
        .map-subtitle { display: block; font-size: 11px; line-height: 1.3; color: var(--secondary-text-color, #536471); font-weight: 600; }
        .map-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .map-actions button { min-height: 28px; padding: 4px 8px; border-radius: 7px; font-size: 12px; }
        .map-span { font-size: 11px; color: var(--secondary-text-color, #536471); font-weight: 800; white-space: nowrap; }
        .map-picker {
          position: relative;
          height: 168px;
          border: 1px solid var(--divider-color, #d0d7de);
          border-radius: 12px;
          overflow: hidden;
          cursor: grab;
          outline: none;
          touch-action: none;
          background: #b8d6df;
        }
        .map-picker.is-dragging { cursor: grabbing; }
        .map-picker:focus { box-shadow: 0 0 0 2px var(--accent-color, #2a9dcc); }
        .map-tiles {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .map-tiles img {
          position: absolute;
          width: 256px;
          height: 256px;
          user-select: none;
          -webkit-user-drag: none;
        }
        .map-crosshair {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .map-crosshair::before,
        .map-crosshair::after {
          content: "";
          position: absolute;
          background: rgba(10,30,45,0.20);
        }
        .map-crosshair::before {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
        }
        .map-crosshair::after {
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
        }
        .map-pin {
          position: absolute;
          width: 18px;
          height: 18px;
          transform: translate(-50%, -100%) rotate(45deg);
          border-radius: 50% 50% 50% 2px;
          background: var(--accent-color, #2a9dcc);
          border: 2px solid var(--card-background-color, #fff);
          box-shadow: 0 2px 10px rgba(0,0,0,0.28);
          z-index: 2;
          pointer-events: none;
        }
        .map-pin::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--card-background-color, #fff);
          left: 4px;
          top: 4px;
        }
        .map-coords {
          position: absolute;
          left: 8px;
          bottom: 8px;
          z-index: 2;
          padding: 3px 7px;
          border-radius: 99px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(0,0,0,0.10);
          color: #1f2933;
          font-size: 11px;
          font-weight: 800;
          font-family: var(--font-mono, monospace);
        }
        .map-attribution {
          position: absolute;
          right: 6px;
          bottom: 6px;
          z-index: 2;
          padding: 2px 5px;
          border-radius: 5px;
          background: rgba(255,255,255,0.82);
          color: #1f2933;
          font-size: 10px;
          font-weight: 700;
        }
        .map-attribution a { color: #1f2933; text-decoration: none; }
        @media (max-width: 520px) {
          .map-picker { height: 132px; }
          .map-head { align-items: flex-start; }
        }
      </style>
      <div class="wrap">
        <div class="section">
          <div class="title">Location</div>
          <div class="grid">
            <label class="wide">
              Tide provider
              <select id="provider">
                <option value="noaa_coops" ${provider === "noaa_coops" ? "selected" : ""}>US NOAA CO-OPS</option>
                <option value="chs_iwls" ${provider === "chs_iwls" ? "selected" : ""}>Canada CHS / DFO</option>
                <option value="ukho_entity" ${provider === "ukho_entity" ? "selected" : ""}>UK UKHO Tides integration sensor</option>
                <option value="generic_entity" ${provider === "generic_entity" ? "selected" : ""}>Home Assistant tide entity</option>
              </select>
            </label>
          </div>
          ${provider === "chs_iwls" ? `
          <div class="grid">
            <label>
              Canadian region
              <select id="caRegion">
                ${CANADA_REGIONS.map((region) => `<option value="${region.code}" ${canadaRegion === region.code ? "selected" : ""}>${region.name}</option>`).join("")}
              </select>
            </label>
            <label>
              CHS water-level station
              <select id="caStation" ${this._canadaStationsLoading ? "disabled" : ""}>
                <option value="">${this._canadaStationsLoading ? "Loading CHS stations..." : "Choose a CHS station"}</option>
                ${canadaStations.map((station) => `<option value="${station.id}" ${config.ca_station === station.id ? "selected" : ""}>${station.name}${station.code ? " (" + station.code + ")" : ""}</option>`).join("")}
              </select>
            </label>
            <label>
              Manual CHS station ID
              <input id="caStationManual" value="${this._escape(config.ca_station || "")}" placeholder="CHS station object ID">
            </label>
            <label>
              CHS station code
              <input id="caStationCode" value="${this._escape(config.ca_station_code || "")}" placeholder="Optional display code">
            </label>
          </div>
          ${this._canadaStationsError ? `<div class="hint">Could not load CHS station list: ${this._escape(this._canadaStationsError)}</div>` : ""}
          <div class="hint">Canadian support uses CHS/DFO IWLS water-level predictions where available, with water-level forecasts as a fallback for Great Lakes stations. Weather, rip risk, surf, and other fishing inputs still depend on Home Assistant entities.</div>
          ` : provider === "ukho_entity" ? `
          <div class="grid">
            <label class="wide">
              UKHO Tides sensor
              <select id="ukhoEntitySelect">
                <option value="">Choose a UKHO Tides sensor</option>
                ${!selectedUkhoEntityKnown && config.ukho_entity ? `<option value="${this._escape(config.ukho_entity)}" selected>${this._escape(config.ukho_entity)}</option>` : ""}
                ${ukhoEntityOptions.map((item) => `<option value="${this._escape(item.entityId)}" ${config.ukho_entity === item.entityId ? "selected" : ""}>${this._escape(item.name)} (${this._escape(item.entityId)})</option>`).join("")}
              </select>
            </label>
            <label class="wide">
              Manual UKHO entity ID
              <input id="ukhoEntityManual" value="${this._escape(config.ukho_entity || "")}" placeholder="sensor.portsmouth_tide">
            </label>
            <label>
              UK time handling
              <select id="ukhoTimeMode">
                <option value="uk_local" ${config.ukho_time_mode !== "as_is" ? "selected" : ""}>UK local time (GMT/BST)</option>
                <option value="as_is" ${config.ukho_time_mode === "as_is" ? "selected" : ""}>Use sensor times as-is</option>
              </select>
            </label>
            <label>
              Time offset (minutes)
              <input id="timeOffsetMinutes" type="number" step="1" value="${config.time_offset_minutes ?? 0}" placeholder="0">
            </label>
            <label>
              Height offset (${tideOffsetUnit})
              <input id="heightOffset" type="number" step="0.01" value="${config.height_offset ?? 0}" placeholder="0">
            </label>
          </div>
          ${ukhoEntityOptions.length ? "" : `<div class="hint"><strong>No UKHO Tides sensors found yet.</strong> Install and configure the UKHO Tides Home Assistant integration first, then reopen this editor or enter the sensor entity ID manually.</div>`}
          <div class="hint"><strong>Required for UK:</strong> TideWise reads a sensor from the separate UKHO Tides Home Assistant integration. Add your UKHO API key and station in that integration first, then choose the created sensor here. The API key stays in Home Assistant instead of browser/dashboard YAML.</div>
          <div class="hint"><strong>UK corrections:</strong> Use UK local time for normal GMT/BST conversion. If the integration already emits local clock times, choose as-is. Use time offset for secondary-station timing corrections and height offset when all tide heights are consistently high or low; height offset uses the selected tide display unit.</div>
          ` : provider === "generic_entity" ? `
          <div class="grid">
            <label class="wide">
              Tide entity
              <select id="tideEntitySelect">
                <option value="">Choose a tide prediction sensor</option>
                ${!selectedTideEntityKnown && config.tide_entity ? `<option value="${this._escape(config.tide_entity)}" selected>${this._escape(config.tide_entity)}</option>` : ""}
                ${tideEntityOptions.map((item) => `<option value="${this._escape(item.entityId)}" ${config.tide_entity === item.entityId ? "selected" : ""}>${this._escape(item.name)} (${this._escape(item.entityId)})</option>`).join("")}
              </select>
            </label>
            <label class="wide">
              Manual tide entity ID
              <input id="tideEntityManual" value="${this._escape(config.tide_entity || "")}" placeholder="sensor.my_tide_predictions">
            </label>
            <label>
              Entity time handling
              <select id="tideTimeMode">
                <option value="as_is" ${config.tide_time_mode === "as_is" ? "selected" : ""}>Use entity times as-is</option>
                <option value="utc" ${config.tide_time_mode === "utc" ? "selected" : ""}>Treat timezone-less times as UTC</option>
                <option value="time_zone" ${config.tide_time_mode === "time_zone" ? "selected" : ""}>Convert zoned times to named timezone</option>
              </select>
            </label>
            <label>
              Tide timezone
              <input id="tideTimeZone" value="${this._escape(config.tide_time_zone || "")}" placeholder="Europe/Paris">
            </label>
            <label>
              Time offset (minutes)
              <input id="timeOffsetMinutes" type="number" step="1" value="${config.time_offset_minutes ?? 0}" placeholder="0">
            </label>
            <label>
              Height offset (${tideOffsetUnit})
              <input id="heightOffset" type="number" step="0.01" value="${config.height_offset ?? 0}" placeholder="0">
            </label>
          </div>
          ${tideEntityOptions.length ? "" : `<div class="hint"><strong>No compatible tide sensors found yet.</strong> Choose a Home Assistant integration or template sensor that exposes prediction rows in a <code>predictions</code>, <code>tide_predictions</code>, <code>events</code>, or <code>extremes</code> attribute.</div>`}
          <div class="hint"><strong>International beta:</strong> TideWise reads high/low tide events from an existing Home Assistant sensor. This is the recommended first path for France, Spain, Australia, the Mediterranean, and Adriatic locations while direct official providers are evaluated.</div>
          ` : `
          <div class="grid">
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
            </label>
          </div>
          `}
          <div class="grid">
            <label>
              Fishing / beach latitude
              <input id="latitude" type="number" step="0.000001" value="${config.latitude ?? ""}" placeholder="33.688">
            </label>
            <label>
              Fishing / beach longitude
              <input id="longitude" type="number" step="0.000001" value="${config.longitude ?? ""}" placeholder="-78.886">
            </label>
          </div>
          <div class="map-card">
            <div class="map-head">
              <div>
                <span class="map-title">Fishing point picker</span>
                <span class="map-subtitle">Drag to pan, zoom in/out, then tap or click to set the point used for NWS weather, surf context, rain/runoff context, and moon timing.</span>
              </div>
              <div class="map-actions">
                <button id="mapZoomOut" type="button" title="Zoom out">-</button>
                <span class="map-span">${mapState.zoomLabel}</span>
                <button id="mapZoomIn" type="button" title="Zoom in">+</button>
                <button id="mapCenter" type="button">Center on pin</button>
              </div>
            </div>
            <div id="forecastMap" class="map-picker" role="button" tabindex="0" aria-label="Tap or click to set fishing and beach coordinates">
              <div id="mapTiles" class="map-tiles"></div>
              <div class="map-crosshair"></div>
              <div id="mapPin" class="map-pin"></div>
              <div id="mapCoords" class="map-coords">${this._escape(mapState.label)}</div>
              <div class="map-attribution">&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></div>
            </div>
            <div class="hint">This loads OpenStreetMap tiles only while the visual editor is open. Paste exact coordinates from Maps when precision matters, or use the map to move the fishing point away from the tide gauge.</div>
          </div>
          <div class="row">
            ${provider === "noaa_coops" ? `<button id="stationLocation" type="button">Use NOAA station location</button>` : ""}
            <span class="hint">For best fishing scores, use the beach, pier, inlet, or fishing spot you actually care about. Pick a beach/surf area to fill nearby context automatically, or use the tide station location for station-based context.</span>
          </div>
          ${provider === "noaa_coops" ? `
          <div class="title">Beach / Surf Forecast</div>
          <div class="grid">
            <label>
              State
              <select id="beachState">
                <option value="">Use coordinates</option>
                ${this._beachStates().map((state) => `<option value="${state}" ${beachState === state ? "selected" : ""}>${state}</option>`).join("")}
              </select>
            </label>
            <label>
              Coastal county / beach area
              <select id="beachArea">
                <option value="">Use coordinates</option>
                ${forecastAreas.map((item) => `<option value="${item.value}" ${selectedForecastArea === item.value ? "selected" : ""}>${item.label}</option>`).join("")}
              </select>
            </label>
          </div>
          <div class="hint">Beach area is used for NWS surf/rip risk. Tide height still comes from the tide station above. If no exact beach zone is listed yet, choose the closest NWS-listed forecast office.</div>
          ` : ""}
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
              Wind units
              <select id="windUnits">
                <option value="auto" ${this._normalizeWindUnits(config.wind_units) === "auto" ? "selected" : ""}>Auto</option>
                <option value="mph" ${this._normalizeWindUnits(config.wind_units) === "mph" ? "selected" : ""}>MPH</option>
                <option value="kmh" ${this._normalizeWindUnits(config.wind_units) === "kmh" ? "selected" : ""}>km/h</option>
                <option value="knots" ${this._normalizeWindUnits(config.wind_units) === "knots" ? "selected" : ""}>Knots</option>
                <option value="beaufort" ${this._normalizeWindUnits(config.wind_units) === "beaufort" ? "selected" : ""}>Beaufort</option>
              </select>
            </label>
            <label>
              Fishing mode
              <select id="mode">
                ${["general", "surf", "inlet", "flounder", "trout_redfish", "sheepshead"].map((mode) => `<option value="${mode}" ${config.mode === mode ? "selected" : ""}>${mode.replace("_", " / ")}</option>`).join("")}
              </select>
            </label>
            <label>
              Theme
              <select id="themeMode">
                <option value="tidewise" ${config.theme_mode !== "auto" ? "selected" : ""}>TideWise</option>
                <option value="auto" ${config.theme_mode === "auto" ? "selected" : ""}>Home Assistant theme</option>
              </select>
            </label>
          </div>
          <label class="check">
            <input id="showFishing" type="checkbox" ${config.show_fishing_score !== false ? "checked" : ""}>
            Show fishing score
          </label>
          <label class="check">
            <input id="autoSources" type="checkbox" ${config.auto_sources !== false ? "checked" : ""}>
            Fetch NOAA/NWS auto sources
          </label>
          <label class="check">
            <input id="autoSurfForecast" type="checkbox" ${config.auto_surf_forecast !== false ? "checked" : ""}>
            Try NWS surf/rip forecast${provider === "noaa_coops" ? "" : " (US NOAA provider only)"}
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
      const nextProvider = this._normalizeProvider(event.target.value);
      const next = { ...this._config, provider: nextProvider };
      if (nextProvider === "chs_iwls") {
        next.ca_region = next.ca_region || "atlantic";
        if (!next.ca_station && this._canadaStations) {
          const first = this._canadaRegionStations(next.ca_region)[0];
          if (first) {
            next.ca_station = first.id;
            next.ca_station_code = first.code;
            next.latitude = first.lat;
            next.longitude = first.lon;
            if (this._isGeneratedTitle(next.title)) next.title = `${first.name} Tides`;
          }
        }
      }
      if (nextProvider === "ukho_entity") {
        const first = this._ukhoEntityOptions()[0];
        if (!next.ukho_entity && first) {
          next.ukho_entity = first.entityId;
          if (this._isGeneratedTitle(next.title)) next.title = `${first.name.replace(/\s+Tides?$/i, "")} Tides`;
        }
      }
      if (nextProvider === "generic_entity") {
        const first = this._tideEntityOptions()[0];
        if (!next.tide_entity && first) {
          next.tide_entity = first.entityId;
          if (this._isGeneratedTitle(next.title)) next.title = `${first.name.replace(/\s+Tides?$/i, "")} Tides`;
        }
      }
      this._emitConfig(next);
    });
    this.shadowRoot.getElementById("caRegion")?.addEventListener("change", (event) => {
      const region = event.target.value;
      const first = this._canadaRegionStations(region)[0];
      const next = { ...this._config, provider: "chs_iwls", ca_region: region };
      if (first) {
        if (first.seed) {
          this._applyCanadaStation(first.id);
          return;
        }
        next.ca_station = first.id;
        next.ca_station_code = first.code;
        next.ca_series_code = first.seriesCode;
        if (Number.isFinite(first.lat)) next.latitude = first.lat;
        if (Number.isFinite(first.lon)) next.longitude = first.lon;
        if (this._isGeneratedTitle(next.title)) next.title = `${first.name} Tides`;
      }
      this._emitConfig(next);
    });
    this.shadowRoot.getElementById("caStation")?.addEventListener("change", (event) => {
      if (event.target.value) this._applyCanadaStation(event.target.value);
    });
    this.shadowRoot.getElementById("caStationManual")?.addEventListener("change", (event) => this._setValue("ca_station", String(event.target.value || "").trim()));
    this.shadowRoot.getElementById("caStationCode")?.addEventListener("change", (event) => this._setValue("ca_station_code", String(event.target.value || "").trim()));
    this.shadowRoot.getElementById("stationPreset")?.addEventListener("change", (event) => {
      const value = event.target.value;
      if (value !== "custom") this._applyStation(value);
    });
    this.shadowRoot.getElementById("station")?.addEventListener("change", (event) => this._setValue("station", String(event.target.value || "").trim()));
    this.shadowRoot.getElementById("ukhoEntitySelect")?.addEventListener("change", (event) => this._applyUkhoEntity(event.target.value));
    this.shadowRoot.getElementById("ukhoEntityManual")?.addEventListener("change", (event) => this._applyUkhoEntity(event.target.value));
    this.shadowRoot.getElementById("ukhoTimeMode")?.addEventListener("change", (event) => this._setValue("ukho_time_mode", this._normalizeUkhoTimeMode(event.target.value)));
    this.shadowRoot.getElementById("tideEntitySelect")?.addEventListener("change", (event) => this._applyTideEntity(event.target.value));
    this.shadowRoot.getElementById("tideEntityManual")?.addEventListener("change", (event) => this._applyTideEntity(event.target.value));
    this.shadowRoot.getElementById("tideTimeMode")?.addEventListener("change", (event) => this._setValue("tide_time_mode", this._normalizeTideTimeMode(event.target.value)));
    this.shadowRoot.getElementById("tideTimeZone")?.addEventListener("change", (event) => this._setValue("tide_time_zone", String(event.target.value || "").trim()));
    this.shadowRoot.getElementById("timeOffsetMinutes")?.addEventListener("change", (event) => this._setNumber("time_offset_minutes", event.target.value));
    this.shadowRoot.getElementById("heightOffset")?.addEventListener("change", (event) => this._setNumber("height_offset", event.target.value));
    this.shadowRoot.getElementById("latitude")?.addEventListener("change", (event) => this._setNumber("latitude", event.target.value));
    this.shadowRoot.getElementById("longitude")?.addEventListener("change", (event) => this._setNumber("longitude", event.target.value));
    const forecastMap = this.shadowRoot.getElementById("forecastMap");
    forecastMap?.addEventListener("click", (event) => this._handleMapPick(event));
    forecastMap?.addEventListener("keydown", (event) => this._handleMapKey(event));
    forecastMap?.addEventListener("pointerdown", (event) => this._handleMapPointerDown(event));
    forecastMap?.addEventListener("pointermove", (event) => this._handleMapPointerMove(event));
    forecastMap?.addEventListener("pointerup", (event) => this._handleMapPointerUp(event));
    forecastMap?.addEventListener("pointercancel", (event) => this._handleMapPointerUp(event));
    this.shadowRoot.getElementById("mapZoomOut")?.addEventListener("click", () => this._zoomMap(-1));
    this.shadowRoot.getElementById("mapZoomIn")?.addEventListener("click", () => this._zoomMap(1));
    this.shadowRoot.getElementById("mapCenter")?.addEventListener("click", () => this._centerMapOnPoint());
    this.shadowRoot.getElementById("stationLocation")?.addEventListener("click", () => this._useNoaaStationLocation());
    this.shadowRoot.getElementById("beachState")?.addEventListener("change", (event) => {
      const state = event.target.value;
      const first = this._forecastAreasForState(state)[0];
      const next = { ...this._config, beach_state: state, beach_area: "", surf_zone: "", nws_office: "", srf_region: "" };
      if (first) this._applyForecastAreaToConfig(next, first);
      this._emitConfig(next);
    });
    this.shadowRoot.getElementById("beachArea")?.addEventListener("change", (event) => {
      const item = this._forecastAreasForState(this._config.beach_state).find((entry) => entry.value === event.target.value);
      const next = { ...this._config };
      if (item) this._applyForecastAreaToConfig(next, item);
      else {
        next.beach_area = "";
        next.surf_zone = "";
        next.nws_office = "";
        next.srf_region = "";
      }
      this._emitConfig(next);
    });
    this.shadowRoot.getElementById("title")?.addEventListener("change", (event) => this._setValue("title", event.target.value || "TideWise"));
    this.shadowRoot.getElementById("units")?.addEventListener("change", (event) => this._setValue("units", event.target.value));
    this.shadowRoot.getElementById("windUnits")?.addEventListener("change", (event) => this._setValue("wind_units", this._normalizeWindUnits(event.target.value)));
    this.shadowRoot.getElementById("mode")?.addEventListener("change", (event) => this._setValue("mode", event.target.value));
    this.shadowRoot.getElementById("themeMode")?.addEventListener("change", (event) => this._setValue("theme_mode", this._normalizeThemeMode(event.target.value)));
    this.shadowRoot.getElementById("showFishing")?.addEventListener("change", (event) => this._setValue("show_fishing_score", event.target.checked));
    this.shadowRoot.getElementById("autoSources")?.addEventListener("change", (event) => this._setValue("auto_sources", event.target.checked));
    this.shadowRoot.getElementById("autoSurfForecast")?.addEventListener("change", (event) => this._setValue("auto_surf_forecast", event.target.checked));
    this.shadowRoot.getElementById("gridRows")?.addEventListener("change", (event) => this._setGridValue("rows", event.target.value));
    this.shadowRoot.getElementById("gridColumns")?.addEventListener("change", (event) => this._setGridValue("columns", event.target.value));
    requestAnimationFrame(() => this._renderForecastMapTiles());
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

  _applyBeachAreaToConfig(config, area) {
    config.beach_state = area.state;
    config.beach_area = area.id;
    config.nws_office = area.office;
    config.surf_zone = area.zone;
    config.srf_region = NWS_SRF_OFFICES.find((office) => office.nws === area.office)?.region || config.srf_region || "";
    config.latitude = area.lat;
    config.longitude = area.lon;
  }

  _applyForecastAreaToConfig(config, item) {
    if (item.kind === "beach") {
      this._applyBeachAreaToConfig(config, item.area);
      return;
    }
    if (item.kind === "office") {
      const officeStates = item.office.state.split("/");
      config.beach_state = officeStates.includes(config.beach_state) ? config.beach_state : officeStates[0];
      config.beach_area = "";
      config.surf_zone = "";
      config.nws_office = item.office.nws;
      config.srf_region = item.office.region;
    }
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
  description: "Tide predictions with optional bite-window fishing quality scoring",
  preview: true
});

console.info(
  `%c TIDEWISE CARD %c v${CARD_VERSION} `,
  "background:#0d3a5c;color:#7ecbca;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px",
  "background:#7ecbca;color:#0d3a5c;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0"
);
console.info(`TideWise v${CARD_VERSION} loaded`);
