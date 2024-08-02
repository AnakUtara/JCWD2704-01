import { Section } from "@/components/Section";
import { Revalidate } from "next/dist/server/lib/revalidate";
import { Category } from "./_components/categories";
import { Promotion } from "./_components/promotion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { dummyPromotion } from "@/constants/promotion";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import { fetchProductsByQuery } from "@/utils/fetch/server/store.fetch";
import { SearchParams } from "@/models/search.params";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/models/product.model";
import ProductCard from "./_components/products/product.card";
import { cn } from "@/lib/utils";
import { FrownIcon, HeartCrackIcon } from "lucide-react";
import ProductsCarousel from "./_components/products/products.carousel";

export const revalidate: Revalidate = 900;

type Props = {
  searchParams: SearchParams;
};
export default async function Home({ searchParams }: Props) {
  const getProductByDiscount = await fetchProductsByQuery({ city_id: searchParams.city_id, discount: "true" });
  const getProductsBuyGet = await fetchProductsByQuery({ city_id: searchParams.city_id, promo: "buy_get" });
  return (
    <>
      <Header />
      <main className="size-full min-h-screen space-y-6 pb-6">
        <section className="container">
          <Promotion datas={dummyPromotion} />
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
