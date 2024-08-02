"use client";
import { Input } from "@/components/ui/input";
import useSP from "@/hooks/useSP";
import { InputHTMLAttributes, useState } from "react";
import { Switch } from "../ui/switch";

interface FillterInputProps extends InputHTMLAttributes<HTMLInputElement> {
  queryKey: string;
  redirect?: "push" | "replace";
  trueValue: string;
  falseValue?: string;
}

export default function FillterToggle({ queryKey, redirect = "replace", trueValue, falseValue, ...props }: FillterInputProps) {
  const { push, replace, sp } = useSP();
  const fn = { push, replace };
  return (
    <Switch
      checked={sp.get(queryKey) === trueValue}
      onCheckedChange={(e) => fn[redirect]({ key: queryKey, value: e ? trueValue : falseValue })}
      className="data-[state=checked]:bg-background/40 data-[state=unchecked]:bg-input"
    />
  );
}
