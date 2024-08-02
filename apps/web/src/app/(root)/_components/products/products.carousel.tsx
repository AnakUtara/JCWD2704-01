import { Section } from "@/components/Section";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Product } from "@/models/product.model";
import { SearchParams } from "@/models/search.params";
import ProductCard from "./product.card";
import { FrownIcon, HeartCrackIcon } from "lucide-react";

type Props = { title: string; searchParams: SearchParams; products: Product[] };
export default function ProductsCarousel({ title, searchParams, products }: Props) {
  return (
    <div className="size-full px-4 md:px-0">
      <Section className={cn(!searchParams.city_id || !products.length ? "hidden" : "flex", "flex-col p-0 md:flex-row")}>
        <div className="w-full rounded-t-md bg-primary p-4 text-white md:w-60 md:rounded-l-md">
          <h2 className="text-3xl font-extrabold md:text-5xl">{title}</h2>
        </div>
        <div className="w-full px-16 py-4">
          <Carousel>
            <CarouselContent>
              {products?.map((product: Product, i: number) => (
                <CarouselItem key={i} className="md:basis1/3 basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Section>
      <Section className={cn(!searchParams.city_id || !products.length ? "block" : "hidden", "w-full space-y-4 bg-destructive py-4")}>
        <span className="flex w-full items-center justify-center gap-2 text-white">
          <FrownIcon />
          No products added to this store location yet...
          <HeartCrackIcon />
        </span>
      </Section>
    </div>
  );
}
