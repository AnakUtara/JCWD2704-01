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
import { cn } from "@/lib/utils";
import PriceRangeButtons from "../_components/price-range.buttons";
import { Footer } from "@/components/footer";
import { HeaderNavigation } from "@/components/header/HeaderNavigation";
import { Header } from "@/components/header";
export const generateMetadata = async ({ params }: Props) => {
  const { category_name } = params;
  return {
    title: category_name,
  };
};

type Props = { params: { category_name: string }; searchParams: SearchParams };
export default async function ProductsByCategoryListPage({ params, searchParams }: Props) {
  const { category_name } = params;
  const { search, page, min, max } = searchParams;
  const categories = await fetchCategories();
  const subCategories = await fetchSubCategoriesWithCatName(category_name.split("-").join(" ").replaceAll("%26", "&"));
  const { products, totalPage } = await fetchProductsByCityID(
    searchParams.sub_category?.replaceAll("%26", " & ") || category_name || "",
    searchParams.city_id && Number(searchParams.city_id),
    search,
    page,
    min && Number(min),
    max && Number(max),
  );
  return (
    <>
      <Header searchParams={searchParams} />
      <div className="container">
        <div className="flex flex-col md:flex-row md:py-5">
          <Suspense
            fallback={
              <div className="mt-5 grid min-h-dvh place-items-center">
                <Spinner />
              </div>
            }
          >
            <nav className="flex flex-col gap-5">
              <aside className="flex gap-5 overflow-x-auto rounded-lg p-5 md:flex-col md:border md:bg-white md:shadow-sm">
                {categories?.map((category: TCategory) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.name.toLowerCase().split(" ").join("-")}?city_id=${searchParams.city_id}`}
                    className={cn(
                      category_name.replaceAll("-", " ").toLowerCase() === category.name.toLowerCase() ? "bg-primary" : "bg-white",
                      "flex flex-col items-center gap-2 rounded-lg border p-2 md:flex-row",
                    )}
                  >
                    <Image
                      src={`${NEXT_PUBLIC_BASE_API_URL}/images/${category.image?.name}`}
                      alt={`${category.image?.name} image`}
                      width={240}
                      height={240}
                      className="min-h-16 min-w-16 rounded-md border object-cover md:size-12"
                    />
                    <p
                      className={cn(
                        category_name.replaceAll("-", " ").toLowerCase() === category.name.toLowerCase() && "font-bold text-white",
                        "text-center text-xs md:text-nowrap md:text-left lg:text-sm",
                      )}
                    >
                      {category.name}
                    </p>
                  </Link>
                ))}
              </aside>
              <aside className="flex flex-col gap-3 border-y bg-white p-4 md:rounded-md md:border">
                <PriceRangeButtons />
              </aside>
            </nav>
          </Suspense>
          <main className="flex-1 overflow-y-auto px-5 pt-1">
            <div className="mb-5 mt-5 md:mt-0">
              <SearchParamsInput placeholder="Search products..." />
            </div>
            <div className="flex gap-5 overflow-x-auto pb-5">
              <Suspense
                fallback={
                  <div className="mt-5 grid min-h-dvh place-items-center">
                    <Spinner />
                  </div>
                }
              >
                <SubCategoriesBtns subCategories={subCategories} />
              </Suspense>
            </div>
            <div className="min-h-dvh">
              <Suspense
                fallback={
                  <div className="mt-5 grid min-h-dvh place-items-center">
                    <Spinner />
                  </div>
                }
              >
                <div className={cn(!products?.length && "hidden", "mt-5 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4")}>
                  {products?.map((product: Product) => <ProductCard key={product.id} product={product} />)}
                </div>
              </Suspense>
              <div className={cn(products?.length ? "hidden" : "flex", "mt-5 min-h-dvh flex-col items-center justify-center gap-5")}>
                <Image src={"/empty.svg"} width={240} height={240} alt={"empty"} />
                <span>No products added to this store/category yet...</span>
              </div>
            </div>
            <div className={cn(!products?.length && "hidden", "my-5 flex justify-center border-t")}>
              <Pagination totalPages={totalPage} />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
