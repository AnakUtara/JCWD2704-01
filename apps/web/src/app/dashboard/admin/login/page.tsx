import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLoginForm from "./_component/admin.login.form";
import Image from "next/image";

export const generateMetadata = async () => {
  return {
    title: "Administrator Dashboard Login",
  };
};
export default function AdminLoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Image src={"/logo/Farm2Door-logo.png"} alt="Farm2Door Logo" width={480} height={480} className="w-full px-1 pb-5" />
          <CardTitle className="text-2xl">Administrator Login</CardTitle>
          <CardDescription>Enter your administrator email below to login to your account.</CardDescription>
        </CardHeader>
        <AdminLoginForm />
      </Card>
    </div>
  );
}
