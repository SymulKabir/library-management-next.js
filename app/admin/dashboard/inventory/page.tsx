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
import ActionBookMenu from "./components/ActionBookMenu/index";
import { LuSettings2 } from "react-icons/lu";
import CustomSelect from '@/shared/components/CustomSelect/index';


const sortBy = {
  asc: "Oldest",
  desc: "Newest"
}


const Inventory = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterInput, setFilterInput] = useState({sort: "desc"});
  const [filterItems, setFilterItems] = useState({  });
  const state = useSelector((state: any) => state);

  console.log("Redux State:", state);

  const handleUpdateBookNav = () => {
    router.push("/admin/dashboard/inventory/add");
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filterInput, page }),
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
  }, []);

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };
  const getFilteredData = (name: string) => {
    return filterInput[name] || "";
  };
  const changeFIlter = (e) => {
    const { name, value } = e.target;
    setFilterInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleFilter = () => {
    fetchBooks();
  };
  return (
    <DashboardLayout>
      <div className="admin-inventory">
        <section className="filter-controls">
          <div className="search">
            <input
              type="input"
              placeholder="search by book name, book id or author"
              name="search"
              value={getFilteredData("search")}
              onChange={changeFIlter}
            />
          </div>
          <div className="select">
            <label>Category:</label>
            <CustomSelect
              name="category"
              value={getFilteredData("category")}
              onChange={changeFIlter}
            >
              <option value="">All</option>
              {!!filterItems?.categories?.length &&
                filterItems?.categories?.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
            </CustomSelect>
          </div>

          <div className="select">
            <label>Author:</label>
            <CustomSelect
              name="author"
              value={getFilteredData("author")}
              onChange={changeFIlter}
            >
              <option value="">All</option>
              {!!filterItems?.authors?.length &&
                filterItems?.authors?.map((author: string, index: number) => (
                  <option key={index} value={author}>
                    {author}
                  </option>
                ))}
            </CustomSelect>
          </div>
          <div className="select">
            <label>Sort By:</label>
            <CustomSelect
              name="sort"
              value={sortBy[getFilteredData("sort")]}
              onChange={changeFIlter}
            >
              {
                Object.keys(sortBy).map((key, index) => {
                  return <option key={index} value={key}>{sortBy[key]}</option>
                })
              }
            </CustomSelect>
          </div>
          <div className="button">
            <button onClick={handleFilter}>
              Filter <LuSettings2 />
            </button>
          </div>
          <div className="button">
            <button onClick={handleUpdateBookNav}>
              Add items <MdAdd />
            </button>
          </div>
        </section>

        <section className="table-controls">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID Number</th>
                <th>Name</th>
                <th>Author</th>
                <th>Stock</th>
                <th>Date</th>
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
                  <td>{book.book_id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.stock}</td>
                  <td>{formatDate(book.created_at)}</td>
                  <td className="action-container">
                    <div>
                      <button>
                        <IoIosArrowDown />
                      </button>
                      <button>
                        <PiDotsThreeOutlineVerticalDuotone />
                        <ActionBookMenu
                          book_id={book.book_id}
                          setBooks={setBooks}
                        />
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

export default Inventory;
