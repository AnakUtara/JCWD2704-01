"use client";

import { DataTable } from "@/components/table/data-table";
import { TStore } from "@/models/store.model";
import { storeEditColumnAdmin } from "./table-edit-column";
import { useState } from "react";
import { storeUpadteSchema, StoreUpdateSchemaType } from "@/schemas/store.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { Button } from "@/components/ui/button";

type RemoveAdminData = Pick<StoreUpdateSchemaType, "storeAdmin">["storeAdmin"];

export const StoreEditTable = ({ data }: { data: TStore | undefined }) => {
  if (!data) return <div className="flex size-full flex-col items-center justify-center rounded-md border bg-background p-8">No Data</div>;

  const [selectedAdminId, setSelectedAdminId] = useState<RemoveAdminData>([]);

  const handleRemoveAdmin = async () => {
    const validate = storeUpadteSchema.safeParse({
      storeAdmin: selectedAdminId,
    });

    if (!validate.success) {
      const errors = validate.error.issues.reduce((acc: { [key: string]: string }, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {});
      toast.error(errors.storeAdmin, { richColors: false, position: "top-right" });
    } else {
      try {
        const response = await axiosInstanceCSR().patch(`/store/v1/`, {
          storeAdmin: selectedAdminId,
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
        <div>
          <p className="text-lg font-medium">Select the admin you want to remove from the store.</p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{data.address.city.city_name} Store</span>, total Admins:{" "}
            {data.store_admin.length}
          </p>
        </div>

        <DataTable
          layoutId="store-edit"
          data={data.store_admin}
          isVariant
          columns={storeEditColumnAdmin}
          selectedData={(id) => {
            const selectedAdmin: RemoveAdminData = id.map((d) => ({ address_id: undefined, id: d.id! }));
            setSelectedAdminId(selectedAdmin);
          }}
        />
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Remove Admin</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove your admin from {data.address.city.city_name} Store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleRemoveAdmin}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
