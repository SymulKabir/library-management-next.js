"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./styles.scss";
import { MdFilterList, MdSearch } from "react-icons/md";
import HeaderLayout from "@/src/layouts/HeaderLayout";
import SearchBookCard from "@/src/components/SearchBookCard";
import { BOOK_PLACEHOLDER_IMG } from "@/src/constants";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";
import useCategories from "@/src/hooks/useCategories";

interface Book {
  book_id: string;
  title: string;
  author: string;
  category: string;
  price?: number;
  image_url: string;
  stock: number;
}

const Index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progressing, setProgressing, list } = useProgressingUtils(12);
  const { list: categorySkeletonList } = useProgressingUtils(10);
  const { categoriesProgressing, categories } = useCategories();

  // URL থেকে ইনিশিয়াল স্টেট রিড করা
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState("popular");
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // URL প্যারামিটার পরিবর্তন হলে স্টেট সিঙ্ক করার জন্য
  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    const queryCategory = searchParams.get("category") || "";
    const queryPage = Number(searchParams.get("page")) || 1;

    setSearchQuery(querySearch);
    setSelectedCategory(queryCategory);
    setPage(queryPage);
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, searchQuery, sortOption, page]);

  const fetchBooks = async () => {
    try {
      setProgressing(true);
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
          search: searchQuery,
          category: selectedCategory,
          sort: sortOption,
        }),
      });
      const result = await res.json();
      setBooks(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error: any) {
      console.error("Error fetching books:", error);
    } finally {
      setProgressing(false);
    }
  };

  // ক্যাটাগরি সিলেক্ট করলে URL আপডেট করার ফাংশন
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <HeaderLayout>
      <div className="filter-books-page">
        <div className="shop-top-bar">
          <div className="breadcrumb">
            Home / <span>Books Gallery</span>
          </div>
        </div>

        <div className="shop-main-content">
          {/* Left Sidebar Filter */}
          <aside className="shop-sidebar">
            <div className="filter-group">
              <h3>
                <MdFilterList /> Book Flags
              </h3>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" /> Pre-Booking
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> Best Booking
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> New Arrival
                  </label>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h3>Book Categories</h3>
              <ul className="category-filter-list">
                <li
                  className={selectedCategory === "" ? "active" : ""}
                  onClick={() => handleCategorySelect("")}
                >
                  <div className="cat-thumb-wrapper">
                    <img src={BOOK_PLACEHOLDER_IMG} alt="" />
                  </div>
                  <span>All Categories</span>
                </li>

                {!!categories.length &&
                  categories.map((cat: any) => (
                    <li
                      key={cat.category_id}
                      className={
                        selectedCategory === cat.category_name ? "active" : ""
                      }
                      onClick={() => handleCategorySelect(cat.category_name)}
                    >
                      <div className="cat-thumb-wrapper">
                        <img
                          src={cat.category_image || BOOK_PLACEHOLDER_IMG}
                          alt=""
                        />
                      </div>
                      <span>{cat.category_name}</span>
                    </li>
                  ))}
                {categoriesProgressing &&
                  categorySkeletonList.map((_, index) => (
                    <li
                      key={`cat-skeleton-${index}`}
                      className="skeleton-category-item"
                    >
                      <div className="cat-thumb-wrapper skeleton-thumb"></div>
                      <div className="skeleton-text"></div>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="shop-products-section">
            {/* Sort bar */}
            <div className="sort-bar">
              <span>
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : selectedCategory
                    ? `Category: ${selectedCategory}`
                    : "Explore our curated library collection"}
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="popular">Most Popular / Trending</option>
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
                <option value="bestsale">Highest Stock Available</option>
              </select>
            </div>

            {/* Product Grid (4 Columns) */}
            <div className="product-grid">
              {!!books.length &&
                books.map((book, index) => (
                  <SearchBookCard book={book} key={index} />
                ))}
              {progressing &&
                list.map((_, index) => {
                  return <SearchBookCard key={index} />;
                })}
              {!progressing && !books.length && (
                <div className="no-books">
                  <p>No books found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={page === p ? "active" : ""}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Index;
