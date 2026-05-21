import { useMemo } from "react";
import './styles.scss'
import BookDetails from "./BookDetails";
export const bookList = [
  {
    title: "তুর্কিস্তানের কান্না",
    author: "সদরুল আমীন সাকিব",
    category: "ইসলামী ইতিহাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/cab06c8fc_202241.jpg",
    stock: 28,
  },
  {
    title: "তাতারীদের ইতিহাস",
    author: "মুহাম্মদ যাইনুল আবিদীন",
    category: "ইসলামী ইতিহাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Tatarider_Itihas.jpg",
    stock: 20,
  },
  {
    title: "দ্য আর্ট অব ওয়ার",
    author: "ইসরাত জাহান বিথী",
    category: "যুদ্ধকৌশল",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Art_of_War.jpg",
    stock: 89,
  },
  {
    title: "বক্তৃতা দিতে শিখুন",
    author: "ওয়াহিদ তুষার",
    category: "ক্যারিয়ার",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Boktrita_Dite_Sikhun.png",
    stock: 69,
  },
  {
    title: "মুনাজাতে মাকবূল",
    author: "হাকীমুল উম্মত",
    category: "দোয়া",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Munajat_Makbul.jpg",
    stock: 60,
  },
  {
    title: "সকাল সন্ধ্যার দু’আ",
    author: "শায়খ আহমাদুল্লাহ",
    category: "দোয়া",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/dua_card.jpg",
    stock: 49,
  },
];
export const bigBookList = [
  {
    title: "রাজিয়া সুলতানা",
    author: "খান আসিফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Razia_Sultana.jpg",
    stock: 50,
  },
  {
    title: "বক্তৃতা দিতে শিখুন",
    author: "ওয়াহিদ তুষার",
    category: "ক্যারিয়ার",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Boktrita_Dite_Sikhun.png",
    stock: 67,
  },
  {
    title: "দ্য ওল্ড ম্যান অ্যান্ড দ্য সি",
    author: "আর্নেস্ট হেমিংওয়ে",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Old_Man_and_the_Sea.jpg",
    stock: 30,
  },
  {
    title: "জাস্ট ওয়ান লুক",
    author: "হারলান কোবেন",
    category: "রহস্য",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Just_one_look.jpg",
    stock: 60,
  },
  {
    title: "জেমস পটার",
    author: "জি. নরম্যান লিপার্ট",
    category: "রহস্য",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/James_Potter.jpg",
    stock: 80,
  },
  {
    title: "দ্য আর্ট অব ওয়ার",
    author: "ইসরাত জাহান বিথী",
    category: "যুদ্ধকৌশল",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Art_of_War.jpg",
    stock: 87,
  },
  {
    title: "সকাল সন্ধ্যার দু’আ",
    author: "শায়খ আহমাদুল্লাহ",
    category: "দোয়া",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/dua_card.jpg",
    stock: 48,
  },
  {
    title: "মুনাজাতে মাকবূল",
    author: "হাকীমুল উম্মত",
    category: "দোয়া",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Munajat_Makbul.jpg",
    stock: 60,
  },
  {
    title: "আই উইল ফাইন্ড ইউ",
    author: "হারলান কোবেন",
    category: "রহস্য",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/I_Will_Find_You.png",
    stock: 70,
  },
  {
    title: "মিডনাইট সান",
    author: "কেইগো হিগাশিনো",
    category: "রহস্য",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Midnight_Sun.jpg",
    stock: 70,
  },
  {
    title: "৮৪ চ্যারিং ক্রস রোড",
    author: "হেলেন হ্যানফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/84_Charing_Cross_Road.jpg",
    stock: 70,
  },
  {
    title: "থ্রি মাস্কেটিয়ার্স",
    author: "আলেকজান্ডার দ্যুমা",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Three_Musketeers.png",
    stock: 100,
  },
  {
    title: "তুর্কিস্তানের কান্না",
    author: "সদরুল আমীন সাকিব",
    category: "ইসলামী ইতিহাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/cab06c8fc_202241.jpg",
    stock: 28,
  },
  {
    title: "তাতারীদের ইতিহাস",
    author: "মুহাম্মদ যাইনুল আবিদীন",
    category: "ইসলামী ইতিহাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Tatarider_Itihas.jpg",
    stock: 20,
  }
];
type Book = {
  title: string;
  author: string;
  category: string;
  availability: number;
  image_url: string;
  stock: number;
};

type Props = {
  book: Book;
  allBooks: Book[];
};

const Index = () => {
  return (
    <BookDetails book={bookList[0]} allBooks={[...bookList, ...bigBookList]} />
  );
};

export default Index;