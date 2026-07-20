import type { FeatureCollection, Point } from "geojson";

export type CollegeLocation = {
  id: string;
  name: string;
  coordinates: [number, number];
  logoUrl: string | null;
};

export type CollegeFeatureProps = {
  id: string;
  name: string;
  logoUrl: string | null;
  iconId: string;
};

export type CollegeFeatureCollection = FeatureCollection<
  Point,
  CollegeFeatureProps
>;
