export const BACKEND_URL =
  // process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_SITE_URL : process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:3000"
  process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_SITE_URL : process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://bookhive.publicvm.com"


// export const ML_BACKEND_URL = process.env.NODE_ENV === "development" ? 'http://localhost:4000/api' : 'http://localhost:4000/api'
export const ML_BACKEND_URL = process.env.NODE_ENV === "development" ? 'http://localhost:4000/api' : 'https://mlbookhive.publicvm.com/api'

export const BOOK_PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=100&q=80"