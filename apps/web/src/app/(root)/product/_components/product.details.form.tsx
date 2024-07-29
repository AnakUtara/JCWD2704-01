"use client";
import { Form } from "@/components/ui/form";
import { Product, ProductVariant } from "@/models/product.model";
import { useForm } from "react-hook-form";
import ProductCarouselForm from "./product.carousel.form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { cartSchema } from "@/lib/zod-schemas/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCartIcon, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toIDR } from "@/utils/toIDR";
import { Badge } from "@/components/ui/badge";
import FormQuantityInput from "@/components/form/form.qty.number";
import { addToCart } from "@/utils/fetch/client/cart.client-fetch";
import useAuthStore from "@/stores/auth.store";
import { updateCart } from "@/actions/updateCart";
import { ButtonSubmit } from "@/components/ui/button-submit";
import { useEffect } from "react";

type Props = { product: Product };
export default function ProductDetailsForm({ product }: Props) {
  const { user } = useAuthStore((s) => s);
  const form = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      store_stock_id: product.variants[0].store_stock[0].id,
      quantity: 1,
    },
  });
  async function onSubmit(data: z.infer<typeof cartSchema>) {
    await updateCart(data);
    window.location.reload();
  }
  const findStock =
    product.variants.find((variant) => variant.store_stock[0].id === form.watch("store_stock_id"))?.store_stock[0] ||
    product.variants[0].store_stock[0];
  const discCalc = findStock?.discount && findStock?.unit_price - (findStock?.unit_price * findStock?.discount) / 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="order-1 md:order-2">
        <Card className="min-w-96 p-5">
          <div className="flex flex-col-reverse gap-4 md:flex-col">
            <h2 className="text-2xl font-extrabold md:hidden">{product.name}</h2>
            <ProductCarouselForm form={form} product={product} />
          </div>
          <div className="mt-3 flex flex-col gap-4 px-1">
            <Separator />
            <CardTitle>{toIDR(!findStock?.discount ? findStock?.unit_price : discCalc || 0)}</CardTitle>
            <CardDescription className={cn(!findStock?.discount ? "hidden" : "flex items-center gap-2")}>
              <Badge variant={"destructive"} className="text-white">
                <Tag className="mr-1" />
                {findStock?.discount}% OFF
              </Badge>
              <p className="text-lg text-muted-foreground line-through">{toIDR(findStock?.unit_price)}</p>
            </CardDescription>
            <Separator />
            <div className="flex items-center justify-between">
              <p>Stock: {findStock?.quantity}</p>
              <Separator className="h-8" orientation="vertical" />
              <FormQuantityInput form={form} name="quantity" stock={findStock?.quantity || 0} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p>Subtotal:</p>
              <CardTitle>{toIDR(discCalc || findStock.unit_price * form.watch("quantity"))}</CardTitle>
            </div>
          </div>
          <Separator className="mt-3" />
          {/* <Button
            size={"lg"}
            type="submit"
            className="mt-3 w-full text-white"
            disabled={form.formState.isSubmitting || findStock.quantity === 0 || !user.email}
          >
            <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
            <ShoppingCartIcon className="mr-2" />
            Add To Cart
          </Button> */}
          <ButtonSubmit
            type="submit"
            className="mt-3 flex w-full text-white"
            disable={findStock.quantity === 0 || !user.email}
            isSubmitting={form.formState.isSubmitting}
            label={
              <>
                <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
                <ShoppingCartIcon className="mr-2" />
                Add To Cart
              </>
            }
          />
        </Card>
      </form>
    </Form>
  );
}
