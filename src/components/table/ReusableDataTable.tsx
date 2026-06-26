// ReusableDataTable - A reusable data table component using TanStack Table
// Designed for consistent UI across the application following CustomerManagement.tsx design
import { useState, type MutableRefObject, type ReactNode } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import type { Column, ColumnDef, SortingState, RowSelectionState, Updater, RowData } from "@tanstack/react-table";
import { Pagination, type PaginationMeta } from "./Pagination";
import { cn } from "@/utils/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    showMobile?: boolean | undefined;
  }

  interface TableMeta<TData extends RowData> {
    lastSelectedRowIndex?: MutableRefObject<number | null>;
  }
}

export interface DataTableProps<TData> {
  // Data
  data: TData[];
  columns: ColumnDef<TData, unknown>[];

  // Pagination
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Loading & Empty states
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Row actions
  onRowClick?: (row: TData) => void;

  // Row selection
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;

  className?: string;
}

// Empty state icon
const EmptyIcon = () => (
  <svg className="h-10 w-10 text-slate-200 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

// Loading skeleton row
const LoadingRow = <TData,>({ leafColumns }: { leafColumns: Column<TData, unknown>[] }) => (
  <tr className="animate-pulse">
    {leafColumns.map((col) => {
      const showMobile = col.columnDef.meta?.showMobile;
      const displayClass = showMobile ? "" : "hidden md:table-cell";
      return (
        <td key={col.id} className={cn("px-4 py-3.5", displayClass)}>
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        </td>
      );
    })}
  </tr>
);

export function ReusableDataTable<TData>({
  data,
  columns,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  emptyMessage = "Không có dữ liệu",
  emptyIcon,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(rowSelection !== undefined && { rowSelection }),
    },
    onSortingChange: setSorting,

    ...(getRowId && {
      getRowId,
    }),

    ...(onRowSelectionChange && {
      onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
        const newSelection = typeof updater === "function" ? updater(rowSelection ?? {}) : updater;

        onRowSelectionChange(newSelection);
      },
    }),

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
    enableRowSelection: rowSelection !== undefined,
  });

  return (
    <div
      className={cn("border-radius box-shadow dark:bg-darkgray overflow-hidden border bg-white dark:border", className)}
    >
      {/* Unified Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 dark:border-slate-700 dark:text-slate-500">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => {
                  const showMobile = header.column.columnDef.meta?.showMobile;
                  const displayClass = showMobile ? "" : "hidden md:table-cell";

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-2 py-3 text-left",
                        displayClass,
                        header.column.getCanSort() && "cursor-pointer select-none",
                      )}
                      style={
                        header.column.columnDef.size !== undefined
                          ? { width: header.column.getSize(), minWidth: header.column.getSize() }
                          : undefined
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span className="text-slate-600 dark:text-slate-400">
                            {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                }),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} leafColumns={table.getAllLeafColumns()} />)
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-2 py-16 text-center text-sm text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon ?? <EmptyIcon />}
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "group transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const showMobile = cell.column.columnDef.meta?.showMobile;
                    const displayClass = showMobile ? "" : "hidden md:table-cell";
                    return (
                      <td key={cell.id} className={cn("px-2 py-3.5", displayClass)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination}
          displayedCount={data.length}
          {...(onPageChange ? { onPageChange } : {})}
          {...(onPageSizeChange ? { onPageSizeChange } : {})}
        />
      )}
    </div>
  );
}

export default ReusableDataTable;
