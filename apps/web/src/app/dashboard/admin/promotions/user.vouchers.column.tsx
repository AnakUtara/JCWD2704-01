"use client";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import { toIDR } from "@/utils/toIDR";
import { Badge } from "@/components/ui/badge";
import { PromoType, TPromotion } from "@/models/promotion.model";

export const userVouchersColumn: ColumnDef<TPromotion>[] = [
  {
    accessorKey: "title",
    id: "title",
    header: () => <HeaderServerSortBtn name="Title" sortBy="title" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />,
    cell: ({ row }) => <p className="font-bold">{row.getValue("title")}</p>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    id: "amount",
    header: () => <HeaderServerSortBtn name="Amount" sortBy="amount" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />,
    cell: ({ row }) => {
      const { original: promo } = row;
      return promo.type === PromoType.referral_voucher ? promo.amount + "%" : toIDR(promo.amount);
    },
  },
  {
    accessorKey: "user.email",
    id: "owner",
    header: "Owner",
    cell: ({ row }) => row.getValue("owner"),
  },
  {
    accessorKey: "min_transaction",
    header: () => (
      <HeaderServerSortBtn
        name="Min. Transaction"
        sortBy="min_transaction"
        sortByParamsKey="sort_by_tab2"
        sortDirParamsKey="sort_dir_tab2"
      />
    ),
    id: "min-trans",
    cell: ({ row }) => toIDR(row.getValue("min-trans")),
  },
  {
    accessorKey: "expiry_date",
    id: "exp-date",
    header: () => (
      <HeaderServerSortBtn name="Expiry Date" sortBy="expiry_date" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />
    ),
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("exp-date"))),
  },
  {
    accessorKey: "is_valid",
    header: () => <HeaderServerSortBtn name="Status" sortBy="is_valid" sortByParamsKey="sort_by_tab2" sortDirParamsKey="sort_dir_tab2" />,
    cell: ({ row }) => {
      const { original: promo } = row;
      return <Badge variant={promo.is_valid ? "default" : "destructive"}>{promo.is_valid ? "valid" : "invalid"}</Badge>;
    },
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
