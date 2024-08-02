"use client";

import { headerLink } from "@/constants/links";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useAuthStore from "@/stores/auth.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export const HeaderNavigation = () => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleClick = () => {
    logout();
    router.refresh();
    router.push("/auth");
  };
  const label = headerLink.find((link) => link.href.includes(pathname))?.label || "";

  return (
    <nav className="w-full">
      <AlertDialog>
        <DropdownMenu open={isActive} onOpenChange={setIsActive}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="w-full max-w-56 justify-between">
              <span className="block">{label}</span>
              <ChevronRight className={cn("size-6 shrink-0 transition-transform duration-300 ease-out", isActive ? "rotate-90" : "")} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="center">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {headerLink.map((link) => {
              if (!link.sub?.length)
                return (
                  <DropdownMenuItem key={link.label} className="flex items-center gap-3">
                    {link.icon("size-4 shrink-0")}
                    <Link className="w-full" href={link.href}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );

              return (
                <DropdownMenuSub key={link.label}>
                  <DropdownMenuSubTrigger className="flex items-center gap-3">
                    {link.icon("size-4 shrink-0")}
                    <Link className="w-full" href={link.href}>
                      {link.label}
                    </Link>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-56">
                      {link.sub.map((sub) => {
                        return (
                          <DropdownMenuItem key={sub.label} className="flex items-center gap-3">
                            {sub.icon("size-4 shrink-0")}
                            <Link className="w-full" href={sub.href}>
                              {sub.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            })}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <AlertDialogTrigger className="flex w-full cursor-pointer items-center gap-3 hover:bg-destructive">
                <LogOut className="size-4 shrink-0" />
                <span className="block w-full text-left">Logout</span>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button variant='destructive' size='sm' onClick={handleClick}>Confirm</Button>
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};
