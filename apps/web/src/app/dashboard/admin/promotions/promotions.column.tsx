"use client";
import ApprovalDialog from "@/components/approval-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Delete, ImageIcon, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/auth.store";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import { toIDR } from "@/utils/toIDR";
import { Badge } from "@/components/ui/badge";
import { PromoType, TPromotion } from "@/models/promotion.model";
import { Role } from "@/models/user.model";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PromoImageUpdate from "./_components/promo.update.form";

export const promoColumns: ColumnDef<TPromotion>[] = [
  {
    accessorKey: "image_id",
    header: "Images",
    cell: ({ row }) => {
      const imageName = row.original.image?.name;
      return (
        <div className="w-24">
          <Image
            src={imageName ? `${NEXT_PUBLIC_BASE_API_URL}/images/${imageName}` : "/placeholder-nonAvatar.svg"}
            alt={`${row.original.title} image`}
            width={240}
            height={240}
            className="rounded-md border object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <HeaderServerSortBtn name="Title" sortBy="title" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
    id: "title",
    cell: ({ row }) => <p className="font-bold">{row.getValue("title")}</p>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    id: "amount",
    header: () => <HeaderServerSortBtn name="Amount" sortBy="amount" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
    cell: ({ row }) => {
      const { original: promo } = row;
      return promo.type === PromoType.discount ? promo.amount + "%" : toIDR(promo.amount);
    },
  },
  {
    accessorKey: "min_transaction",
    header: () => (
      <HeaderServerSortBtn
        name="Min. Transaction"
        sortBy="min_transaction"
        sortByParamsKey="sort_by_tab1"
        sortDirParamsKey="sort_dir_tab1"
      />
    ),
    id: "min-trans",
    cell: ({ row }) => toIDR(row.getValue("min-trans")),
  },
  {
    accessorKey: "expiry_date",
    id: "exp-date",
    header: () => (
      <HeaderServerSortBtn name="Expiry Date" sortBy="expiry_date" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />
    ),
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("exp-date"))),
  },
  {
    accessorKey: "is_valid",
    header: () => <HeaderServerSortBtn name="Status" sortBy="is_valid" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
    cell: ({ row }) => {
      const { original: promo } = row;
      return <Badge variant={promo.is_valid ? "default" : "destructive"}>{promo.is_valid ? "valid" : "invalid"}</Badge>;
    },
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
    id: "action",
    cell: ({ row }) => {
      const promo = row.original;
      const { user: admin } = useAuthStore((s) => s);
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(admin.role === Role.store_admin && "hidden")} asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <ImageIcon className="mr-2" />
                    Add/Edit Image
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-80" align="start">
                  <PromoImageUpdate promo={promo} />
                </PopoverContent>
              </Popover>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild className={cn(admin.role !== Role.super_admin ? "hidden" : "flex cursor-pointer")}>
                <DropdownMenuItem>
                  <Delete className="mr-2 size-4" />
                  Deactivate
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <ApprovalDialog
            onClick={() => {
              //   deleteProduct(product.id);
            }}
          />
        </AlertDialog>
      );
    },
  },
];
