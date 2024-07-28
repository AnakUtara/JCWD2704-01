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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAddressDeleteSubmit } from "@/utils/form/handlers/address";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";

export const AddressSetting = ({ city }: { city: string }) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Address Setting</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account/address/detail">Modify</Link>
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Delete <span className="font-medium">"{city}"</span> from your address.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button className="sm:w-full" variant="destructive" onClick={userAddressDeleteSubmit}>
            Yes
          </Button>
          <DialogClose asChild>
            <Button className="sm:w-full" variant="outline">
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
