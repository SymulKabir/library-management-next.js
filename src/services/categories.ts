export const getCategories = async () => {
  try {
    const res = await fetch("/api/categories");
    const data = await res.json();

    return data;
  } catch (error:any) {}
};
