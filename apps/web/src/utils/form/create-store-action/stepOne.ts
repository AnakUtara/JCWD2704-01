"use server";

import { redirect } from "next/navigation";

import { CreateStoreRoutes, FormErrors } from "@/types/store.action.types";
import { stepOneSchema } from "@/schemas/store.schema";

type AnotheData = {
  address: string;
  city_id: number;
  longitude: number;
  latitude: number;
};

export const stepOneFormAction = (prevState: FormErrors | undefined, formData: FormData, another: AnotheData): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries());
  const validated = stepOneSchema.safeParse({
    ...data,
    ...another,
  });

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    return errors;
  } else {
    redirect(CreateStoreRoutes.STEP_TWO);
  }
};
