"use client";

import { DataTable } from "@/components/table/data-table";
import { TStore } from "@/models/store.model";
import { storeAdminColumns } from "./table-column";
import Pagination from "@/components/pagination";

type DataType = {
  stores: TStore[];
  totalPage: number;
};

export const DashboardStoreTable = ({ data }: { data: DataType }) => {
  return (
    <div className="flex size-full flex-col justify-between rounded-md border bg-background p-8">
      <DataTable layoutId="store-table" isVariant data={data.stores} columns={storeAdminColumns} placeholder="Search store..." />
      <div className="flex w-full justify-center">
        <Pagination getPage="page_tab1" totalPages={data.totalPage} className="mt-0" />
      </div>
    </div>
  );
};
