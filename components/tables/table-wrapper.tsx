type TableWrapperProps = {
  children: React.ReactNode;
};

export default function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
