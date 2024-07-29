"use client";
import { Menu } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../../../components/ui/sheet";
import AdminNavLinks from "./admin.nav-links";
import AdminMenu from "./admin.menu";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/stores/auth.store";
import { cn } from "@/lib/utils";

type Props = {};
export default function AdminMainNav({}: Props) {
  const { user } = useAuthStore((s) => s);
  return (
    <header className={cn(user.id ? "flex" : "hidden", "sticky top-0 z-50 items-center gap-4 border-b bg-background p-4 md:p-6")}>
      <nav className="container hidden w-full md:flex md:flex-wrap md:items-center md:justify-between md:gap-5 md:text-sm lg:gap-6">
        <div className="flex items-center gap-6">
          <AdminNavLinks />
        </div>
        <AdminMenu />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <AdminNavLinks />
            <Separator />
            <AdminMenu />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
