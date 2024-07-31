"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ColumnToggle from "./column.toggle";
import SearchParamsInput from "./input.search";
import { SearchParamsDatepicker } from "./search.params.datepicker";
import StoreSearchCombobox from "./store.search.combobox";
import { TStore } from "@/models/store.model";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder?: string;
  setSearch?: string;
  useDate?: boolean;
  useStoreFilter?: boolean;
  stores?: TStore[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder = "Search...",
  setSearch = "search",
  useDate = false,
  useStoreFilter = false,
  stores,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center">
        <SearchParamsInput placeholder={placeholder} setSearch={setSearch} />
        <div className="flex flex-col gap-4 md:flex-row">
          {useDate && (
            <>
              <SearchParamsDatepicker placeholder="Pick a filter start date." setSearch="start_date" />
              <SearchParamsDatepicker title="Filter End Date" placeholder="Pick a filter end date." setSearch="end_date" />
            </>
          )}
          {useStoreFilter && <StoreSearchCombobox datas={stores as TStore[]} />}
          <ColumnToggle>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </ColumnToggle>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
