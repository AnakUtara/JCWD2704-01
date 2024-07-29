export enum Order {
  asc = "asc",
  desc = "desc",
}

export interface SearchParams {
  page: number;
  page_tab1: number;
  page_tab2: number;
  search: string;
  search_tab1: string;
  search_tab2: string;
  category_id?: string;
  category_name?: string;
  sub_category?: string;
  city_id?: number;
}

export const searchParams: string = "?page_tab1=1&page_tab2=1";
