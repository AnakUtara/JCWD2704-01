import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const Search = ({ className }: { className?: string }) => {
  return (
    <Label className={cn("relative size-full", className)}>
      <SearchIcon className="absolute left-2 top-1/2 size-5 shrink-0 -translate-y-1/2 stroke-muted-foreground" />
      <Input placeholder="Search..." className="pl-8" />
    </Label>
  );
};
export default Search;
