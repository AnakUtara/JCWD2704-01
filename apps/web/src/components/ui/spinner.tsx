import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {};
export default function Spinner({}: Props) {
  return <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />;
}
