import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

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
