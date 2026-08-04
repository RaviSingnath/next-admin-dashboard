// Sample data matching the reference design — swap for real customer

import { CustomerMarker } from "./map-types";

// counts by passing the `markers` prop.
export const DEFAULT_MARKERS: CustomerMarker[] = [
  { id: "us", country: "United States", lng: -97, lat: 33, customers: 2379 },
  { id: "de", country: "Germany", lng: 20, lat: 52, customers: 850 },
  { id: "th", country: "Thailand", lng: 98, lat: 17, customers: 1200 },
  { id: "au", country: "Australia", lng: 133, lat: -25, customers: 410 },
];

// A blank style: no Mapbox-hosted imagery/vector tiles at all. The whole
// look — grey landmass, white borders — comes from the country GeoJSON
// we add ourselves below. This is what makes edge-to-edge, no-crop,
// no-gap rendering possible: there's no photographic basemap to clip.
export const BLANK_STYLE: mapboxgl.StyleSpecification = {
  version: 8,
  name: "blank",
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#eef1f5",
      },
    },
  ],
};

// Bounding box covering all populated landmass. No basemap imagery
// means there's nothing to look "cut off" near the poles — we can
// just pick a box that frames the content nicely.
export const WORLD_BOUNDS: [[number, number], [number, number]] = [
  [-165, -56],
  [180, 78],
];
