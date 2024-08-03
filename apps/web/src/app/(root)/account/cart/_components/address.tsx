"use client";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import useAuthStore from "@/stores/auth.store";
import { useCheckout } from "@/stores/checkout";
import { useEffect } from "react";

export default function Address() {
  const { user } = useAuthStore();
  const setOrigin = useCheckout((s) => s.setOrigin);
  useEffect(() => {
    const fetchStore = async () => {
      const store_id = await axiosInstanceCSR()
        .get("/store/nearest", { params: { address_id: user.addresses[0].id } })
        .then((r) => r.data.data.id)
        .catch((e) => {
          return "origin not found";
        });
      console.log(store_id);
      setOrigin(store_id);
    };
    fetchStore();
  }, [user]);
  return (
    <div className="flex flex-col gap-4">
      {user.addresses[0].city.province} | {user.addresses[0].city.city_name} Store
    </div>
  );
}
