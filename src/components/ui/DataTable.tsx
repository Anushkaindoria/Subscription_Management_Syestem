import React from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are currently no items to display in this list.",
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 space-y-4", className)}>
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={cn("w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] shadow-sm overflow-hidden", className)}>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-3.5",
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-6 py-4 text-slate-800 dark:text-slate-200",
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
        {data.map((row, idx) => (
          <div
            key={row.id || idx}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors",
              onRowClick && "cursor-pointer"
            )}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 uppercase">{typeof col.header === "string" ? col.header : col.key}:</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
