import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "./_components/singup";
import { LoginForm } from "./_components/signin";
import Image from "next/image";
import { SearchParams } from "@/models/search.params";

export default async function AuthPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="container relative flex h-full min-h-dvh w-full flex-col items-start justify-center px-4 py-20 md:h-dvh xl:px-0">
      <Image src="/placeholder-image.jpg" alt="Login" fill priority className="object-cover brightness-50 md:hidden" />

      <div className="flex size-full max-w-screen-xl overflow-ellipsis rounded-xl md:overflow-hidden md:border md:bg-background md:shadow-md">
        <div className="relative hidden size-full md:block">
          <Image src="/placeholder-image.jpg" alt="Login" fill priority className="object-cover brightness-50" />
          <div className="relative flex size-full flex-col justify-between px-6 py-8">
            <Link href={`/?city_id=${searchParams.city_id}`} className="w-fit text-background">
              <Image
                src="/logo/Farm2Door-logo-inv.png"
                alt="Logo Farm2Door"
                height={100}
                width={320}
                sizes="320px"
                className="object-contain"
              />
            </Link>
            <p className="max-w-sm self-end text-balance text-end text-background">
              &quot;Your trusted market platform for you and your family.&quot;
            </p>
          </div>
        </div>

        <div className="relative flex h-full w-full items-center justify-center md:px-6">
          <section className="relative z-40 h-fit w-full max-w-screen-lg space-y-4 p-4 md:h-fit md:space-y-0 md:p-0">
            <div className="flex flex-col items-center text-balance text-center md:hidden md:space-y-0">
              <Link href={`/?city_id=${searchParams.city_id}`} className="w-fit text-background">
                <Image
                  src="/logo/Farm2Door-logo-inv.png"
                  alt="Logo Farm2Door"
                  height={100}
                  width={220}
                  sizes="320px"
                  className="object-contain"
                />
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
        </div>
      </div>
    </main>
  );
}
