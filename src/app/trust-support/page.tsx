import HeaderLayout from "@/src/layouts/HeaderLayout";
import DocumentView from "@/src/components/DocumentView";
import { TRUST_SUPPORT } from "@/src/constants/policy";

const Index = () => {
  return (
    <HeaderLayout>
      <DocumentView
        pageTitle={TRUST_SUPPORT.title}
        docList={TRUST_SUPPORT.list}
      />
    </HeaderLayout>
  );
};

export default Index;