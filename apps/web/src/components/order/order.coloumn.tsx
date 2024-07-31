"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerOrders } from "@/models/order.model";
import Link from "next/link";

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
