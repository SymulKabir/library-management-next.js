    export const BACKEND_URL =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

export const ML_BACKEND_URL = process.env.NODE_ENV === "development" ? 'http://localhost:4000/api' : 'http://localhost:4000/api'

