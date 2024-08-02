"use client";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

type Props = {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  children: ReactNode;
  modalText?: string;
  triggerText?: string;
};

export default function ChangeStatuConfirmation({ variant, children, modalText = "", triggerText = "" }: Props) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setModal(true)}>
        {triggerText}
      </Button>
      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <section className="*:my-4">
          <h1>{modalText}</h1>
          <div className="flex justify-center gap-x-4">{children}</div>
        </section>
      </Modal>
    </>
  );
}
