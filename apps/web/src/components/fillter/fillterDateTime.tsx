"use client";
import useSP from "@/hooks/useSP";
import { InputHTMLAttributes, useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { Matcher } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  queryKey: string;
  redirect?: "push" | "replace";
  defaultV?: number;
}

export default function FillerDateTime({ queryKey, redirect = "replace", defaultV, ...props }: SearchInputProps) {
  const { push, replace, sp } = useSP();
  const fn = { push, replace };
  const defaultDate: Matcher = new Date(Number(sp.get(queryKey) || defaultV));
  useEffect(() => {
    if (!sp.get(queryKey) && defaultV) {
      replace({ key: queryKey, value: String(defaultV) });
    }
  }, [sp.get(queryKey)]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{sp.get(queryKey) || defaultV ? defaultDate.toLocaleDateString() : "Select Date"}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={new Date().getFullYear()}
          selected={defaultDate}
          onSelect={(e) => {
            const value = e?.getTime();
            fn[redirect]({ key: queryKey, value: !value ? undefined : String(value) });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
