"use client";

import Pagination from "@/components/pagination";
import { DataTable } from "@/components/table/data-table";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TUser } from "@/models/user.model";
import { storeAddColumnAdmin } from "./table-add-column";
import { storeUpadteSchema, StoreUpdateSchemaType } from "@/schemas/store.schema";
import { useState } from "react";
import { toast } from "sonner";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";

type AddAdminData = Pick<StoreUpdateSchemaType, "storeAdmin">["storeAdmin"];

export const StoreAddTable = ({ data, address_id }: { data: { users: TUser[]; totalPage: number } | undefined; address_id: string }) => {
  if (!data) return <div className="flex size-full flex-col items-center justify-center rounded-md border bg-background p-8">No Data</div>;

  const [selectedAdmin, setSelectedAdmin] = useState<AddAdminData>([]);

  const handleAdd = async () => {
    const validate = storeUpadteSchema.safeParse({
      storeAdmin: selectedAdmin,
    });

    if (!validate.success) {
      const errors = validate.error.issues.reduce((acc: { [key: string]: string }, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {});
      toast.error(errors.storeAdmin, { richColors: false, position: "top-right" });
    } else {
      try {
        await axiosInstanceCSR().patch(`/store/v1/`, {
          storeAdmin: selectedAdmin,
        });
        window.location.reload();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(`Error! ${error.response?.status}`, { richColors: false, position: "top-right" });
        }
      }
    }
  };

  return (
    <div className="flex size-full flex-col justify-between rounded-md border bg-background p-6">
      <div className="space-y-4">
        <div className="max-w-screen-sm px-2">
          <p className="text-2xl font-bold">
            <span className="font-normal">Select the admin you want to assign to</span>&nbsp;
            <span className="inline-block">{data.users[1].store?.address.city.city_name} Store</span>
          </p>
        </div>

        <DataTable
          layoutId="store-add"
          data={data.users}
          isVariant
          columns={storeAddColumnAdmin}
          selectedData={(data) => {
            const selectedAdmin: AddAdminData = data.map((d) => ({ id: d.id!, address_id }));
            setSelectedAdmin(selectedAdmin);
          }}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row-reverse md:justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Add Admin</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will remove your admin from {""} Store.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAdd}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Pagination totalPages={data.totalPage} className="mx-auto mt-0 md:mx-0" />
      </div>
    </div>
  );
};
