import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { TStore } from "@/models/store.model";
import { AxiosError } from "axios";
import { StoreEditTable } from "./_components/table-edit";
import { SearchParams } from "@/models/search.params";
import { TUser } from "@/models/user.model";
import { fetchStoreAdminData } from "@/utils/fetch/server/admin.fetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreAddTable } from "./_components/table-add";
import { LocationStoreEdit } from "./_components/location.edit";
import { MapsProvider } from "@/components/maps/MapsProvider";
import { fetchAllCities } from "@/utils/fetch/cities.fetch";
import { CityType } from "@/types/cities.type";
import { Detail } from "./_components/Detail";

type Props = {
  params: { id: string };
  searchParams: SearchParams;
};

const getStoreById = async ({ params }: Pick<Props, "params">): Promise<TStore | undefined> => {
  try {
    const response = await axiosInstanceSSR().get(`/store/v1/${params.id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};

const getAllStoreAdmin = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<{ users: TUser[]; totalPage: number } | undefined> => {
  try {
    const response = await fetchStoreAdminData(searchParams);
    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

const getCities = async (): Promise<CityType[] | undefined> => {
  const response = await fetchAllCities();
  return response;
};

export default async function DashboardStoreEditPage({ params, searchParams }: Props) {
  const store = await getStoreById({ params });
  const storeAdmin = await getAllStoreAdmin({ searchParams });
  const cities = await getCities();

  return (
    <main className="min-h-[calc(100dvh-120.09px)]">
      <MapsProvider className="flex size-full flex-1 flex-col gap-4 p-4 md:gap-8 md:px-0 md:py-8">
        <Tabs defaultValue="detail" className="size-full">
          <TabsList className="flex w-full items-center px-0">
            <TabsTrigger className="w-full transition-all duration-300 ease-out data-[state=active]:border" value="detail">
              <span className="block">Detail Store</span>
            </TabsTrigger>

            <TabsTrigger className="w-full transition-all duration-300 ease-out data-[state=active]:border" value="location">
              <span className="block">Location Store</span>
            </TabsTrigger>

            <TabsTrigger className="w-full" value="add">
              <span>Add Admin</span>
            </TabsTrigger>

            <TabsTrigger className="w-full transition-all duration-300 ease-out data-[state=active]:border" value="edit">
              <span className="block">Remove Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detail" className="h-[calc(100dvh-200.09px)] w-full overflow-hidden">
            <Detail store={store} />
          </TabsContent>

          <TabsContent value="location" className="h-[calc(100dvh-200.09px)] w-full">
            <div className="flex size-full items-center justify-center">
              <LocationStoreEdit cities={cities} addressId={params.id} />
            </div>
          </TabsContent>

          <TabsContent value="add" className="h-[calc(100dvh-200.09px)] w-full">
            <div className="flex size-full items-center justify-center">
              <StoreAddTable address_id={params.id} data={storeAdmin} />
            </div>
          </TabsContent>

          <TabsContent value="edit" className="h-[calc(100dvh-200.09px)] w-full">
            <div className="flex size-full items-center justify-center">
              <StoreEditTable data={store} />
            </div>
          </TabsContent>
        </Tabs>
      </MapsProvider>
    </main>
  );
}
