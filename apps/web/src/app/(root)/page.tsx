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

export const revalidate: Revalidate = 900;

const getPromotion = async (): Promise<{ result: { name: string }[] } | undefined> => {
  try {
    const response = await axiosInstanceSSR().get("/promotion/featured");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const getProductByDiscount = await fetchProductsByQuery({ city_id: searchParams.city_id, discount: "true" });
  const getProductsBuyGet = await fetchProductsByQuery({ city_id: searchParams.city_id, promo: "buy_get" });
  const promotion = await getPromotion();
  return (
    <>
      <Header />
      <main className="size-full min-h-screen space-y-6 pb-6">
        <section className="container">
          <Promotion datas={promotion} />
        </section>
        <div className="size-full px-4 md:px-0">
          <Section className="w-full space-y-4 py-4">
            <h1 className="mx-auto max-w-screen-md text-3xl font-bold leading-tight md:text-4xl lg:leading-[1.1]">Category</h1>
            <Suspense fallback={<Spinner />}>
              <Category />
            </Suspense>
          </Section>
        </div>
        <ProductsCarousel title="Diskon Meriah Hari Ini!" searchParams={searchParams} products={getProductByDiscount} />
        <ProductsCarousel title="BUY 1 GET 1!" searchParams={searchParams} products={getProductsBuyGet} />
      </main>
      <Footer />
    </>
  );
}
