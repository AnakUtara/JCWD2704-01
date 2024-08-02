"use client";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
type Props = {
  form: UseFormReturn<any>;
  name: string;
  stock: number;
};
export default function FormQuantityInput({ form, name, stock }: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, formState }) => {
        const { register } = form;
        return (
          <FormItem className="w-44">
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="number"
                  {...register(name, { valueAsNumber: true })}
                  disabled={formState.isSubmitting}
                  defaultValue={field.value}
                />
              </FormControl>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  size={"icon"}
                  onClick={() => form.setValue(name, form.getValues(name) - 1)}
                  disabled={form.getValues(name) === 1}
                >
                  <Minus />
                </Button>
                <Button
                  type="button"
                  size={"icon"}
                  onClick={() => form.setValue(name, form.getValues(name) + 1)}
                  disabled={form.getValues(name) === stock}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
