import HeaderSortButton from "@/components/table/header.sort.button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TUser } from "@/models/user.model";
import { ColumnDef } from "@tanstack/react-table";

export const storeAddColumnAdmin: ColumnDef<TUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
        onCheckedChange={(check) => table.toggleAllRowsSelected(!!check)}
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => {
      return <Checkbox checked={row.getIsSelected()} onCheckedChange={(check) => row.toggleSelected(!!check)} aria-label="Select Row" />;
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => <HeaderSortButton name="Full Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <HeaderSortButton name="Email" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <HeaderSortButton name="Gender" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    accessorFn: (user) => (user?.gender === "male" ? "Male" : "Female"),
  },
  {
    accessorKey: "phone_no",
    header: ({ column }) => <HeaderSortButton name="Phone Number" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
  },
  {
    id: "store_id",
    accessorKey: "store.address.city.city_name",
    header: ({ column }) => <HeaderSortButton name="Store" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.getValue("store_id") ? <Badge variant='outline'>{row.getValue("store_id")} Store</Badge> : <span className="px-2.5 py-0.5">Not Set</span>}
      </div>
    ),
  },
];
