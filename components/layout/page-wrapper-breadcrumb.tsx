import React from "react";
import PageBreadcrumb from "@/components/common/page-breadcrumb";

type PageWrapperBreadcrumbProps = {
  title: string;
  children: React.ReactNode;
};

export default function PageWrapperBreadcrumb({
  title,
  children,
}: PageWrapperBreadcrumbProps) {
  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      {children}
    </div>
  );
}
