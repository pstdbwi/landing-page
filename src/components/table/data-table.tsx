"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  Table as TableTanStack,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  attribute?: any;
  customPagination?: boolean;
  customPaginationComponent?: (table: TableTanStack<TData>, attribute: any) => any;
  sorting?: any;
  setSorting?: any;
  expandable?: boolean;
  customEmptyMessage?: string;
  expandableComponent?: (data: Row<TData>) => any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  attribute,
  customPagination = false,
  customPaginationComponent,
  expandable = false,
  sorting,
  setSorting,
  customEmptyMessage,
  expandableComponent,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = React.useState<any>({});
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: attribute?.page,
    pageSize: attribute?.size,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns: [
      ...(expandable
        ? [
            {
              id: "expanded_or_selection",
              cell: ({ row }: any) => (
                <div>
                  {row.getCanExpand() && expandable ? (
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                      }}
                    >
                      {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              ),
            },
          ]
        : []),
      ...columns,
    ].filter((val) => val),
    pageCount: attribute?.total_pages || 1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      expanded,
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="w-full space-y-4">
      <div className="w-full rounded-lg border bg-white">
        <Table className="w-full rounded-lg px-2">
          <TableHeader className="rounded-t-lg px-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="rounded-t-lg">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-10",
                        index === 0 ? "rounded-tl-lg" : "",
                        index === headerGroup.headers.length - 1 ? "rounded-tr-lg" : ""
                        // header.column.columnDef.meta?.className,
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="rounded-b-lg">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex: number) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      rowIndex % 2 == 0 ? "rounded-b-lg bg-gray-50 hover:bg-gray-100" : "",
                      "rounded-b-lg py-1"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  {(expanded[rowIndex] && expandableComponent) ||
                  (expanded == true && typeof expandable != "object" && expandableComponent) ? (
                    <TableRow>
                      <TableCell className="p-0" colSpan={columns.length + 1}>
                        {expandableComponent(row)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={expanded == true && typeof expandable != "object" ? columns.length + 1 : columns.length + 1}
                  className="text-center"
                >
                  {customEmptyMessage || "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!customPagination ? (
        <DataTablePagination table={table} attribute={attribute} />
      ) : customPaginationComponent ? (
        customPaginationComponent(table, attribute)
      ) : null}
    </div>
  );
}
