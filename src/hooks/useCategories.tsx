"use client";
import { useEffect } from "react";
import { getCategories } from "@/src/services/categories";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  updateCategoryProgress,
} from "../store/categories/reducer";

const useCategories = () => {
  const { progressing: categoriesProgressing, value: categories } = useSelector(
    (state: any) => state.Categories,
  ); 
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        if (!categories.length) {
          dispatch(updateCategoryProgress(true));
          const data = await getCategories();
          dispatch(setCategories(data.data || []));
        }
      } catch (error:any) {
      } finally {
        dispatch(updateCategoryProgress(false));
      }
    })();
  }, []);

  return { categoriesProgressing, categories };
};

export default useCategories;
