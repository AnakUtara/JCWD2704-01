"use client";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { TRajaOngkirCostResponse } from "@/models/rajaOngkirCost.model";
import { useCheckout } from "@/stores/checkout";
import useAuthStore from "@/stores/auth.store";
import { toIDR } from "@/utils/toIDR";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createOrderSchema } from "@/schemas/order.scema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { TVoucher } from "../_model/props";
import LocalTime from "@/components/localTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PopoverClose } from "@radix-ui/react-popover";
import { updateCart } from "@/actions/updateCart";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CheckoutModal() {
  const { list, listTotal, weight, origin, removeAllList } = useCheckout((s) => {
    const { list, origin } = s;
    const listTotal = s.listTotal(list);
    const weight = s.weight(list);
    const removeAllList = s.removeAllList;
    return { list, listTotal, weight, origin, removeAllList };
  });
  const { user } = useAuthStore();
  const [courier, setCourier] = useState("jne");
  const [voucherList, setVoucherList] = useState<PromotionType[] | null>(null);
  const [services, setServices] = useState<TRajaOngkirCostResponse["rajaongkir"]["results"] | null>(null);
  const [selectedService, setSelectedService] = useState<{ name: string; cost: number } | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<{ promotion_id: string; result?: { total: number; discount: number } } | null>(
    null,
  );
  const destination = useAuthStore((s) => s.user.addresses[0].id);
  const fetchServices = async () => {
    setServices(null);
    if (!destination) return;
    const services = (
      await axiosInstanceCSR().get("/order/shipcost", {
        params: {
          weight,
          origin,
          destination,
          courier,
        },
      })
    ).data.data as TRajaOngkirCostResponse;
    setServices(services.rajaongkir.results);
  };

  const fetchVouchers = async () => {
    setVoucherList(null);
    try {
      const vouchers = (await axiosInstanceCSR().get("/promotion/all")).data.result as PromotionType[];
      setVoucherList([...user?.promotions, ...vouchers]);
    } catch (error) {
      setVoucherList([]);
    }
  };

  const fetchApplyCoucher = async (promotion_id: string) => {
    if (!selectedService?.cost) return;
    const result = await axiosInstanceCSR()
      .get("/promotion/v0/" + promotion_id, {
        params: { total: listTotal, shipCost: selectedService.cost },
      })
      .then((r) => r.data.data as { total: number; discount: number })
      .catch((e) => {
        toast.error("voucher failed to apply");
        if (e instanceof AxiosError) console.log(e.response?.data);
      });
    setSelectedVoucher(result ? { promotion_id, result } : null);
  };
  const router = useRouter();

  const createOrder = async () => {
    if (!selectedService) return;
    const data: z.infer<typeof createOrderSchema> = {
      store_id: origin,
      promotion_id: selectedVoucher?.promotion_id,
      destination_id: `${user.addresses[0].id}`,
      courier: courier as "jne" | "pos" | "tiki",
      courier_service: selectedService.name,
      req_products: list.map((e) => ({
        id: e.store_stock_id,
        quantity: e.quantity,
      })),
    };
    try {
      removeAllList();
      const order = await axiosInstanceCSR().post("/order", createOrderSchema.parse(data));
      toast.success("transaction success");
      try {
        await Promise.all(data.req_products.map(async ({ id }) => updateCart({ store_stock_id: id, quantity: 0 })));
      } catch (error) {
        toast.error("update cart fail");
      }
      router.push("/account/orders/" + order.data.data.inv_no);
    } catch (error) {
      toast.error("checkout failed");
    }
  };

  useEffect(() => {
    setSelectedService(null);
  }, [courier]);

  useEffect(() => {
    setSelectedVoucher(null);
  }, [selectedService]);

  useEffect(() => {
    if (!selectedVoucher) return;
    fetchApplyCoucher(selectedVoucher.promotion_id);
  }, [selectedVoucher?.promotion_id]);

  const deliveryCost = selectedService?.cost || 0;
  const promotionDiscount = selectedVoucher?.result?.discount || 0;
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <Table className="my-4">
        <TableBody>
          <TableRow>
            <TableCell>Weight</TableCell>
            <TableCell>{weight} g</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Courier</TableCell>
            <TableCell>
              <Select defaultValue={courier} onValueChange={(val) => setCourier(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="JNE" />
                </SelectTrigger>
                <SelectContent>
                  {["jne", "tiki", "pos"].map((e, i) => (
                    <SelectItem key={i} value={e}>
                      {e.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Courier Service</TableCell>
            <TableCell className="w-full">
              <Popover modal={true}>
                <PopoverTrigger asChild onClick={fetchServices} className="w-full">
                  <Button variant="outline" className={selectedService?.name && "text-left"}>
                    {!selectedService?.name ? (
                      "Select Courier Service"
                    ) : (
                      <span>
                        <span>{selectedService.name}</span>&nbsp;-&nbsp;<span>{toIDR(selectedService.cost)}</span>
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {services == null && <h1>Loading...</h1>}
                  <ul>
                    {services?.[0].costs.map((e, i) => (
                      <li key={i} className="my-2">
                        <PopoverClose asChild>
                          <Button
                            disabled={selectedService?.name == e.service}
                            variant="ghost"
                            className="flex h-max w-full flex-col items-start gap-2 text-sm text-muted-foreground"
                            onClick={() => setSelectedService({ name: e.service, cost: e.cost[0].value })}
                          >
                            <span className="flex w-full items-center justify-between">
                              <span className="block">{e.description}</span>
                              <span className="block">{e.service}</span>
                            </span>
                            <span className="block self-end text-secondary-foreground">{toIDR(e.cost[0].value)}</span>
                          </Button>
                        </PopoverClose>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Select Voucher</TableCell>
            <TableCell>
              <Popover modal={true}>
                <PopoverTrigger asChild onClick={fetchVouchers} className="w-full">
                  <Button variant="outline" className={selectedService?.name && "text-left"} disabled={!selectedService}>
                    {!selectedVoucher?.promotion_id ? (
                      <>Select Voucher</>
                    ) : (
                      <span>
                        <span>{selectedVoucher.promotion_id}</span>
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 h-60 overflow-y-auto">
                  {voucherList == null ? (
                    <h1>Loading...</h1>
                  ) : (
                    <ul>
                      {voucherList.length == 0 ? (
                        <h1>No Voucher Available</h1>
                      ) : (
                        voucherList.map((e, i) => (
                          <li key={i} className="my-2">
                            <PopoverClose asChild>
                              <Button
                                disabled={selectedVoucher?.promotion_id == e?.id}
                                variant="ghost"
                                className="flex h-full w-full flex-col items-start gap-2 text-sm text-muted-foreground"
                                onClick={() => setSelectedVoucher({ promotion_id: e?.id || "" })}
                              >
                                <span className="block font-extrabold">{e?.title}</span>
                                <span className="block text-wrap text-left text-xs font-normal">{e?.description}</span>
                                {e?.type == "discount" || e?.type == "referral_voucher" ? (
                                  <Badge className="block">{e?.amount + "%"}</Badge>
                                ) : undefined}
                                {e?.type == "voucher" && <Badge>{toIDR(e?.amount)}</Badge>}
                                <span className="block self-start text-xs text-secondary-foreground">
                                  {"Exp. Date: "}
                                  <LocalTime time={e?.expiry_date || new Date()} />
                                </span>
                              </Button>
                            </PopoverClose>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Shipping Cost</TableCell>
            <TableCell>{toIDR(deliveryCost)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Products Price</TableCell>
            <TableCell>{toIDR(listTotal)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell>{toIDR(promotionDiscount)}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Price</TableCell>
            <TableCell>{toIDR(deliveryCost + listTotal - promotionDiscount)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button disabled={!Boolean(selectedService)} onClick={createOrder} className="w-full">
        Checkout
      </Button>
    </div>
  );
}
