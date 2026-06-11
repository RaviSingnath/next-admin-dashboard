import { AddressAutofill } from "@mapbox/search-js-react";

export function AddressField() {
  return (
    <div className="relative overflow-visible">
      <AddressAutofill
        popoverOptions={{
          placement: "bottom-start",
        }}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
      >
        <input name="address" placeholder="Search address" />
      </AddressAutofill>
      <input
        name="apartment"
        placeholder="Apartment number"
        type="text"
        autoComplete="address-line2"
      />
      <input
        name="city"
        placeholder="City"
        type="text"
        autoComplete="address-level2"
      />
      <input
        name="state"
        placeholder="State"
        type="text"
        autoComplete="address-level1"
      />
      <input
        name="country"
        placeholder="Country"
        type="text"
        autoComplete="country"
      />
      <input
        name="postcode"
        placeholder="Postcode"
        type="text"
        autoComplete="postal-code"
      />
    </div>
  );
}
