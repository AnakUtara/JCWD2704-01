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
      <Section
        className={cn("flex flex-col md:border md:bg-secondary p-0 md:flex-row relative md:min-h-[450px]", !searchParams.city_id || !products.length ? "hidden" : "")}
      >
        <div className="w-full max-md:rounded-md md:rounded-l-md bg-primary p-2 text-white md:max-w-60">
          <h2 className="text-balance text-2xl font-extrabold md:text-5xl uppercase">{title}</h2>
        </div>
        <div className="w-full py-4 md:px-16">
          <Carousel>
            <CarouselContent>
              {products?.map((product: Product, i: number) => (
                <CarouselItem key={i} className="basis-1/2 sm:basis-[210px] lg:basis-[230px]">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        </div>
      </Section>
      <Section className={cn(!searchParams.city_id || !products.length ? "block" : "hidden", "w-full space-y-4 bg-destructive py-4")}>
        <span className="flex w-full items-center justify-center gap-2 text-white">
          <FrownIcon />
          No products added to this section/store location yet...
          <HeartCrackIcon />
        </span>
      </Section>
    </div>
  );
}
