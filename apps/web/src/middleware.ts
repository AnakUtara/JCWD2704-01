import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./utils/action/user.middleware";
import { Role } from "./models/user.model";

const requiredLogin = ["/account/setting", "/account/address", "/account/cart"];
const adminBaseRoute = "/dashboard/admin";
const adminRoutes = [`${adminBaseRoute}/users`, `${adminBaseRoute}/products`, `${adminBaseRoute}/categories`, `${adminBaseRoute}/store`];

export async function middleware(request: NextRequest) {
  try {
    const refresh_token = request.cookies.get("refresh_token")?.value || "";
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();
    const user = await getUserSession(response, refresh_token);
    const isRequiredLogin = requiredLogin.includes(pathname);
    const isRequiredAdminLogin = adminRoutes.includes(pathname);

    // TODO: User protection routes
    if (!user && isRequiredLogin) return NextResponse.redirect(new URL("/auth", request.url));
    if (user && pathname.startsWith("/auth")) return NextResponse.redirect(new URL("/", request.url));
    if (!user?.addresses.length && pathname.includes("/categories")) return NextResponse.redirect(new URL("/account/address", request.url));

    // Super & Store admin protection routes
    if ((!user || user.role === Role.customer) && isRequiredAdminLogin) return NextResponse.redirect(new URL("/", request.url));

    // if (!user?.addresses.length && pathname.startsWith("/account/cart"))
    //   return NextResponse.redirect(new URL("/account/address", request.url));
    // if (user && pathname === "/auth") return NextResponse.redirect(new URL("/", request.url));

    // if (!user || (user?.role === "customer" && pathname.startsWith("/dashboard"))) return NextResponse.redirect(new URL("/", request.url));
    return response;
  } catch (error) {
    // console.log(error);
    // return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/dashboard/admin/:path*", "/cart/:path*", "/account/:path*", "/auth", "/categories/:path*"],
};
