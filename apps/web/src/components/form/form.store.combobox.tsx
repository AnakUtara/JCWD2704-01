import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import SearchParamsInput from "../table/input.search";
import { TStore } from "@/models/store.model";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  form: UseFormReturn<any>;
  datas: TStore[];
  name: string;
  label: string;
  placeholder?: string;
  emptyMsg?: string;
  desc?: string;
  setSearch?: string;
};
export default function FormComboBoxStores({
  datas,
  form,
  name,
  label,
  placeholder = "Select Store:*",
  emptyMsg = "No store found",
  desc = "",
  setSearch = "search_sel1",
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" role="combobox" className={cn("justify-between", !field.value && "text-muted-foreground")}>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {field.value
                      ? datas.find((data) => data.address_id === field.value)?.address.address +
                        ", " +
                        datas.find((data) => data.address_id === field.value)?.address.city.city_name
                      : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="grow p-0">
              <SearchParamsInput setSearch={setSearch} rounded="sm" flatBottom={true} />
              <Command>
                <CommandList>
                  <CommandEmpty>{emptyMsg}</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60 w-full">
                      {datas.map((data) => (
                        <CommandItem
                          value={data.address.address}
                          key={data.address_id}
                          onSelect={() => {
                            form.setValue(name, data.address_id);
                          }}
                        >
                          <Check className={cn("mr-2 size-4", data.address_id === field.value ? "opacity-100" : "opacity-0")} />
                          {data.address.address + ", " + data.address.city.city_name}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{desc}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
