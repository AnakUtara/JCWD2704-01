import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { TCategory } from "@/models/category.model";
import { CategoryLink } from "./CategoryLink";

const getCategories = async () => {
  try {
    const response = await axiosInstanceSSR().get("/categories/category-list");
    return response.data.categories as TCategory[];
  } catch (error) {
    console.log(error)
  }
};

export const Category = async () => {
  const categories = await getCategories();

  return (
    <ul className="mx-auto grid max-w-screen-md grid-flow-col grid-cols-5 grid-rows-2 gap-y-4 overflow-auto">
      {categories?.map((cat) => <CategoryLink key={cat.id} category={cat} />)}
    </ul>
  );
};
