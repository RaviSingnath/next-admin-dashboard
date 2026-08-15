import { cn } from "@/lib/utils";
import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClass?: string;
  desc?: string;
  ActionButton?: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  titleClass = "",
  desc = "",
  ActionButton,
}) => {
  return (
    <div
      className={cn(
        `rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3`,
        className,
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-start flex-col">
          <h3
            className={cn(
              `text-base font-medium font-display text-gray-800 dark:text-white/90`,
              titleClass,
            )}
          >
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {ActionButton && ActionButton}
      </div>

      {/* Card Body */}
      <div className="border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
