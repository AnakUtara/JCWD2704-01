"use client";
import { Product, ProductVariant } from "@/models/product.model";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselMainContainer, CarouselThumbsContainer, SliderMainItem, SliderThumbItem } from "@/components/ui/carousel.vercel";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

type Props = { form: UseFormReturn<any>; product: Product };
export default function ProductCarouselForm({ form, product }: Props) {
  return (
    <FormField
      control={form.control}
      name="store_stock_id"
      render={({ field, formState }) => (
        <FormItem>
          <Carousel className="gap-1">
            <CarouselMainContainer className="h-full">
              {product.variants.map((variant: ProductVariant) =>
                variant.store_stock.length ? (
                  <SliderMainItem key={variant.id}>
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        src={`${NEXT_PUBLIC_BASE_API_URL}/images/${variant.images.name}`}
                        alt={`${variant.name}'s image`}
                        fill={true}
                        sizes="100"
                        className="aspect-square rounded-md object-cover"
                      />
                    </AspectRatio>
                  </SliderMainItem>
                ) : null,
              )}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {product.variants.map((variant: ProductVariant, i) =>
                variant.store_stock.length ? (
                  <SliderThumbItem key={variant.id} index={i} className="h-11 bg-transparent">
                    <FormControl>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          form.setValue("store_stock_id", variant.store_stock[0].id);
                        }}
                      >
                        {variant.name}
                      </Button>
                    </FormControl>
                  </SliderThumbItem>
                ) : null,
              )}
            </CarouselThumbsContainer>
          </Carousel>
        </FormItem>
      )}
    />
  );
}
