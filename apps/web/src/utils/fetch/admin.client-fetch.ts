import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";
import { toast } from "sonner";

export async function createStoreAdmin(data: Record<string, any>) {
  try {
    await axiosInstanceCSR().post("/admin/users/store-admins", {
      ...data,
    });
    toast.success("New store admin added.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
  }
}

export async function updateStoreAdmin(
  id: string | undefined,
  data: Record<string, any>,
) {
  try {
    await axiosInstanceCSR().patch(`/admin/users/store-admins/${id}`, {
      ...data,
    });
    toast.success("Store admin data updated.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Failed to edit store admin data.");
    }
  }
}

export async function deleteStoreAdmin(id: string | undefined) {
  try {
    await axiosInstanceCSR().delete(`/admin/users/store-admins/${id}`);
    toast.success("Store admin deleted.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data.message);
      toast.error("Failed to delete store admin.");
    }
  }
}
