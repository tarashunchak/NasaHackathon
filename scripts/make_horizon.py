"""Build a horizon mask for one site from a LOLA polar DEM (GeoTIFF).

    pip install numpy rasterio pyproj
    python scripts/make_horizon.py LDEM_80S_20MPP_ADJ.TIF --id shackleton-rim --lat -89.9 --lon 0 \
        --radius-km 100 --mast 2 --out public/data/horizons/shackleton-rim.json

Get the DEM from the PDS / challenge Resources tab. Check the raster's elevation units and
scale factor (use --scale if values are not metres). Not tested against real data yet:
validate against a known site (e.g. compare with LRO illumination products) before trusting it.
"""
import argparse, json
import numpy as np, rasterio
from pyproj import CRS, Transformer

R = 1737400.0
ap = argparse.ArgumentParser()
ap.add_argument("dem"); ap.add_argument("--id", required=True)
ap.add_argument("--lat", type=float, required=True); ap.add_argument("--lon", type=float, required=True)
ap.add_argument("--radius-km", type=float, default=100); ap.add_argument("--mast", type=float, default=2.0)
ap.add_argument("--scale", type=float, default=1.0); ap.add_argument("--step-deg", type=float, default=1.0)
ap.add_argument("--out", required=True)
a = ap.parse_args()

with rasterio.open(a.dem) as src:
    if src.crs is None or not src.crs.is_projected:
        raise ValueError("DEM must use a projected lunar CRS with linear units")
    if not np.isfinite(a.radius_km) or a.radius_km <= 0:
        raise ValueError("--radius-km must be a positive number")
    azimuth_count = 360 / a.step_deg if np.isfinite(a.step_deg) and a.step_deg > 0 else 0
    if azimuth_count < 12 or not np.isclose(azimuth_count, round(azimuth_count), rtol=0, atol=1e-8):
        raise ValueError("--step-deg must divide 360 evenly and produce at least 12 azimuth samples")
    if not np.isfinite(a.scale) or a.scale == 0:
        raise ValueError("--scale must be a finite, non-zero number")

    geo = CRS.from_proj4(f"+proj=longlat +R={R} +no_defs")
    tf = Transformer.from_crs(geo, src.crs, always_xy=True)
    dem = src.read(1, masked=True).astype("float64").filled(np.nan) * a.scale
    inv = ~src.transform
    pixel_x = np.hypot(src.transform.a, src.transform.d)
    pixel_y = np.hypot(src.transform.b, src.transform.e)
    if pixel_x <= 0 or pixel_y <= 0:
        raise ValueError("DEM has an invalid pixel transform")
    axis_info = src.crs.axis_info
    unit_to_m = axis_info[0].unit_conversion_factor if axis_info else None
    if unit_to_m is None:
        raise ValueError("Could not determine projected CRS units")
    res = np.sqrt(pixel_x * pixel_y) * unit_to_m
    if not np.isfinite(res) or res <= 0:
        raise ValueError("Could not determine DEM pixel size in metres")

def elev(lat, lon):
    x, y = tf.transform(lon, lat)
    c, r = inv * (x, y)
    ci, ri = np.round(c).astype(int), np.round(r).astype(int)
    ok = (ci >= 0) & (ci < dem.shape[1]) & (ri >= 0) & (ri < dem.shape[0])
    z = np.full(np.shape(lat), np.nan)
    z[ok] = dem[ri[ok], ci[ok]]
    return z

site_ground = float(elev(np.array([a.lat]), np.array([a.lon]))[0])
if not np.isfinite(site_ground):
    raise ValueError("The DEM has no valid elevation at the requested site")
z0 = site_ground + a.mast
d = np.arange(res, a.radius_km * 1000, res)
th = d / R
la0, lo0 = np.radians(a.lat), np.radians(a.lon)
vals = []
for az in np.arange(0, 360, a.step_deg):
    b = np.radians(az)
    la = np.arcsin(np.sin(la0) * np.cos(th) + np.cos(la0) * np.sin(th) * np.cos(b))
    lo = lo0 + np.arctan2(np.sin(b) * np.sin(th) * np.cos(la0), np.cos(th) - np.sin(la0) * np.sin(la))
    z = elev(np.degrees(la), np.degrees(lo))
    if not np.isfinite(z).all():
        raise ValueError(f"DEM has nodata or incomplete coverage within {a.radius_km:g} km at azimuth {az:g} deg; use a larger mosaic or reduce --radius-km")
    ang = np.degrees(np.arctan2((R + z) * np.cos(th) - (R + z0), (R + z) * np.sin(th)))
    vals.append(round(float(np.max(ang)), 3))

with open(a.out, "w", encoding="utf-8") as output:
    json.dump({"id": a.id, "lat": a.lat, "lon": a.lon, "radiusKm": a.radius_km, "mastM": a.mast,
               "resolutionM": round(float(res), 3), "stepDeg": a.step_deg, "source": a.dem, "values": vals}, output)
print("wrote", a.out, len(vals), "azimuths")
