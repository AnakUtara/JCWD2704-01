import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { TCategory } from "@/models/category.model";
import { fetchCategories, fetchSubCategoriesWithCatName } from "@/utils/fetch/server/categories.fetch";
import Image from "next/image";
import Link from "next/link";
import { fetchProductsByCityID } from "@/utils/fetch/server/products.fetch";
import { SearchParams } from "@/models/search.params";
import { Product } from "@/models/product.model";
import ProductCard from "../../_components/products/product.card";
import SubCategoriesBtns from "../_components/subcategories.buttons";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import SearchParamsInput from "@/components/table/input.search";
import Spinner from "@/components/ui/spinner";
import HeaderBgPrimary from "../../_components/header/header.bg-primary";

export const generateMetadata = async ({ params }: Props) => {
  const { category_name } = params;
  return {
    title: category_name,
  };
};

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
  if (!categories?.length) return <div>Not Found</div>;

  return (
    <div className="container">
      <HeaderBgPrimary href="/" useSearch={false} title={"Search Categories"} />
      <div className="flex flex-col md:flex-row md:pt-5">
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
        <main className="flex-1 overflow-y-auto px-5 pt-1">
          <div className="mb-5 mt-5 md:mt-0">
            <SearchParamsInput placeholder="Search products..." />
          </div>
          <div className="flex gap-5 overflow-x-auto pb-5">
            <SubCategoriesBtns subCategories={subCategories} />
          </div>
          <Suspense
            fallback={
              <div className="mt-5 grid place-items-center">
                <Spinner />
              </div>
            }
          >
            <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-5 flex justify-center border-t">
              <Pagination totalPages={totalPage} />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
