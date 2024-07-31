import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/models/search.params";
import { fetchCategoriesWithPagination, fetchCategoryNames, fetchSubCategories } from "@/utils/fetch/server/categories.fetch";
import { categoriesColumns } from "./categories.column";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import Pagination from "@/components/pagination";
import { DataTable } from "@/components/table/data-table";
import { subCategoriesColumns } from "./subcategories.column";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import CategoryCreateForm from "./_components/category.create.form";
import SubCatCreateForm from "./_components/subcat.create.form";
import AdminTabDialog from "../_component/admin.tab.dialog";

type Props = { searchParams: SearchParams };
export default async function DashboarCategoriesPage({ searchParams }: Props) {
  const catDatas = await fetchCategoriesWithPagination(searchParams);
  const subCats = await fetchSubCategories(searchParams);
  const categories = await fetchCategoryNames(searchParams);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-0 md:py-8">
      <Tabs defaultValue="categories">
        <TabsList className="mb-5 grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Categories Data</h2>
            <AdminTabDialog btnLabel="Add New Category">
              <AdminCRUDDialog title="Add New Category" desc="You can add new category here.">
                <CategoryCreateForm />
              </AdminCRUDDialog>
            </AdminTabDialog>
          </div>
          <Suspense
            key={searchParams.page_tab1}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable
              setSearch="search_tab1"
              layoutId="categories"
              placeholder="Filter categories..."
              columns={categoriesColumns}
              data={catDatas.categories}
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={catDatas.totalPages} />
          </div>
        </TabsContent>
        <TabsContent value="sub-categories">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Sub-Categories Data</h2>
            <AdminTabDialog btnLabel="Add New Sub-category">
              <AdminCRUDDialog title="Add New Sub-category" desc="You can add new sub-category item here.">
                <SubCatCreateForm categories={categories} />
              </AdminCRUDDialog>
            </AdminTabDialog>
          </div>
          <Suspense
            key={searchParams.page_tab2}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable
              setSearch="search_tab2"
              placeholder="Filter sub-categories..."
              columns={subCategoriesColumns}
              data={subCats.subCategories}
              layoutId="categories-variant"
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={subCats.totalPages} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
