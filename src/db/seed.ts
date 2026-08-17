import { db } from "@/src/lib/db";
import {
  createBookMetadataVector,
  createBookVector,
} from "@/src/services/book";
import { generateBookId } from "@/src/utils/book";

const categoryList = [
  {
    category_name: "অনুবাদ সাহিত্য",
    category_image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "কমিকস ও গ্রাফিক নভেল",
    category_image: "https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "স্বাস্থ্য ও ফিটনেস",
    category_image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "রান্নাবান্না ও রেসিপি",
    category_image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "ভ্রমণ ও পর্যটন",
    category_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "একাডেমিক ও পড়াশোনা",
    category_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "জীবনী ও স্মৃতিকথা",
    category_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "কবিতা ও ছড়া",
    category_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "বিজ্ঞান ও প্রযুক্তি",
    category_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "ইতিহাস ও ঐতিহ্য",
    category_image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "বিজ্ঞান কল্পকাহিনী ও রহস্য",
    category_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "শেয়ারবাজার, ব্যবসা ও বিনিয়োগ",
    category_image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "ছোটদের বই",
    category_image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "আত্ম-উন্নয়নমূলক বই",
    category_image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
  {
    category_name: "ইসলামিক বই",
    category_image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80",
    description: "",
  },
];
const bigBookList = [
  {
    title: "রাজিয়া সুলতানা",
    author: "খান আসিফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/55593072e_213580.jpg",
    stock: 50,
  },
  {
    title: "বক্তৃতা দিতে শিখুন",
    author: "ওয়াহিদ তুষার",
    category: "ক্যারিয়ার উন্নয়ন",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Boktrita_Dite_Sikhun-Wahid_Tusar-0e378-285080.png",
    stock: 67,
  },
  {
    title: "রাজিয়া সুলতানা",
    author: "খান আসিফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/55593072e_213580.jpg",
    stock: 30,
  },
  {
    title: "দি ওল্ড ম্যান অ্যান্ড দ্য সি",
    author: "আর্নেস্ট হেমিংওয়ে",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Old_Man_and_the_Sea-Ernest_Hemingway-59a14-394617.jpg",
    stock: 30,
  },
  {
    title: "জাস্ট ওয়ান লুক",
    author: "হারলান কোবেন",
    category: "রহস্য, গোয়েন্দা",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Just_one_look-Harlan_coben-517fe-386756.jpg",
    stock: 60,
  },
  {
    title: "জেমস পটার অ্যান্ড দ্য কার্স অব দ্য গেটকিপার",
    author: " জি. নরম্যান লিপার্ট",
    category: "রহস্য, গোয়েন্দা",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/1fd6bcf11_208742.jpg",
    stock: 80,
  },
  {
    title: "দ্য আর্ট অব ওয়ার",
    author: " ইসরাত জাহান বিথী",
    category: "যুদ্ধকৌশল ও পররাষ্ট্রনীতি",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Art_of_War-Sun_Tzu-37e01-426422.jpg",
    stock: 87,
  },
  {
    title: "রাসূলুল্লাহ (সা.) এর সকাল সন্ধ্যার দু’আ ও যিকর এবং দোয়ার কার্ড",
    author: "শায়খ আহমাদুল্লাহ",
    category: "দোয়া, দরূদ ও যিকর",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/11254e6eb_210878.jpg",
    stock: 48,
  },
  {
    title: " মুনাজাতে মাকবূল ও মাসনূন দুআ (বড়)",
    author: "হাকীমুল উম্মত মাওলানা",
    category: " দোয়া, দরূদ ও যিকর",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Munajat_Mokbhula_O_Masnun_Dowa_Boro-Hakimul_ummat_Maolana_Ashraf_Ali_Thanvi_-ebf89-44644.jpg",
    stock: 60,
  },
  {
    title: "আই উইল ফাইন্ড ইউ",
    author: "হারলান কোবেন",
    category: "রহস্য, গোয়েন্দা,",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/I_Will_Find_You-Harlan_coben-130e7-335558.png",
    stock: 70,
  },
  {
    title: "জার্নি আন্ডার দ্য মিডনাইট সান (পূর্ণাঙ্গ অনুবাদ)",
    author: "কেইগো হিগাশিনো",
    category: "Category: রহস্য, গোয়েন্দা",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Journey_Under_The_Midnight_Sun-Keigo_Higashino-4f916-333204.jpg",
    stock: 70,
  },
  {
    title: "৮৪,চ্যারিং ক্রস রোড",
    author: "হেলেন হ্যানফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/84_Charing_Cross_Road-Helen_Hanof-0ebc7-415661.jpg",
    stock: 70,
  },
  {
    title: "থ্রি মাস্কেটিয়ার্স",
    author: " আলেকজান্ডার দ্যুমা",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Three_Musketeers-Alexandre_Dumas-e2134-423136.png",
    stock: 100,
  },
  {
    title: "তুর্কিস্তানের কান্না",
    author: "সদরুল আমীন সাকিব",
    category: "ইসলামী ইতিহাস",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/cab06c8fc_202241.jpg",
    stock: 28,
  },
  {
    title: "তাতারীদের ইতিহাস (২ খণ্ড একত্রে)",
    author: "মুহাম্মদ যাইনুল আবিদীন",
    category: " ইসলামি ইতিহাস ও ঐতিহ্য",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Tatarider_Itihas_2_Khondo_Akotre-Muhammod_Jainul_Abidin-5573a-123961.jpg",
    stock: 20,
  },
];

const insertBooks = async (bookList: any[]) => {
  const conn = await db();

  try {
    for (const book of bookList) {
      const book_id = generateBookId();
      const { image_vector_id } = await createBookVector(book.image_url);
      const { metadata_vector_id } = await createBookMetadataVector({
        title: book.title,
        author: book.author,
        category: book.category,
      });
      console.log("image_vector_id ->", image_vector_id);
      console.log("metadata_vector_id ->", metadata_vector_id);
      const query = `
        INSERT INTO books 
          (book_id, title, author, category, availability, image_url, image_vector_id, metadata_vector_id, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          book_id = VALUES(book_id),
          title = VALUES(title),
          author = VALUES(author),
          category = VALUES(category),
          availability = VALUES(availability),
          image_url = VALUES(image_url),
          image_vector_id = VALUES(image_vector_id),
          metadata_vector_id = VALUES(metadata_vector_id),
          stock = VALUES(stock)
      `;

      await conn.execute(query, [
        book_id,
        book.title,
        book.author,
        book.category,
        book.availability,
        book.image_url,
        image_vector_id,
        metadata_vector_id,
        book.stock,
      ]);
    }

    console.log("Books inserted successfully!");
  } catch (error:any) {
    console.error("Error inserting books:", error);
  } finally {
    await conn.end();
  }
};
const insertCategories = async (categories: typeof categoryList) => {
  const conn = await db();

  try {
    for (const cat of categories) {
      const query = `
        INSERT INTO book_categories 
          (category_name, category_image, description)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          category_image = VALUES(category_image),
          description = VALUES(description),
          updated_at = CURRENT_TIMESTAMP
      `;

      await conn.execute(query, [
        cat.category_name,
        cat.category_image,
        cat.description,
      ]);
    }

    console.log("Categories inserted successfully!");
  } catch (error:any) {
    console.error("Error inserting categories:", error);
  } finally {
    await conn.end();
  }
};

// Call the function
insertCategories(categoryList);
insertBooks(bigBookList);
