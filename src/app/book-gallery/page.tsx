import { Suspense } from "react";
import ClientComponent from "./components/ClientComponent";
import PageSkeleton from "@/src/components/PageSkeleton"

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <ClientComponent />
    </Suspense>
  );
}