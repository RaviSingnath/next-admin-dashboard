import { twMerge } from "tailwind-merge";

type TitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Title({ children, className }: TitleProps) {
  return (
    <h3
      className={twMerge(
        className,
        "mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl",
      )}
    >
      {children}
    </h3>
  );
}
