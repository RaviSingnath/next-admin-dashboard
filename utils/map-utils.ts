import mapboxgl from "mapbox-gl";
import type { Feature, FeatureCollection, Point } from "geojson";
import type {
  CollegeFeatureProps,
  CollegeLocation,
} from "@/lib/types/map-types";

export const SOURCE_ID = "colleges-source";
export const LAYER_ID = "colleges-logo-layer";
export const FALLBACK_ICON_ID = "college-fallback-icon";
export const ICON_SIZE = 64;

const DEGREES_PER_SECOND = 1;
const AUTO_ROTATE_DELAY = 3000;

export const EMPTY_FEATURE_COLLECTION: FeatureCollection<
  Point,
  CollegeFeatureProps
> = {
  type: "FeatureCollection",
  features: [],
};

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

export function iconIdForUrl(url: string) {
  return `college-logo-${btoa(encodeURIComponent(url)).replace(
    /[^a-zA-Z0-9]/g,
    "",
  )}`;
}

export function drawFallbackIcon() {
  const canvas = document.createElement("canvas");
  canvas.width = ICON_SIZE;
  canvas.height = ICON_SIZE;

  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.arc(ICON_SIZE / 2, ICON_SIZE / 2, ICON_SIZE / 2 - 2, 0, Math.PI * 2);

  ctx.fillStyle = "#2563eb";
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  return ctx.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
}

export function drawToFixedCanvas(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");

  canvas.width = ICON_SIZE;
  canvas.height = ICON_SIZE;

  const ctx = canvas.getContext("2d")!;

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,.28)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  // White background
  ctx.beginPath();
  ctx.arc(ICON_SIZE / 2, ICON_SIZE / 2, ICON_SIZE / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // White border
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  ctx.save();

  ctx.beginPath();
  ctx.arc(ICON_SIZE / 2, ICON_SIZE / 2, ICON_SIZE / 2, 0, Math.PI * 2);

  // Clip logo
  ctx.save();
  ctx.beginPath();
  ctx.arc(ICON_SIZE / 2, ICON_SIZE / 2, ICON_SIZE / 2 - 5, 0, Math.PI * 2);

  ctx.clip();

  const scale = Math.max(ICON_SIZE / img.width, ICON_SIZE / img.height);

  const w = img.width * scale;
  const h = img.height * scale;

  ctx.drawImage(img, (ICON_SIZE - w) / 2, (ICON_SIZE - h) / 2, w, h);

  ctx.restore();

  return ctx.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
}

export function ensureFallbackIcon(map: mapboxgl.Map) {
  if (!map.hasImage(FALLBACK_ICON_ID)) {
    map.addImage(FALLBACK_ICON_ID, drawFallbackIcon(), {
      pixelRatio: 2,
    });
  }
}

export async function ensureLogoIcon(
  map: mapboxgl.Map,
  logoUrl: string,
  loadedIcons: Set<string>,
  promiseCache: Map<string, Promise<string>>,
) {
  const iconId = iconIdForUrl(logoUrl);

  if (loadedIcons.has(iconId) && map.hasImage(iconId)) {
    return iconId;
  }

  const cached = promiseCache.get(logoUrl);

  if (cached) {
    return cached;
  }

  const promise = new Promise<string>((resolve) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        if (!map.hasImage(iconId)) {
          map.addImage(iconId, drawToFixedCanvas(img), {
            pixelRatio: 2,
          });
        }

        loadedIcons.add(iconId);

        resolve(iconId);
      } catch {
        ensureFallbackIcon(map);
        resolve(FALLBACK_ICON_ID);
      }
    };

    img.onerror = () => {
      ensureFallbackIcon(map);
      resolve(FALLBACK_ICON_ID);
    };

    img.src = logoUrl;
  });

  promiseCache.set(logoUrl, promise);

  return promise;
}

/* -------------------------------------------------------------------------- */
/*                                GEOJSON                                     */
/* -------------------------------------------------------------------------- */

export async function buildFeatureCollection(
  map: mapboxgl.Map,
  locations: CollegeLocation[],
  loadedIcons: Set<string>,
  promiseCache: Map<string, Promise<string>>,
): Promise<FeatureCollection<Point, CollegeFeatureProps>> {
  ensureFallbackIcon(map);

  const features = await Promise.all(
    locations.map(async (location) => {
      const iconId = location.logoUrl
        ? await ensureLogoIcon(map, location.logoUrl, loadedIcons, promiseCache)
        : FALLBACK_ICON_ID;

      const feature: Feature<Point, CollegeFeatureProps> = {
        id: location.id,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
        properties: {
          id: location.id,
          name: location.name,
          logoUrl: location.logoUrl,
          iconId,
        },
      };

      return feature;
    }),
  );

  return {
    type: "FeatureCollection",
    features,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  CAMERA                                    */
/* -------------------------------------------------------------------------- */

export function fitToLocations(
  map: mapboxgl.Map,
  locations: CollegeLocation[],
) {
  if (!locations.length) return;

  if (locations.length === 1) {
    map.flyTo({
      center: locations[0].coordinates,
      zoom: 1.25,
    });

    return;
  }

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: 80,
    maxZoom: 14,
    zoom: 1.8,
    duration: 1000,
  });
}

/* -------------------------------------------------------------------------- */
/*                             GLOBE ROTATION                                 */
/* -------------------------------------------------------------------------- */

export function startAutoRotate(
  map: mapboxgl.Map,
  degreesPerSecond = DEGREES_PER_SECOND,
  resumeDelayMs = AUTO_ROTATE_DELAY,
) {
  let hovering = false;
  let enabled = true;
  let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

  function clearResumeTimeout() {
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }
  }

  function spin() {
    // Don't spin if unmounted, cursor is over the map, or waiting out the resume delay
    if (!enabled || hovering || resumeTimeout) return;

    const center = map.getCenter();
    center.lng -= degreesPerSecond;

    map.easeTo({ center, duration: 1000, easing: (t) => t });
  }

  function onMouseEnter() {
    hovering = true;
    clearResumeTimeout();
    map.stop(); // cancel any in-flight spin so it doesn't fight incoming interaction
  }

  function onMouseLeave() {
    hovering = false;
    clearResumeTimeout();

    resumeTimeout = setTimeout(() => {
      resumeTimeout = null;
      spin();
    }, resumeDelayMs);
  }

  function onMoveEnd() {
    // Chains the next spin leg. If the cursor just left, resumeTimeout is
    // already set above, so this is a no-op until that timeout clears.
    spin();
  }

  const container = map.getContainer();
  container.addEventListener("mouseenter", onMouseEnter);
  container.addEventListener("mousedown", onMouseLeave);
  container.addEventListener("mouseleave", onMouseLeave);
  container.addEventListener("touchstart", onMouseEnter, { passive: true });
  container.addEventListener("touchend", onMouseLeave);

  map.on("moveend", onMoveEnd);

  spin(); // kick off the first leg

  return () => {
    enabled = false;
    clearResumeTimeout();

    container.removeEventListener("mouseenter", onMouseEnter);
    container.removeEventListener("mouseup", onMouseEnter);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.removeEventListener("touchstart", onMouseEnter);
    container.removeEventListener("touchend", onMouseLeave);
    container.removeEventListener("dragend", onMouseLeave);
    container.removeEventListener("pitchend", onMouseLeave);
    container.removeEventListener("rotateend", onMouseLeave);
    container.removeEventListener("moveend", onMouseLeave);

    map.off("moveend", onMoveEnd);
  };
}

/* -------------------------------------------------------------------------- */
/*                              HOVER MARKER                                  */
/* -------------------------------------------------------------------------- */

export function createHoverMarker(
  map: mapboxgl.Map,
  coordinates: [number, number],
  logoUrl: string,
) {
  const wrapper = document.createElement("div");

  const img = document.createElement("img");
  wrapper.appendChild(img);

  img.src = logoUrl;

  img.width = 80;
  img.height = 80;

  img.style.borderRadius = "9999px";
  img.style.boxShadow =
    "0 8px 24px rgba(0,0,0,.25), 0 0 10px rgba(255,255,255,.18)";
  img.style.transition = "all .25s ease";
  img.style.position = "relative";
  img.style.background = "#fff";
  img.style.padding = "2px";

  img.style.transformOrigin = "center center";

  img.style.transform = "scale(1)";

  img.style.willChange = "transform, opacity";
  img.style.transformOrigin = "center center";
  img.style.backfaceVisibility = "hidden";

  img.style.animation = "float 3.5s ease-in-out infinite";

  img.style.transition = `transform .25s cubic-bezier(.2,.8,.2,1),
box-shadow .25s`;

  const marker = new mapboxgl.Marker(wrapper).setLngLat(coordinates).addTo(map);

  img.addEventListener("mouseover", () => {
    img.animate(
      [
        {
          transform: "translateY(6px) scale(0.9) rotate(-4deg)",
          opacity: 0,
        },
        {
          transform: "translateY(-3px) scale(1.08) rotate(2deg)",
          opacity: 1,
          offset: 0.7,
        },
        {
          transform: "translateY(0) scale(1.05) rotate(0deg)",
          opacity: 1,
        },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );
  });

  img.animate(
    [
      {
        transform: "translateY(6px) scale(0.9)",
        opacity: 0,
      },
      {
        transform: "translateY(-2px) scale(1.08)",
        opacity: 1,
        offset: 0.7,
      },
      {
        transform: "translateY(0) scale(1.05)",
        opacity: 1,
      },
    ],
    {
      duration: 350,
      easing: "cubic-bezier(.34,1.56,.64,1)",
      fill: "forwards",
    },
  );

  return marker;
}

/* -------------------------------------------------------------------------- */
/*                            REVEAL ANIMATION                                */
/* -------------------------------------------------------------------------- */

// export async function animateFeatureReveal(
//   map: mapboxgl.Map,
//   sourceId: string,
//   featureCollection: FeatureCollection<Point, CollegeFeatureProps>,
//   delay = 120,
// ) {
//   const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

//   const current: FeatureCollection<Point, CollegeFeatureProps> = {
//     type: "FeatureCollection",
//     features: [],
//   };

//   for (const feature of featureCollection.features) {
//     current.features.push(feature);

//     source.setData(current);

//     await new Promise((resolve) => setTimeout(resolve, delay));
//   }
// }

export async function animateFeatureReveal(
  map: mapboxgl.Map,
  sourceId: string,
  featureCollection: FeatureCollection<Point, CollegeFeatureProps>,
  delay = 120,
  shouldContinue: () => boolean = () => true,
) {
  const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
  const current: FeatureCollection<Point, CollegeFeatureProps> = {
    type: "FeatureCollection",
    features: [],
  };

  for (const feature of featureCollection.features) {
    if (!shouldContinue()) return;
    current.features.push(feature);
    source.setData(current);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
