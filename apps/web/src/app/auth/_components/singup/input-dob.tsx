import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { RegisterType } from "@/schemas/user.schema";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { useEffect, useRef } from "react";
import { useEffect, useRef } from "react";

export const RegisterDobInput = ({ form }: { form: UseFormReturn<RegisterType> }) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (form.watch("dob")) ref.current?.click();
  }, [form.watch("dob")]);

  return (
    <FormField
      control={form.control}
      name="dob"
      render={({ field, formState }) => (
        <FormItem className="w-full">
          <FormLabel>Date of Birth</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="w-full">
              <FormControl>
                <Button
                  ref={ref}
                  disabled={formState.isSubmitting}
                  variant="outline"
                  className={cn("flex w-full", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick a Date</span>}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent align="start" sideOffset={20} className="z-50">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                className="rounded border bg-background"
                fixedWeeks
                fromYear={1950}
                toYear={new Date().getFullYear()}
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1990-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
