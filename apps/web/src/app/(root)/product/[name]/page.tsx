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
import ProductDetailsAddress from "../_components/product.address";
import { fetchStoreByCityId } from "@/utils/fetch/server/store.fetch";
import { TCategory } from "@/models/category.model";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type Props = { params: { name: string }; searchParams: SearchParams };

export const generateMetadata = async ({ params, searchParams }: Props) => {
  const { name } = params;
  const details: Product = await fetchProductDetailsByCityID(Number(searchParams.city_id), name);
  return {
    title: details.name,
  };
};

export default async function ProductDetailsPage({ params, searchParams }: Props) {
  const { name } = params;
  const details: Product = await fetchProductDetailsByCityID(Number(searchParams.city_id), name);
  const store = await fetchStoreByCityId(Number(searchParams.city_id));
  const categories = await fetchCategories();
  return (
    <>
      <Header searchParams={searchParams} />
      <div className="container">
        <div className="flex flex-col gap-5 p-5 md:flex-row">
          <article className="order-2 flex flex-col gap-3 md:order-1">
            <h2 className="hidden text-4xl font-extrabold md:block">{details?.name}</h2>
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={`/categories/${details?.category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}`}
                className="flex w-fit items-center gap-4 rounded-lg border bg-white p-2 shadow-sm"
              >
                <Image
                  src={`${NEXT_PUBLIC_BASE_API_URL}/images/${details?.category.image?.name}`}
                  alt={`${details?.category.image?.name} image`}
                  width={240}
                  height={240}
                  className="size-6 rounded-md border object-cover"
                />
                <p className="text-nowrap text-sm">{details?.category.name}</p>
              </Link>
              <ChevronRight className="w-5" />
              <Link
                className="text-sm hover:underline"
                href={`/categories/${details?.category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}&sub_category=${formatQueryString(details?.sub_category.name)}`}
              >
                {details?.sub_category.name}
              </Link>
            </div>
            <Separator className="hidden md:block" />
            <div className={cn(!details?.description && "hidden", "flex flex-col gap-2")}>
              <h3 className="text-xl font-bold">Description:</h3>
              <p className="text-sm">{details?.description}</p>
              <Separator />
            </div>
            <div className={cn(!details?.shelf_life && "hidden", "flex flex-col gap-2")}>
              <h3 className="text-xl font-bold">Shelf Life:</h3>
              <p className="text-sm">{details?.shelf_life || "-"}</p>
              <Separator />
            </div>
            <div className={cn(!details?.nutrition_facts && "hidden", "flex flex-col gap-2")}>
              <h3 className="text-xl font-bold">Nutrition Facts:</h3>
              <p className="text-sm">{details?.nutrition_facts || "-"}</p>
              <Separator />
            </div>
            <div className={cn(!details?.storage_instructions && "hidden", "flex flex-col gap-2")}>
              <h3 className="text-xl font-bold">Storage Instructions:</h3>
              <p className="text-sm">{details?.storage_instructions}</p>
              <Separator />
            </div>
            <ProductDetailsAddress store={store.address} />
            <Separator />
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">Explore Other Categories:</h2>
              <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-6">
                {categories?.map((category: TCategory) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}`}
                    className="flex flex-col items-center gap-2 rounded-lg border bg-white p-2 shadow-sm"
                  >
                    <Image
                      src={`${NEXT_PUBLIC_BASE_API_URL}/images/${category.image?.name}`}
                      alt={`${category.image?.name} image`}
                      width={240}
                      height={240}
                      className="min-h-24 min-w-24 rounded-md object-cover"
                    />
                    <p className="text-center text-xs">{category.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </article>
          <ProductDetailsForm product={details} />
        </div>
      </div>
      <Footer />
    </>
  );
}
