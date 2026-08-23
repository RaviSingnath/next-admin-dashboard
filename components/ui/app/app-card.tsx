import { cn } from "@/lib/utils";

type AppCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AppCard({ children, className }: AppCardProps) {
  return (
    <div
      className={cn(
        `flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-white/3`,
        className,
      )}
    >
      {children}
    </div>
  );
}
