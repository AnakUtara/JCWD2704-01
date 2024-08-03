"use client";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  label: string;
  useSwitch?: boolean;
};
export default function FormNumber({ form, name, label, placeholder = "", useSwitch = false }: Props) {
  const [isPositive, setIsPositive] = useState<boolean>(true);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, formState }) => {
        const { register } = form;
        return (
          <FormItem className="grow">
            <FormLabel htmlFor={name} className="text-right">
              {label}
            </FormLabel>
            <div className="flex items-center gap-2">
              <div className={cn(!useSwitch && "hidden")}>
                <Switch
                  id="positive-negative"
                  checked={isPositive}
                  onCheckedChange={() => {
                    setIsPositive(!isPositive);
                    form.setValue(name, isPositive ? -Math.abs(form.getValues(name)) : Math.abs(form.getValues(name)));
                  }}
                />
              </div>
              <span className={cn(!useSwitch && "hidden", "text-xs font-bold")}>{isPositive ? "Add" : "Sub"}</span>
              <FormControl>
                <Input
                  placeholder={placeholder}
                  type="number"
                  {...register(name, { valueAsNumber: true })}
                  disabled={formState.isSubmitting}
                  defaultValue={1}
                />
              </FormControl>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  size={"icon"}
                  onClick={() => form.setValue(name, form.getValues(name) - 1)}
                  disabled={form.watch(name) <= 0 || formState.isSubmitting}
                >
                  <Minus />
                </Button>
                <Button type="button" size={"icon"} onClick={() => form.setValue(name, form.getValues(name) + 1)}>
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
