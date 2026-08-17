import { BACKEND_URL, ML_BACKEND_URL } from "@/src/constants";

export const getFilteredBook = async (query: any, page: any) => {
  try {
    const res = await fetch("/api/books/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...query, page }),
    });
    const parseResponse = await res.json();
    return parseResponse;
  } catch (error: any) {
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
  } catch (error: any) {}
};

export const createBookVector = async (image_url: string) => {
  try {
    if (!image_url) {
      return;
    }
    const res = await fetch(`${ML_BACKEND_URL}/book/create-image-vector`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url }),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error: any) {}
};
export const createBookMetadataVector = async (metadata: any) => {
  try {
    if (!metadata) {
      return;
    }
    const res = await fetch(`${ML_BACKEND_URL}/book/create-text-vector`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...metadata }),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error: any) {
    console.log("error ---->>>", error);
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
  } catch (error: any) {}
};

export const searchBookByImage = async (file: File) => {
  try {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${ML_BACKEND_URL}/book/image-search`, {
      method: "POST",
      body: formData,
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error: any) {}
};

export const deleteAllBookVector = async () => {
  try {
    const res = await fetch(`${ML_BACKEND_URL}/book/delete-image-vector`, {
      method: "DELETE",
    });
    const resJson = await res.json();
    return resJson;
  } catch (error: any) {}
};

export const searchBookByVoice = async (blob: any) => {
  try {
    if (!blob) {
      return;
    }
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
    const res = await fetch(`${ML_BACKEND_URL}/book/voice-search`, {
      method: "POST",
      body: formData,
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error: any) {}
};
export const searchBookByMetadata = async (body: any) => {
  try {
    if (!body) {
      return;
    }
    const res = await fetch(`${ML_BACKEND_URL}/book/metadata-search`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const jsonRes = await res.json();
    return jsonRes;
  } catch (error: any) {}
};
