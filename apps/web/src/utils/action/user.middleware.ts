import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";
import { TUser } from "@/models/user.model";
import { jwtDecode } from "jwt-decode";
import type { NextResponse } from "next/server";

export const getUserSession = async (res: NextResponse<unknown>, refresh_token: string): Promise<Awaited<TUser> | null> => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BASE_API_URL}/users/v2`, {
      method: "GET",
      credentials: "include",
      next: { revalidate: 600 },
      headers: {
        Authorization: `Bearer ${refresh_token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as Awaited<{ accessToken?: string | null }>;

    if (!data.accessToken) {
      res.cookies.delete("access_token");
      return null;
    }
    res.cookies.set("access_token", data.accessToken);
    const user = jwtDecode(data.accessToken) as TUser;
    return user;
  } catch (error) {
    res.cookies.delete("refresh_token");
    res.cookies.delete("access_token");
    console.error(error);
    return null;
  }
};
