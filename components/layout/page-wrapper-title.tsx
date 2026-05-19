import React from "react";

type PageWrapperTitleProps = {
  title: string;
  children: React.ReactNode;
};

export default function PageWrapperTitle({
  title,
  children,
}: PageWrapperTitleProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
