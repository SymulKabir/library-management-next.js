import {
  getFilteredBook,
  searchBook,
  searchBookByImage,
  searchBookByVoice,
} from "@/src/services/book";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { LuSearch, LuImage, LuMic, LuX } from "react-icons/lu";
import { useRouter } from "next/navigation";
import ProgressingDot from "@/src/components/ProgressingDot";

type Book = {
  book_id: string;
  title: string;
  author: string;
};

const Index: React.FC = () => {
  const [filterInput, setFilterInput] = useState<any>({ sort: "desc" });
  const [progressing, setProgressing] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    if (!filterInput.search) {
      setProgressing(false);
      setBooks([]);
      return;
    }
    const handler = setTimeout(async () => {
      setProgressing(true);
      try {
        const data = await searchBook({
          search: filterInput.search,
          limit: 20,
        });
        setBooks(data?.data || []);
      } catch (error: any) {
        console.error("Search error:", error);
        setBooks([]);
      } finally {
        setProgressing(false);
      }
    }, 500); // 500ms delay

    // Cleanup function clears the timeout if user types again before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [filterInput.search]);

  const getContainerClass = () => {
    let classes = ["search-container"];
    if (isRecording) classes.push("is-recording");
    if (imgFile) classes.push("has-image");
    if (filterInput?.search?.length) classes.push("has-search-text");
    return classes.join(" ");
  };

  const resetSearchItem = () => {
    setFilterInput((prev: any) => ({ ...prev, search: "", placeholder: "" }));
    setImgFile(null);
    setIsRecording(false);
    setBooks([]);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      return;
    }

    try {
      resetSearchItem();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      const autoStopTimer = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 10000);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        clearTimeout(autoStopTimer);

        // Stop all tracks to turn off the microphone light
        stream.getTracks().forEach((track) => track.stop());

        // Create the blob
        const audioBlob = new Blob(chunks, { type: "audio/wav" });

        // Update UI state before sending to backend
        setIsRecording(false);
        setMediaRecorder(null);

        // Send to backend
        await sendAudioToBackend(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error: any) {
      console.error("Recording error:", error);
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (blob: Blob) => {
    try {
      setProgressing(true);
      const { data, voiceText } = await searchBookByVoice(blob);
      setBooks(data || []);
      setFilterInput((pre: any) => {
        return {
          ...pre,
          placeholder: voiceText || "",
        };
      });
    } finally {
      setProgressing(false);
    }
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      resetSearchItem();
      setImgFile(e.target.files[0]);
      // Trigger API call for image
      (async () => {
        setProgressing(true);
        const { data } = await searchBookByImage(e.target.files![0]);
        setBooks(data || []);
        setProgressing(false);
      })();
    }
  };
  const searchSubmit = () => {
    if (!filterInput.search) {
      return;
    }
    setBooks([]);
    router.push(`/book-gallery?search=${filterInput.search}`);
  };

  return (
    <section className="book-search-section">
      <div className={getContainerClass()}>
        <button className="img-section"   data-search-ai-highlight>
          <LuImage />
          <input type="file" onChange={handleImgUpload} />
        </button>

        <button
          onClick={toggleRecording}
          className={`icon-btn mic-btn ${isRecording ? "active" : ""}`}
          data-search-ai-highlight
        >
          <LuMic />
        </button>

        {imgFile && (
          <div className="preview-container">
            <img src={URL.createObjectURL(imgFile)} alt="Preview" />
          </div>
        )}

        <input
          type="search"
          placeholder={
            isRecording
              ? "Listening..."
              : filterInput.placeholder
                ? filterInput.placeholder
                : "Search by title, ID, or author..."
          }
          value={filterInput.search || ""}
          onChange={(e) => {
            setImgFile(null);
            setFilterInput({
              ...filterInput,
              search: e.target.value,
              placeholder: "",
            });
          }}
          disabled={isRecording}
        />

        <button className="icon-btn search-btn" onClick={() => searchSubmit()}>
          <LuSearch />
        </button>
      </div>

      <div className="search-result-container">
        {progressing ? (
          <ProgressingDot />
        ) : books.length > 0 ? (
          <ul>
            {books.map((book, i) => (
              <li key={i} onClick={() => router.push(`/books/${book.book_id}`)}>
                <LuSearch /> <div>{book.title}</div>
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

export default Index;
