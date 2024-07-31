"use client";

import { DataTable } from "@/components/table/data-table";
import { TUser } from "@/models/user.model";
import { useResultData } from "./CreateStoreProvider";
import { useFormState } from "react-dom";
import { FormErrors } from "@/types/store.action.types";
import { stepThreeFormAction } from "@/utils/form/create-store-action/stepThree";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { AdminInfo } from "@/schemas/store.schema";
import { createStoreAdminSelectColumns } from "../step-two/table";

const initialState: FormErrors = {};
export const CreateStoreTable = ({ data }: { data: { users: TUser[]; totalPage: number } }) => {
  const { updateResultData } = useResultData();
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [adminInfo, setAdminInfo] = useState<AdminInfo[]>([]);
  const [error, formAction] = useFormState(
    (state: FormErrors | undefined, formData: FormData) => stepThreeFormAction(state, formData, selectedId, adminInfo),
    initialState,
  );

  useEffect(() => {
    if (selectedId.length) updateResultData({ selectedAdminId: selectedId });
    if (adminInfo) updateResultData({ selectedAdminInfo: adminInfo });
  }, [selectedId, adminInfo]);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex w-full flex-col gap-4">
        <DataTable
          placeholder="Search store admin"
          columns={createStoreAdminSelectColumns}
          data={data.users}
          selectedData={(data) => {
            if (data.length) {
              const selectedAdminId = data.map((d) => d?.id) as string[];
              const selectedAdminInfo = data.map((data: AdminInfo | undefined) => ({
                address: data?.address,
                full_name: data?.full_name,
                email: data?.email,
                gender: data?.gender,
              }));
              setSelectedId(selectedAdminId);
              setAdminInfo(selectedAdminInfo);
            }
          }}
        />
        <div className="flex h-fit w-full justify-between">
          <Pagination getPage="page_tab1" totalPages={data.totalPage} className="mt-0" />
          <div className="flex flex-col items-end gap-2">
            <Button type="submit" className="md:w-fit">
              Set Store Admin
            </Button>
            {error?.selectedAdminId && <div className="mt-1 text-sm text-destructive">{error?.selectedAdminId}</div>}
          </div>
        </div>
      </form>
    </div>
  );
};
