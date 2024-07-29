"use client";
import FormDatepicker from "@/components/form/form.field.datepick";
import FormFile from "@/components/form/form.field.file";
import FormInput from "@/components/form/form.field.input";
import FormNumber from "@/components/form/form.field.number";
import FormSelect from "@/components/form/form.field.select";
import FormTextArea from "@/components/form/form.field.textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createPromoSchema } from "@/lib/zod-schemas/promotion.schema";
import { PromoType } from "@/models/promotion.model";
import { createPromo } from "@/utils/fetch/client/promo.client-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { add } from "date-fns";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};
export default function PromoCreateForm({}: Props) {
  const form = useForm<z.infer<typeof createPromoSchema>>({
    resolver: zodResolver(createPromoSchema),
    defaultValues: {
      expiry_date: new Date().toDateString(),
    },
  });
  function onSubmit(data: z.infer<typeof createPromoSchema>) {
    createPromo(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput control={form.control} name="title" label="Title:*" placeholder="Enter promotion title..." />
        <FormTextArea control={form.control} name="description" label="Description:*" placeholder="Enter promotion description..." />
        <FormNumber form={form} name="amount" label="Amount:*" placeholder="Enter amount..." />
        <FormNumber form={form} name="min_transaction" label="Min. Transaction:*" placeholder="Enter promotion min. transaction..." />
        <FormSelect control={form.control} name="type" label="Select Promo Type:*" placeholder="Pick a promo type.">
          <SelectItem value={PromoType.voucher}>Voucher</SelectItem>
          <SelectItem value={PromoType.discount}>Discount</SelectItem>
          <SelectItem value={PromoType.buy_get}>Buy 1 Get 1</SelectItem>
        </FormSelect>
        <FormDatepicker
          control={form.control}
          name="expiry_date"
          label="Expiry Date:*"
          fromYear={2024}
          toYear={add(new Date(), { years: 3 }).getFullYear()}
        />
        <FormFile control={form} name="promo_image" label="Promo Image:" placeholder="Select a promo image." />
        <Button type="submit" className="text-white" disabled={form.formState.isSubmitting ? true : false}>
          <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
          Submit
        </Button>
      </form>
    </Form>
  );
}
