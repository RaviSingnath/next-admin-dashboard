type TableWrapperProps = {
  children: React.ReactNode;
};

export function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">{children}</div>
      </div>
    </div>
  );
}
