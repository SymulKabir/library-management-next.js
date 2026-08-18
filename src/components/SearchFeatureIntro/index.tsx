"use client";

import { useEffect, useState } from "react";
import "./styles.scss";
interface SearchFeatureIntroProps {
  onClose?: () => void;
}

export default function SearchFeatureIntro({
  onClose,
}: SearchFeatureIntroProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem("bookhive_ai_search_intro_seen");

    if (!alreadySeen) {
      // Small delay so the homepage renders first
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("bookhive_ai_search_intro_seen", "true");
    setOpen(false);
 
   const searchHighlightBtn = document.querySelectorAll<HTMLElement>(
    "[data-search-ai-highlight]"
  );

    console.log("searchHighlightBtn ---->>>", searchHighlightBtn);
    searchHighlightBtn.forEach((element: any) => {
      element.classList.add("search-ai-highlight");
    });

    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="search-intro-overlay">
      <div className="search-intro-modal">
        {/* Close */}
        <button
          className="search-intro-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Top Icon */}
        <div className="search-intro-icon">
          <span>✨</span>
        </div>

        {/* Heading */}
        <div className="search-intro-header">
          <span className="search-intro-badge">NEW • AI POWERED</span>

          <h2>
            Discover a Smarter
            <br />
            Way to Find Books
          </h2>

          <p>
            BookHive now gives you smarter ways to search. Find your next book
            using an image or simply your voice.
          </p>
        </div>

        {/* Features */}
        <div className="search-intro-features">
          {/* Image Search */}
          <div className="search-feature-card image-feature">
            <div className="feature-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>

            <div>
              <h3>Search by Image</h3>

              <p>
                Take or upload a photo of a book and let BookHive find it for
                you.
              </p>
            </div>

            <span className="feature-arrow">→</span>
          </div>

          {/* Voice Search */}
          <div className="search-feature-card voice-feature">
            <div className="feature-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="9" y="2" width="6" height="13" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <path d="M12 19v3" />
                <path d="M8 22h8" />
              </svg>
            </div>

            <div>
              <h3>Search by Voice</h3>

              <p>
                Just say a title, author, or keyword. BookHive will search for
                you.
              </p>
            </div>

            <span className="feature-arrow">→</span>
          </div>
        </div>

        {/* Footer */}
        <div className="search-intro-footer">
          <div className="intro-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>

          <button className="search-intro-button" onClick={handleClose}>
            Got it, Let's Search
            <span>→</span>
          </button>
        </div>

        <p className="intro-footer-note">
          You can use these features anytime from the search bar.
        </p>
      </div>
    </div>
  );
}
