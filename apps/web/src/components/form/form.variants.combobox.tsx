import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import SearchParamsInput from "../table/input.search";
import { ProductVariant } from "@/models/product.model";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  form: UseFormReturn<any>;
  datas: ProductVariant[];
  name: string;
  label: string;
  placeholder?: string;
  emptyMsg?: string;
  desc?: string;
  setSearch?: string;
};
export default function FormComboBoxVariants({
  datas,
  form,
  name,
  label,
  placeholder = "Select Product:*",
  emptyMsg = "No product found",
  desc = "",
  setSearch = "search_sel2",
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" role="combobox" className={cn("justify-between", !field.value && "text-muted-foreground")}>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {field.value
                      ? datas.find((data) => data.id === field.value)?.product.name +
                        "-" +
                        datas.find((data) => data.id === field.value)?.name
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
                          value={data.name}
                          key={data.id}
                          onSelect={() => {
                            form.setValue(name, data.id);
                          }}
                        >
                          <Check className={cn("mr-2 size-4", data.id === field.value ? "opacity-100" : "opacity-0")} />
                          {data.product.name + "-" + data.name}
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
