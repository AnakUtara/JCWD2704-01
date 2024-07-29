"use client";

import useAuthStore from "@/stores/auth.store";

export default function CheckoutAddressOption() {
  const { user } = useAuthStore();

  // useEffect(() => {
  //   // const fetchAddress = async () => (await axiosInstanceCSR().get("/addresses/user/" + userId)).data.data as any[];
  //   // fetchAddress().then((r) => {
  //   //   if (!r) return;
  //   // });

  //   if (user.addresses.length) {
  //     setAddress(user.addresses);
  //     setDestination(user.addresses[0].id!);
  //   }
  // }, [sp, user]);

  // useEffect(() => {
  //   if (!destination) return;
  //   axiosInstanceCSR()
  //     .get("/store/nearest", { params: { address_id: destination } })
  //     .then((r) => {

  //     });
  // }, [destination]);

  return (
    <div className="flex flex-col gap-4">
      {/* <FillterSelect queryKey="address" name="address" className="w-full rounded-md border px-4 py-2" value={user.addresses[0].id || ""}>
        {address.map((e, i) => (
          <option value={i} className="rounded-md px-4 py-2 shadow-md">
            {e.address}
          </option>
        ))}
      </FillterSelect> */}
      <div className="flex gap-2 items-center">
        <span className="block text-muted-foreground">Send to</span>
        <span className="block font-semibold">{user.addresses[0].city.city_name}</span>
      </div>
    </div>
  );
}
