"use server";

import { redirect } from "next/navigation";

import { stepTwoSchema } from "@/schemas/store.schema";
import { CreateStoreRoutes, FormErrors } from "@/types/store.action.types";

export const stepTwoFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData,
  { start_time, end_time }: { start_time: Date | undefined; end_time: Date | undefined },
): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries());
  const validated = stepTwoSchema.safeParse({
    name: data.name,
    start_time: start_time?.toTimeString().split(" ").shift(),
    end_time: end_time?.toTimeString().split(" ").shift(),
  });

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    return errors;
  } else {
    redirect(CreateStoreRoutes.STEP_THREE);
  }
};
