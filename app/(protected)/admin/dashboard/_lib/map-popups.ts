import mapboxgl from "mapbox-gl";

export function createMarkerPopup() {
  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 12,
    className: "country-popup",
  });
}

export function createCountryPopup() {
  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 12,
    className: "country-popup country-popup--muted",
  });
}
