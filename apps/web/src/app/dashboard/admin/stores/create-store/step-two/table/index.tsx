"use client";

import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TUser } from "@/models/user.model";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";

export const createStoreAdminSelectColumns: ColumnDef<TUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
        onCheckedChange={(check) => table.toggleAllRowsSelected(!!check)}
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(check) => row.toggleSelected(!!check)} aria-label="Select Row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Fullname",
    accessorKey: "full_name",
    header: () => <HeaderServerSortBtn name="Full Name" sortBy="full_name" />,
  },
  {
    accessorKey: "email",
    header: () => <HeaderServerSortBtn name="Email" sortBy="email" />,
  },
  {
    accessorKey: "gender",
    header: () => <HeaderServerSortBtn name="Gender" sortBy="gender" />,
    accessorFn: (user) => (user.gender === "male" ? "Male" : "Female"),
  },
  {
    accessorKey: "dob",
    header: () => <HeaderServerSortBtn name="Date of birth" sortBy="dob" />,
    cell: ({ row }) => new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(row.getValue("dob"))),
  },
  {
    accessorKey: "phone_no",
    header: () => <HeaderServerSortBtn name="Phone Number" sortBy="phone_no" />,
    accessorFn: (user) => (user.phone_no ? user.phone_no : "-"),
  },
  {
    accessorKey: "addresses",
    id: "address",
    accessorFn: (user) => (user.addresses?.length ? user.addresses[0]?.address : "-"),
    header: "Address",
  },
  {
    accessorKey: "addresses",
    id: "details",
    accessorFn: (user) => (user.addresses?.length ? user.addresses[0]?.details : "-"),
    header: "Details",
  },
];
