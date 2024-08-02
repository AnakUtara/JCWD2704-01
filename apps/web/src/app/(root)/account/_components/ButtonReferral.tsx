"use client";

import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import useAuthStore from "@/stores/auth.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ButtonReferral = ({ className }: { className?: string }) => {
  const { user } = useAuthStore();
  const handleCopy = () => {
    navigator.clipboard.writeText(`${user.referral_code}`);
    toast("Copied", { position: "top-right", icon: <CopyCheck className="size-5" /> });
  };

  return (
    <Button variant="ghost" size="sm" className={cn("w-full justify-start space-x-1.5", className)} onClick={handleCopy}>
      <Copy className="size-4 shrink-0" />
      <span className="inline-block">{user.referral_code}</span>
    </Button>
  );
};
