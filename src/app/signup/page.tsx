import { Suspense } from "react";
import HeaderLayout from "@/src/layouts/HeaderLayout";
import Signup from "./index";
import PageSkeleton from "@/src/components/PageSkeleton"

export default function SignupPage() {
  return (
    <HeaderLayout>
      <Suspense fallback={<PageSkeleton/>}>
        <Signup />
      </Suspense>
    </HeaderLayout>
  );
}