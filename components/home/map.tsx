"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { GeoJSONSource } from "mapbox-gl";
import { MapAddress } from "@/features/colleges/college.service";
import type { CollegeLocation } from "@/lib/types/map-types";
import {
  animateFeatureReveal,
  buildFeatureCollection,
  createHoverMarker,
  EMPTY_FEATURE_COLLECTION,
  fitToLocations,
  LAYER_ID,
  SOURCE_ID,
  startAutoRotate,
} from "@/utils/map-utils";

type MapProps = {
  colleges: MapAddress;
};

export default function CollegeMap(props: MapProps) {
  if (!props) {
    throw new Error("Map received undefined props");
  }

  const { colleges } = props;

  console.log("Colleges:", colleges);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<mapboxgl.Map | null>(null);

  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const hasAnimatedRef = useRef(false);

  const stopRotationRef = useRef<(() => void) | null>(null);

  const loadedIconsRef = useRef(new Set<string>());

  const promiseCacheRef = useRef(new Map<string, Promise<string>>());

  const mapLoadedRef = useRef(false);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const hoveredIdRef = useRef<string | number | null>(null);

  const collegeLocations = useMemo<CollegeLocation[]>(() => {
    return colleges.flatMap((college) => {
      const address = college.addresses;

      if (address?.longitude == null || address?.latitude == null) {
        return [];
      }

      return [
        {
          id: String(college.id),
          name: college.college_name,
          coordinates: [address.longitude, address.latitude],
          logoUrl: college.logo_url,
        },
      ];
    });
  }, [colleges]);

  /**
   * --------------------------------------------------------
   * Initialize map once
   * --------------------------------------------------------
   */

  const collegeLocationsRef = useRef<CollegeLocation[]>(collegeLocations);
  useEffect(() => {
    collegeLocationsRef.current = collegeLocations;
  }, [collegeLocations]);

  const syncSourceData = async (map: mapboxgl.Map) => {
    const locations = collegeLocationsRef.current;
    if (!locations.length) return;

    const featureCollection = await buildFeatureCollection(
      map,
      locations,
      loadedIconsRef.current,
      promiseCacheRef.current,
    );

    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) return;

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      await animateFeatureReveal(map, SOURCE_ID, featureCollection);
    } else {
      source.setData(featureCollection);
    }

    fitToLocations(map, locations);
  };

  useEffect(() => {
    if (!mapboxToken) {
      throw new Error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
    }

    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      projection: "globe",
      style: "mapbox://styles/ravisinghnath/cmrtdhqq200be01sc2t7u1st2",
      zoom: 1.35,
      pitch: 0,
      bearing: 0,
      scrollZoom: true,
    });

    mapRef.current = map;

    map.on("dragstart", () => {
      popupRef.current?.remove();
    });

    const nav = new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: false,
    });

    map.addControl(nav);

    map.on("style.load", () => {
      if (map.getProjection()?.name === "globe") {
        map.setFog({
          range: [-1, 1],
          color: "#0b1522",
          "high-color": "#27405f",
          "space-color": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            "rgba(2,5,11,0)",
            3,
            "rgba(0,0,0,0)",
          ],
          "horizon-blend": 0,
          "star-intensity": 0.05,
        });
      }

      map.setLights([
        {
          id: "sun_light",
          type: "directional",
          properties: {
            color: "rgba(255.0, 0.0, 0.0, 1.0)",
            intensity: 0.4,
            direction: [200.0, 40.0],
            "cast-shadows": true,
            "shadow-intensity": 0.2,
          },
        },
      ]);

      map.resize();
    });

    map.on("load", () => {
      mapLoadedRef.current = true;

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: EMPTY_FEATURE_COLLECTION,
      });

      map.addLayer({
        id: LAYER_ID,

        type: "symbol",

        source: SOURCE_ID,

        layout: {
          "icon-image": ["get", "iconId"],
          "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1,
            0.65,
            4,
            0.75,
            8,
            0.9,
            14,
            1.0,
          ],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      map.addLayer(
        {
          id: "college-pulse",

          type: "circle",

          source: SOURCE_ID,

          paint: {
            "circle-radius": 16,

            "circle-color": "#ffffff",

            "circle-opacity": 0.25,
          },
        },
        LAYER_ID,
      );

      /**
       * Cursor
       */

      map.on("mouseenter", LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
        console.log("mouseenter");
      });

      map.on("mouseleave", LAYER_ID, () => {
        console.log("mouseleave");
        map.getCanvas().style.cursor = "";

        hoverMarkerRef.current?.remove();
        hoverMarkerRef.current = null;
      });

      /**
       * Hover marker
       */

      map.on("mousemove", LAYER_ID, (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];

        if (feature.geometry.type !== "Point") {
          return;
        }

        if (feature.id === hoveredIdRef.current) return;

        hoveredIdRef.current = feature.id ?? null;
        hoverMarkerRef.current?.remove();
        const logoUrl = feature.properties?.logoUrl;
        hoverMarkerRef.current = logoUrl
          ? createHoverMarker(
              map,
              feature.geometry.coordinates as [number, number],
              logoUrl,
            )
          : null;
      });

      /**
       * Popup
       */

      map.on("click", LAYER_ID, (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];

        if (feature.geometry.type !== "Point") {
          return;
        }

        popupRef.current?.remove();

        popupRef.current = new mapboxgl.Popup({
          offset: 20,
        })
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(`<h3 class="font-semibold">${feature.properties?.name}</h3>`)
          .addTo(map);
      });

      stopRotationRef.current = startAutoRotate(map);

      void syncSourceData(map);
    });

    /**
     * If colleges were already loaded before the map finished loading,
     * populate the source immediately.
     */
    if (collegeLocations.length > 0) {
      void (async () => {
        const featureCollection = await buildFeatureCollection(
          map,
          collegeLocations,
          loadedIconsRef.current,
          promiseCacheRef.current,
        );

        const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;

        if (!source) return;

        if (!hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          await animateFeatureReveal(map, SOURCE_ID, featureCollection);
        } else {
          source.setData(featureCollection);
        }

        fitToLocations(map, collegeLocations);
      })();
    }

    return () => {
      stopRotationRef.current?.();

      popupRef.current?.remove();
      popupRef.current = null;

      hoverMarkerRef.current?.remove();
      hoverMarkerRef.current = null;

      loadedIconsRef.current.clear();
      promiseCacheRef.current.clear();

      mapLoadedRef.current = false;

      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current || !collegeLocations.length) return;

    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await syncSourceData(map);
    })();

    return () => {
      cancelled = true;
    };
  }, [collegeLocations]);

  /**
   * --------------------------------------------------------
   * Update GeoJSON whenever colleges change
   * --------------------------------------------------------
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (!mapLoadedRef.current) return;

    if (!collegeLocations.length) return;

    let cancelled = false;

    void (async () => {
      const featureCollection = await buildFeatureCollection(
        map,
        collegeLocations,
        loadedIconsRef.current,
        promiseCacheRef.current,
      );

      if (cancelled) return;

      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;

      if (!source) return;

      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;

        await animateFeatureReveal(map, SOURCE_ID, featureCollection);
      } else {
        source.setData(featureCollection);
      }

      fitToLocations(map, collegeLocations);
    })();

    return () => {
      cancelled = true;
    };
  }, [collegeLocations]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
