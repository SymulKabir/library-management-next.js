"use client";
import { useEffect, useState } from "react";
import useStudent from "@/src/hooks/useStudent";
import { warningToast, promiseToast } from "@/src/utils/toast";
import { useRouter } from "next/navigation";

const useProgressingUtils = (listLength: number = 10) => {
  const [progressing, setProgressing] = useState(true);
  const [list, setList ] = useState(new Array(listLength).fill("")) 

  return { progressing, setProgressing, list};
};

export default useProgressingUtils;
