export type TSalesRep = {
  product_name: string;
  variant_name: string;
  category_id?: number;
  category: string;
  store_id?: string;
  store_address: string;
  total_sales: number;
  month: Date;
};

export type TStockRep = {
  variant_name: string;
  product_name: string;
  store_id?: string;
  store_address: string;
  month: Date;
  total_additions: number;
  total_subtractions: number;
  final_qty: number;
};
