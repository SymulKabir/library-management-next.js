import { Suspense } from "react";
import HeaderLayout from "@/src/layouts/HeaderLayout";
import HomePage from "@/src/app/Home/index";
import PageSkeleton from "@/src/components/PageSkeleton"


export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <HeaderLayout>
        <HomePage />
      </HeaderLayout>
    </Suspense>
  );
}