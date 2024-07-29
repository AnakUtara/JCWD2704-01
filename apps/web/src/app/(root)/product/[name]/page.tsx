import { Product } from "@/models/product.model";
import { SearchParams } from "@/models/search.params";
import { fetchProductDetailsByCityID } from "@/utils/fetch/server/products.fetch";
import ProductDetailsForm from "../_components/product.details.form";
import { formatQueryString } from "@/utils/formatter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/utils/fetch/server/categories.fetch";
import Link from "next/link";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { ChevronRight } from "lucide-react";

type Props = { params: { name: string }; searchParams: SearchParams };
export default async function ProductDetailsPage({ params, searchParams }: Props) {
  const { name } = params;
  const details: Product = await fetchProductDetailsByCityID(Number(searchParams.city_id), name);
  const categories = await fetchCategories();
  return (
    <div className="container flex flex-col gap-5 p-5 md:flex-row">
      <article className="order-2 flex flex-col gap-2 md:order-1">
        <h2 className="hidden text-4xl font-extrabold md:block">{details.name}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/categories/${details.category.name.toLowerCase().split(" ").join("-")}?store_id=${searchParams.store_id}`}
            className="flex w-fit items-center gap-4 rounded-lg border p-2 "
          >
            <Image
              src={`${NEXT_PUBLIC_BASE_API_URL}/images/${details.category.image?.name}`}
              alt={`${details.category.image?.name} image`}
              width={240}
              height={240}
              className="size-6 rounded-md border object-cover"
            />
            <p className="text-nowrap text-sm">{details.category.name}</p>
          </Link>
          <ChevronRight className="w-5" />
          <Link
            className="text-sm hover:underline"
            href={`/categories/${details.category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}&sub_category=${formatQueryString(details.sub_category.name)}`}
          >
            {details.sub_category.name}
          </Link>
        </div>
        <Separator />
        <div className={cn(!details.description && "hidden", "flex flex-col gap-2")}>
          <h3 className="text-xl font-bold">Description:</h3>
          <p className="text-sm">{details.description}</p>
          <Separator />
        </div>
        <div className={cn(!details.shelf_life && "hidden", "flex flex-col gap-2")}>
          <h3 className="text-xl font-bold">Shelf Life:</h3>
          <p className="text-sm">{details.shelf_life}</p>
          <Separator />
        </div>
        <div className={cn(!details.nutrition_facts && "hidden", "flex flex-col gap-2")}>
          <h3 className="text-xl font-bold">Nutrition Facts:</h3>
          <p className="text-sm">{details.nutrition_facts}</p>
          <Separator />
        </div>
        <div className={cn(!details.storage_instructions && "hidden", "flex flex-col gap-2")}>
          <h3 className="text-xl font-bold">Storage Instructions:</h3>
          <p className="text-sm">{details.storage_instructions}</p>
          <Separator />
        </div>
      </article>
      <ProductDetailsForm product={details} />
    </div>
  );
}
