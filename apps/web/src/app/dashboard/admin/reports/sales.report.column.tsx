"use client";
import { ColumnDef } from "@tanstack/react-table";
import { toIDR } from "@/utils/toIDR";
import { TSalesRep } from "@/models/report.model";
import HeaderSortButton from "@/components/table/header.sort.button";
import { format } from "date-fns";

export const salesReportColumns: ColumnDef<TSalesRep>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => <HeaderSortButton name="Product" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "variant_name",
    header: ({ column }) => <HeaderSortButton name="Variant" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <HeaderSortButton name="Category" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "store_address",
    id: "store-address",
    header: ({ column }) => <HeaderSortButton name="Store Address" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => <div className="w-60">{row.getValue("store-address")}</div>,
  },
  {
    accessorKey: "total_sales",
    id: "total-sales",
    header: ({ column }) => <HeaderSortButton name="Total Sales" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => toIDR(row.getValue("total-sales")),
  },
  {
    accessorKey: "month",
    id: "month",
    header: ({ column }) => <HeaderSortButton name="Month" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => format(row.getValue("month"), "MMMM") + ", " + format(row.getValue("month"), "yyyy"),
  },
];
