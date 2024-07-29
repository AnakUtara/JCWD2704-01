import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CityType } from "@/types/cities.type";
import { Check } from "lucide-react";
import { useRef, useState } from "react";

export const CreateStoreSelectCity = ({
  cities,
  className,
  onCitySelect,
  errorMsg,
  defaultValue,
}: {
  cities: CityType[];
  className?: string;
  errorMsg?: string;
  onCitySelect?: (city_id: number) => void;
  defaultValue?: number;
}) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div className={className}>
      <label htmlFor="city" className="text-lg font-medium">
        Store City
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id="city"
            variant="outline"
            role="combobox"
            className={cn("w-full justify-start text-muted-foreground", errorMsg ? "text-destructive" : "")}
          >
            {defaultValue
              ? cities.find((city) => city.city_id === defaultValue)?.city_name
              : value
                ? cities.find((city) => city.city_id === value)?.city_name
                : "Select Store City"}
          </Button>
        </PopoverTrigger>

        {errorMsg && <div className="text-destructive">{errorMsg}</div>}

        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search City" />
            <CommandList className="scrollbar-hidden">
              <CommandEmpty>No City found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.city_id}
                    value={city.city_name}
                    className="cursor-pointer gap-2 px-0"
                    onSelect={() => {
                      setValue(city.city_id);
                      onCitySelect && onCitySelect(city.city_id);
                      ref.current?.click();
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", city.city_id === value ? "opacity-100" : "opacity-0")} />
                    {city.city_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
