"use client";
import FormComboBox from "@/components/form/form.field.combobox";
import FormFile from "@/components/form/form.field.file";
import FormInput from "@/components/form/form.field.input";
import FormSelect from "@/components/form/form.field.select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateVariantSchema } from "@/lib/zod-schemas/product.schema";
import { Product, Variants, variants } from "@/models/product.model";
import { fetchProductIdsAndNamesClient, updateVariant } from "@/utils/fetch/client/product.client-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ProductVariant } from "@/models/product.model";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Props = { variant: ProductVariant };
export default function VariantEditForm({ variant }: Props) {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  async function handleSetProducts() {
    setProducts([...(await fetchProductIdsAndNamesClient(params.get("search") || ""))]);
  }
  useEffect(() => {
    handleSetProducts();
  }, [params.get("search")]);
  const form = useForm<z.infer<typeof updateVariantSchema>>({
    resolver: zodResolver(updateVariantSchema),
    defaultValues: {
      name: variant.name,
      type: variant.type as Variants,
      weight: String(variant.weight),
      product_id: variant.product_id,
    },
  });
  function onSubmit(data: z.infer<typeof updateVariantSchema>) {
    updateVariant(variant.id, data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput control={form.control} name="name" label="Name:*" placeholder="Enter variant name here..." />
        <FormSelect control={form.control} name="type" label="Variant Type:*" placeholder="Pick a variant type...">
          {variants.map((variant: string) => (
            <SelectItem key={variant} value={variant}>
              {variant}
            </SelectItem>
          ))}
        </FormSelect>
        <FormInput control={form.control} name="weight" label="Weight in grams:*" placeholder="Enter variant's weight here..." />
        <FormComboBox form={form} name="product_id" label="Select A Product:*" datas={products} />
        <FormFile control={form} name="variant_image" label="Variant Image:*" data={variant.images.name} />
        <Button type="submit" className="text-white" disabled={form.formState.isSubmitting ? true : false}>
          <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
          Submit
        </Button>
      </form>
    </Form>
  );
}
