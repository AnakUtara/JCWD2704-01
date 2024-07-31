"use client";
import useSP from "@/hooks/useSP";
import { Select, SelectTrigger } from "../ui/select";
import { SelectProps, SelectValue } from "@radix-ui/react-select";

interface FillterSelectProps extends SelectProps {
  queryKey: string;
  redirect?: "push" | "replace";
}

export default function FillterSelect({ queryKey, children, redirect = "replace", defaultValue, ...props }: FillterSelectProps) {
  const { push, replace, sp } = useSP();
  const fn = { push, replace };
  const value = sp.get(queryKey) || defaultValue;
  return (
    <Select
      {...props}
      defaultValue={value}
      onValueChange={(e) => {
        fn[redirect]({ key: queryKey, value: e == "all" ? undefined : e });
      }}
    >
      <SelectTrigger className="m-auto w-full grow">
        <SelectValue />
      </SelectTrigger>
      {children}
    </Select>
  );
}
