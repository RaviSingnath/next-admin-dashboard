type QueryValue = string | number | boolean | null | undefined;

export function createQueryString(
  searchParams: URLSearchParams,
  updates: Record<string, QueryValue>,
) {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
}
