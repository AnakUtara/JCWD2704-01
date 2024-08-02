"use client";

import { DataTable } from "@/components/table/data-table";
import { TStoreStock } from "@/models/store.model";
import { DetailProductColumn } from "./DetailProduct.column";

export const DetailProduct = ({ products }: { products: TStoreStock[] | undefined }) => {
  if (!products?.length)
    return <div className="flex size-full items-center justify-center text-2xl font-semibold uppercase md:text-3xl">No Product</div>;

  return (
    <DataTable data={products} columns={DetailProductColumn} isVariant layoutId="detail-product" className="size-full overflow-y-scroll" />
  );
};
