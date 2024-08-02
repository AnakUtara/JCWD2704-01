"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TSubCategory } from "@/models/category.model";
import { formatSearchParams } from "@/utils/formatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = { subCategories: TSubCategory[] };
export default function SubCategoriesBtns({ subCategories }: Props) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  function handleSubCat(subCat: TSubCategory) {
    subCat ? params.set("sub_category", subCat.name) : params.delete("sub_category");
    replace(`${pathname}?${params.toString()}`);
  }
  function handleClear() {
    params.delete("sub_category");
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <>
      <Button size={"sm"} type="button" onClick={() => handleClear()} className="whitespace-nowrap text-nowrap rounded-full text-white">
        Clear Filter
      </Button>
      {subCategories.map((subCat: TSubCategory) => (
        <Button
          size={"sm"}
          type="button"
          onClick={() => handleSubCat(subCat)}
          key={subCat.id}
          className={cn(
            formatSearchParams(params.get("sub_category") || "") == subCat.name
              ? "whitespace-nowrap text-nowrap rounded-full border-2 border-primary text-white"
              : "whitespace-nowrap text-nowrap rounded-full border-2 border-primary bg-secondary text-[#16a349] hover:text-white",
          )}
        >
          {subCat.name}
        </Button>
      ))}
    </>
  );
}
