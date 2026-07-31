# TideWise

<p align="center">
  <img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/tidewise-icon.png" alt="TideWise wave icon" width="96">
</p>

[![GitHub release](https://img.shields.io/github/v/release/TheWillMiller/tide-wise)](https://github.com/TheWillMiller/tide-wise/releases)
[![Validate](https://img.shields.io/github/actions/workflow/status/TheWillMiller/tide-wise/validate.yml?branch=main&label=validate)](https://github.com/TheWillMiller/tide-wise/actions/workflows/validate.yml)
[![GitHub stars](https://img.shields.io/github/stars/TheWillMiller/tide-wise?label=stars)](https://github.com/TheWillMiller/tide-wise/stargazers)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/thewillmiller)

**Latest release:** `v0.9.7`

TideWise is a Home Assistant dashboard (Lovelace) custom card for tide predictions, current tide height, next high/low tides, and optional fishing bite-window scoring. The default provider is NOAA CO-OPS, with early Canada CHS/DFO support, UK support through the UKHO Tides Home Assistant integration, and international beta support through compatible Home Assistant tide sensors.

## Screenshots

### Main TideWise Card

<img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/TIDE_CARD.png" alt="TideWise card showing current tide, tide chart, moon phase, and fishing window" width="720">

### Theme Modes

TideWise keeps its ocean-glass style by default. It can also follow Home Assistant theme colors more closely with `theme_mode: auto`.

<img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/TIDE_CARD_THEME_TIDEWISE.png" alt="TideWise default ocean-glass theme mode" width="720">

<img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/TIDE_CARD_THEME_AUTO_DARK.png" alt="TideWise Home Assistant theme mode on a dark dashboard" width="720">

### NOAA Station Picker

<img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/TideStations.png" alt="TideWise NOAA station picker in the visual editor" width="720">

### Visual Editor

<img src="https://raw.githubusercontent.com/TheWillMiller/tide-wise/main/ThemeEditor.png" alt="TideWise visual editor showing the theme selector and live preview" width="720">

It combines tide data with local Home Assistant entities such as weather, wind, water temperature, surf height, pressure, rain, and rip current risk. Missing optional entities are allowed; TideWise falls back to neutral scoring where possible.

> **Beta notice:** TideWise is still early beta software. Please expect occasional layout issues, missing-data fallbacks, and station-specific quirks while testing.

## Important For UK Users

UK tide support requires a separate Home Assistant integration first. TideWise is a dashboard card, so it cannot reliably call the UKHO Admiralty API directly from the browser because UKHO/Azure may block browser-side requests.

For UK tides, install and configure the [UKHO Tides Home Assistant integration](https://github.com/ianByrne/HASS-ukho_tides), add your UKHO API key and station there, then select the created UKHO Tides sensor in TideWise.

In short:

- NOAA/US: TideWise can fetch NOAA tide data directly.
- Canada: TideWise can fetch CHS/DFO water-level data directly where available.
- UK: TideWise needs the UKHO Tides Home Assistant integration sensor.
- International beta: TideWise can read a compatible Home Assistant tide sensor for places such as France, Spain, Australia, the Mediterranean, and the Adriatic while direct official providers are evaluated.

The UK option in TideWise is intentionally named **UK UKHO Tides integration sensor** because TideWise reads an existing Home Assistant sensor. It does not ask for, store, or call a UKHO API key directly.

UKHO integration event times are displayed in UK local time (`Europe/London`), including British Summer Time. If a UK card is still exactly one hour off, check the UKHO Tides integration sensor attributes and your Home Assistant/browser timezone.

## Beta Feedback

TideWise is in beta. If it works for your setup, please consider starring the repo so I can gauge interest and so you can follow development:

[Star TideWise on GitHub](https://github.com/TheWillMiller/tide-wise)

If you run into issues or want to confirm your station works, please open one of these quick reports:

- [Beta Install Report](https://github.com/TheWillMiller/tide-wise/issues/new?template=beta-install-report.yml)
- [Works For Me / Confirmed Station](https://github.com/TheWillMiller/tide-wise/issues/new?template=works-for-me-confirmed-station.yml)

Helpful details include Home Assistant version, HACS version, TideWise version, browser/device, provider, station ID or tide entity ID, and a screenshot or console error if something broke.

## Support TideWise

TideWise has no telemetry, ads, popups, tracking pixels, or in-card donation prompts. If it helps you and you want to support development, you can [buy me a coffee](https://buymeacoffee.com/thewillmiller).

Available for custom Home Assistant dashboards, Lovelace cards, and kiosk interfaces. I take 2-3 commissions/month, typically $300-600 depending on scope.

## Visual Editor Quick Reference

The visual editor is the recommended setup path. Start with **Tide provider**, then work down the form.

| Editor area | What it controls | Notes |
| --- | --- | --- |
| **Tide provider** | Chooses the tide data source. | Use **US NOAA CO-OPS** for NOAA stations, **Canada CHS / DFO** for Canadian CHS/IWLS stations, **UK UKHO Tides integration sensor** for a UKHO integration sensor, or **Home Assistant tide entity** for international sensors. |
| **Station / sensor picker** | Chooses the source used for the tide curve, current height, and next high/low tides. | This is the most important field. It is separate from weather, surf, or fishing coordinates. |
| **Manual station/entity field** | Fallback when the dropdown does not show what you need. | NOAA uses a station ID, Canada uses a CHS station object ID/code, and UK/international entity providers use Home Assistant entity IDs such as `sensor.london_bridge_tower_pier_tide` or `sensor.adriatic_tide_predictions`. |
| **Fishing / beach latitude and longitude** | Used for NWS weather lookup, moon/solunar timing, and fishing-score context. | These coordinates do not have to be the tide gauge. For best fishing scores, use the beach, inlet, pier, or fishing area you actually care about. |
| **Fishing point picker** | OpenStreetMap picker for the fishing/beach point. | Drag to pan, zoom in/out, click or tap to set the point, or paste exact coordinates from Maps when precision matters. Map tiles load only while the visual editor is open. |
| **Beach / Surf Forecast** | Scopes US NWS surf/rip-current data. | This does not change the tide station. Pick a **State**, then a nearby **Coastal county / beach area**. |
| **Card settings** | Title, units, fishing mode, theme, and optional data toggles. | These change display and scoring behavior, not the tide source itself. |
| **Wind units** | Controls only the displayed wind speed unit. | Use this when tide height should be metric but wind should remain MPH or Beaufort. |
| **Dashboard Size** | Home Assistant grid sizing. | Recommended: `rows: full`, `columns: 18`. Use `columns: full` on narrower dashboards. |

### Provider Setup At A Glance

| Provider | Best for | What TideWise needs | API key location |
| --- | --- | --- | --- |
| **US NOAA CO-OPS** | United States NOAA tide stations. | NOAA station ID. Presets are provided, and custom station IDs are supported. | No TideWise API key needed. |
| **Canada CHS / DFO** | Canadian CHS/IWLS water-level stations, including early Great Lakes support. | Canadian region plus CHS station from the editor. | No TideWise API key needed. |
| **UK UKHO Tides integration sensor** | UK tides through the separate UKHO Tides Home Assistant integration. | A Home Assistant sensor created by the UKHO Tides integration. | Add the UKHO API key to the UKHO Tides integration, not TideWise. |
| **Home Assistant tide entity** | International beta support through an existing HA tide sensor. | A sensor with high/low events in `predictions`, `tide_predictions`, `events`, or `extremes`. | Put any API key in the integration/template that creates the sensor, not TideWise. |

Common setup rule: **the station/sensor controls the tide chart; the forecast coordinates and beach/surf area control fishing context.** TideWise does not assume your Home Assistant home is the fishing spot.

## Features

- NOAA tide predictions using a configurable station ID
- Early Canada CHS/DFO water-level prediction and forecast support
- UK tide support through a UKHO Tides Home Assistant sensor
- International tide support through a generic Home Assistant tide entity
- Current interpolated tide height
- Water temperature display when available
- Wind display when available, with optional MPH, km/h, knots, or Beaufort display
- Next high and low tide
- 24-hour tide chart
- High/low fallback for NOAA stations without full interval predictions
- Visual editor support
- Visual-editor fishing point picker for the weather/surf/scoring coordinates
- Opt-in Home Assistant theme color support with `theme_mode: auto`
- 50-station NOAA preset picker plus custom NOAA station ID
- Canada region picker with CHS station discovery
- UKHO Tides integration sensor picker for UK tide support
- Generic Home Assistant tide entity picker for international beta support
- Optional fishing bite-window score
- Fishing modes for general, surf, inlet, flounder, trout/redfish, and sheepshead use
- Optional NOAA/NWS public data fetching
- Optional Home Assistant entity overrides for weather, wind, water temperature, surf height, pressure, rain, and rip current risk
- Safety-aware fishing display that can cap the current score without globally flattening future bite windows
- Hidden YAML-only debug panel for troubleshooting fishing inputs, score components, caps, and data sources
- Legacy support for `custom:cherry-grove-tides-card`

## Installation

### Recommended: HACS Custom Repository

[![Open TideWise in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=TheWillMiller&repository=tide-wise&category=plugin)

TideWise is not yet listed in the default/searchable HACS store. Until it is accepted into the default HACS list, install it as a custom HACS repository.

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu in the top right.
3. Choose **Custom repositories**.
4. Add this repository URL:

```text
https://github.com/TheWillMiller/tide-wise
```

5. For category, choose **Dashboard**.

   If your HACS version uses older wording, choose the dashboard/card/frontend/plugin-style option.

6. Install **TideWise**.
7. Refresh Home Assistant.

A hard browser refresh is recommended after installing or updating:

- Windows/Linux: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

Then add the card from your dashboard editor:

1. Edit your dashboard.
2. Add a new card.
3. Search for **TideWise**.
4. Open the visual editor.
5. Choose the tide provider.
6. Select a station, UKHO Tides sensor, or Home Assistant tide entity.
7. Save.

### Manual Install

1. Download or copy `tidewise-card.js`.
2. Place it in your Home Assistant `www` directory.
3. Add it as a dashboard resource:

```yaml
url: /local/tidewise-card.js
type: module
```

4. Refresh Home Assistant and hard-refresh your browser.
5. Add the card to a dashboard.

### Test From GitHub CDN

For quick testing before installing locally, you can add this dashboard resource:

```yaml
url: https://cdn.jsdelivr.net/gh/TheWillMiller/tide-wise@v0.9.7/tidewise-card.js
type: module
```

After changing resources, refresh Home Assistant and hard-refresh the browser tab.

> CDN testing is not the preferred long-term install method. HACS is recommended for normal use.

## Quick Start

```yaml
type: custom:tidewise-card
title: Local Tides
station: "8661070"
units: english
mode: general
auto_sources: true
auto_surf_forecast: true
grid_options:
  rows: full
  columns: 18
```

## Minimal Config

```yaml
type: custom:tidewise-card
title: Local Tides
station: "8661070"
units: english
mode: general
```

## Cherry Grove Example

```yaml
type: custom:tidewise-card
title: Cherry Grove Tides
station: "8661070"
units: english
mode: inlet
auto_sources: true
auto_surf_forecast: true
water_temp_entity: sensor.noaa_surf_water_temperature
wave_height_entity: sensor.noaa_surf_surf_height
rip_current_risk_entity: sensor.noaa_surf_rip_current_risk
wind_speed_entity: sensor.noaa_weather_wind_speed
wind_direction_entity: sensor.noaa_weather_wind_direction
pressure_entity: sensor.noaa_weather_barometric_pressure
grid_options:
  rows: full
  columns: 18
```

## Tide-Only Config

```yaml
type: custom:tidewise-card
title: Local Tides
station: "8661070"
units: english
show_fishing_score: false
grid_options:
  rows: full
  columns: 18
```

## Canada CHS Example

Canada support uses the Canadian Hydrographic Service / DFO IWLS API. The visual editor can load Canadian regions and station lists, so most users should choose a station from the editor instead of writing the object ID by hand.

```yaml
type: custom:tidewise-card
title: Pointe-du-Chene Tides
provider: chs_iwls
ca_region: atlantic
ca_station: "64b6e5ec8027cb190816a0c0"
ca_station_code: "01804"
time_offset_minutes: 0
height_offset: 0
units: metric
mode: general
auto_sources: false
grid_options:
  rows: full
  columns: 18
```

Canadian tide predictions can render the tide chart and high/low times. NOAA/NWS auto sources are US-focused, so Canadian fishing inputs such as weather, wind, surf, water temperature, and pressure should come from Home Assistant entities when available.

CHS prediction timestamps are UTC instants. TideWise converts them to the dashboard device's local time, including its daylight-saving rules. If a station needs a consistent secondary-station correction, set `time_offset_minutes` to move every event earlier or later. Use `height_offset` to adjust every displayed height in the selected display unit.

## UK UKHO Example

Recommended UK support uses the [UKHO Tides Home Assistant integration](https://github.com/ianByrne/HASS-ukho_tides). TideWise alone does not fetch UKHO tides reliably from the browser. Configure your UKHO Admiralty API key and station in that Home Assistant integration first, then point TideWise at the created sensor.

```yaml
type: custom:tidewise-card
title: Portsmouth Tides
provider: ukho_entity
ukho_entity: sensor.portsmouth_tide
units: metric
wind_units: mph
ukho_time_mode: uk_local
time_offset_minutes: 0
height_offset: 0
mode: general
auto_sources: false
auto_surf_forecast: false
grid_options:
  rows: full
  columns: 18
```

UKHO tide heights are provided in metres. TideWise displays them as metres with `units: metric`, or converts them to feet with `units: english`. When the UKHO Tides integration exposes high/low events, TideWise builds a smooth tide curve between those events.

> **UKHO key note:** TideWise does not store or use a UKHO API key. Put the key and station in the UKHO Tides Home Assistant integration, then select that integration's sensor in TideWise.

> **UK time note:** TideWise displays UKHO integration-sensor tide events in UK local time (`Europe/London`), including British Summer Time. If your integration already exposes local clock times, use `ukho_time_mode: as_is`.

For UK cards that use metric tide heights but prefer MPH wind, add:

```yaml
units: metric
wind_units: mph
```

For UK secondary stations that need a consistent correction, use:

```yaml
ukho_time_mode: uk_local
time_offset_minutes: 0
height_offset: 0
```

`time_offset_minutes` moves all UKHO tide events forward or backward in time. Positive values make events later; negative values make events earlier.

`height_offset` adjusts all UKHO tide heights by a fixed amount. It uses the selected display unit: metres with `units: metric`, feet with `units: english`. Use a negative value if TideWise needs to lower all displayed heights.

## International Home Assistant Entity Example

Use this provider when a separate Home Assistant integration or template sensor already exposes tide high/low predictions. This is the first beta path for places such as France, Spain, Australia, the Mediterranean, and the Adriatic.

```yaml
type: custom:tidewise-card
title: Adriatic Tides
provider: generic_entity
tide_entity: sensor.adriatic_tide_predictions
units: metric
tide_time_mode: as_is
time_offset_minutes: 0
height_offset: 0
mode: general
auto_sources: false
auto_surf_forecast: false
grid_options:
  rows: full
  columns: 18
```

The entity should expose an attribute named `predictions`, `tide_predictions`, `events`, or `extremes`. Each row can be an array like `["2026-06-12T06:14:00+02:00", 0.42, "H"]` or an object with time and height fields such as `{ "time": "2026-06-12T06:14:00+02:00", "height": 0.42, "type": "high" }`. Common aliases such as `time_utc`, `time_local`, `height_m`, `heightMeters`, `water_level`, `tide`, and `tide_type` are also accepted.

Tide heights are expected in metres. TideWise displays them as metres with `units: metric`, or converts them to feet with `units: english`.

Use `tide_time_mode: as_is` when the entity already exposes local clock times or timezone-aware ISO strings. Use `tide_time_mode: utc` when timezone-less rows should be treated as UTC. Use `tide_time_mode: time_zone` with `tide_time_zone: Europe/Paris` or `Australia/Sydney` when zoned source times need to display as a specific local tide timezone.

If your source integration does not expose a compatible attribute, use [examples/international-template-sensor.yaml](examples/international-template-sensor.yaml) as the Home Assistant template sensor shape.

## Dashboard Size

TideWise is a dense chart card. In Home Assistant section/grid dashboards, give it enough horizontal space:

```yaml
grid_options:
  rows: full
  columns: 18
```

On narrower dashboards, use:

```yaml
grid_options:
  rows: full
  columns: full
```

## Theme Support

TideWise defaults to its built-in ocean-glass styling:

```yaml
theme_mode: tidewise
```

To make the card follow Home Assistant theme colors more closely, use:

```yaml
theme_mode: auto
```

The visual editor includes a **Theme** dropdown for this setting. Theme mode only changes the card styling; it does not change tide fetching, NOAA/NWS data, or fishing score behavior.

## Visual Editor

TideWise includes a Home Assistant visual editor. When adding the card from the dashboard editor, you can:

- Choose 50 common NOAA tide stations from a dropdown
- Enter a custom NOAA station ID
- Switch to Canada CHS / DFO and choose a region-fed station dropdown
- Switch to UK UKHO Tides integration sensor and choose a UKHO Tides sensor entity
- Switch to Home Assistant tide entity and choose a compatible tide prediction sensor
- Set fishing / beach latitude and longitude
- Fill coordinates from the selected NOAA station
- Pick a US beach/surf forecast state and area for NWS rip-current and surf context
- Select English or metric units
- Select wind units separately from tide height units
- Select fishing mode
- Choose TideWise styling or Home Assistant theme colors
- Enable or disable fishing score
- Enable or disable public NOAA/NWS auto sources
- Enable or disable NWS surf/rip forecast parsing
- Set the recommended dashboard size

The station dropdown is a 50-station starter list, not a complete NOAA station database. If your station is not listed, choose **Custom station ID** and paste the NOAA CO-OPS station ID.

Latitude and longitude are used for fishing-score context such as NWS forecast lookup, surf/rip forecast lookup, and moon/solunar timing. For best results, use coordinates near the beach, pier, inlet, or fishing area you actually care about.

The visual editor includes a **Fishing point picker** that writes directly to those latitude/longitude fields. It uses OpenStreetMap tiles while the visual editor is open so you can drag, zoom, and click/tap the actual beach, pier, inlet, or fishing area. The dashboard card itself does not load map tiles. You can still paste exact coordinates from Google Maps/Apple Maps for the most precise setup.

Map picker controls:

- Drag the map to pan.
- Use `+` and `-` to zoom.
- Click or tap the map to set the fishing / beach point.
- Use **Center on pin** to return the map view to the saved point.

The **Beach / Surf Forecast** controls US NWS surf/rip-current parsing only. It does not change the tide station. A Myrtle Beach tide station can still use a Grand Strand beach area, and a different NOAA tide station can use whatever nearby beach area best matches the place being fished.

## Auto Sources

For NOAA/US cards, TideWise can fetch extra public NOAA/NWS data directly from the browser when `auto_sources` is enabled:

- NOAA CO-OPS water temperature, wind, and air pressure where the selected station supports those products
- NWS hourly forecast weather and wind from the configured fishing / beach latitude and longitude
- NWS Surf Zone Forecast text for surf height, rip current risk, and water temperature where the local forecast office issues an SRF product

Manual Home Assistant entities take priority. If a manual entity is configured, TideWise uses it instead of the auto-fetched value. For example, an explicit `weather_entity` overrides TideWise's NWS point forecast.

Surf Zone Forecasts are text products and vary by NWS office. TideWise parses common formats such as:

- `high rip current risk`
- `surf height 2 to 4 feet`
- `water temperature in the mid 80s`

Some locations may still show unknown surf or rip data. Manual entities or dedicated integrations remain the most reliable override.

Recent rainfall totals are not yet reliably auto-filled. If you configure `rain_today_entity`, use a sensor that represents the beach/fishing area or nearby runoff conditions. A home rain sensor can be misleading when your house is inland or far from the water.

## Fishing Score

The fishing score is advisory only. It is intended to give a quick glance at likely better and worse bite windows.

Depending on available data, TideWise may consider:

- Tide movement
- Tide direction
- Time to next high/low tide
- Current tide height
- Moon/solunar timing
- Time of day
- Weather condition
- Wind speed
- Wind direction
- Water temperature
- Surf/wave height
- Rip current risk
- Pressure
- Pressure trend
- Rainfall/runoff

When optional data is missing, TideWise falls back to the data it has available.

Current safety conditions such as high rip current risk can cap the **Now** score while still allowing the future curve to show improving bite potential. This is why a card may show **Slow now** with a better bite window later in the day.

## Hidden Debug Panel

For troubleshooting, TideWise includes a YAML-only debug panel. It is hidden from normal users and is not exposed in the visual editor.

Enable it manually only when diagnosing a station, data source, or fishing score:

```yaml
debug:
  enabled: true
  panel: true
```

The debug panel is collapsed by default and scrolls internally when expanded. It shows the current/Now score target, future curve mode, source availability, component weights, moon multiplier, safety caps, final current score, display score, and whether the future curve is globally capped.

## Configuration

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `type` | Yes |  | Use `custom:tidewise-card`. The legacy `custom:cherry-grove-tides-card` alias also works. |
| `title` | No | `TideWise` | Card title. |
| `provider` | No | `noaa_coops` | Tide data provider. Use `noaa_coops` for US NOAA CO-OPS, `chs_iwls` for early Canada CHS/DFO support, `ukho_entity` for UKHO Tides integration support, or `generic_entity` for a compatible Home Assistant tide sensor. |
| `station` | Required for NOAA |  | NOAA tides and currents station ID. |
| `tide_entity` | Required for `generic_entity` |  | Home Assistant sensor with high/low tide rows in a `predictions`, `tide_predictions`, `events`, or `extremes` attribute. |
| `tide_time_mode` | No | `as_is` | Generic entity time handling. Use `as_is`, `utc`, or `time_zone`. |
| `tide_time_zone` | No |  | IANA timezone such as `Europe/Paris` or `Australia/Sydney`, used only when `tide_time_mode: time_zone`. |
| `ca_region` | No | `atlantic` | Canada station picker region: `atlantic`, `great_lakes`, `quebec`, `pacific`, or `arctic`. |
| `ca_station` | Required for Canada |  | Canadian CHS/DFO IWLS station object ID or numeric station code. Prefer choosing it from the visual editor. |
| `ca_station_code` | No |  | Optional Canadian CHS display code. |
| `ukho_entity` | Required for `ukho_entity` |  | Home Assistant sensor from the UKHO Tides integration. The sensor must expose a `predictions` attribute. |
| `ukho_time_mode` | No | `uk_local` | UKHO integration-sensor time handling. Use `uk_local` to convert GMT/UTC events to UK local time including BST, or `as_is` when the sensor already exposes local clock times. |
| `time_offset_minutes` | No | `0` | Manual minute offset applied to CHS, UKHO, or generic-entity tide events. Useful for secondary-station timing corrections. |
| `height_offset` | No | `0` | Manual height offset applied to CHS, UKHO, or generic-entity tide heights. Uses the selected display unit: metres with `metric`, feet with `english`. |
| `units` | No | `english` | Display units. Usually `english` or `metric`. Canadian CHS and UKHO data are metric and are converted to feet when `english` is selected. |
| `wind_units` | No | `auto` | Wind display units. Use `auto`, `mph`, `kmh`, `knots`, or `beaufort`. `auto` follows the tide unit choice, so metric cards show km/h unless overridden. |
| `mode` | No | `general` | Fishing score mode: `general`, `surf`, `inlet`, `flounder`, `trout_redfish`, or `sheepshead`. |
| `theme_mode` | No | `tidewise` | Visual style mode. Use `tidewise` for the default ocean-glass look or `auto` to follow Home Assistant theme colors more closely. |
| `show_fishing_score` | No | `true` | Set to `false` for a tide-only card. |
| `auto_sources` | No | `true` | Fetch public NOAA/NWS weather and marine observations directly where available. US-focused; non-US providers should use Home Assistant entities for fishing context. |
| `auto_surf_forecast` | No | `true` | Try to parse NWS Surf Zone Forecast text for surf height, rip current risk, and water temperature. US-focused. |
| `srf_region` | No |  | Optional internal grouping for NWS-listed Surf Zone Forecast offices. Usually set by the visual editor. |
| `nws_office` | No | Auto from NWS point metadata | Optional NWS office code such as `ILM`, `CHS`, or `SGX` for Surf Zone Forecast products. |
| `beach_state` | No |  | Optional beach forecast state used by the visual editor. |
| `beach_area` | No |  | Optional NWS beach/surf area preset used for rip risk and surf context. |
| `surf_zone` | No | Auto from NWS point metadata | Optional NWS surf/beach forecast zone such as `SCZ054`; overrides coordinate-derived zone for SRF parsing. |
| `latitude` | No | Beach/surf area or station preset, then Cherry Grove fallback | Fishing / beach latitude for NWS lookup and moon/solunar scoring. |
| `longitude` | No | Beach/surf area or station preset, then Cherry Grove fallback | Fishing / beach longitude for NWS lookup and moon/solunar scoring. |
| `weather_entity` | No | NWS point forecast, then Home Assistant weather fallback | Optional weather condition override. Leave blank to use the configured fishing / beach point when available. |
| `water_temp_entity` | No |  | Water temperature sensor. Fahrenheit and Celsius are supported. |
| `wave_height_entity` | No |  | Wave/surf height sensor. Feet and meters are supported. |
| `rip_current_risk_entity` | No |  | Rip current risk sensor. |
| `unsafe_to_swim_entity` | No |  | Boolean or text entity for unsafe surf/swim conditions. |
| `wind_speed_entity` | No | Weather attribute fallback | Wind speed sensor. mph, km/h, m/s, and knots are supported. |
| `wind_direction_entity` | No | Weather attribute fallback | Wind bearing in degrees. |
| `pressure_entity` | No | Weather attribute fallback | Barometric pressure. hPa and inHg are supported. |
| `pressure_trend_entity` | No |  | Pressure trend entity. |
| `rain_today_entity` | No |  | Optional rainfall override for the fishing / beach area. Inches and mm are supported; avoid using an inland home rain sensor unless it represents the spot being fished. |
| `debug` | No | disabled | Hidden troubleshooting object. Use `debug: { enabled: true, panel: true }` only when diagnosing score/data issues. Not available in the visual editor. |

## Finding a NOAA Station

Use a NOAA tides and currents station ID near your location. TideWise uses the NOAA CO-OPS data API, so station IDs must support tide predictions.

If your station does not work, try a nearby NOAA station that supports tide predictions.

## Finding a Canadian Station

Set **Tide provider** to **Canada CHS / DFO** in the visual editor, choose a Canadian region, then choose a CHS water-level station from the station dropdown. Canadian Great Lakes stations are under **Great Lakes / Ontario**.

If the station is not listed, find its numeric code in the [official CHS station directory](https://www.tides.gc.ca/en/stations) and enter that code in **Manual CHS station ID or code**. TideWise resolves numeric codes to the internal CHS object ID automatically.

Canada support uses CHS/DFO IWLS water-level predictions where available. Some Great Lakes stations publish water-level forecasts instead, so TideWise falls back from `wlp` predictions to `wlf` forecasts when needed. The Great Lakes picker includes a small official CHS seed list because those stations may not appear in the CHS bulk station API. Selected stations may still need testing because CHS availability can vary by station and forecast window.

NOAA/NWS auto sources are US-focused. For Canadian fishing context, configure Home Assistant entities for weather, wind, pressure, water temperature, surf, rain, or safety/rip-risk data when available.

## Finding a UKHO Station

Required UK setup:

1. Install and configure the [UKHO Tides Home Assistant integration](https://github.com/ianByrne/HASS-ukho_tides).
2. Add your UKHO Admiralty API key and station in that integration.
3. Confirm Home Assistant created a UKHO Tides sensor entity.
4. In TideWise, set **Tide provider** to **UK UKHO Tides integration sensor**.
5. Choose the UKHO Tides sensor from the visual editor, or paste the entity ID into **Manual UKHO entity ID**.

If no UKHO Tides sensor appears in TideWise, the UKHO Tides integration is not installed, not configured, or has not created a sensor yet. TideWise cannot create the UKHO sensor by itself.

TideWise reads the integration sensor's high/low prediction attribute and builds a smooth chart curve from those events. Weather, wind, water temperature, surf, rain, pressure, and fishing safety context should come from Home Assistant entities for UK cards.

TideWise displays UKHO integration-sensor event times in UK local time (`Europe/London`). This handles British Summer Time when the integration exposes GMT/UTC prediction times.

TideWise does not support direct browser calls to the UKHO API. That keeps UKHO API keys out of dashboard YAML/browser config and avoids UKHO/Azure browser CORS limitations.

### UKHO Time And Height Corrections

Default UK setup:

```yaml
ukho_time_mode: uk_local
time_offset_minutes: 0
height_offset: 0
```

Use `ukho_time_mode: uk_local` when the UKHO integration exposes GMT/UTC prediction times. TideWise converts those events to UK local time, including British Summer Time. If the sensor already exposes local clock times and TideWise appears one hour late or early, use `ukho_time_mode: as_is`.

Use `time_offset_minutes` when a secondary station needs a consistent timing correction. Positive values move displayed tide events later and negative values move them earlier.

Use `height_offset` when all displayed heights are consistently high or low. The value is in the selected display unit: metres for `units: metric`, feet for `units: english`.

Example secondary-station correction:

```yaml
provider: ukho_entity
ukho_entity: sensor.cardiff_tide
units: metric
wind_units: mph
ukho_time_mode: uk_local
time_offset_minutes: 0
height_offset: 0.7
```

Use a negative `height_offset` if TideWise needs to lower all displayed heights.

UK troubleshooting quick checks:

- The TideWise provider should be `ukho_entity`, not an API-key/browser mode.
- The UKHO API key belongs in the UKHO Tides integration setup, not in TideWise.
- The TideWise YAML should point to the created sensor, for example `ukho_entity: sensor.london_bridge_tower_pier_tide`.
- If TideWise says the entity is missing, verify the exact entity ID under **Settings -> Devices & services -> Entities**.
- If the sensor exists but TideWise has no tide curve, check whether the sensor exposes a `predictions` attribute from the UKHO Tides integration.
- If UK times are exactly one hour early, leave or set `ukho_time_mode: uk_local`.
- If UK times become one hour late, the integration may already be exposing local clock times; try `ukho_time_mode: as_is`.
- If all UK tide heights are consistently high or low, use `height_offset`.
- If a secondary station needs a consistent timing correction, use `time_offset_minutes`.

## Beach / Surf Forecast Area

For US surf and rip-current context, TideWise can use a beach forecast area instead of relying only on latitude/longitude. The tide station still controls the tide curve, but the beach area controls NWS Surf Zone Forecast scoping for rip risk and surf height.

TideWise includes a guided list of **NWS-listed SRF offices** for areas where the National Weather Service publishes Surf Zone Forecast products. This is not the same as every U.S. coastal county; some coastal offices may handle beach hazards through other products such as Hazardous Weather Outlooks.

The visual editor keeps this simple: choose a **State**, then choose the closest **Area**. Where TideWise has an exact beach/surf-zone preset, that area is used. Otherwise, the area maps to the closest NWS-listed SRF office and TideWise still uses your coordinates for local forecast context.

The first built-in precise beach-area set covers the NWS Wilmington, NC office beaches for the Grand Strand and nearby NC/SC beaches. Broader NWS-listed SRF offices are available for other supported states/regions, and more precise beach-zone presets can be added as confirmed.

Use this section when the rip-risk or surf-height context should follow a beach/county area instead of the tide gauge. This is especially useful when the tide station is inland, across a bay, or many miles from the actual beach.

Example:

```yaml
srf_region: Atlantic/Gulf/Caribbean
beach_state: SC
beach_area: sc-horry
nws_office: ILM
surf_zone: SCZ054
```

## Troubleshooting

If TideWise works for you after troubleshooting, please consider starring the repo or opening a Works For Me / Confirmed Station report. If it breaks, a Beta Install Report with your versions and station ID helps a lot.

### TideWise does not show in the card picker

1. Confirm TideWise is installed in HACS.
2. Hard-refresh the browser.
3. Restart Home Assistant if needed.
4. Check that the card resource exists.
5. Open the browser console and look for TideWise errors.

### HACS shows an old README or old version

HACS may cache repository metadata.

Try:

1. Open HACS.
2. Open TideWise.
3. Open the three-dot menu.
4. Select **Redownload**.
5. Choose the latest version.
6. Hard-refresh your browser.

If HACS still shows an old README, the installed card file may still be current while the HACS display cache is stale.

If HACS shows a short value like `214b6c2` instead of `v0.9.7`, that is a GitHub commit hash. HACS shows commit hashes when a repository has tags but no full GitHub Release yet. Publishing a full GitHub Release makes HACS show the release version instead.

### Card does not show up

1. Confirm TideWise is installed.
2. Confirm the dashboard resource exists.
3. Hard-refresh the browser.
4. Redownload the latest release in HACS.
5. Restart Home Assistant if needed.
6. Check the browser console for `tidewise-card.js` loading errors.

### Visual editor does not show

1. Confirm the latest TideWise JS is loaded.
2. Hard-refresh the browser.
3. Redownload the latest HACS release.
4. Check the browser console for custom element errors.

### Tide data unavailable

1. Verify the selected provider.
2. Verify the station ID, CHS station, UKHO entity ID, or generic tide entity ID.
3. Try a known preset station or sensor.
4. Confirm your browser/Home Assistant can reach the provider data source.
5. Open the browser console and check for network or station errors.

For UK cards, TideWise requires the separate UKHO Tides Home Assistant integration. If the integration sensor is missing or does not expose predictions, TideWise cannot render UK tides.

For international entity cards, TideWise needs the selected Home Assistant sensor to expose high/low tide rows in a supported attribute such as `predictions`, `tide_predictions`, `events`, or `extremes`.

### Fishing score looks limited

This usually means optional weather, wind, water temperature, surf, pressure, rain, or rip current data is unavailable.

The card should still work, but the score may be based on fewer inputs.

For deeper troubleshooting, temporarily enable the hidden debug panel in YAML:

```yaml
debug:
  enabled: true
  panel: true
```

Remove it again after testing.

## Privacy

TideWise does not include telemetry, tracking pixels, external analytics, or phone-home behavior.

When `auto_sources` or `auto_surf_forecast` are enabled, the card fetches the public NOAA/NWS data needed to render the configured dashboard card. The visual editor's map picker loads OpenStreetMap tiles only while the editor is open. Adoption tracking is based only on GitHub-native signals such as stars, issues, release activity, and tester reports.

Maintainer notes for GitHub-native adoption signals are in [PROJECT_INSIGHTS.md](PROJECT_INSIGHTS.md).

## Beta Tester Checklist

The full checklist is also available in [BETA_TESTER_CHECKLIST.md](BETA_TESTER_CHECKLIST.md).

If you are testing TideWise, please report:

- Home Assistant version
- HACS version
- TideWise version
- Browser/device
- Provider and station/entity ID used
- Whether you installed from HACS custom repository, manual resource, or CDN
- Screenshot of any layout issue
- Browser console errors, if any
- Whether the issue happens after a hard refresh

Basic test steps:

1. Install TideWise from HACS custom repository.
2. Add the card from the dashboard card picker.
3. Open the visual editor.
4. Select a preset station.
5. Save.
6. Refresh the dashboard.
7. Confirm the card still loads.
8. Change fishing mode.
9. Save and refresh again.
10. Test on desktop and phone.
11. Test with missing optional entities.
12. Screenshot or copy any errors.

## Safety

TideWise is informational. It is not a marine safety, navigation, emergency, or surf safety tool.

Always check official local forecasts, marine advisories, beach warnings, and on-site conditions before entering the water or boating.

Do not use TideWise for navigation, hazardous surf decisions, boating safety, swimming safety, or life-safety decisions.

## License

TideWise is licensed under the MIT License.

## Development

The distributable card is:

```text
tidewise-card.js
```

For HACS default repository submission, TideWise is a dashboard/custom card. HACS validation/submission uses the `plugin` category internally for dashboard plugins.

Run the local syntax check before opening a pull request:

```bash
npm run check
```

## Roadmap

Planned areas for future releases:

- Map-based fishing/forecast coordinate picker
- More station presets and station discovery improvements
- Direct official tide-provider research for non-NOAA regions
- Further fishing outlook calibration based on tester feedback
- Additional mobile layout polish

### International Provider Notes

TideWise uses explicit provider adapters instead of stretching NOAA-specific code paths. NOAA CO-OPS remains the default provider, Canada CHS/DFO is available for early testing, recommended UK support reads a UKHO Tides Home Assistant integration sensor, and international beta support reads compatible Home Assistant tide sensors while direct official providers are researched.

See [INTERNATIONAL_PROVIDER_ROADMAP.md](INTERNATIONAL_PROVIDER_ROADMAP.md) for the current France, Spain, Australia, Mediterranean, and Adriatic provider plan.

Likely future shape:

```yaml
provider: noaa_coops
station: "8661070"
```

Other providers should get their own station picker and validation rules. For example, Canadian or UK support may need separate station IDs, units, datum notes, and availability checks.

## Contributing

Bug reports, confirmed-station reports, and focused feature requests are welcome through GitHub Issues.

For code changes:

1. Keep TideWise as a dashboard/custom card, not an integration.
2. Preserve existing HACS custom repository install behavior.
3. Keep changes scoped and update `CHANGELOG.md` when behavior changes.
4. Run `npm run check`.
5. Include screenshots for visible UI changes when practical.
