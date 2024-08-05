import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import { notFound, redirect } from "next/navigation";
import { ForgetPasswordForm } from "../_components/password";
import { axiosInstanceSSR } from "@/lib/axios.server-config";

const checkParams = async (token: string) => {
  try {
    await axiosInstanceSSR().get("/users/v3", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    notFound();
  }
};

export default async function ForgotPasswordPage({ params }: { params: { token: string } }) {
  await new Promise((resolve) => {
    try {
      resolve(jwtDecode(params.token));
    } catch (error) {
      redirect("/auth/forget-password");
    }
  });

  const _check = await checkParams(params.token);

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>

            <CardDescription>Lorem ipsum dolor sit, amet consectetur adipisicing.</CardDescription>
          </CardHeader>

          <CardContent>
            <ForgetPasswordForm token={params.token} />
          </CardContent>

          <CardFooter>
            <CardDescription>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel, et.</CardDescription>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
