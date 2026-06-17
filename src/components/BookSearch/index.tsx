import {
  getFilteredBook,
  searchBook,
  searchBookByImage,
} from "@/src/services/book";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { LuMic } from "react-icons/lu";
import { useRouter } from "next/navigation";
import ProgressingDot from "@/src/components/ProgressingDot"
import { sleep } from "@/src/utils/sleep";

type Book = {
  title: string;
  author: string;
};



const BookSearch: React.FC = () => {
  const [filterInput, setFilterInput] = useState<any>({ sort: "desc" });
  const [page, setPage] = useState<number>(1);
  const [progressing, setProgressing] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    (
      async () => {
        try {
          setProgressing(true)
          if (filterInput.search) {
            const { data } = await getFilteredBook(filterInput, page)
            setBooks(data || []);
          } else {
            setBooks([]);
          }
        } finally {
          setProgressing(false)
        }
      }
    )()

  }, [filterInput.search]);
  useEffect(() => {
    (async () => {
      try {
        setProgressing(true)
        if (imgFile) {
          const { data } = await searchBookByImage(imgFile);
          setBooks(data || []);
        } else {
          setBooks([]);
        }
      } finally {
        setProgressing(false)
      }

    })();
  }, [imgFile]);

  const fetchBooks = async () => {
    try {
      const { data } = await searchBook({ ...filterInput, page });
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const getFilteredData = (name: string) => {
    return filterInput[name] || "";
  };
  const changeFilter = (e) => {
    const { name, value } = e.target;
    setFilterInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleBookView = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };
  const handleImgUpload = (e) => {
    const { files } = e.target;
    if (files[0]) {
      setImgFile(files[0]);
    }
  };

  return (
    <section className="book-search-section">
      <div className="search-container">
        <button className="img-section" name="">
          <LuImage />
          <input type="file" onChange={handleImgUpload} />
        </button>
        <button>
          <LuMic />
        </button>
        {imgFile && <img src={URL.createObjectURL(imgFile)} alt="" />}
        <input
          type="search"
          placeholder="search by book name, book id or author"
          name="search"
          value={getFilteredData("search")}
          onChange={changeFilter}
        />

        <button onClick={fetchBooks}>
          <LuSearch />
        </button>
      </div>

      <div className="search-result-container">
        {progressing ?
          <ProgressingDot /> :
          books.length > 0 ? (
            <ul>
              {books.map((book: Book, index: number) => (
                <li key={index} onClick={() => handleBookView(book.book_id)}>
                  <LuSearch /> {book.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
      </div>
    </section>
  );
};

export default BookSearch;
