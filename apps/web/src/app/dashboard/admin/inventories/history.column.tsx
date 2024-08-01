"use client";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import HeaderSortButton from "@/components/table/header.sort.button";
import { TStockHistory } from "@/models/store.model";
import { Badge } from "@/components/ui/badge";

export const historyColumns: ColumnDef<TStockHistory>[] = [
  {
    accessorKey: "store_stock.store.address.city.city_name",
    id: "store_city",
    header: ({ column }) => <HeaderSortButton name="Store City" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => <Badge className="bg-black text-white hover:bg-zinc-800">{row.getValue("store_city")}</Badge>,
  },
  {
    accessorKey: "store_stock.store.address.address",
    id: "store_address",
    header: ({ column }) => <HeaderSortButton name="Store Address" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => row.getValue("store_address"),
  },
  {
    accessorKey: "store_stock.product.product.name",
    id: "product_name",
    header: ({ column }) => <HeaderSortButton name="Product Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "store_stock.product.name",
    id: "variant_name",
    header: ({ column }) => <HeaderSortButton name="Variant" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "start_qty_at",
    header: () => (
      <HeaderServerSortBtn name="Start Quantity" sortBy="start_qty_at" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />
    ),
  },
  {
    accessorKey: "qty_change",
    header: () => (
      <HeaderServerSortBtn name="Mutation" sortBy="qty_change" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />
    ),
    cell: ({ row }) => {
      const { original: history } = row;
      const isSignMinus = Math.sign(history.qty_change) === -1;
      return <Badge variant={isSignMinus ? "destructive" : "default"}>{isSignMinus ? history.qty_change : "+" + history.qty_change}</Badge>;
    },
  },
  {
    accessorKey: "start_qty_at",
    id: "final_qty",
    header: ({ column }) => (
      <HeaderSortButton name="Listed Quantity" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => Number(row.getValue("final_qty")) + Number(row.original.qty_change),
  },
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <HeaderSortButton name="Listed Quantity" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
  },
  {
    accessorKey: "created_at",
    id: "created",
    header: () => (
      <HeaderServerSortBtn name="Created At" sortBy="created_at" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />
    ),
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("created"))),
  },
];
