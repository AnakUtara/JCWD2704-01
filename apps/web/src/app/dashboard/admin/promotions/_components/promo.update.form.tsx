import FormFile from "@/components/form/form.field.file";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { updatePromoImageSchema } from "@/lib/zod-schemas/promotion.schema";
import { TPromotion } from "@/models/promotion.model";
import { updateImagePromo } from "@/utils/fetch/client/promo.client-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = { promo: TPromotion };
export default function PromoImageUpdate({ promo }: Props) {
  const form = useForm<z.infer<typeof updatePromoImageSchema>>({
    resolver: zodResolver(updatePromoImageSchema),
  });
  function onSubmit(data: z.infer<typeof updatePromoImageSchema>) {
    console.log(data);
    updateImagePromo(data, promo?.id || "");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormFile control={form} name="promo_image" label="Promo Image:" placeholder="Select a promo image." aspect="video" />
        <Button type="submit" className="text-white" disabled={form.formState.isSubmitting ? true : false}>
          <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
          Submit
        </Button>
      </form>
    </Form>
  );
}
