"use client";

export default function DepartmentsError({ error }: { error: Error }) {
  return <div>Failed to load departments: {error.message}</div>;
}
