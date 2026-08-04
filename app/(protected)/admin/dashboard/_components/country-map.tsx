"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import updateMapTheme from "../_lib/map-theme";
import { markersToGeoJSON } from "../_lib/map-utils";
import { MapState, WorldMapProps } from "../_lib/map-types";
import { DEFAULT_MARKERS, BLANK_STYLE, WORLD_BOUNDS } from "../_lib/constants";
import {
  addLayerCountryFill,
  addLayerCountryOutline,
  addLayerMarkerDot,
  addLayerMarkerHalo,
  addSourceCountriesGeojson,
} from "../_lib/map-layers";
import { createCountryPopup, createMarkerPopup } from "../_lib/map-popups";
import {
  setupCountryHover,
  setupCountryLeave,
  setupMarkerHover,
  setupMarkerLeave,
} from "../_lib/map-events";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function WorldMap({ markers = DEFAULT_MARKERS }: WorldMapProps) {
  const { theme } = useTheme();
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

    const mapState: MapState = {
      hoveredMarkerId: null,
      hoveredCountryId: null,
    };

    // Two popups: the marker one is fixed at the dot's exact coordinates
    // and takes priority; the country one follows the cursor and only
    // shows when the pointer isn't over a marker (a marker always sits
    // inside its country's polygon, so both layers fire on the same
    // mousemove — the priority check below resolves the overlap).
    const markerPopup = createMarkerPopup();

    const countryPopup = createCountryPopup();

    map.on("load", () => {
      fitWorld();

      addSourceCountriesGeojson(map);

      addLayerCountryFill(map);

      addLayerCountryOutline(map);

      setupCountryHover(map, mapState, countryPopup);

      setupCountryLeave(map, mapState, countryPopup);

      map.addSource("customer-markers", {
        type: "geojson",
        data: markersToGeoJSON(markersRef.current),
        generateId: true,
      });

      addLayerMarkerHalo(map, maxCustomers);

      addLayerMarkerDot(map, maxCustomers);

      setupMarkerHover(map, mapState, countryPopup, markerPopup);

      setupMarkerLeave(map, mapState, markerPopup);

      updateMapTheme(map);
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait until the <html> class has been updated
    requestAnimationFrame(() => {
      updateMapTheme(map);
    });
  }, [theme]);

  return (
    <>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <div ref={containerRef} className="absolute inset-0 h-full" />
      </div>

      <style jsx global>{`
        .country-popup .mapboxgl-popup-content {
          padding: 4px 6px;
          border-radius: 6px;

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
