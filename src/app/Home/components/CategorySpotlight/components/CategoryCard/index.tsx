"use client";
import { useRouter } from "next/navigation";
import "./styles.scss";

const Index = ({ data }: { data?: any }) => {
  const router = useRouter();
  if (!data) {
    return (
      <div className="category-card skeleton-card">
        <div className="icon skeleton-icon"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }
  const handleCategoryPageView = (category: string) => {
    router.push(`/book-gallery?category=${category}`);
  };

  return (
    <div
      className="category-card"
      onClick={() => handleCategoryPageView(data.category_name)}
    >
      <img className="icon" src={data.category_image} />
      <h4>{data.category_name}</h4>
      <p>{data.total_books || 0}</p>
    </div>
  );
};

export default Index;
