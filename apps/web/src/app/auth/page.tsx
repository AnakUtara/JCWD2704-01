import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "./_components/singup";
import { LoginForm } from "./_components/signin";

export default async function AuthPage() {
  return (
    <main className="container flex h-screen w-full justify-center px-4 pt-20">
      <section className="h-fit w-full max-w-screen-lg space-y-4">
        <div className="space-y-2 text-balance text-center">
          <h2 className="text-5xl font-bold leading-none">Farm2Door</h2>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </div>

        <Tabs defaultValue="signin" className="size-full">
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="w-full">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="singup" className="w-full">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>

                <CardDescription>Lorem ipsum dolor sit amet consectetur.</CardDescription>
              </CardHeader>

              <CardContent>
                <LoginForm />
              </CardContent>

              <CardFooter>
                <CardDescription>
                  <Link href="/auth/forget-password">Forget password?</Link>
                </CardDescription>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="singup">
            <Card>
              <CardHeader>
                <CardTitle>Register your account</CardTitle>

                <CardDescription></CardDescription>
              </CardHeader>

              <CardContent>
                <RegisterForm />
              </CardContent>

              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
