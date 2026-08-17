'use client';

import React, { Suspense } from 'react';
import HeaderLayout from "@/src/layouts/HeaderLayout";
import DocumentView from "@/src/components/DocumentView";
import { EXPERIENCE } from '@/src/constants/policy';
import PageSkeleton from "@/src/components/PageSkeleton"


const IndexContent = () => {
  return (
    <HeaderLayout>
      <DocumentView 
        pageTitle={EXPERIENCE.title} 
        docList={EXPERIENCE.list} 
      />
    </HeaderLayout>
  );
};


const Index = () => {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <IndexContent />
    </Suspense>
  );
};


export default Index;