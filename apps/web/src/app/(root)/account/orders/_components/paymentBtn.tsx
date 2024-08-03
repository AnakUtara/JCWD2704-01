"use client";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentBtn({ paymentLink }: { paymentLink?: string }) {
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState<File | undefined>();
  const { inv } = useParams();
  const router = useRouter();

  const submit = async () => {
    if (!img) return;
    const data = new FormData();
    data.append("img", img);
    await axiosInstanceCSR()
      .patch(`/order/${inv}/v1`, data, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => {
        toast.success("success");
      })
      .catch(() => toast.error("Failed"));
    setImg(undefined);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setModal(true)}>Pay</Button>
      <Modal
        isOpen={modal}
        onClose={() => {
          setImg(undefined);
          setModal(false);
        }}
      >
        <section className="flex flex-col gap-4 *:flex *:flex-col *:gap-y-2 *:text-center">
          <div>
            <Label htmlFor="paymentProof">Upload your payment proof</Label>
            <Input name="paymentProof" type="file" onChange={(e) => setImg(e.target.files?.[0])} />
            <Button disabled={!Boolean(img)} className="m-auto w-full" onClick={submit}>
              Send Payment Proof
            </Button>
          </div>
          <h1>----- OR -----</h1>
          <Label>use payment gateway</Label>
          <Link target="_blank" href={paymentLink || `${inv}/midtrans`}>
            <Button className="w-full bg-sky-800 text-white hover:bg-sky-950">Midtrans</Button>
          </Link>
        </section>
      </Modal>
    </>
  );
}
