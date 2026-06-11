"use server";

import { SearchBoxSuggestion } from "@mapbox/search-js-core";

export interface SearchBoxSuggestResponse {
  suggestions: SearchBoxSuggestion[];
  attribution?: string;
}

export async function searchAddress(sessionToken: string, query: string) {
  if (!query || query.length < 3) {
    return [];
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const searchboxURL = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
    query,
  )}&session_token=${sessionToken}&access_token=${token}`;

  const response = await fetch(searchboxURL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to search addresses");
  }

  const data: SearchBoxSuggestResponse = await response.json();

  return data.suggestions ?? [];
}
