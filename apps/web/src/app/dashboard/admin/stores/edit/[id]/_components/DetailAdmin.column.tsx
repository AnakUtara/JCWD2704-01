import HeaderSortButton from "@/components/table/header.sort.button";
import { TUser } from "@/models/user.model";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";

export const DetailAdminColumn: ColumnDef<TUser>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <HeaderSortButton name="ID" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
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
    accessorKey: "created_at",
    header: ({ column }) => <HeaderSortButton name="Assign" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
    cell: ({ row }) => <span className="capitalize">{formatDistanceToNowStrict(row.original.created_at!, { addSuffix: true })}</span>,
  },
];
