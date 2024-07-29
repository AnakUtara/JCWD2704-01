"use server";

import { ResultData, stepOneSchema, stepThreeSchema, stepTwoSchema } from "@/schemas/store.schema";
import { CreateStoreRoutes } from "@/types/store.action.types";

type SubmitCreateStore = {
  redirect?: CreateStoreRoutes | string;
  errorMsg?: string;
  success?: boolean;
};

export const submitCreateStoreAction = async (resultData: ResultData): Promise<SubmitCreateStore> => {
  const validatedStepOne = await stepOneSchema.spa(resultData);
  const validatedStepTwo = await stepTwoSchema.spa(resultData);
  const validatedStepThree = await stepThreeSchema.spa(resultData);
  console.log(validatedStepOne.error?.errors);
  console.log(validatedStepTwo.error?.errors);
  console.log(validatedStepThree.error?.errors);
  if (!validatedStepOne.success) {
    return {
      redirect: CreateStoreRoutes.STEP_ONE,
      errorMsg: "Please validate store info",
      success: false,
    };
  }
  if (!validatedStepTwo.success) {
    return {
      redirect: CreateStoreRoutes.STEP_TWO,
      errorMsg: "Please create store schedule",
      success: false,
    };
  }
  if (!validatedStepThree.success) {
    return {
      redirect: CreateStoreRoutes.STEP_THREE,
      errorMsg: "Please assign admin",
      success: false,
    };
  }

  return {
    success: true,
    redirect: "/dashboard/admin/stores?page_tab1=1&page_tab2=1",
  };
};
