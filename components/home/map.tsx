"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    // Set your Mapbox access token
    mapRef.current = new mapboxgl.Map({
      accessToken: mapboxToken,
      container: mapContainerRef.current!,
      projection: "globe",
      center: [-77.03915, 38.90025],
      style: "mapbox://styles/ravisinghnath/cmreqsoks003201qwhgzp63rx",
      zoom: 2.5,
      scrollZoom: false,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [mapboxToken]);

  return (
    // <div className="relative">
    <div className="flex  h-full w-full">
      <div className="w-full h-screen" ref={mapContainerRef} />
    </div>
    // </div>
  );
}
