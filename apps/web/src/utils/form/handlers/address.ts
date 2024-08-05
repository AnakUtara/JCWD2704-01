import { UserCreateAddressType } from "@/schemas/address.schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { userAddressAction } from "../actions/address";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const userAddressSubmit = async (payload: UserCreateAddressType, router: AppRouterInstance, keepLogin: () => void) => {
  try {
    const response = await userAddressAction(payload);
    toast.success(response.data.message, { richColors: false });
    keepLogin();
    router.back();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
        position: "top-right",
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
        position: "top-right",
      });
    } else {
      toast.error(`${error}`, { position: "top-right" });
    }
  }
};

export const userAddressDeleteSubmit = async (router: AppRouterInstance, keepLogin: () => void) => {
  try {
    const response = await axiosInstanceCSR().delete("/addresses/user");
    toast.success(response.data.message, { richColors: false });
    keepLogin();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
        position: "top-right",
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
        position: "top-right",
      });
    } else {
      toast.error(`${error}`, { position: "top-right" });
    }
  }
};
