import HeaderServerSortBtn from "@/components/table/header.server-sort.button";
import HeaderSortButton from "@/components/table/header.sort.button";
import { ProductVariant } from "@/models/product.model";
import { TStoreStock } from "@/models/store.model";
import { imageUrl } from "@/utils/imageUrl";
import { toIDR } from "@/utils/toIDR";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const DetailProductColumn: ColumnDef<TStoreStock>[] = [
  {
    accessorKey: "product.images.name",
    header: "Images",
    id: "product_image",
    cell: ({ row }) => {
      const imageName = row.getValue("product_image");
      return (
        <div className="size-20">
          <Image
            src={imageUrl.render(imageName as string)}
            alt={`${imageName} image`}
            width={240}
            height={240}
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "product.product.name",
    id: "product_name",
    header: ({ column }) => <HeaderSortButton name="Product Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "product.name",
    id: "variant_name",
    header: ({ column }) => <HeaderSortButton name="Variant" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "unit_price",
    id: "price",
    header: ({ column }) => <HeaderSortButton name="Price" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      return toIDR(price);
    },
  },
  {
    accessorKey: "quantity",
    header: () => <HeaderServerSortBtn name="Quantity" sortBy="quantity" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
  },
  {
    accessorKey: "discount",
    id: "discount",
    header: () => <HeaderServerSortBtn name="Discount" sortBy="discount" sortByParamsKey="sort_by_tab1" sortDirParamsKey="sort_dir_tab1" />,
    cell: ({ row }) => row.getValue("discount") + "%",
  },
];
