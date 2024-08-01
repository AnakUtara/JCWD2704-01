import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import SearchParamsInput from "./input.search";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { TStore } from "@/models/store.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  datas: TStore[];
  placeholder?: string;
  emptyMsg?: string;
  useClearBtn?: boolean;
};
export default function StoreSearchCombobox({
  datas,
  placeholder = "Filter store address.",
  emptyMsg = "No store found",
  useClearBtn = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between md:w-48", !value && "text-muted-foreground")}>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {value
              ? datas?.find((data) => data?.address_id === value)?.address.address +
                ", " +
                datas?.find((data) => data?.address_id === value)?.address.city.city_name
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grow p-0">
        <SearchParamsInput setSearch={"search_sel1"} rounded="sm" flatBottom={true} />
        <Command>
          <CommandList>
            <CommandEmpty>{emptyMsg}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-60 w-full">
                <Button
                  variant={"outline"}
                  className={cn(useClearBtn ? "block" : "hidden", "mb-1 w-full")}
                  onClick={() => {
                    setValue("");
                    params.delete("store_id");
                    replace(`${pathname}?${params.toString()}`);
                  }}
                >
                  Clear
                </Button>
                {datas?.map((data) => (
                  <CommandItem
                    value={data?.address_id}
                    key={data?.address_id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      params.set("store_id", currentValue);
                      replace(`${pathname}?${params.toString()}`);
                    }}
                  >
                    <Check className={cn("mr-2 size-6", data?.address_id === value ? "opacity-100" : "opacity-0")} />
                    {data?.address?.address + ", " + data?.address?.city?.city_name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
