import { BACKEND_URL, ML_BACKEND_URL } from "@/src/constants";

export const getFilteredBook = async (query, page) => {
  try {
    const res = await fetch("/api/books/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...query, page }),
    });
    const parseResponse = await res.json();
    return parseResponse;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};
export const getBookById = async (id: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/books/get/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const parseResponse = await res.json();
    return parseResponse;
  } catch (error) {
  }
};

export const createBookVector = async (image_url: string) => {
  try {
    if (!image_url) {
      return;
    }
    const res = await fetch(`${ML_BACKEND_URL}/book/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url }),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) {
  }
};
export const searchBook = async (body: Object) => {
  try {
    if (!body) {
      return;
    }
    const res = await fetch("/api/books/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body }),
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error) {}
};

export const searchBookByImage = async (file: File) => {
  try {
    if (!file) {
      return;
    }
    const formData = new FormData();
    const res = await fetch(`${ML_BACKEND_URL}/book/search`, {
      method: "POST",
      body: formData,
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error) {}
};
export const deleteAllBookVector = async () => {
  try {
    const res = await fetch(`${ML_BACKEND_URL}/book/delete-all`, {
      method: "DELETE",
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) {
  }
};
