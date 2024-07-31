"use client";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  name: string;
  sortByParamsKey?: string;
  sortDirParamsKey?: string;
  sortBy: string;
};
export default function HeaderServerSortBtn({ name, sortBy, sortByParamsKey = "sort_by", sortDirParamsKey = "sort_dir" }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isAsc, setIsAsc] = useState<boolean>(false);
  function handleSearchParams(e: React.FormEvent<HTMLButtonElement>) {
    setIsAsc(!isAsc);
    const params = new URLSearchParams(searchParams);
    params.set(sortByParamsKey, sortBy);
    params.set(sortDirParamsKey, isAsc ? "asc" : "desc");
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <Button type="button" variant="ghost" onClick={handleSearchParams}>
      {name}
      <ChevronsUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
