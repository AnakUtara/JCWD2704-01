"use client";

import { submitCreateStoreAction } from "@/utils/form/create-store-action/stepFour";
import { useResultData } from "../CreateStoreProvider";
import { ResultData } from "@/schemas/store.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";

export const StepFourForm = () => {
  const { resultData } = useResultData();
  const { address, city_id, details, end_time, latitude, longitude, name, start_time, selectedAdminId, selectedAdminInfo } = resultData;
  const router = useRouter();

  const handleAction = async (formData: FormData) => {
    const { errorMsg, redirect, success } = await submitCreateStoreAction(resultData as ResultData);
    if (success) {
      try {
        const response = await axiosInstanceCSR().post("/store/v1", {
          address,
          details,
          city_id,
          latitude,
          longitude,
          name,
          start_time,
          end_time,
          selectedAdminId,
        });
        toast.success(response.data.massage);
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

          <div className="w-full space-y-2">
            <h3 className="text-xl font-medium md:text-2xl">Schedule</h3>

            <div className="flex flex-col gap-2 md:flex-row md:gap-6" aria-hidden>
              <p aria-hidden className="flex gap-4">
                <span className="block">Name</span>
                <span className="block font-medium text-muted-foreground">{name || "Not set"}</span>
              </p>

              <div className="flex gap-4">
                <p aria-hidden>
                  <span className="block">Start at</span>
                  <span className="block font-medium text-muted-foreground">{start_time || "Not set"}</span>
                </p>
                <p aria-hidden>
                  <span className="block">End at</span>
                  <span className="block font-medium text-muted-foreground">{end_time || "Not set"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full space-y-2">
            <h3 className="text-xl font-medium md:text-2xl">Admins</h3>

            <div className="flex flex-col flex-wrap gap-4 md:flex-row">
              {selectedAdminId
                ? selectedAdminInfo?.map(({ full_name, email, gender, address }) => (
                    <div key={email} className="w-full max-w-sm rounded-md border bg-muted px-6 py-4">
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
