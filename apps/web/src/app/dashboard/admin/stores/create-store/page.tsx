import { redirect } from "next/navigation";
import { CreateStoreRoutes } from "../../../../../types/store.action.types";

export default function DashboardCreateStorePage() {
  redirect(CreateStoreRoutes.STEP_ONE);
}
