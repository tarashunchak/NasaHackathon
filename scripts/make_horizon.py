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
    geo = CRS.from_proj4(f"+proj=longlat +R={R} +no_defs")
    tf = Transformer.from_crs(geo, src.crs, always_xy=True)
    dem = src.read(1).astype("float64") * a.scale
    inv = ~src.transform
    res = abs(src.transform.a)

def elev(lat, lon):
    x, y = tf.transform(lon, lat)
    c, r = inv * (x, y)
    ci, ri = np.round(c).astype(int), np.round(r).astype(int)
    ok = (ci >= 0) & (ci < dem.shape[1]) & (ri >= 0) & (ri < dem.shape[0])
    z = np.full(np.shape(lat), np.nan)
    z[ok] = dem[ri[ok], ci[ok]]
    return z

z0 = float(elev(np.array([a.lat]), np.array([a.lon]))[0]) + a.mast
d = np.arange(res, a.radius_km * 1000, res)
th = d / R
la0, lo0 = np.radians(a.lat), np.radians(a.lon)
vals = []
for az in np.arange(0, 360, a.step_deg):
    b = np.radians(az)
    la = np.arcsin(np.sin(la0) * np.cos(th) + np.cos(la0) * np.sin(th) * np.cos(b))
    lo = lo0 + np.arctan2(np.sin(b) * np.sin(th) * np.cos(la0), np.cos(th) - np.sin(la0) * np.sin(la))
    z = elev(np.degrees(la), np.degrees(lo))
    ang = np.degrees(np.arctan2((R + z) * np.cos(th) - (R + z0), (R + z) * np.sin(th)))
    vals.append(round(float(np.nanmax(ang)), 3))

json.dump({"id": a.id, "lat": a.lat, "lon": a.lon, "radiusKm": a.radius_km, "mastM": a.mast,
           "source": a.dem, "values": vals}, open(a.out, "w"))
print("wrote", a.out, len(vals), "azimuths")
