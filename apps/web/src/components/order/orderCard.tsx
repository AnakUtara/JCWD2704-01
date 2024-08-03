import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { CustomerOrders } from "@/models/order.model";
import { toIDR } from "@/utils/toIDR";
import PaymentBtn from "@/app/(root)/account/orders/_components/paymentBtn";
import CancelBtn from "@/app/(root)/account/orders/_components/cancelBtn";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import OrderStatusButton from "./orderStatusButton";
import ChangeStatuConfirmation from "./changeStatuConfirmation";
import { formatDate } from "@/utils/formatter";
import { calculateDiscount } from "@/utils/calculateDiscount";
import { PageProps } from "@/app/(root)/account/orders/_model/invPageProps";

export default async function OrderCard({ inv, role = "user" }: { inv: PageProps["params"]["inv"]; role?: "admin" | "user" }) {
  const order = await axiosInstanceSSR()
    .get("/order/" + inv)
    .then((r) => r.data.data as CustomerOrders)
    .catch((error) => {
      throw new Error("Failed to fetch data");
    });
  return (
    <>
      <CardContent className="flex flex-wrap justify-between gap-2">
        <CardDescription>
          <span className="block">Status</span>
          <span className="block font-semibold uppercase text-foreground">{order.status.replaceAll("_", " ")}</span>
        </CardDescription>
        <CardDescription>
          <span className="block">Transaction Expire</span>
          <span className="block font-semibold text-foreground">{formatDate(new Date(order.expire).toDateString())}</span>
        </CardDescription>
        <CardDescription>
          <span className="block">Transaction Date</span>
          <span className="block font-semibold text-foreground">{formatDate(new Date(order.created_at).toDateString())}</span>
        </CardDescription>
      </CardContent>

      <CardContent className="p-1">
        <ul className="flex w-full overflow-auto">
          {order.order_details.map((e, i) => (
            <li key={i} className="mx-5 w-full text-nowrap py-4">
              <Card className="w-full border-black py-2">
                <CardHeader className="py-2">{e.store_stock.product.product.name}</CardHeader>
                <CardHeader className="py-2">{e.store_stock.product.name}</CardHeader>
                <CardContent className="*:*:px-2 *:*:py-0">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <CardDescription>Price</CardDescription>
                        </TableCell>
                        <TableCell>
                          <CardDescription>{toIDR(e.unit_price)}</CardDescription>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <CardDescription>Discount</CardDescription>
                        </TableCell>
                        <TableCell>
                          <CardDescription>{e.discount}%</CardDescription>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <CardDescription>Quantity</CardDescription>
                        </TableCell>
                        <TableCell>
                          <CardDescription>{e.quantity}</CardDescription>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <CardDescription>Total</CardDescription>
                        </TableCell>
                        <TableCell>
                          <CardDescription>{toIDR(e.quantity * calculateDiscount(e.unit_price, e.discount))}</CardDescription>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <CardDescription>Shipping Cost</CardDescription>
              </TableCell>
              <TableCell>
                <CardDescription>{toIDR(order.shipping_cost)}</CardDescription>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CardDescription>promotion discount</CardDescription>
              </TableCell>
              <TableCell>
                <CardDescription>{toIDR(order.discount)}</CardDescription>
              </TableCell>
            </TableRow>
            <TableRow className="*:*:font-bold">
              <TableCell>
                <CardDescription>Total</CardDescription>
              </TableCell>
              <TableCell>
                <CardDescription>
                  {toIDR(
                    order.shipping_cost +
                      order.order_details.reduce((p, s) => p + s.quantity * calculateDiscount(s.unit_price, s.discount), 0) -
                      order.discount,
                  )}
                </CardDescription>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      {order.payment_proof?.name && (
        <CardContent>
          <Image
            src={NEXT_PUBLIC_BASE_API_URL + "/images/" + order.payment_proof.name}
            alt="payment proof img"
            height={500}
            width={500}
            className="m-auto"
          />
        </CardContent>
      )}

      <CardContent className="flex justify-between">
        {role == "user" && (
          <>
            {order.status == "wait_for_payment" && (
              <>
                <CancelBtn />
                <PaymentBtn paymentLink={order.paymentLink} />
              </>
            )}
            {order.status == "sending" && <OrderStatusButton inv={order.inv_no} to="delivered" />}
          </>
        )}
        {role == "admin" && (
          <>
            {order.status !== "canceled" && order.status !== "sended" && (
              <ChangeStatuConfirmation modalText="Are you sure to cancel this order?" triggerText="Cancel Order" variant={"destructive"}>
                <OrderStatusButton inv={order.inv_no} to="cancel" variant={"destructive"} text="Confirm" />
              </ChangeStatuConfirmation>
            )}

            {order.status == "process" && (
              <ChangeStatuConfirmation modalText="Are you sure to send this order?" triggerText="Send">
                <OrderStatusButton inv={order.inv_no} to="send" />
              </ChangeStatuConfirmation>
            )}

            {order.status == "wait_for_confirmation" && (
              <ChangeStatuConfirmation modalText="Are you sure to approve this order" triggerText="Approve Payment">
                <OrderStatusButton inv={order.inv_no} to="approve payment" />
              </ChangeStatuConfirmation>
            )}
          </>
        )}
      </CardContent>
    </>
  );
}
