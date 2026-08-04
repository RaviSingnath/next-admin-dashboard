import { Map } from "mapbox-gl";
import { resolveCssVar } from "./map-utils";

export function addSourceCountriesGeojson(map: Map) {
  // --- Country landmass (flat grey fill, white borders) ---
  map.addSource("countries", {
    type: "geojson",
    data: "/data/countries.geojson",
    generateId: true,
  });
}

export function addLayerCountryFill(map: Map) {
  map.addLayer({
    id: "country-fill",
    type: "fill",
    source: "countries",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        resolveCssVar("--map-country-hover", "#2d72a2"),
        resolveCssVar("--map-country-fill", "#8ebdd6"),
      ],
      "fill-opacity": 1,
    },
  });
}

export function addLayerCountryOutline(map: Map) {
  map.addLayer({
    id: "country-outline",
    type: "line",
    source: "countries",
    paint: {
      "line-color": "#ffffff",
      "line-width": 0.75,
    },
  });
}

export function addLayerMarkerHalo(map: Map, maxCustomers: number) {
  // --- Customer markers ---
  // Resolved once per mount from the CSS variable — Mapbox can't
  // consume var(--color-brand-500) directly (see resolveCssVar above).
  const brandColor = resolveCssVar("--color-brand-500", "#4f46e5");

  // Soft halo behind each dot, like the reference.
  map.addLayer({
    id: "marker-halo",
    type: "circle",
    source: "customer-markers",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "customers"],
        0,
        7,
        maxCustomers,
        11,
      ],
      "circle-color": brandColor,
      "circle-opacity": 0.15,
    },
  });
}

export function addLayerMarkerDot(map: Map, maxCustomers: number) {
  const brandColor = resolveCssVar("--color-brand-500", "#4f46e5");

  map.addLayer({
    id: "marker-dot",
    type: "circle",
    source: "customer-markers",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "customers"],
        0,
        3,
        maxCustomers,
        6,
      ],
      "circle-color": brandColor,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}
