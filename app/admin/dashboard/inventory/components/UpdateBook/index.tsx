"use client";
import { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { promiseToast, warningToast } from "@/shared/utils/toast";
import { useRouter } from "next/navigation";


const UpdateBook = () => {
  const [progressing, setProcessing] = useState({
    addBook: false,
  });
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    availability: true,
    image_url: "",
    stock: "",
  });
  const [warnings, setWarnings] = useState<Record<string, boolean>>({});
const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "availability") {
      setForm({ ...form, [name]: value === "true" ? true : false });
      return;
    }

    if (name === "stock") {
      if (/^\d*$/.test(value)) {
        setForm({ ...form, stock: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  console.log("Form State:", form);
  const validateForm = () => {
    const newWarnings: Record<string, boolean> = {};

    Object.entries(form).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newWarnings[key] = true;
      }
    });

    setWarnings(newWarnings);
    if (Object.keys(newWarnings).length > 0) warningToast("Fill all fields, then try again!");
    return Object.keys(newWarnings).length === 0;
  };
  const apiCall = async () => {
    setProcessing((state) => ({
      ...state,
      addBook: true,
    }));
    try {
      const response = await fetch("/api/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { data, message } = await response.json();
      if (!data) throw new Error(message || "Book add failed");
      return data;
    } catch (error) {
      throw new Error(error.message || "Book add failed")
    } finally {
      setProcessing((state) => ({
        ...state,
        addBook: false,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (progressing.addBook) {
      return
    }
    if (!validateForm()) return;

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Adding book...",
        success: {
          render: ({ data }: { data: any }) => {
            router.push("/admin/dashboard/inventory");
            return `Book added successfully!`;
          }
        },
        error: {
          render: ({ data }: { data: { message: string } }) => `${data.message}`
        }
      });
      console.log("API Result:", result);
    } catch (err) {
      console.error("Book add error:", err);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? "warning" : "";
  };

  return (
    <div className="update-book-container">
      <div className="auth-page">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Add New Book</h2>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label>
              Book Title
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Rich Dad Poor Dad"
                className={getWarningClass("title")}
              />
            </label>

            <label>
              Author
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Robert Kiyosaki"
                className={getWarningClass("author")}
              />
            </label>



            <label>
              Category
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Financial Education"
                className={getWarningClass("category")}
              />
            </label>
            <label>
              Availability
              <select
                name="availability"
                value={form.availability ? "true" : "false"}
                onChange={handleChange}
                className={getWarningClass("availability")}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </label>
            <label>
              Book Image
              <input
                type="text"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://xyz.com/ab.jpg"
                className={getWarningClass("image_url")}
              />
            </label>

            <label>
              Stock Amount
              <input
                type="text"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
                className={getWarningClass("stock")}
              />
            </label>

            <button type="submit">
              <FaPlus /> Add Book
            </button>

            <div className="nav">
              <p>Want to see all books?</p>
              <Link href={"/admin/dashboard/inventory"}>Book List</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
