import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./utils/action/user.middleware";

const requiredLogin = ["/account/setting", "/account/address"];
const adminBaseRoute = "/dashboard/admin";
const adminRoutes = [`${adminBaseRoute}/users`, `${adminBaseRoute}/products`, `${adminBaseRoute}/categories`];

export async function middleware(request: NextRequest) {
  try {
    const refresh_token = request.cookies.get("refresh_token")?.value || "";
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();
    const user = await getUserSession(response, refresh_token);

    const isRequiredLogin = requiredLogin.includes(pathname);

    if (isRequiredLogin && !user) return NextResponse.redirect(new URL("/", request.url));
    if (!user && pathname.includes("/login")) return response;
    if (!user?.addresses.length && pathname.includes("/cart")) return NextResponse.redirect(new URL("/account/address", request.url));

    if (!user || (user?.role === "customer" && pathname.startsWith("/dashboard"))) return NextResponse.redirect(new URL("/", request.url));
    if (!user || (user?.role !== "customer" && pathname.startsWith("/account"))) return NextResponse.redirect(new URL("/", request.url));

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/dashboard/admin/:path*", "/cart/:path*", "/account/:path*"],
};
