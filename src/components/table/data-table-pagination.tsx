"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import currencyFormater, { qs } from "@/lib/utils";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  attribute: any;
}

export function DataTablePagination<TData>({ table, attribute }: TablePaginationProps<TData>) {
  // const { pageIndex } = table?.getState().pagination;
  const pageSize = attribute?.size || 10;
  const show = attribute?.page != 0 ? +attribute?.page * attribute?.size : attribute?.total_items == 0 ? 0 : 1;
  const to =
    attribute?.total_items == 0
      ? 0
      : +attribute?.page + 1 == attribute?.total_pages
      ? attribute?.total_items
      : (+attribute?.page + 1) * attribute?.size;

  const navigation = useRouter();
  return (
    <div className="mt-2 flex flex-col justify-end gap-2 lg:flex-row lg:items-center">
      <div className="flex-1 text-left text-xs text-gray-600">
        Showing {currencyFormater(show)} to {currencyFormater(Number(to || 0))} of{" "}
        {currencyFormater(Number(attribute?.total_items || 0))} results
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-full flex-col justify-between lg:flex-row lg:items-center lg:space-x-2">
          <p className="text-xs">Rows per page</p>
          <Select
            value={`${attribute?.size}`}
            onValueChange={(value) => {
              navigation.push(
                "?" +
                  qs({
                    ...attribute?.filters,
                    page: `0`,
                    size: `${value}`,
                  })
              );
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={"10"} />
            </SelectTrigger>
            <SelectContent side="top">
              {[2, 5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex whitespace-nowrap items-center justify-center text-xs">
            Page {currencyFormater(Number(attribute.page || 0) + 1)} of {currencyFormater(table.getPageCount())}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                navigation.push(
                  "?" +
                    qs({
                      ...attribute?.filters,
                      page: `0`,
                      size: `${pageSize}`,
                    })
                );
                table.setPageIndex(0);
              }}
              disabled={+attribute?.page < 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                navigation.push(
                  "?" +
                    qs({
                      ...attribute?.filters,
                      page: `${+attribute?.page - 1}`,
                      size: `${pageSize}`,
                    })
                );
                table.previousPage();
              }}
              disabled={+attribute?.page < 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                navigation.push(
                  "?" +
                    qs({
                      ...attribute?.filters,
                      page: `${+attribute?.page + 1}`,
                      size: `${pageSize}`,
                    })
                );
                table.nextPage();
              }}
              disabled={+attribute?.page + 1 >= attribute?.total_pages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                navigation.push(
                  "?" +
                    qs({
                      ...attribute?.filters,
                      page: `${+attribute?.total_pages - 1}`,
                      size: `${pageSize}`,
                    })
                );
                table.setPageIndex(table.getPageCount() - 1);
              }}
              disabled={+attribute?.page + 1 >= attribute?.total_pages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
