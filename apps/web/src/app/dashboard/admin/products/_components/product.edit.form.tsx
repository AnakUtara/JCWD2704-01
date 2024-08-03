"use client";

import FormInput from "@/components/form/form.field.input";
import FormSelect from "@/components/form/form.field.select";
import FormTextArea from "@/components/form/form.field.textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateProductSchema } from "@/lib/zod-schemas/product.schema";
import { updateProduct } from "@/utils/fetch/client/product.client-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TCategory, TSubCategory } from "@/models/category.model";
import { Product } from "@/models/product.model";
import { useEffect, useState } from "react";
import { fetchCategoriesClient, fetchSubCategoriesWithCatIDClient } from "@/utils/fetch/client/categories.client-fetch";

type Props = { product: Product };
export default function ProductEditForm({ product }: Props) {
  const [category_id, setCategoryID] = useState<number>(product.category_id);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subCats, setSubCats] = useState<TSubCategory[]>([]);
  async function handleCategories() {
    setCategories([...(await fetchCategoriesClient())]);
  }
  async function handleSubCategories() {
    setSubCats([...(await fetchSubCategoriesWithCatIDClient(String(category_id)))]);
  }
  useEffect(() => {
    handleCategories();
  }, []);
  useEffect(() => {
    handleSubCategories();
  }, [category_id]);
  const form = useForm<z.infer<typeof updateProductSchema>>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      shelf_life: product.shelf_life || "",
      nutrition_facts: product.nutrition_facts || "",
      storage_instructions: product.storage_instructions || "",
      category_id: String(product.category_id),
      sub_category_id: String(product.sub_category_id),
    },
  });
  function onSubmit(data: z.infer<typeof updateProductSchema>) {
    updateProduct(product.id, data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput control={form.control} name="name" label="Name:*" placeholder="Enter product name here..." />
        <FormTextArea control={form.control} name="description" label="Description:*" placeholder="Enter product description here..." />
        <FormInput control={form.control} name="shelf_life" label="Shelf Life:" placeholder="Enter product's shelf life here..." />
        <FormTextArea
          control={form.control}
          name="nutrition_facts"
          label="Nutrition Facts:"
          placeholder="Enter product's nutrition facts here..."
        />
        <FormTextArea
          control={form.control}
          name="storage_instructions"
          label="Storage Instructions:"
          placeholder="Enter product's storage instructions here..."
        />{" "}
        <FormSelect
          control={form.control}
          name="category_id"
          label="Select Category:"
          placeholder="Pick a category..."
          setState={setCategoryID}
        >
          {categories?.map((cat: TCategory) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </FormSelect>
        {subCats.length !== 0 && (
          <FormSelect control={form.control} name="sub_category_id" label="Select Sub-Category:" placeholder="Pick a sub-category...">
            {subCats?.map((sub: TSubCategory) => (
              <SelectItem key={sub.id} value={String(sub.id)}>
                {sub.name}
              </SelectItem>
            ))}
          </FormSelect>
        )}
        <Button type="submit" className="text-white" disabled={form.formState.isSubmitting ? true : false}>
          <Loader2 className={cn(form.formState.isSubmitting ? "block" : "hidden", "mr-2 h-4 w-4 animate-spin")} />
          Submit
        </Button>
      </form>
    </Form>
  );
}
