import { resolveCssVar } from "./map-utils";

export default function updateMapTheme(map: mapboxgl.Map) {
  const mapCountry = resolveCssVar("--map-country-fill", "#ffffff");
  const mapCountryHover = resolveCssVar("--map-country-hover", "#8ebdd6");
  const mapCountryBorder = resolveCssVar("--map-country-border", "#d1d5db");
  const brandColor = resolveCssVar("--color-brand-500", "#2d72a2");

  map.setPaintProperty("country-fill", "fill-color", [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    mapCountryHover,
    mapCountry,
  ]);

  map.setPaintProperty("country-outline", "line-color", mapCountryBorder);

  map.setPaintProperty("marker-dot", "circle-color", brandColor);

  map.setPaintProperty("marker-halo", "circle-color", brandColor);
}
