export interface Site { name: string; lat: number; lon: number }

// Approximate coordinates (deg, east-positive longitude)
export const SITES: Site[] = [
  { name: "Shackleton crater rim", lat: -89.9, lon: 0 },
  { name: "Connecting ridge (Artemis III region)", lat: -89.45, lon: 222.7 - 360 },
  { name: "Malapert A (IM-1 landing)", lat: -80.13, lon: 1.44 },
  { name: "Malapert massif", lat: -86.0, lon: 0.0 },
  { name: "Haworth rim", lat: -87.5, lon: -5.0 },
  { name: "de Gerlache rim", lat: -88.5, lon: -87.0 },
  { name: "Nobile rim", lat: -85.4, lon: 53.0 },
  { name: "Apollo 11", lat: 0.67, lon: 23.47 },
  { name: "Apollo 17", lat: 20.19, lon: 30.77 },
];
