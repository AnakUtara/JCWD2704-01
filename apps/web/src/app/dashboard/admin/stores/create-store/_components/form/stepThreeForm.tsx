"use client";

import { useRouter } from "next/navigation";
import { useResultData } from "../CreateStoreProvider";
import { submitCreateStoreAction } from "@/utils/form/create-store-action/stepFour";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ResultData } from "@/schemas/store.schema";
import { Button } from "@/components/ui/button";

export const StepFourForm = () => {
  const { resultData, resetData } = useResultData();
  const { address, city_id, details, latitude, longitude, selectedAdminId, selectedAdminInfo } = resultData;
  const router = useRouter();

  const handleAction = async (_formData: FormData) => {
    const { errorMsg, redirect, success } = await submitCreateStoreAction(resultData as ResultData);
    if (success) {
      try {
        const response = await axiosInstanceCSR().post("/store/v1", {
          address,
          details,
          city_id,
          latitude,
          longitude,
          selectedAdminId,
        });
        toast.success(response.data.message);
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.massage);
        }
      }
    } else if (errorMsg) {
      toast.error(errorMsg);
    }
    if (redirect) {
      resetData();
      router.push(redirect);
    }
  };

  return (
    <form action={handleAction}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold md:text-3xl">Store Review</h2>

        <div className="flex flex-col md:flex-row">
          <div className="w-full space-y-2">
            <p className="w-full">
              <span className="block text-xs text-muted-foreground md:text-sm">Location</span>
              <span className="block font-medium">{address || "Not set"}</span>
            </p>
            <p className="w-full">
              <span className="block text-xs text-muted-foreground md:text-sm">Location Details</span>
              <span className="block font-medium">{details || "Not set"}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full space-y-2">
            <h3 className="text-xl font-medium md:text-2xl">Admins</h3>

            <div className="flex flex-col flex-wrap gap-4 md:flex-row">
              {selectedAdminId
                ? selectedAdminInfo?.map(({ full_name, email, gender, address }) => (
                    <div key={email} className="w-full max-w-sm rounded-md border bg-muted px-6 py-4 md:max-w-full">
                      <div className="flex w-full flex-col gap-4">
                        <p className="flex w-full justify-between">
                          <span className="block text-muted-foreground">Name</span>
                          <span className="block font-medium">{full_name || "Not set"}</span>
                        </p>
                        <p className="flex w-full justify-between">
                          <span className="block text-muted-foreground">Email</span>
                          <span className="block font-medium">{email || "Not set"}</span>
                        </p>
                        <p className="flex w-full justify-between">
                          <span className="block text-muted-foreground">Gender</span>
                          <span className="block font-medium capitalize">{gender || "Not set"}</span>
                        </p>
                        <p className="flex w-full justify-between">
                          <span className="block text-muted-foreground">Address</span>
                          <span className="block font-medium">{address || "Not set"}</span>
                        </p>
                      </div>
                    </div>
                  ))
                : "Not Set"}
            </div>
          </div>
        </div>
        <Button className="md w-full text-lg">Submit Store</Button>
      </div>
    </form>
  );
};
