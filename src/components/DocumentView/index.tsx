import { Suspense } from "react";
import DocumentViewClient from "./DocumentViewClient";
import PageSkeleton from "@/src/components/PageSkeleton"

const DocumentView = ({ pageTitle, docList }: any) => {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <DocumentViewClient
        pageTitle={pageTitle}
        docList={docList}
      />
    </Suspense>
  );
};

export default DocumentView;