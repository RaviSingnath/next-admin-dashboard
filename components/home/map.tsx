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
  console.log("Map props:", props);

  // if (!props) {
  //   console.log("Props are undefined");
  //   return null;
  // }

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

      style: "mapbox://styles/mapbox/standard",

      // center: [78.9629, 20.5937],

      zoom: 1.3,

      scrollZoom: true,
    });

    mapRef.current = map;

    map.on("dragstart", () => {
      popupRef.current?.remove();
    });

    map.on("style.load", () => {
      map.setFog({
        color: "#10141c",
        "high-color": "#1b2535",
        "space-color": "#04070d",
        "horizon-blend": 0.08,
      });
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
            0.45,
            4,
            0.55,
            8,
            0.75,
            12,
            0.95,
            16,
            1.15, // new — keeps growing past your fitBounds maxZoom of 14
            20,
            1.35,
          ],

          "icon-allow-overlap": true,

          "icon-ignore-placement": true,
        },
      });

      /**
       * Cursor
       */

      map.on("mouseenter", LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
        console.log('mouseenter')
      });

      map.on("mouseleave", LAYER_ID, () => {
        console.log('mouseleave')
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

        // const coordinates = feature.geometry.coordinates as [number, number];

        // const logoUrl = feature.properties?.logoUrl;

        // hoverMarkerRef.current?.remove();
        // hoverMarkerRef.current = null;

        // if (logoUrl) {
        //   hoverMarkerRef.current = createHoverMarker(map, coordinates, logoUrl);
        // }

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
    <div className="relative h-full w-full overflow-hidden rounded-l-3xl">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
