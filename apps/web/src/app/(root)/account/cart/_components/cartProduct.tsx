"use client";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { updateCart } from "@/actions/updateCart";
import { useCheckout } from "@/stores/checkout";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputQuantityProps } from "../_model/props";
import { toIDR } from "@/utils/toIDR";
import { Button } from "@/components/ui/button";
import { TCart } from "@/models/cart.model";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/auth.store";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { imageUrl } from "@/utils/imageUrl";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

export function CartProduct({ cartProduct }: { cartProduct: TCart }) {
  const store_id = cartProduct.store_stock.store_id;
  const { user } = useAuthStore();
  const sp = useSearchParams();
  const [add, remove, list, nearestStore, setOrigin] = useCheckout((s) => [s.add, s.remove, s.list, s.origin, s.setOrigin]);
  const hide = sp.get("store_id") != "all" ? cartProduct.store_stock.store_id !== nearestStore : false;
  const ref = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState(false);
  const checkHandler = () => {
    if (store_id !== nearestStore) return;
    if (!ref.current) return;
    if (ref.current.checked == true) {
      remove(cartProduct.store_stock_id);
    } else {
      add({
        store_stock_id: cartProduct.store_stock_id,
        quantity: cartProduct.quantity,
        unit_price: cartProduct.store_stock.unit_price,
        weight: cartProduct.store_stock.product.weight,
        discount: cartProduct.store_stock.discount,
      });
    }
  };
  const handlerCheck = (e: CheckedState) => {
    setIsChecked(Boolean(e));
  };

  useEffect(() => {
    if (!isChecked) {
      remove(cartProduct.store_stock_id);
    } else {
      add({
        store_stock_id: cartProduct.store_stock_id,
        quantity: cartProduct.quantity,
        unit_price: cartProduct.store_stock.unit_price,
        weight: cartProduct.store_stock.product.weight,
        discount: cartProduct.store_stock.discount,
      });
    }
  }, [isChecked]);

  const checked = useMemo(() => Boolean(list.find((e) => e.store_stock_id == cartProduct.store_stock_id)), [list]);

  useEffect(() => {
    const fetchStore = async () => {
      const store_id = await axiosInstanceCSR()
        .get("/store/nearest", { params: { address_id: user.addresses[0].id } })
        .then((r) => r.data.data.id)
        .catch((e) => {
          console.log(e);
          return "";
        });
      setOrigin(store_id);
    };
    fetchStore();
  }, [user]);

  return (
    <Card
      className={cn("relative flex w-full flex-col text-ellipsis border-2 bg-white px-4 py-6 shadow-lg sm:flex-row", hide && "hidden")}
      // onClick={checkHandler}
    >
      {cartProduct.store_stock.quantity < cartProduct.quantity && (
        <div
          className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-[rgba(0,0,0,0.60)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-center font-bold text-white">Out of Stock</h1>
        </div>
      )}
      <CardContent
        id={cartProduct.store_stock.product.product.name.toLowerCase().replaceAll(" ", "-") + "-" + cartProduct.store_stock_id}
        className="p-0"
      >
        <div className="flex gap-4">
          {/* <input type="checkbox" ref={ref} onClick={checkHandler} disabled={store_id !== nearestStore} checked={checked} /> */}
          <Checkbox checked={isChecked} onCheckedChange={handlerCheck} className="size-6" />
          <div className="relative overflow-hidden rounded-md sm:h-36 sm:w-36">
            <Image
              src={imageUrl.render(cartProduct.store_stock.product.images?.name)}
              alt={cartProduct.store_stock.product.name}
              fill
              sizes="25vw"
              className="size-auto object-contain"
            />
          </div>
        </div>
      </CardContent>
      <CardContent className="flex w-full flex-col justify-between gap-2 p-2">
        <div>
          <Link href={`/product/${cartProduct.store_stock.id}`}>
            <CardDescription className="mb-2 min-w-40 font-bold">{cartProduct.store_stock.product.product.name}</CardDescription>
            <CardDescription className="mb-2 min-w-40 font-bold">{cartProduct.store_stock.product.name}</CardDescription>
          </Link>
          <CardDescription>
            <span className={`${cartProduct.store_stock.discount && "line-through"}`}>{toIDR(cartProduct.store_stock.unit_price)}</span>
            <span className={`${!cartProduct.store_stock.discount && "hidden"}`}>
              {toIDR(cartProduct.store_stock.unit_price - cartProduct.store_stock.discount)}
            </span>
          </CardDescription>
          <CardDescription>{cartProduct.store_stock.store.address.address}</CardDescription>
        </div>
        <InputQuantity
          disable={nearestStore !== cartProduct.store_stock.store_id}
          weight={cartProduct.store_stock.product.weight}
          unit_price={cartProduct.store_stock.unit_price}
          quantity={cartProduct.quantity}
          store_stock_id={cartProduct.store_stock_id}
          discount={cartProduct.store_stock.discount}
        />
      </CardContent>
    </Card>
  );
}

function InputQuantity({ quantity, store_stock_id, unit_price, weight, disable = false, discount = 0 }: InputQuantityProps) {
  const [add, remove] = useCheckout((s) => [s.add, s.remove]);
  const [isLoading, setLoading] = useState(false);
  const onClick = async (quantity: number) => {
    setLoading(true);
    await updateCart({ store_stock_id, quantity }).finally(() => setLoading(false));
    if (quantity < 1) remove(store_stock_id);
    else add({ store_stock_id, quantity, unit_price, weight, discount });
  };
  return (
    <div
      className="z-[10] flex h-[24px] items-center gap-x-2 self-end overflow-hidden rounded-xl border-2 border-green-500"
      onClick={async (e) => {
        e.stopPropagation();
      }}
    >
      <Button
        className="border-r-2 border-green-500 p-2 hover:bg-gray-200"
        disabled={isLoading || disable}
        onClick={async (e) => {
          e.stopPropagation();
          await onClick(quantity - 1);
        }}
      >
        -
      </Button>
      <h1>{quantity}</h1>
      <Button
        disabled={isLoading || disable}
        onClick={async (e) => {
          e.stopPropagation();
          await onClick(quantity + 1);
        }}
        className="border-l-2 border-green-500 p-2 hover:bg-gray-200"
      >
        +
      </Button>
    </div>
  );
}
