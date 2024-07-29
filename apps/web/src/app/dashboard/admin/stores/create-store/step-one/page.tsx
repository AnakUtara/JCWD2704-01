import { fetchAllCities } from "@/utils/fetch/cities.fetch";
import { CityType } from "@/types/cities.type";
import { StepOneForm } from "../_components/form/StepOneForm";

const getCities = async () => {
  const response = await fetchAllCities();
  const data = response as CityType[];
  return data;
};

export default async function DashboardCreateStoreStepOnePage() {
  const cities = await getCities();

  return (
    <div className="flex size-full flex-col">
      <h3 className="text-lg font-medium">Select store location</h3>
      <StepOneForm cities={cities} />
    </div>
  );
}
