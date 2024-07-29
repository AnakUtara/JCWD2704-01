"use client";
import ApprovalDialog from "@/components/approval-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { cn } from "@/lib/utils";
// import CategoriesEditForm from "./_components/categories.update.form";
import useAuthStore, { AuthStore } from "@/stores/auth.store";
import { Role } from "@/models/user.model";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import HeaderSortButton from "@/components/table/header.sort.button";
import { TStoreStock } from "@/models/store.model";
import { toIDR } from "@/utils/toIDR";
import UpdateStockForm from "./_components/stock.edit.form";
import { Badge } from "@/components/ui/badge";

export const stocksColumns: ColumnDef<TStoreStock>[] = [
  {
    accessorKey: "product.images.name",
    header: "Images",
    id: "product_image",
    cell: ({ row }) => {
      const imageName = row.getValue("product_image");
      return (
        <div className="size-20">
          <Image
            src={`${NEXT_PUBLIC_BASE_API_URL}/images/${imageName}`}
            alt={`${imageName} image`}
            width={240}
            height={240}
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "product.product.name",
    id: "product_name",
    header: ({ column }) => <HeaderSortButton name="Product Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "product.name",
    id: "variant_name",
    header: ({ column }) => <HeaderSortButton name="Variant" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "unit_price",
    id: "price",
    header: () => (
      <HeaderServerSortBtn name="Unit Price" sortBy="unit_price" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />
    ),
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      return toIDR(price);
    },
  },
  {
    accessorKey: "quantity",
    header: () => <HeaderServerSortBtn name="Quantity" sortBy="quantity" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
  },
  {
    accessorKey: "discount",
    id: "discount",
    header: () => <HeaderServerSortBtn name="Discount" sortBy="discount" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
    cell: ({ row }) => row.getValue("discount") + "%",
  },
  {
    accessorKey: "store.address.city.city_name",
    id: "store_city",
    header: ({ column }) => <HeaderSortButton name="Store City" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => <Badge className="bg-black text-white hover:bg-zinc-800">{row.getValue("store_city")}</Badge>,
  },
  {
    accessorKey: "store.address.address",
    id: "store_address",
    header: ({ column }) => <HeaderSortButton name="Store Address" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => row.getValue("store_address"),
  },
  {
    accessorKey: "created_at",
    id: "created",
    header: () => (
      <HeaderServerSortBtn name="Created At" sortBy="created_at" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />
    ),
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("created"))),
  },
  {
    accessorKey: "updated_at",
    id: "updated",
    header: () => (
      <HeaderServerSortBtn name="Updated At" sortBy="updated_at" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />
    ),
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("updated"))),
  },
  {
    id: "action",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild className={cn("cursor-pointer")}>
                <DropdownMenuItem>
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AdminCRUDDialog title={`Edit ${stock.product?.product.name}-${stock.product?.name} Data`} desc="You can edit product data here.">
            <UpdateStockForm stock={stock} />
          </AdminCRUDDialog>
        </Dialog>
      );
    },
  },
];
