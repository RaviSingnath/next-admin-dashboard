import { twMerge } from "tailwind-merge";

type DescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Description({ children, className }: DescriptionProps) {
  return (
    <p
      className={twMerge(
        "mb-4 text-sm text-gray-500 dark:text-gray-400 sm:text-base",
        className,
      )}
    >
      {children}
    </p>
  );
}
