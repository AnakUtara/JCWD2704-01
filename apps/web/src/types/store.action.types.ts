export type FormErrors = {
  [key: string]: string | undefined;
};

export enum CreateStoreRoutes {
  STEP_ONE = "/dashboard/admin/stores/create-store/step-one",
  STEP_TWO = "/dashboard/admin/stores/create-store/step-two?page_tab1=1&page_tab2=1",
  STEP_THREE = "/dashboard/admin/stores/create-store/step-three",
}
