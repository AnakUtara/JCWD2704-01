"use client";
import HeaderSortBtn from "@/components/table/header.sort.button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TUser } from "@/models/user.model";
import { deleteStoreAdmin } from "@/utils/fetch/client/admin.client-fetch";
import { tableDateFormat } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, MoreHorizontal, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StoreAdminEdit from "../_component/store-admin.edit.dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ApprovalDialog from "@/components/approval-dialog";
import HeaderServerSortBtn from "@/components/table/header.server-sort.button";

export const storeAdminColumns: ColumnDef<TUser>[] = [
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
      const isActive = row.getValue("status");
      return <Badge variant={isActive ? "destructive" : "default"}>{isActive ? "Resigned" : "Active"}</Badge>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const users = row.original;
      return (
        <AlertDialog>
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
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(users?.email || "");
                    toast.success("Email copied to clipboard.", {
                      duration: 1000,
                    });
                  }}
                >
                  Copy user email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Edit className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Delete className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <StoreAdminEdit user={users} />
            <ApprovalDialog onClick={() => deleteStoreAdmin(users.id)} />
          </Dialog>
        </AlertDialog>
      );
    },
  },
];
