"use client";

import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import WorldMap from "./country-map";
import { DEFAULT_MARKERS } from "@/app/(protected)/dashboard/_lib/constants";
import CountryFlag from "@/components/common/country-flag";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  const totalCustomers = DEFAULT_MARKERS.reduce(
    (accumulator, currentItem) => accumulator + currentItem.customers,
    0,
  );

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Number of customer based on country
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <Ellipsis className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="-mx-4 -my-6 aspect-5/2 sm:-mx-6">
          <WorldMap />
        </div>
      </div>

      <div className="space-y-5">
        {DEFAULT_MARKERS.map((country) => (
          <div key={country.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-full max-w-8 items-center rounded-full">
                <CountryFlag
                  iso2={country.id}
                  title={country.country}
                  className="size-8 shrink-0 rounded-full"
                />
              </div>
              <div>
                <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                  {country.country}
                </p>
                <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                  {country.customers} Customers
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="bg-brand-500 absolute top-0 left-0 flex h-full items-center justify-center rounded-sm text-xs font-medium text-white"
                  style={{
                    width: `${(country.customers / totalCustomers) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                {((country.customers / totalCustomers) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
