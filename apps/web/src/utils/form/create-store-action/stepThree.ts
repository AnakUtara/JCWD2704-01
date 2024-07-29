"use server";

import { redirect } from "next/navigation";

import { AdminInfo, stepThreeSchema, stepTwoSchema } from "@/schemas/store.schema";
import { CreateStoreRoutes, FormErrors } from "@/types/store.action.types";

export const stepThreeFormAction = (
  _prevState: FormErrors | undefined,
  _formData: FormData,
  selectedAdminId: (string | undefined)[],
  selectedAdminInfo: AdminInfo[],
): FormErrors | undefined => {
  const validated = stepThreeSchema.safeParse({
    selectedAdminId,
    selectedAdminInfo,
  });

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    console.log(errors);
    return errors;
  } else {
    redirect(CreateStoreRoutes.STEP_FOUR);
  }
};
