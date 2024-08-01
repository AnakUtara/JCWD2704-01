"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TStockRep } from "@/models/report.model";
import HeaderSortButton from "@/components/table/header.sort.button";
import { format } from "date-fns";

export const stockReportColumns: ColumnDef<TStockRep>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => <HeaderSortButton name="Product" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "variant_name",
    header: ({ column }) => <HeaderSortButton name="Variant" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "store_address",
    id: "store-address",
    header: ({ column }) => <HeaderSortButton name="Store Address" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => <div className="w-60">{row.getValue("store-address")}</div>,
  },
  {
    accessorKey: "total_additions",
    header: ({ column }) => (
      <HeaderSortButton name="Total Additions" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
  },
  {
    accessorKey: "total_subtractions",
    header: ({ column }) => (
      <HeaderSortButton name="Total Subtractions" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
  },
  {
    accessorKey: "final_qty",
    header: ({ column }) => <HeaderSortButton name="Final Quantity" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "month",
    id: "month",
    header: ({ column }) => <HeaderSortButton name="Month" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => format(row.getValue("month"), "MMMM") + ", " + format(row.getValue("month"), "yyyy"),
  },
];
