# International Provider Roadmap

Status date: 2026-06-12

TideWise is a Home Assistant Lovelace card, so direct provider support depends on browser-readable APIs, CORS behavior, licensing, attribution rules, and whether API keys can stay out of dashboard YAML. The safest international path is to support Home Assistant tide sensors first, then add direct official providers only where the data source is suitable for a browser card.

## Current Implementation

TideWise now supports:

- `noaa_coops`: direct NOAA CO-OPS tide predictions for US stations.
- `chs_iwls`: direct CHS/DFO IWLS water-level prediction/forecast support for Canada where available.
- `ukho_entity`: UK support through a separate Home Assistant UKHO Tides integration sensor.
- `generic_entity`: international beta support through a compatible Home Assistant tide sensor.

The `generic_entity` provider is the recommended first beta path for France, Spain, Australia, the Mediterranean, and the Adriatic. It expects a Home Assistant sensor with high/low tide rows in `predictions`, `tide_predictions`, `events`, or `extremes`.

## Provider Strategy

1. Keep API keys and paid data credentials inside Home Assistant integrations or user-created sensors, not in TideWise dashboard YAML.
2. Prefer official national hydrographic sources when they offer suitable API access and licensing.
3. Use direct browser fetches only when the API is public, stable, CORS-compatible, and safe for client-side use.
4. Keep provider-specific station IDs, units, datum notes, and timezone handling explicit.
5. Treat currents separately from tide height/tide extremes; currents often require different datasets and licensing.

## Region Plan

| Region | Near-term TideWise path | Direct-provider feasibility | Main blockers |
| --- | --- | --- | --- |
| Australia | `generic_entity` via a Home Assistant sensor/template using local tide data | Medium | BoM/AHO product access, licensing, and machine-readable API terms |
| France | `generic_entity` via SHOM-backed HA sensor/template if the user has access | Medium | SHOM tide prediction services require authenticated subscription access |
| Spain | `generic_entity` via local integration/template while Puertos del Estado access is validated | Medium | API discovery, licensing, CORS, and prediction data shape |
| Mediterranean | `generic_entity` first, plus model/observation validation where possible | Medium | Fragmented national sources; small astronomical tide range means surge/local effects matter |
| Adriatic | `generic_entity` first, with Italy/Croatia station validation | Medium-low | Multi-country coverage, local seiche/surge effects, and fragmented official APIs |

## Candidate Sources To Validate

- France SHOM tide prediction services: https://services.data.shom.fr/support/en/services/spm
- Spain Puertos del Estado oceanography services: https://www.puertos.es/servicios/oceanografia
- Australia Bureau of Meteorology tides: https://www.bom.gov.au/oceanography/projects/ntc/ntc.shtml
- Australian Hydrographic Office AusTides: https://www.hydro.gov.au/prodserv/publications/ausTides/tides.htm
- Copernicus Marine data products and toolbox: https://data.marine.copernicus.eu/products
- FES global tide model: https://www.aviso.altimetry.fr/en/data/products/auxiliary-products/global-tide-fes.html
- EMODnet Physics sea-level/tide-gauge context: https://emodnet.ec.europa.eu/en/physics
- ISPRA sea monitoring network for Italy: https://www.isprambiente.gov.it/en/archive/news-and-other-events/ispra-news/2023/06/the-new-web-site-of-the-ispra-networks-for-monitoring-the-physical-state-of-the-sea-is-online

## Implementation Timeline

### Phase 1: International Entity Beta

Status: implemented.

- Add `generic_entity` provider.
- Add visual editor controls for entity selection, timezone handling, and offsets.
- Add example YAML and template sensor shape.
- Add parser regression tests.

### Phase 2: Provider Discovery And Validation

Target: 2-4 weeks.

- Collect beta reports for France, Spain, Australia, Mediterranean, and Adriatic sensors.
- Build a compatibility matrix of sensor attribute shapes and time formats.
- Validate official source licensing and whether direct TideWise browser fetches are permitted.
- Confirm attribution requirements and whether data can be cached or transformed.

### Phase 3: First Direct International Provider

Target: 4-8 weeks after source validation.

- Choose the least risky direct source, likely Australia or Spain if public access proves browser-safe.
- Add provider-specific station metadata, station picker, config fields, errors, examples, and tests.
- Keep `generic_entity` as fallback for unsupported stations and paid/authenticated data.

### Phase 4: Mediterranean And Adriatic Expansion

Target: 8-12 weeks after source validation.

- Decide whether regional coverage should use official national providers, a Home Assistant helper integration, or a documented external tide sensor workflow.
- Add confidence/limitations notes for locations where tide range is small and non-tidal water-level effects are significant.
- Reassess whether currents belong in TideWise or should remain separate Home Assistant entities.

## Acceptance Criteria For A Direct Provider

A direct provider is ready only when all of the following are true:

- Tide extremes and usable chart points are available for at least the next 24 hours.
- Units and datum are documented.
- Timezone handling is verified across daylight-saving transitions where relevant.
- Browser access works without unsafe API-key exposure.
- License and attribution requirements are compatible with TideWise.
- At least one representative station has a regression test or repeatable fixture.
