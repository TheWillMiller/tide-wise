# Changelog

## 0.9.7

### Added

- Added CHS visual-editor controls for manual tide time and height corrections.
- Added direct numeric CHS station-code support and a link to the official CHS station directory.
- Added regression coverage for CHS time offsets, height offsets, unit conversion, daylight-saving conversion, invalid rows, and station-code parsing.

### Fixed

- Applied `time_offset_minutes` and `height_offset` to Canadian CHS/DFO predictions instead of limiting those corrections to entity-backed providers.
- Kept CHS API timestamps as UTC instants until the optional time correction is applied, preserving the dashboard device's daylight-saving conversion.

### Changed

- Clarified Canadian timestamp behavior and secondary-station corrections in the README and visual editor.

## 0.9.6

### Added

- Added an international beta provider (`provider: generic_entity`) that reads high/low tide predictions from compatible Home Assistant sensor attributes.
- Added visual editor controls for generic tide entities, entity time handling, named tide timezones, and manual time/height offsets.
- Added international entity examples, including a Home Assistant template sensor shape for users adapting regional tide sources.
- Added an international provider roadmap covering Australia, France, Spain, the Mediterranean, and the Adriatic.
- Added regression tests for generic tide entity parsing, European day-first dates, array/object prediction rows, unit conversion, UTC handling, and invalid date rejection.

### Changed

- Switched the repository license to MIT so GitHub/HACS can identify the license with standard SPDX metadata.
- Updated README, examples, and beta guidance for France, Spain, Australia, the Mediterranean, and Adriatic users who can provide tide predictions through a Home Assistant sensor.
- Updated the frontend check workflow to run the new generic entity regression tests.

## 0.9.5

### Fixed

- Fixed moon phase labels by anchoring lunar age to a known new moon instead of the J2000 epoch.
- Corrected waning/waxing phase labels that could appear several days off.

### Changed

- Added a plain Buy Me a Coffee support link in README/info documentation.
- Kept support information docs-only; no telemetry, tracking, popup, external script, or in-card donation UI was added.

## 0.9.4

### Fixed

- Fixed NOAA CO-OPS air pressure normalization so millibar/hPa values are not converted like inches of mercury when the card uses English tide units.
- Corrected pressure scoring and debug output that could show impossible values such as `34585 hPa`.

### Changed

- Clarified the debug label for the smoothed display score.

## 0.9.3

### Added

- Added UKHO integration-sensor time handling mode (`uk_local` or `as_is`) in YAML and the visual editor.
- Added manual UKHO time offsets in minutes for secondary-station timing corrections.
- Added manual UKHO height offsets for stations where highs/lows are consistently high or low.

### Fixed

- Made UKHO/BST workflows clearer for users whose UKHO integration sensor exposes GMT/UTC events versus already-local clock times.

### Changed

- Updated README and visual editor guidance for UKHO secondary-station corrections.

## 0.9.2

### Added

- Added a `wind_units` option and visual editor selector so wind can be shown as auto, MPH, km/h, knots, or Beaufort independently from tide height units.

### Fixed

- Fixed UKHO Tides integration sensor event times so TideWise displays UK tide events in UK local time, including British Summer Time.

### Changed

- Clarified UK setup docs for UKHO integration sensors, time handling, and mixed tide/wind units.

## 0.9.1

### Added

- Replaced the lightweight fishing point pad with an OpenStreetMap tile picker in the visual editor.
- Added map panning, zoom in/out, click/tap-to-set, center-on-pin, and OpenStreetMap attribution.

### Changed

- Clarified that map tiles load only while the visual editor is open.
- No tide-fetching, scoring model, provider, or dashboard rendering behavior changed.

## 0.9.0

### Added

- Added a visual-editor Fishing point picker for the latitude/longitude used by NWS weather lookup, surf context, moon timing, and fishing-score context.
- Added picker zoom controls and keyboard arrow-key nudging for the fishing point.

### Changed

- Updated README setup guidance to explain that the picker is a lightweight coordinate helper and that exact coordinates can still be pasted from Maps when precision matters.
- No tide-fetching or scoring model behavior changed.

## 0.8.2

### Changed

- TideWise now prefers the configured fishing/beach point's NWS hourly forecast before falling back to a generic Home Assistant weather entity.
- Removed the visual editor's normal "Use HA home location" setup path so users are guided toward the tide station, beach area, or actual fishing spot instead.
- Renamed the visual editor coordinate fields to "Fishing / beach latitude" and "Fishing / beach longitude".
- Clarified that recent rainfall should come from a sensor near the fishing/beach area, not an inland home rain sensor unless that truly represents the spot.

### Fixed

- Debug source labels now identify NWS hourly weather/wind more clearly when TideWise is using the configured fishing/beach point.

## 0.8.1

### Fixed

- Fixed UKHO integration-sensor preview timing so TideWise waits for Home Assistant state data before reporting that a UKHO Tides entity is missing.
- Legacy `provider: ukho` configs now fall back to the supported UKHO integration-sensor provider path.

### Changed

- Removed the experimental direct-browser UKHO API provider, UKHO station presets, and UKHO API key fields from the visual editor and current documentation.
- UK support now clearly requires the separate UKHO Tides Home Assistant integration (`provider: ukho_entity`), keeping UKHO API keys in Home Assistant instead of dashboard YAML/browser config.
- No NOAA, Canada, chart, or fishing score behavior changed.

## 0.8.0

### Added

- Added a recommended UKHO Tides integration provider (`provider: ukho_entity`) that reads Home Assistant sensor data from the UKHO Tides integration instead of calling UKHO directly from the browser.
- Added a visual editor picker for UKHO Tides sensor entities that expose prediction attributes.
- Added conversion of UKHO high/low sensor predictions into TideWise's synthetic tide curve.

### Changed

- Updated UK setup docs to recommend the Home Assistant integration path so UKHO API keys stay in Home Assistant and avoid browser CORS issues.
- Direct UKHO API mode was still present for testing only. It was removed in v0.8.1 after browser CORS/key-storage limitations were confirmed.

### Known Issues

- UKHO entity mode depends on the separate UKHO Tides Home Assistant integration being installed and configured.
- UKHO entity mode builds the chart from high/low events, so the curve is a smooth approximation between events.

## 0.7.2

### Changed

- Changed experimental UKHO browser requests to pass the subscription key as an Azure APIM query parameter instead of a custom request header, avoiding browser preflight where possible.
- Improved UKHO browser-blocked error messaging so `Failed to fetch` points users toward CORS/backend limitations instead of looking like a bad station.

### Known Issues

- UKHO support remains experimental. If UKHO does not return browser-readable CORS responses for a user's subscription, a future Home Assistant/backend helper will be required.
- UKHO API keys are stored in dashboard configuration and are visible to browsers/users that can inspect the card.

## 0.7.1

### Fixed

- Fixed experimental UKHO Discovery support so TideWise loads UKHO high/low tide events first.
- Made UKHO interval heights optional; if `TidalHeights` is unavailable, TideWise now builds the chart curve from `TidalEvents`.

### Known Issues

- UKHO support is still experimental and may still fail if the UKHO API blocks browser-side requests, CORS, or a user's subscription tier.
- UKHO API keys are stored in dashboard configuration and are visible to browsers/users that can inspect the card.

## 0.7.0

### Added

- Added experimental UK UKHO Admiralty tide provider support.
- Added UKHO station presets and custom UKHO station ID support.
- Added a visual editor UKHO API key field shown only when the UK provider is selected.
- Added README setup notes and YAML example for UKHO cards.

### Changed

- UKHO cards require each user to provide their own UKHO API key.
- UKHO tide heights are treated as metric source data and converted to feet when English units are selected.
- NOAA/NWS auto sources remain US-focused; UK fishing context should come from Home Assistant entities.

### Known Issues

- UKHO support is experimental and depends on the user's UKHO API access and browser-side API availability.
- The UKHO API key is stored in dashboard configuration and is visible to browsers/users that can inspect the card.

## 0.6.5

### Changed

- Simplified the Beach / Surf Forecast visual editor to a two-step State and Area picker.
- Hid NWS SRF office and surf-zone plumbing from the visual editor while preserving YAML/manual support.
- Area choices now combine precise beach-zone presets where available with broader NWS-listed SRF offices for the selected state.

## 0.6.4

### Added

- Added an NWS-listed SRF office catalog for Atlantic/Gulf/Caribbean, Great Lakes, West Coast, and Pacific Surf Zone Forecast offices.
- Added a guided NWS SRF region/office selector in the visual editor.

### Changed

- Beach/surf forecast setup now distinguishes broad NWS SRF office selection from precise beach/surf-zone selection.
- Documentation now labels these as NWS-listed SRF offices rather than claiming every coastal county is covered.

## 0.6.3

### Added

- Added first-pass NWS beach/surf forecast area selectors for the NWS Wilmington, NC office coverage area.
- Added `beach_state`, `beach_area`, and `surf_zone` config support so SRF rip-risk parsing can be scoped to a selected beach/forecast zone instead of only coordinate-derived metadata.
- Added debug source rows showing the selected NWS beach area and SRF office/zone.

### Changed

- Selecting a built-in beach area now sets the NWS office, surf zone, and forecast coordinates for surf/rip-risk context while leaving tide station selection separate.

## 0.6.2

### Fixed

- Fixed Canadian Great Lakes station discovery by accepting CHS/DFO `wlf` water-level forecast series when `wlp` tide prediction series is not advertised.
- Added Canada provider fallback from `wlp` to `wlf` so manual Great Lakes station IDs such as Belle River can load forecast curves when CHS does not expose prediction curves.
- Added a Great Lakes CHS seed list so Ontario/Great Lakes stations still appear when the CHS bulk station API omits them.

## 0.6.1

### Added

- Added early Canada CHS/DFO tide provider support with Canadian region and station pickers.
- Added a Canada CHS example configuration.

### Fixed

- Scoped NWS Surf Zone Forecast rip-risk parsing to the matching NWS forecast zone when available.
- Recognized active `Rest of Today` surf forecast sections so expired or future rip-risk wording is less likely to cap the current score incorrectly.
- Avoided falling back to whole-product SRF risk text when timed rip-risk periods exist but none apply to the current time.
- Added a Canadian **Great Lakes / Ontario** station picker region for CHS stations such as Belle River.

### Changed

- Improved narrow/mobile card layout so header badges, fishing reason text, safety warnings, and tide pills wrap more cleanly.
- Added README notes for future international tide-provider support and UK provider research.
- Filtered the Canadian station picker to operating CHS stations that advertise water-level predictions.

## 0.5.1

### Fixed

- Fixed the visual editor repeatedly re-rendering from Home Assistant state updates, which could cause mobile station dropdowns to close immediately on iOS Safari/Chrome.

## 0.5.0

### Added

- Added a hidden YAML-only TideWise debug panel for troubleshooting fishing score inputs, component weights, caps, and data sources.
- Added collapsed-by-default debug presentation with internal scrolling.
- Added a subtle high rip risk safety warning badge when active.
- Added first-pass timed NWS Surf Zone Forecast rip-risk period parsing when the forecast text includes usable timing.

### Fixed

- Fixed fishing chart coloring so current safety caps do not globally flatten the full future bite curve.
- Clarified debug score terminology by separating component sum, pre-cap score, moon multiplier, score after moon, active cap, final current score, and display score.
- Clarified debug cap scope for current/near-term safety caps versus future bite potential.

### Changed

- Shortened the public fishing reason line and made future bite windows clearer.
- Updated release references to `v0.5.0`.

## 0.4.9

### Added

- Added opt-in Home Assistant theme color support with `theme_mode: auto`.
- Added a visual editor theme selector.

### Changed

- Kept the existing TideWise ocean-glass styling as the default `theme_mode: tidewise`.
- Updated chart drawing to read theme-aware CSS colors when theme mode is enabled.
- Updated release references to `v0.4.9`.

## 0.4.8

### Added

- Added frontend syntax-check GitHub Actions workflow.
- Added feature request issue template.
- Added HACS default submission prep notes.
- Added README roadmap and contribution guidance.

### Fixed

- Switched README icon and screenshots to absolute raw GitHub URLs so HACS can render them from the release details view.
- Added a PNG icon fallback for HACS README rendering.

### Changed

- Updated issue template placeholders to the current release.
- Expanded package keywords for HACS/Home Assistant discoverability.
- Updated release references to `v0.4.8`.

## 0.4.7

### Added

- Added a compact wind chip to the current tide row when wind data is available.

### Fixed

- Stabilized fishing outlook labels with a deadband so tiny score changes do not constantly flip between nearby bands.
- Smoothed chart score colors with a small rolling average.
- Fixed fishing/forecast coordinate priority so configured coordinates are used before the Home Assistant home fallback.

### Changed

- Updated release references to `v0.4.7`.

## 0.4.6

### Added

- Added a compact water temperature chip to the tide/fishing header when water temperature data is available.
- Added a visual editor button to fill fishing/forecast coordinates from the NOAA station location.

### Changed

- Widened the visual editor title field and improved long-title wrapping on the card.
- Clarified that latitude/longitude are fishing/forecast coordinates, not necessarily the Home Assistant home location.
- Updated release references to `v0.4.6`.

## 0.4.5

### Changed

- Expanded the visual editor preset station dropdown from 15 stations to 50 verified NOAA tide prediction stations.
- Added a high/low tide fallback for NOAA stations that do not return 6-minute interval predictions.
- Updated release references to `v0.4.5`.

## 0.4.4

### Added

- Added a TideWise wave icon for the README/HACS details view.

### Changed

- Clarified the current release candidate near the top of the README.
- Added troubleshooting guidance for HACS commit-hash version labels before a full GitHub Release is published.
- Bumped release references to `v0.4.4`.

## 0.4.3

### Added

- Added HACS validation workflow using `hacs/action` with category `plugin`.
- Added Beta Install Report and Works For Me / Confirmed Station issue templates.
- Added visible beta feedback CTA asking users to star the repo or open a quick report.
- Added privacy/no-telemetry language.
- Added project insights/adoption tracking notes.
- Added standalone beta tester checklist.

### Changed

- Updated `hacs.json` metadata with `country: US`.
- Updated README install, troubleshooting, and HACS cache guidance.
- Bumped release references to `v0.4.3`.

### Known Issues

- HACS may cache README metadata after updates; redownload the latest release and hard-refresh if old text appears.
- Recent rainfall totals still require a local sensor or Home Assistant weather integration.

## 0.4.2

- Matched NWS Surf Zone Forecast fetching more closely to NOAA IT ALL by trying the forecast.weather.gov SRF text product first.
- Improved rip current parsing for dangerous rip current wording.
- Improved surf height range parsing.
- Improved water temperature parsing for lower/mid/upper temperature bands.

## 0.4.1

- Updated HACS custom repository instructions to use the Dashboard category.

## 0.4.0

- Added NWS Surf Zone Forecast auto parsing for rip current risk, surf height, and water temperature where available.
- Added `auto_surf_forecast` and optional `nws_office` configuration.
- Improved water temperature fallback priority across manual entities, NOAA CO-OPS observations, and NWS surf forecasts.

## 0.3.0

- Added `auto_sources` for direct NOAA/NWS fallback data.
- Added NOAA CO-OPS latest water temperature, wind, and air pressure fallbacks where supported by the selected station.
- Added NWS hourly forecast weather and wind fallbacks from latitude/longitude.
- Added visual editor control for enabling or disabling NOAA/NWS auto sources.

## 0.2.1

- Fixed visual editor station preset title updates after the first station selection.

## 0.2.0

- Added a Home Assistant visual editor for TideWise card configuration.
- Added common NOAA tide station presets with custom station ID support.
- Added editor controls for title, units, fishing mode, fishing score visibility, latitude, longitude, and dashboard sizing.
- Added a Home Assistant home location helper for latitude/longitude.

## 0.1.2

- Added recommended Home Assistant grid sizing to README and examples.

## 0.1.1

- Documented HACS custom repository installation.
- Updated stable CDN install examples to `v0.1.1`.

## 0.1.0

- Initial TideWise public release scaffold.
- Renamed the public card type to `custom:tidewise-card`.
- Added legacy support for `custom:cherry-grove-tides-card`.
- Added optional `show_fishing_score` tide-only mode.
- Added HACS metadata, README, and example dashboard configs.
