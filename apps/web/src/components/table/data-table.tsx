"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
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
  useStoreFilter?: TStore[];
  selectedData?: (data: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder = "Search...",
  setSearch = "search",
  useDate = false,
  useStoreFilter,
  selectedData,
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

  useEffect(() => {
    if (selectedData) selectedData(table.getSelectedRowModel().rows.map((data) => data.original));
  }, [table.getSelectedRowModel()]);

  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <SearchParamsInput placeholder={placeholder} setSearch={setSearch} />
        {useDate && (
          <>
            <SearchParamsDatepicker placeholder="Pick a filter start date." setSearch="start_date" />
            <SearchParamsDatepicker title="Filter End Date" placeholder="Pick a filter end date." setSearch="end_date" />
          </>
        )}
        {useStoreFilter?.length && <StoreSearchCombobox datas={useStoreFilter} />}
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
                  {row.getVisibleCells().map((cell) => {
                    return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                  })}
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
