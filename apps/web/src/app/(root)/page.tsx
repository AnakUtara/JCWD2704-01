import { Section } from "@/components/Section";
import { Revalidate } from "next/dist/server/lib/revalidate";
import { Category } from "./_components/categories";
import { Promotion } from "./_components/promotion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import { fetchProductsByQuery } from "@/utils/fetch/server/store.fetch";
import { SearchParams } from "@/models/search.params";
import ProductsCarousel from "./_components/products/products.carousel";
import { axiosInstanceSSR } from "@/lib/axios.server-config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TCategory } from "@/models/category.model";

export const revalidate: Revalidate = 900;

const getPromotion = async (): Promise<{ result: { name: string }[] } | undefined> => {
  try {
    const response = await axiosInstanceSSR().get("/promotion/featured");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async (): Promise<TCategory[] | undefined> => {
  try {
    const response = await axiosInstanceSSR().get("/categories/category-list");
    return response.data.categories;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const getProductByDiscount = await fetchProductsByQuery({ city_id: searchParams.city_id, discount: "true" });
  const getProductsBuyGet = await fetchProductsByQuery({ city_id: searchParams.city_id, promo: "buy_get" });
  const promotion = await getPromotion();
  const categories = await getCategories();
  return (
    <>
      <Header searchParams={searchParams} />
      <main className="size-full min-h-screen gap-4 pb-6">
        <div className="container space-y-4">
          <Promotion datas={promotion} />

          <div className="block px-4 md:hidden md:px-0">
            <Section className="mx-auto w-full max-w-screen-md space-y-4 bg-secondary py-4">
              <div>
                <h1 className="text-xl font-bold leading-tight md:text-2xl lg:leading-[1.1]">Category</h1>
                <p className="text-sm text-muted-foreground">Explore your favourite food categories.</p>
              </div>
              <Category data={categories} />
            </Section>
          </div>

          <div className="px-4 xl:px-0">
            <div className="w-full space-y-4 rounded-md border bg-background p-4">
              <div className="container hidden md:block">
                <Category data={categories} />
              </div>
              <div className="flex gap-2">
                <h3 className="text-3xl text-primary font-bold leading-none">Happy Shopping</h3>
              </div>
              <ProductsCarousel title="Diskon Meriah Hari Ini!" searchParams={searchParams} products={getProductByDiscount} />
              <div className="flex gap-2">
                <h4 className="text-2xl font-bold leading-none">Flash Sale</h4>
                <p className="self-end text-sm text-muted-foreground">Only now!</p>
              </div>
              <ProductsCarousel title="BUY 1 GET 1!" searchParams={searchParams} products={getProductsBuyGet} />
            </div>
          </div>

          <div className="p-0">
            <Section className="w-full space-y-4 p-0">
              <Link href={`/search?page=1&city_id=${searchParams.city_id}`} className="">
                <Button className="w-full">Explore Our Products Selection</Button>
              </Link>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
