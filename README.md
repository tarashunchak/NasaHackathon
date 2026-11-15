# Lunar site check

    npm install
    npm run dev

## Data flow
- `public/data/sites.json`: site list, loaded at runtime. Every entry carries its source. Add sites here.
- `public/data/horizons/<site-id>.json`: optional terrain horizon mask. None are shipped.
  Install generator dependencies with `python3 -m pip install -r requirements-terrain.txt`, then generate from a LOLA DEM with `scripts/make_horizon.py`. It rejects no-data or incomplete coverage instead of silently underestimating terrain. Without a mask the app uses a flat 0-degree horizon and says so.
- `src/sky.ts`: Sun and Earth vectors from astronomy-engine, rotated into the Moon body-fixed frame
  with the IAU rotation model. Topocentric elevation/azimuth, parallax and Sun limb included.
- `scripts/horizons_check.py`: pulls JPL Horizons azimuth/elevation values for a site and UTC dates.

## Layout
`src/components/{layout,controls,views,stats,scenario}`: one component per file, styles in a `styles` object in the same file. `src/pages/Planner.tsx` composes them. `src/lib/moon3d.ts`: 3D helpers and texture config.

## Validation and limits
- `npm run build` passes.
- Manual spot checks compared `src/sky.ts` with JPL Horizons at Apollo 11 (0.67416, 23.47314) and Chandrayaan-3 (-69.373, 32.319) for 2027-01-10, 11, and 12 UTC. The largest observed absolute azimuth/elevation difference was about 0.005 degrees. This is a limited spot check, not a full ephemeris validation; the Horizons script prints values but does not assert a tolerance automatically.
- No LOLA horizon masks are bundled. The mask generator has not yet been run against a supplied, verified DEM. Sites without a mask use a flat horizon; custom profiles may be uploaded as JSON.
- Mission pass/fail values are screening thresholds based on sunlight duration and Earth outages. They are not a detailed spacecraft power, thermal, or communications-link budget. Operational window edges use hourly samples.
- No Artemis III candidate-region coordinates are included: no authoritative source was checked.
  Add them to sites.json from the IAU Gazetteer or NASA material, with the source.
