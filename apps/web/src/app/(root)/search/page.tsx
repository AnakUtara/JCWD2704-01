import SearchParamsInput from "@/components/table/input.search";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Product } from "@/models/product.model";
import { Suspense } from "react";
import ProductCard from "../_components/products/product.card";
import Image from "next/image";
import Pagination from "@/components/pagination";
import { fetchProductsByCityID } from "@/utils/fetch/server/products.fetch";
import { SearchParams } from "@/models/search.params";
import HeaderBgPrimary from "../_components/header/header.bg-primary";
import { Footer } from "@/components/footer";
import PriceRangeButtons from "../categories/_components/price-range.buttons";
import { Header } from "@/components/header";

type Props = {
  searchParams: SearchParams;
};
export default async function SearchPage({ searchParams }: Props) {
  const { products, totalPage } = await fetchProductsByCityID(
    "",
    searchParams.city_id && Number(searchParams.city_id),
    searchParams.search,
    searchParams.page,
    searchParams.min && Number(searchParams.min),
    searchParams.max && Number(searchParams.max),
  );
  return (
    <>
      <Header searchParams={searchParams} />
      <div className="container mt-5 px-4 xl:p-0">
        <SearchParamsInput placeholder="Search products..." />
        <PriceRangeButtons className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center" />
        <div className={cn(!products.length && "hidden", "min-h-dvh")}>
          <Suspense
            fallback={
              <div className="mt-5 grid min-h-dvh place-items-center">
                <Spinner />
              </div>
            }
          >
            <div className={cn(!products?.length && "hidden", "mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
              {products?.map((product: Product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </Suspense>
        </div>
        <div className={cn(products?.length ? "hidden" : "flex", "mt-5 min-h-dvh flex-col items-center justify-center gap-5")}>
          <Image src={"/empty.svg"} width={240} height={240} alt={"empty"} />
          <span>No products added to this store yet...</span>
        </div>
        <div className={cn(!products?.length && "hidden", "my-5 flex justify-center border-t")}>
          <Pagination totalPages={totalPage} />
        </div>
      </div>
      <Footer />
    </>
  );
}
