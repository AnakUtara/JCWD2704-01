"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  setSearch: "start_date" | "end_date";
  placeholder: string;
  title?: string;
};
export function SearchParamsDatepicker({ setSearch, placeholder, title = "Filter Start Date" }: Props) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [date, setDate] = useState<Date>();
  const params = new URLSearchParams(searchParams);
  function handleChange(day: Date | undefined) {
    setDate(day);
    day && params.set(setSearch, day.toDateString());
    replace(`${pathname}?${params.toString()}`);
  }
  function handleClear() {
    setDate(undefined);
    params.delete(setSearch);
    params.delete(setSearch === "start_date" ? "end_date" : "start_date");
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal md:w-[280px]", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <h2 className="text-center font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant={"outline"} className="w-full" onClick={() => handleChange(new Date())}>
            Today
          </Button>
          <Button variant={"outline"} className="w-full" onClick={() => handleClear()}>
            Clear
          </Button>
        </div>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            fromYear={2024}
            toYear={new Date().getFullYear()}
            selected={date}
            onSelect={handleChange}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
