import { CustomerMarker } from "./map-types";

export function markersToGeoJSON(
  markers: CustomerMarker[],
): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: markers.map((m) => ({
      type: "Feature",
      id: m.id,
      geometry: {
        type: "Point",
        coordinates: [m.lng, m.lat],
      },
      properties: {
        country: m.country,
        customers: m.customers,
      },
    })),
  };
}

// Mapbox `paint` properties are evaluated by the WebGL renderer, not the
// browser's CSS engine — `var(--foo)` is meaningless there. Resolve the
// custom property to its actual computed value (e.g. an oklch()/hex
// string) once on the client and hand Mapbox that resolved value instead.
export function resolveCssVar(name: string, fallback: string, el?: Element) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(el ?? document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function cssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
