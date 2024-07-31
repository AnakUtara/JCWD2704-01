"use client"

import { DataTable } from "@/components/table/data-table";
import { TUser } from "@/models/user.model";
import { DetailAdminColumn } from "./DetailAdmin.column";

export const DetailAdmin = ({ admins }: { admins: TUser[] | undefined }) => {
  if (!admins?.length)
    return <div className="flex size-full items-center justify-center text-2xl font-semibold uppercase md:text-3xl">No Admin</div>;

  return <DataTable data={admins} columns={DetailAdminColumn} isVariant layoutId="detail-admins" className="size-full overflow-y-scroll" />
};
