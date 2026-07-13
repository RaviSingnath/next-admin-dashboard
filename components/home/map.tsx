"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapAddress } from "@/features/colleges/college.service";

type MapProps = {
  colleges: MapAddress;
};

type CollegeLocation = {
  name: string;
  coordinates: [number, number];
};

export default function Map({ colleges }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const collegeLocations = useMemo<CollegeLocation[]>(() => {
    return colleges.flatMap((college) => {
      const address = college.addresses;

      if (address?.longitude == null || address?.latitude == null) {
        return [];
      }

      return [
        {
          name: college.college_name,
          coordinates: [address.longitude, address.latitude] as [
            number,
            number,
          ],
        },
      ];
    });
  }, [colleges]);

  // Initialize map once
  useEffect(() => {
    if (!mapboxToken) {
      throw new Error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
    }

    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      accessToken: mapboxToken,
      container: mapContainerRef.current,
      // style: "mapbox://styles/ravisinghnath/cmreqsoks003201qwhgzp63rx",
      projection: "globe",
      center: [78.9629, 20.5937], // India
      zoom: 2.5,
      scrollZoom: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  // Update markers whenever colleges change
  useEffect(() => {
    const map = mapRef.current;

    if (!map || collegeLocations.length === 0) return;

    // Remove previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    collegeLocations.forEach((location) => {
      const popup = new mapboxgl.Popup({
        offset: 25,
      }).setHTML(`<h3>${location.name}</h3>`);

      const marker = new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      bounds.extend(location.coordinates);
    });

    // Zoom to fit all markers
    if (collegeLocations.length === 1) {
      map.flyTo({
        center: collegeLocations[0].coordinates,
        zoom: 3,
      });
    } else {
      map.fitBounds(bounds, {
        padding: 80,
        zoom: 3,
        maxZoom: 14,
        duration: 1000,
      });
    }
  }, [collegeLocations]);

  return (
    <div className="flex h-full w-full">
      <div ref={mapContainerRef} className="h-screen w-full" />
    </div>
  );
}
