"use client";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import HeaderSortBtn from "@/components/table/header.sort.button";
import { Badge } from "@/components/ui/badge";
import { TUser } from "@/models/user.model";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";

export const customersColumns: ColumnDef<TUser>[] = [
  {
    accessorKey: "full_name",
    header: () => <HeaderServerSortBtn name="Full Name" sortBy="full_name" />,
    id: "Fullname",
  },
  {
    accessorKey: "email",
    header: () => <HeaderServerSortBtn name="Email" sortBy="email" />,
  },
  {
    accessorKey: "gender",
    header: () => <HeaderServerSortBtn name="Gender" sortBy="gender" />,
  },
  {
    accessorKey: "dob",
    header: () => <HeaderServerSortBtn name="Date of Birth" sortBy="dob" />,
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("dob"))),
  },
  {
    accessorKey: "addresses",
    id: "address",
    accessorFn: (user) => (user.addresses?.length ? user.addresses[0]?.address : "-"),
    header: "Address",
    cell: ({ row }) => <div className="min-w-48">{row.getValue("address")}</div>,
  },
  {
    accessorKey: "addresses",
    id: "details",
    accessorFn: (user) => (user.addresses?.length ? user.addresses[0]?.details : "-"),
    header: "Details",
  },
  {
    accessorKey: "addresses",
    id: "city",
    accessorFn: (user) => (user.addresses?.length ? user.addresses[0]?.city.city_name : "-"),
    header: ({ column }) => <HeaderSortBtn name="City" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "is_verified",
    id: "verification",
    header: () => <HeaderServerSortBtn name="Verification Status" sortBy="is_verified" />,
    cell: ({ row }) => {
      const isActive = row.getValue("verification");
      return <Badge variant={!isActive ? "destructive" : "default"}>{!isActive ? "Unverified" : "Verified"}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    id: "join",
    header: () => <HeaderServerSortBtn name="Join Date" sortBy="created_at" />,
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("join"))),
  },
  {
    accessorKey: "is_banned",
    id: "status",
    header: () => <HeaderServerSortBtn name="Status" sortBy="is_banned" />,
    cell: ({ row }) => {
      const isActive = row.getValue("is_banned");
      return <Badge variant={isActive ? "destructive" : "default"}>{isActive ? "Deleted" : "Active"}</Badge>;
    },
  },
];
