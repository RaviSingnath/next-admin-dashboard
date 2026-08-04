import * as Flags from "country-flag-icons/react/1x1";

interface CountryFlagProps {
  iso2: string;
  className?: string;
  title?: string;
}

export default function CountryFlag({
  iso2,
  className,
  title,
}: CountryFlagProps) {
  const code = iso2.toUpperCase() as keyof typeof Flags;
  const Flag = Flags[code];

  if (!Flag) {
    return (
      <span
        className={`inline-block bg-gray-200 dark:bg-gray-700 ${className ?? ""}`}
        title={title ?? iso2}
        aria-label={title ?? iso2}
      />
    );
  }

  return <Flag className={className} title={title} />;
}
