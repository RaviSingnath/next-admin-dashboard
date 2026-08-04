"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface CountryProperties {
  ADMIN: string;
  ISO_A2: string;
  ISO_A3: string;
  name?: string;
}

export interface CustomerMarker {
  id: string;
  country: string;
  lng: number;
  lat: number;
  customers: number;
}

interface WorldMapProps {
  markers?: CustomerMarker[];
}

// Sample data matching the reference design — swap for real customer
// counts by passing the `markers` prop.
const DEFAULT_MARKERS: CustomerMarker[] = [
  { id: "us", country: "United States", lng: -97, lat: 33, customers: 2379 },
  { id: "de", country: "Germany", lng: 20, lat: 52, customers: 850 },
  { id: "th", country: "Thailand", lng: 98, lat: 17, customers: 1200 },
  { id: "au", country: "Australia", lng: 133, lat: -25, customers: 410 },
];

// A blank style: no Mapbox-hosted imagery/vector tiles at all. The whole
// look — grey landmass, white borders — comes from the country GeoJSON
// we add ourselves below. This is what makes edge-to-edge, no-crop,
// no-gap rendering possible: there's no photographic basemap to clip.
const BLANK_STYLE: mapboxgl.StyleSpecification = {
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

function markersToGeoJSON(
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

export default function WorldMap({ markers = DEFAULT_MARKERS }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Keep a stable reference to the latest markers for the effect below
  // without re-initializing the whole map every time they change.
  const markersRef = useRef(markers);

  const maxCustomers = useMemo(
    () => Math.max(...markers.map((m) => m.customers), 1),
    [markers],
  );

  useEffect(() => {
    markersRef.current = markers;
  });

  useEffect(() => {
    if (!mapboxToken) {
      // Don't throw inside an effect — it just crashes to the nearest
      // error boundary. Bail out gracefully instead.
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }

    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Bounding box covering all populated landmass. No basemap imagery
    // means there's nothing to look "cut off" near the poles — we can
    // just pick a box that frames the content nicely.
    const WORLD_BOUNDS: [[number, number], [number, number]] = [
      [-165, -56],
      [180, 78],
    ];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: BLANK_STYLE,

      projection: "equirectangular",

      pitch: 0,
      bearing: 0,

      renderWorldCopies: false,
      attributionControl: false,

      antialias: true,
    });

    mapRef.current = map;

    // Flush to the edges, matching the reference — no basemap means no
    // risk of slicing through real content near the container border.
    const fitWorld = () => {
      map.fitBounds(WORLD_BOUNDS, {
        padding: 0,
        animate: false,
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        map.resize();
        fitWorld();
      });
    });

    resizeObserver.observe(containerRef.current!);

    map.dragPan.disable();
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    map.on("error", (e) => {
      console.error("Mapbox error:", e.error);
    });

    let hoveredCountryId: number | string | null = null;
    let hoveredMarkerId: number | string | null = null;

    // Two popups: the marker one is fixed at the dot's exact coordinates
    // and takes priority; the country one follows the cursor and only
    // shows when the pointer isn't over a marker (a marker always sits
    // inside its country's polygon, so both layers fire on the same
    // mousemove — the priority check below resolves the overlap).
    const markerPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: "country-popup",
    });

    const countryPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: "country-popup country-popup--muted",
    });

    map.on("load", () => {
      fitWorld();

      // --- Country landmass (flat grey fill, white borders) ---
      map.addSource("countries", {
        type: "geojson",
        data: "/data/countries.geojson",
        generateId: true,
      });

      map.addLayer({
        id: "country-fill",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#c7ced8",
            "#d7dce3",
          ],
          "fill-opacity": 1,
          "fill-opacity-transition": { duration: 120 },
        },
      });

      map.addLayer({
        id: "country-outline",
        type: "line",
        source: "countries",
        paint: {
          "line-color": "#ffffff",
          "line-width": 0.75,
        },
      });

      map.on("mousemove", "country-fill", (e) => {
        // A marker sits inside its country's polygon, so this fires
        // alongside the marker-dot handler too — let the marker popup
        // own the moment when the cursor is actually on a dot.
        const markerHere = map.queryRenderedFeatures(e.point, {
          layers: ["marker-dot"],
        });

        if (markerHere.length > 0) {
          if (hoveredCountryId !== null) {
            map.setFeatureState(
              { source: "countries", id: hoveredCountryId },
              { hover: false },
            );
            hoveredCountryId = null;
          }
          countryPopup.remove();
          return;
        }

        const feature = e.features?.[0];
        if (!feature?.id) return;

        if (hoveredCountryId !== feature.id) {
          if (hoveredCountryId !== null) {
            map.setFeatureState(
              { source: "countries", id: hoveredCountryId },
              { hover: false },
            );
          }

          hoveredCountryId = feature.id;

          map.setFeatureState(
            { source: "countries", id: hoveredCountryId },
            { hover: true },
          );
        }

        const props = feature.properties as CountryProperties;

        countryPopup
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${props.name}</strong>`)
          .addTo(map);

        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "country-fill", () => {
        if (hoveredCountryId !== null) {
          map.setFeatureState(
            { source: "countries", id: hoveredCountryId },
            { hover: false },
          );
          hoveredCountryId = null;
        }
        countryPopup.remove();
        map.getCanvas().style.cursor = "";
      });

      // --- Customer markers ---
      map.addSource("customer-markers", {
        type: "geojson",
        data: markersToGeoJSON(markersRef.current),
        generateId: true,
      });

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
          "circle-color": "#4f46e5",
          "circle-opacity": 0.15,
        },
      });

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
            7,
          ],
          "circle-color": "#4f46e5",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.on("mousemove", "marker-dot", (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.id === hoveredMarkerId) return;

        hoveredMarkerId = feature.id ?? null;

        // Marker takes priority over the country popup underneath it.
        if (hoveredCountryId !== null) {
          map.setFeatureState(
            { source: "countries", id: hoveredCountryId },
            { hover: false },
          );
          hoveredCountryId = null;
        }
        countryPopup.remove();

        const { country, customers } = feature.properties as {
          country: string;
          customers: number;
        };

        const coords = (
          feature.geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number];

        markerPopup
          .setLngLat(coords)
          .setHTML(
            `<strong>${country}</strong><br/>${customers.toLocaleString()} customers`,
          )
          .addTo(map);

        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "marker-dot", () => {
        hoveredMarkerId = null;
        markerPopup.remove();
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      resizeObserver.disconnect();

      markerPopup.remove();
      countryPopup.remove();

      map.remove();

      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker layer in sync if `markers` changes after mount,
  // without tearing down and re-creating the whole map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("customer-markers") as
      mapboxgl.GeoJSONSource | undefined;

    source?.setData(markersToGeoJSON(markers));
  }, [markers]);

  return (
    <>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <div ref={containerRef} className="absolute inset-0 h-full" />
      </div>

      <style jsx global>{`
        .country-popup .mapboxgl-popup-content {
          padding: 6px 12px;
          border-radius: 9999px;

          background: rgba(17, 24, 39, 0.95);

          color: white;

          font-size: 12px;

          font-weight: 600;

          border: 1px solid rgba(255, 255, 255, 0.08);

          backdrop-filter: blur(12px);

          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);

          text-align: center;
        }

        .country-popup .mapboxgl-popup-tip {
          display: none;
        }

        .country-popup--muted .mapboxgl-popup-content {
          background: rgba(55, 65, 81, 0.9);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
