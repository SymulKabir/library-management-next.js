/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/shared/layouts/DashboardLayout/index";
import { MdAdd } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterItems, setFilterItems] = useState({});
  const state = useSelector((state: any) => state);

  console.log("Redux State:", state);

  const handleUpdateBookNav = () => {
    router.push("/dashboard/admin/inventory/add");
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, author, sort, page }),
      });
      const { data } = await res.json();
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const fetchFilterItems = async () => {
    try {
      const res = await fetch("/api/books/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const { data } = await res.json();
      setFilterItems(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchFilterItems();
  }, []);
  useEffect(() => {
    fetchBooks();
  }, [category, author, sort, page]);

  return (
    <DashboardLayout>
      <div className="admin-inventory">
        <section className="inventory-filter-section">
          <div className="select">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {!!filterItems?.categories?.length &&
                filterItems?.categories?.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          <div className="select">
            <label>Author:</label>
            <select value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="">All</option>
              {!!filterItems?.authors?.length &&
                filterItems?.authors?.map((author: string, index: number) => (
                  <option key={index} value={author}>
                    {author}
                  </option>
                ))}
            </select>
          </div>

          <div className="select">
            <label>Sort By:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Default</option>
              <option value="asc">Oldest</option>
              <option value="desc">Newest</option>
              <option value="bestsale">Best Sale</option>
            </select>
          </div>

          <div className="button">
            <button onClick={handleUpdateBookNav}>
              Add items <MdAdd />
            </button>
          </div>
        </section>

        <section className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID Number</th>
                <th>Name</th>
                <th>Author</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td className="img-container">
                    <div>
                      <input type="checkbox" />
                      <div>
                        <img src={book.image_url} alt={book.title} />
                      </div>
                    </div>
                  </td>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.stock}</td>
                  <td className="action-container">
                    <div>
                      <button>
                        <IoIosArrowDown />
                      </button>
                      <button>
                        <PiDotsThreeOutlineVerticalDuotone />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {books.length === 0 && <p>No books found.</p>}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

 

