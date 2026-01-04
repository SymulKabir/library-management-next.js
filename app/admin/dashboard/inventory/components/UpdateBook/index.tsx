"use client";
import { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { promiseToast, warningToast } from "@/shared/utils/toast";

const UpdateBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    image_url: "",
    stock: "",
  });

  const [warnings, setWarnings] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "stock") {
      if (/^\d*$/.test(value)) {
        setForm({ ...form, stock: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const keys = Object.keys(form);
    const newWarnings: any = {};
    keys.forEach((key) => {
      if (!form[key as keyof typeof form]) newWarnings[key] = true;
    });
    setWarnings(newWarnings);
    if (Object.keys(newWarnings).length > 0) warningToast("Fill all fields, then try again!");
    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiCall = async () => {
      const response = await fetch("/api/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { data, message } = await response.json();
      if (!data) throw new Error(message || "Book add failed");
      return data;
    };

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Adding book...",
        success: "Book added successfully!",
        error: "Failed to add book!",
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
              ISBN Number
              <input
                type="text"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="978-1612680194"
                className={getWarningClass("isbn")}
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
              <Link href={"/admin/inventory"}>Book List</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
