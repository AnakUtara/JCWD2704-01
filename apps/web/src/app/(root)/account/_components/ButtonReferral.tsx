"use client";

import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import useAuthStore from "@/stores/auth.store";
import { toast } from "sonner";

export const ButtonReferral = () => {
  const { user } = useAuthStore();
  const handleCopy = () => {
    navigator.clipboard.writeText(`${user.referral_code}`);
    toast("Copied", { position: "top-right", icon: <CopyCheck className="size-5" /> });
  };

  return (
    <Button variant="ghost" size="sm" className="space-x-1.5 w-full" onClick={handleCopy}>
      <Copy className="size-4" />
      <span className="inline-block">{user.referral_code}</span>
    </Button>
  );
};
