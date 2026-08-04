import { Map, Popup } from "mapbox-gl";
import { CountryProperties, MapState } from "./map-types";

export function setupMarkerHover(
  map: Map,
  mapState: MapState,
  countryPopup: Popup,
  markerPopup: Popup,
) {
  map.on("mousemove", "marker-dot", (e) => {
    const feature = e.features?.[0];
    if (!feature || feature.id === mapState.hoveredMarkerId) return;

    mapState.hoveredMarkerId = feature.id ?? null;

    // Marker takes priority over the country popup underneath it.
    if (mapState.hoveredCountryId !== null) {
      map.setFeatureState(
        { source: "countries", id: mapState.hoveredCountryId },
        { hover: false },
      );
      mapState.hoveredCountryId = null;
    }
    countryPopup.remove();

    const { country, customers } = feature.properties as {
      country: string;
      customers: number;
    };

    const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [
      number,
      number,
    ];

    markerPopup
      .setLngLat(coords)
      .setHTML(
        `<strong>${country}</strong><br/>${customers.toLocaleString()} customers`,
      )
      .addTo(map);

    map.getCanvas().style.cursor = "pointer";
  });
}

export function setupMarkerLeave(
  map: Map,
  mapState: MapState,
  markerPopup: Popup,
) {
  map.on("mouseleave", "marker-dot", () => {
    mapState.hoveredMarkerId = null;
    markerPopup.remove();
    map.getCanvas().style.cursor = "";
  });
}

export function setupCountryHover(
  map: Map,
  mapState: MapState,
  countryPopup: Popup,
) {
  map.on("mousemove", "country-fill", (e) => {
    // A marker sits inside its country's polygon, so this fires
    // alongside the marker-dot handler too — let the marker popup
    // own the moment when the cursor is actually on a dot.
    const markerHere = map.queryRenderedFeatures(e.point, {
      layers: ["marker-dot"],
    });

    if (markerHere.length > 0) {
      if (mapState.hoveredCountryId !== null) {
        map.setFeatureState(
          { source: "countries", id: mapState.hoveredCountryId },
          { hover: false },
        );
        mapState.hoveredCountryId = null;
      }
      countryPopup.remove();
      return;
    }

    const feature = e.features?.[0];
    if (!feature?.id) return;

    if (mapState.hoveredCountryId !== feature.id) {
      if (mapState.hoveredCountryId !== null) {
        map.setFeatureState(
          { source: "countries", id: mapState.hoveredCountryId },
          { hover: false },
        );
      }

      mapState.hoveredCountryId = feature.id;

      map.setFeatureState(
        { source: "countries", id: mapState.hoveredCountryId },
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
}

export function setupCountryLeave(
  map: Map,
  mapState: MapState,
  countryPopup: Popup,
) {
  map.on("mouseleave", "country-fill", () => {
    if (mapState.hoveredCountryId !== null) {
      map.setFeatureState(
        { source: "countries", id: mapState.hoveredCountryId },
        { hover: false },
      );
      mapState.hoveredCountryId = null;
    }
    countryPopup.remove();
    map.getCanvas().style.cursor = "";
  });
}
