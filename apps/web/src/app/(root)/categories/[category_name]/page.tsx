import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { TCategory } from "@/models/category.model";
import { fetchCategories, fetchSubCategoriesWithCatName } from "@/utils/fetch/server/categories.fetch";
import Image from "next/image";
import Link from "next/link";
import { Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, TagIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductsByCityID } from "@/utils/fetch/server/products.fetch";
import { SearchParams } from "@/models/search.params";
import { Product } from "@/models/product.model";
import ProductCard from "../../_components/products/product.card";
import SubCategoriesBtns from "../_components/subcategories.buttons";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import SearchParamsInput from "@/components/table/input.search";
import { Separator } from "@radix-ui/react-separator";

type Props = { params: { category_name: string }; searchParams: SearchParams };
export default async function ProductsByCategoryListPage({ params, searchParams }: Props) {
  const { category_name } = params;
  const { search, page } = searchParams;
  const categories = await fetchCategories();
  const subCategories = await fetchSubCategoriesWithCatName(category_name.split("-").join(" ").replaceAll("%26", "&"));
  const { products, totalPage } = await fetchProductsByCityID(
    searchParams.sub_category?.replaceAll("%26", " & ") || category_name || "",
    Number(searchParams.city_id),
    search,
    page,
  );
  console.log(products)

  if (!categories?.length) return <div>Not Found</div>;

  return (
    <div className="container flex h-dvh flex-col md:flex-row md:pt-5">
      <aside className="flex gap-5 overflow-x-auto rounded-lg p-5 md:flex-col md:border">
        {categories.map((category: TCategory) => (
          <Link
            key={category.id}
            href={`/categories/${category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}`}
            className="flex flex-col items-center gap-4 rounded-lg border p-2 md:flex-row"
          >
            <Image
              src={`${NEXT_PUBLIC_BASE_API_URL}/images/${category.image?.name}`}
              alt={`${category.image?.name} image`}
              width={240}
              height={240}
              className="min-h-16 min-w-16 rounded-md object-cover md:size-12"
            />
            <p className="text-center text-xs md:text-nowrap md:text-left lg:text-sm">{category.name}</p>
          </Link>
        ))}
      </aside>
      <main className="flex flex-1 flex-col justify-between overflow-y-auto px-5 pb-4 pt-1">
        <div>
          <div className="mb-5 mt-5 md:mt-0">
            <SearchParamsInput placeholder="Search products..." />
          </div>
          <div className="flex gap-5 overflow-x-auto pb-5">
            <SubCategoriesBtns subCategories={subCategories} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-5">
            <Suspense fallback={<div className="mt-5 grid place-items-center">Loading...</div>}>
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Suspense>
          </div>
        </div>

        <div className="mt-5 flex justify-center border-t">
          <Pagination totalPages={totalPage} />
        </div>
      </main>
    </div>
  );
}
