import HeaderSortButton from "@/components/table/header.sort.button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TStore } from "@/models/store.model";
import { TUser } from "@/models/user.model";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, CopyCheck, Edit, MoreHorizontal, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { deleteStore } from "../action";
import Link from "next/link";
import { searchParams } from "@/models/search.params";

export const storeAdminColumns: ColumnDef<TStore>[] = [
  {
    id: "city_name",
    accessorKey: "address.city.city_name",
    header: ({ column }) => <HeaderSortButton name="Store Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => row.getValue("city_name") + " Store",
  },
  {
    id: "address",
    accessorKey: "address.address",
    header: ({ column }) => <HeaderSortButton name="Store Address" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => {
      const handleCopy = () => {
        navigator.clipboard.writeText(row.getValue("address"));
        toast("Copied", { position: "top-right", icon: <CopyCheck className="size-5" /> });
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="max-w-xs truncate">{row.getValue("address")}</TooltipTrigger>
            <TooltipContent onClick={handleCopy}>
              <div className="flex cursor-pointer items-center gap-2 px-4 py-2">
                <span className="block text-balance">{row.getValue("address")}</span>
                <span className="block size-fit rounded-md p-2 transition-colors duration-300 hover:bg-secondary">
                  <Copy className="size-4 shrink-0" />
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "address.details",
    header: ({ column }) => <HeaderSortButton name="Details" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "product_stock.length",
    header: ({ column }) => <HeaderSortButton name="Product" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    accessorFn: ({ product_stock }) => (!product_stock.length ? "No Product" : product_stock.length),
  },
  {
    id: "store_admin",
    accessorKey: "store_admin",
    header: ({ column }) => <HeaderSortButton name="Admin" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => {
      const { original } = row;
      return (
        <div className="flex max-w-screen-sm flex-wrap gap-2" key={"store_admin"}>
          {original.store_admin.length ? (
            original.store_admin.map((s: TUser) => (
              <Badge key={s.id} variant="outline" className="w-fit">
                {s.email}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const store = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>

                <MoreHorizontal className="size-6 shrink-0" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40 md:w-60">
              <DropdownMenuLabel>Setting</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/admin/stores/edit/${store.address_id}${searchParams}`} className="flex gap-4">
                  <Edit className="size-4 shrink-0" />
                  <span className="block">Edit</span>
                </Link>
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex gap-4">
                  <Trash className="size-4 shrink-0" />
                  <span className="block">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {row.getValue("city_name")} Store</AlertDialogTitle>
              <AlertDialogDescription>Are you sure want to delete?</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild onClick={() => deleteStore(store.address_id)}>
                <Button variant="destructive">Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
