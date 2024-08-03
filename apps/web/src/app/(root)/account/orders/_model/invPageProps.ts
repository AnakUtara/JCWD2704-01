import { SearchParams } from "@/models/search.params";

export type PageProps = {
  params: {
    userId: string;
    inv: string;
  };
  searchParams?: SearchParams;
};
