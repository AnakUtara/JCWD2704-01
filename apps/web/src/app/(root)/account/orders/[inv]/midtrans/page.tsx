import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

type Props = {
  params: { inv: string };
};
export default async function Page({ params }: Props) {
  const paymentLink = await axiosInstanceSSR()
    .get(`/order/${params.inv}/v1`)
    .then((r) => r.data.data)
    .catch((e) => {
      if (e instanceof AxiosError) {
        throw new Error(JSON.stringify(e.response?.data.message));
      }
      throw new Error(JSON.stringify(e.message));
    });
  revalidatePath(`/order/${params.inv}`, "page");
  redirect(paymentLink.payment_url);
}
