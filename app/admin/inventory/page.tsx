"use client";
import React, { useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/shared/layouts/DashboardLayout/index";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [books, setBooks] = React.useState<any[]>([]);
  const [category, setCategory] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const ImgAdd =
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8MHx8fDA%3D";

  const handleUpdateBookNav = () => {
    router.push("/admin/inventory/add");
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

  useEffect(() => {
    fetchBooks();
  }, [category, author, sort, page]);

  return (
    <DashboardLayout>
      <div className="admin-inventory">
        <section className="inventory-filter-section">
          <div className="select">
            <label>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              <option value="cat1">Cat 1</option>
              <option value="cat2">Cat 2</option>
            </select>
          </div>

          <div className="select">
            <label>Author:</label>
            <select value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="">All</option>
              <option value="author1">Author 1</option>
              <option value="author2">Author 2</option>
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
                <tr key={book.id || index}>
                  <td className="img-container">
                    <div>
                      <input type="checkbox" />
                      <div>
                        <Image src={book.image_url || ImgAdd} alt={book.title} height={100} width={100} />
                      </div>
                    </div>
                  </td>
                  <td>{book.book_id || `BK-${book.id}`}</td>
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
