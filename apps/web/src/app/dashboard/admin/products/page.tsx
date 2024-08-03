import { DataTable } from "@/components/table/data-table";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/models/search.params";
import { fetchProductIdsAndNames, fetchProducts, fetchProductsWithVariants } from "@/utils/fetch/server/products.fetch";
import { Suspense } from "react";
import { productsColumns } from "./products.columns";
import Pagination from "@/components/pagination";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import ProductCreateForm from "./_components/product.create.form";
import { fetchCategories, fetchSubCategoriesWithCatID } from "@/utils/fetch/server/categories.fetch";
import { variantsColumns } from "./variants.column";
import VariantCreateForm from "./_components/variant.create.form";
import AdminTabDialog from "../_component/admin.tab.dialog";
import { TCategory } from "@/models/category.model";

export const generateMetadata = async () => {
  return {
    title: "Products Dashboard",
  };
};

type Props = { searchParams: SearchParams };
export default async function DashboardProductsPage({ searchParams }: Props) {
  const products = await fetchProducts(searchParams);
  const productIdsAndNames = await fetchProductIdsAndNames(searchParams);
  const variants = await fetchProductsWithVariants(searchParams);
  const categories = (await fetchCategories()) as TCategory[];
  const subCatsByCatID = await fetchSubCategoriesWithCatID(searchParams);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:py-8 xl:px-0">
      <Tabs defaultValue="products">
        <TabsList className="mb-5 grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Products Data</h2>
            <AdminTabDialog btnLabel="Add New Product">
              <AdminCRUDDialog title="Add New Product" desc="You can add new product item here.">
                <ProductCreateForm datas={[categories, subCatsByCatID]} />
              </AdminCRUDDialog>
            </AdminTabDialog>
          </div>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full min-h-dvh items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable
              layoutId="product"
              isVariant
              placeholder="Filter products..."
              setSearch="search_tab1"
              columns={productsColumns}
              data={products.data}
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={products.totalPages} />
          </div>
        </TabsContent>
        <TabsContent value="variants">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Product Variants Data</h2>
            <AdminTabDialog btnLabel="Add New Variant">
              <AdminCRUDDialog title="Add New Variant" desc="You can add new product variants here.">
                <VariantCreateForm products={productIdsAndNames} />
              </AdminCRUDDialog>
            </AdminTabDialog>
          </div>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full min-h-dvh items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable
              layoutId="variant"
              isVariant
              setSearch="search_tab2"
              placeholder="Filter variants..."
              columns={variantsColumns}
              data={variants.data}
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={variants.totalPages} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
