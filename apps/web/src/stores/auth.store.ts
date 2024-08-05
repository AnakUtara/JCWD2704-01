import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { TStore } from "@/models/store.model";
import { Gender, Role, TUser } from "@/models/user.model";
import { deleteClientTokens } from "@/utils/token";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { create } from "zustand";

export type AuthState = { user: TUser };

type AuthAction = {
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => void;
  keepLogin: () => void;
  logout: () => void;
};

export type AuthStore = AuthState & AuthAction;

export const initAdmin: AuthState = {
  user: {
    id: "",
    email: "",
    avatar_id: "",
    avatar: null,
    reset_token: "",
    referral_code: "",
    reference_code: "",
    is_verified: false,
    role: Role.customer,
    store_id: "",
    full_name: "",
    gender: Gender.male,
    dob: "",
    phone_no: "",
    is_banned: false,
    created_at: "",
    updated_at: "",
    addresses: [],
    promotions: [],
    cart: [],
    store: {} as TStore,
  },
};

const useAuthStore = (initState: AuthState = initAdmin) =>
  create<AuthStore>()((set) => {
    return {
      ...initState,
      login: async (email, password) => {
        try {
          const response = await axiosInstanceCSR().post("/users/v2", {
            email,
            password,
          });
          toast.success(response.data.message, {
            description: response.data.description,
            position: "top-right",
            duration: 1000,
          });
          const access_token = getCookie("access_token") || "";
          if (access_token) {
            set(() => ({ user: jwtDecode(access_token) as TUser }));
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message, {
              description: error.response?.data.causer,
              position: "top-right",
              richColors: false,
            });
          }
          deleteClientTokens();
        }
      },
      adminLogin: async (email, password) => {
        try {
          await axiosInstanceCSR().post("/admin/auth/v1", {
            email,
            password,
          });
          const access_token = getCookie("access_token");
          if (access_token) {
            set(() => ({ user: jwtDecode(access_token) as TUser }));
            toast.success("Signed In");
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log(error.response?.data.message);
            toast.error(error.response?.data.message);
          }
          deleteClientTokens();
        }
      },
      keepLogin: () => {
        const access_token = getCookie("access_token");
        if (access_token) {
          set(() => ({ user: jwtDecode(access_token) as TUser }));
        } else {
          deleteClientTokens();
          set(() => ({ user: initState.user }));
        }
      },
      logout: () => {
        deleteClientTokens();
        set(() => ({ user: initState.user }));
        toast.success("Logged out.");
      },
    };
  });

export default useAuthStore();
