"""Print JPL Horizons Sun/Earth azimuth+elevation for a site, to compare with the app.

    python scripts/horizons_check.py --lat -69.373 --lon 32.319 --start 2027-01-10 --stop 2027-01-12

Compare with the app by setting the same site and start date (UTC) and reading the table at
slider +0 h, +24 h, etc. Differences of more than ~0.1 deg mean a bug or a frame mismatch.
Not run yet (no network access when this was written).
"""
import argparse, json, re, urllib.parse, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("--lat", type=float, required=True); ap.add_argument("--lon", type=float, required=True)
ap.add_argument("--start", required=True); ap.add_argument("--stop", required=True)
a = ap.parse_args()

for name, cmd in (("Sun", "10"), ("Earth", "399")):
    q = {"format": "json", "COMMAND": f"'{cmd}'", "CENTER": "'coord@301'", "COORD_TYPE": "'GEODETIC'",
         "SITE_COORD": f"'{a.lon},{a.lat},0'", "START_TIME": f"'{a.start}'", "STOP_TIME": f"'{a.stop}'",
         "STEP_SIZE": "'1 d'", "QUANTITIES": "'4'", "ANG_FORMAT": "'DEG'", "CSV_FORMAT": "'YES'"}
    url = "https://ssd.jpl.nasa.gov/api/horizons.api?" + urllib.parse.urlencode(q)
    text = json.load(urllib.request.urlopen(url))["result"]
    body = re.search(r"\$\$SOE(.*)\$\$EOE", text, re.S)
    print(f"--- {name} (columns: date, flags, azimuth, elevation) ---")
    print(body.group(1).strip() if body else text[:600])
