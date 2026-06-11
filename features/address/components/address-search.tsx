"use client";

import * as React from "react";
import { Check, Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { searchAddress } from "../address.action";
import { retrieveAddress } from "../address.service";
import { Address } from "../types";
import { SearchBoxSuggestion } from "@mapbox/search-js-core";
import TriggerButton from "./trigger-button";

type AddressSearchProps = {
  value?: string;
  onSelect: (address: Address) => void;
};

export function AddressSearch({ value, onSelect }: AddressSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value ?? "");
  const [results, setResults] = React.useState<SearchBoxSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);

  const sessionToken = React.useMemo(() => crypto.randomUUID(), []);

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const addresses = await searchAddress(sessionToken, query);

        setResults(addresses);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, sessionToken]);

  const handleSelect = async (mapboxID: string) => {
    try {
      const address = await retrieveAddress(sessionToken, mapboxID);

      onSelect(address);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TriggerButton open={open} query={query} />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-full p-0 z-[999999] bg-white border shadow-lg"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search address..."
              value={query}
              onValueChange={setQuery}
            />

            <CommandList>
              {loading && (
                <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}

              {!loading && (
                <>
                  <CommandEmpty>No addresses found.</CommandEmpty>

                  <CommandGroup>
                    {results.map((item) => (
                      <CommandItem
                        key={item.mapbox_id}
                        value={item.full_address || item.name}
                        onSelect={() => handleSelect(item.mapbox_id)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />

                        <span className="flex-1 truncate">
                          {item.full_address || item.name}
                        </span>

                        <Check className={cn("ml-auto h-4 w-4 opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
