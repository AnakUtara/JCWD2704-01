import { Section } from "@/components/Section";
import { Revalidate } from "next/dist/server/lib/revalidate";
import { Category } from "./_components/categories";
import { Promotion } from "./_components/promotion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { dummyPromotion } from "@/constants/promotion";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";

export const revalidate: Revalidate = 900;

export default async function Home() {
  return (
    <>
      <Header />
      <main className="size-full min-h-screen space-y-6 pb-6">
        <section className="container">
          <Promotion datas={dummyPromotion} />
        </section>

        <div className="size-full px-4 md:px-0">
          <Section className="w-full space-y-4 py-4">
            <h1 className="mx-auto max-w-screen-md text-3xl font-bold leading-tight md:text-4xl lg:leading-[1.1]">Category</h1>
            <Suspense fallback={<Spinner />}>
              <Category />
            </Suspense>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
