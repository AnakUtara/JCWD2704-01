import {
  ChangePasswordType,
  ChangeProfileType,
  EmailVerificationType,
  ForgetPasswordType,
  LoginType,
  RegisterType,
} from "@/schemas/user.schema";
import { changePasswordAction, changeProfileAction, emailVerificationAction, forgetPasswordAction, registerAction } from "../actions/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const registerSubmit = async (payload: RegisterType) => {
  try {
    const response = await registerAction(payload);

    toast.success(response.data.message, {
      important: true,
      description: response.data.description,
      position: "top-right",
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
        position: "top-right",
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
      });
    } else {
      toast.error(`${error}`);
    }
  }
};

export const loginSubmit = async (payload: LoginType, login: (email: string, password: string) => Promise<void>) => {
  try {
    await login(payload.email, payload.password);
    window.location.reload();
  } catch (error) {
    console.log(error)
  }
};

export const emailVerificationSubmit = async (payload: EmailVerificationType) => {
  try {
    const response = await emailVerificationAction(payload);
    toast.success(response.data.message, {
      description: response.data.description,
    });
  } catch (error) {}
};

export const forgetPasswordSubmit = async (payload: ForgetPasswordType, token: string, router: AppRouterInstance) => {
  try {
    const response = await forgetPasswordAction(payload, token);
    toast.success(response.data.message, {
      description: response.data.description,
    });
    router.push("/auth");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
      });
    } else {
      toast.error(`${error}`, { closeButton: true });
    }
  }
};

export const changeProfileSubmit = async (payload: ChangeProfileType) => {
  try {
    const response = await changeProfileAction(payload);
    window.location.reload();
    toast.success(response.data.message, {
      description: response.data.description,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
      });
    } else {
      toast.error(`${error}`, { closeButton: true });
    }
  }
};

export const changePasswordSubmit = async (payload: ChangePasswordType) => {
  try {
    const response = await changePasswordAction(payload);
    window.location.reload();
    toast.success(response.data.message, {
      description: response.data.description,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message, {
        description: error.response?.data.cause,
      });
    } else if (error instanceof Error) {
      toast.error(error.message, {
        description: error.cause ? (error.cause as string) : "",
      });
    } else {
      toast.error(`${error}`, { closeButton: true });
    }
  }
};
