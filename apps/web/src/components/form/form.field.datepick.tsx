import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Control } from "react-hook-form";

type Props = {
  control: Control<any, any>;
  name: string;
  label: string;
  fromYear?: number;
  toYear?: number;
};
export default function FormDatepicker({ control, name, label, fromYear = 1960, toYear = subYears(new Date(), 18).getFullYear() }: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                fromYear={fromYear}
                toYear={toYear}
                selected={new Date(field.value || "")}
                onSelect={(day) => field.onChange(day?.toDateString())}
                disabled={(date) => date < new Date("1900-01-01")}
                defaultMonth={new Date(field.value || "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
