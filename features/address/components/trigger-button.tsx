import { MapPin } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

type TriggerButtonProps = {
  query: string;
  open: boolean;
};

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  ({ query, open, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant="outline"
        type="button"
        aria-expanded={open}
        className="justify-start h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      >
        <MapPin className="mr-2 h-4 w-4 shrink-0" />

        <span className="truncate">{query || "Search address..."}</span>
      </Button>
    );
  },
);

TriggerButton.displayName = "TriggerButton";
export default TriggerButton;
