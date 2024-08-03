"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerOrders } from "@/models/order.model";
import Link from "next/link";
import LocalTime from "../localTime";

export const orderColoumn: ColumnDef<CustomerOrders>[] = [
  {
    accessorKey: "inv_no",
    header: "Invoice",
  },
  {
    accessorKey: "origin_id",
    header: "Store",
  },
  {
    accessorKey: "user_id",
    header: "User",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "duedate",
    cell: ({ row }) => (
      <h1 className="text-nowrap">
        <LocalTime time={row.getValue("created_at")} />
      </h1>
    ),
  },
  {
    accessorKey: "expire",
    header: "expire",
    cell: ({ row }) => (
      <h1 className="text-nowrap">
        <LocalTime time={row.getValue("expire")} />
      </h1>
    ),
  },
  {
    accessorKey: "inv_no",
    header: "Detail",
    id: "inv",
    cell: ({ row }) => (
      <Link className="italic text-blue-500 hover:text-blue-300" href={`./orders/${row.getValue("inv")}`}>
        See Details
      </Link>
    ),
  },
];
