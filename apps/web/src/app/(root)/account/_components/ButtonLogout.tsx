"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/stores/auth.store";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const ButtonLogout = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleClick = () => {
    logout();
    router.refresh();
    router.push("/auth");
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="mt-2 sm:mt-0 px-2">
        <Button variant="ghost" size="sm" className="flex items-center justify-start gap-4 py-6 sm:py-8">
          <span className="inline-block p-2">
            <LogOut className="size-6" />
          </span>{" "}
          <span className="inline-block font-medium">Logout</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout Confirmation</DialogTitle>
          <DialogDescription>Are you sure you want to log out?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-4 sm:gap-0">
          <DialogClose asChild>
            <Button size="sm" onClick={handleClick}>
              Confirm
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
