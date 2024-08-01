import { Check } from "lucide-react";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { UserCreateAddressType } from "@/schemas/address.schema";
import { CityType } from "@/types/cities.type";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export const AddressCityInput = ({
  form,
  cities,
  city: userCity,
}: {
  form: UseFormReturn<UserCreateAddressType>;
  cities: CityType[] | undefined;
  city?: string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <FormField
      control={form.control}
      name="city_id"
      render={({ field, formState }) => (
        <FormItem>
          <FormLabel>City</FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  ref={ref}
                  role="combobox"
                  variant="outline"
                  disabled={formState.isSubmitting}
                  className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                >
                  {field.value
                    ? cities?.find((city) => city.city_id.toString() === field.value)?.city_name
                    : userCity
                      ? userCity
                      : "Select your city"}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="p-1">
              <Command>
                <CommandInput placeholder="Search City" />
                <CommandList className="scrollbar-hidden">
                  <CommandEmpty>No City found.</CommandEmpty>
                  <CommandGroup>
                    {cities?.map((city) => (
                      <CommandItem
                        value={city.city_name}
                        key={city.city_id}
                        className="gap-2 px-0"
                        onSelect={() => {
                          form.setValue("city_id", city.city_id.toString());
                          ref.current?.click();
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", city.city_id.toString() === field.value ? "opacity-100" : "opacity-0")} />
                        {city.city_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
