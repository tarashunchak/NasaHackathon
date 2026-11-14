# Lunar site check

    npm install
    npm run dev

## Data flow
- `public/data/sites.json`: site list, loaded at runtime. Every entry carries its source. Add sites here.
- `public/data/horizons/<site-id>.json`: optional terrain horizon mask. None are shipped.
  Generate with `scripts/make_horizon.py` from a LOLA DEM. Without a mask the app uses a flat horizon and says so.
- `src/sky.ts`: Sun and Earth vectors from astronomy-engine, rotated into the Moon body-fixed frame
  with the IAU rotation model. Topocentric elevation/azimuth, parallax and Sun limb included.
- `scripts/horizons_check.py`: pulls JPL Horizons values for the same site and time, to validate the app.

## Layout
`src/components/{layout,controls,views,stats,scenario}`: one component per file, styles in a `styles` object in the same file. `src/pages/Planner.tsx` composes them. `src/lib/moon3d.ts`: 3D helpers and texture config.

## Not done / not verified
- No Artemis III candidate-region coordinates are included: no authoritative source was checked.
  Add them to sites.json from the IAU Gazetteer or NASA material, with the source.
- Nothing here was built or run when written. Run `npm run build` and the validation script first.
