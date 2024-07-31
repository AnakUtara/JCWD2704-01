import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TStore } from "@/models/store.model";
import { formatDistanceToNowStrict } from "date-fns";
import { DetailAdmin } from "./DetailAdmin";
import { DetailProduct } from "./DetailProduct";

export const Detail = ({ store }: { store: TStore | undefined }) => {
  return (
    <div className="flex size-full items-center justify-center">
      <Card className="size-full">
        <CardHeader className="flex flex-col md:flex-row md:justify-between">
          <CardTitle className="text-2xl font-bold md:text-3xl">{store?.address.city.city_name} Store</CardTitle>
          <CardDescription className="flex flex-col justify-between md:flex-row">
            <span className="block md:hidden">Location:</span>
            <span className="block max-w-md text-foreground max-md:truncate md:text-muted-foreground">{store?.address.address}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex size-full items-center justify-center">
          <Tabs className="size-full" defaultValue="admins">
            <TabsList className="w-full">
              <TabsTrigger className="w-full capitalize" value="admins">
                admins
              </TabsTrigger>
              <TabsTrigger className="w-full capitalize" value="products">
                products
              </TabsTrigger>
            </TabsList>

            <TabsContent className="flex items-center justify-center py-2" value="admins">
              <DetailAdmin admins={store?.store_admin} />
            </TabsContent>
            <TabsContent className="flex items-center justify-center" value="products">
              <DetailProduct products={store?.product_stock} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
