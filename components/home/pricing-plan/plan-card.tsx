export default function PlanCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none dark:bg-gray-800/50 dark:ring-white/10">
      {children}
    </div>
  );
}
