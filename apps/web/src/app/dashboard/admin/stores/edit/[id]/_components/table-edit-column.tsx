import HeaderSortButton from "@/components/table/header.sort.button";
import { Checkbox } from "@/components/ui/checkbox";
import { TUser } from "@/models/user.model";
import { ColumnDef } from "@tanstack/react-table";

export const storeEditColumnAdmin: ColumnDef<TUser>[] = [
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
];
