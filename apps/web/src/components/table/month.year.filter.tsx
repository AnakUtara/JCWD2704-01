"use client";
import { SelectContent, SelectItem } from "@/components/ui/select";
import FillterSelect from "../fillter/fillterSelect";
type Props = {};
export default function MonthYearFilter({}: Props) {
  return (
    <div className="flex w-full items-center gap-4 md:w-fit">
      <div className="flex w-full items-center">
        <h2 className="text-nowrap rounded-md rounded-r-none border border-r-0 bg-white p-[9px] text-sm font-semibold text-muted-foreground">
          Month:
        </h2>
        <FillterSelect addCustomStyle="rounded-l-none" queryKey="month" defaultValue={String(new Date().getMonth())}>
          <SelectContent>
            <SelectItem value="1">January</SelectItem>
            <SelectItem value="2">February</SelectItem>
            <SelectItem value="3">March</SelectItem>
            <SelectItem value="4">April</SelectItem>
            <SelectItem value="5">May</SelectItem>
            <SelectItem value="6">June</SelectItem>
            <SelectItem value="7">July</SelectItem>
            <SelectItem value="8">August</SelectItem>
            <SelectItem value="9">September</SelectItem>
            <SelectItem value="10">October</SelectItem>
            <SelectItem value="11">November</SelectItem>
            <SelectItem value="12">December</SelectItem>
          </SelectContent>
        </FillterSelect>
      </div>
      <div className="flex w-full items-center">
        <h2 className="text-nowrap rounded-md rounded-r-none border border-r-0 bg-white p-[9px] text-sm font-semibold text-muted-foreground">
          Year:
        </h2>
        <FillterSelect addCustomStyle="rounded-l-none" queryKey="year" defaultValue={String(new Date().getFullYear())}>
          <SelectContent>
            {Array.from({ length: 11 }, (_, i) => (
              <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                {new Date().getFullYear() + i}
              </SelectItem>
            ))}
          </SelectContent>
        </FillterSelect>
      </div>
    </div>
  );
}
