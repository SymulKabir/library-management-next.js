"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "./styles.scss";
import Banner from "@/src/components/Banner";

const DocumentViewClient = ({ pageTitle, docList }: any) => {

  const searchParams = useSearchParams();

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});


  useEffect(() => {
    const section = searchParams.get("section");

    if (section && sectionRefs.current[section]) {
      sectionRefs.current[section]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [searchParams]);


  return (
    <div className="doc-view-page container">
      <Banner />

      <main className="doc-section">
        <h1>{pageTitle}</h1>

        {docList.map((item: any, index: number) => (
          <div
            key={index}
            ref={(el) => {
              sectionRefs.current[item.id] = el;
            }}
            className="exp-section"
          >
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}

      </main>
    </div>
  );
};

export default DocumentViewClient;