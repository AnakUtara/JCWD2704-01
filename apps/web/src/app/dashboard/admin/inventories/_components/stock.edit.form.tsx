"use client";
import FormNumber from "@/components/form/form.field.number";
import FormSelect from "@/components/form/form.field.select";
import FormTextArea from "@/components/form/form.field.textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateStockSchema } from "@/lib/zod-schemas/stock.schema";
import { TPromotion } from "@/models/promotion.model";
import { TStoreStock } from "@/models/store.model";
import { fetchAllBuyGetPromosClient } from "@/utils/fetch/client/promo.client-fetch";
import { updateStock } from "@/utils/fetch/client/store.client-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = { stock: TStoreStock };
export default function UpdateStockForm({ stock }: Props) {
  const form = useForm<z.infer<typeof updateStockSchema>>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      unit_price: stock.unit_price,
      discount: Number(stock.discount),
    },
  });
  function onSubmit(data: z.infer<typeof updateStockSchema>) {
    updateStock(stock.id || "", data);
  }
  const [promos, setPromos] = useState<TPromotion[]>([]);
  async function handleSetPromos() {
    setPromos([...(await fetchAllBuyGetPromosClient())]);
  }
  useEffect(() => {
    handleSetPromos();
  }, []);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormNumber form={form} name="quantity" label="Quantity:*" placeholder="Enter stock quantity..." useSwitch />
        <FormNumber form={form} name="unit_price" label="Price(IDR):*" placeholder="Enter unit price..." />
        <FormNumber form={form} name="discount" label="Discount:*" placeholder="Enter product discount amount..." />
        <FormSelect control={form.control} name="promo_id" label="Select promo:" placeholder="Pick a promo.">
          {promos.map((promo: TPromotion) => (
            <SelectItem value={promo?.id || ""}>{promo?.title}</SelectItem>
          ))}
        </FormSelect>
        <FormTextArea
          control={form.control}
          name="reference"
          label="Reference Notes:"
          placeholder="Enter stock change reference notes here..."
        />
        <Button type="submit" className="text-white" disabled={form.formState.isSubmitting ? true : false}>
          <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
          Submit
        </Button>
      </form>
    </Form>
  );
}
