import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "./_components/singup";
import { LoginForm } from "./_components/signin";
import Image from "next/image";

export default async function AuthPage() {
  return (
    <main className="container relative flex h-screen w-full justify-center px-4 pt-20">
      <Image src="/placeholder-image.jpg" alt="Login" fill priority className="object-cover brightness-50" />
      <section className="z-40 h-fit w-full max-w-screen-lg space-y-4">
        <div className="space-y-2 text-balance text-center">
          <Link href="/" className="text-background">
            <h2 className="text-5xl font-bold leading-none">Farm2Door</h2>
          </Link>
          <p className="text-balance text-background">Your trusted market platform for you and your family.</p>
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

                <CardDescription>Login to get access to the products that are best for you</CardDescription>
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
