const mysql = require("mysql2/promise");

const generateBookId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 9; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const db = async () => {
  return mysql.createConnection({
    host: "localhost",
    user: "book_hive",
    password: "12345",
    database: "library_management",
  });
};

const bookList = [
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
  {
    title: "দ্য আর্ট অব ওয়ার",
    author: " ইসরাত জাহান বিথী",
    category: "যুদ্ধকৌশল ও পররাষ্ট্রনীতি",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Art_of_War-Sun_Tzu-37e01-426422.jpg",
    stock: 89,
  },
  {
    title: "বক্তৃতা দিতে শিখুন",
    author: "ওয়াহিদ তুষার",
    category: "ক্যারিয়ার উন্নয়ন",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Boktrita_Dite_Sikhun-Wahid_Tusar-0e378-285080.png",
    stock: 69,
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
    title: "রাসূলুল্লাহ (সা.) এর সকাল সন্ধ্যার দু’আ ও যিকর এবং দোয়ার কার্ড",
    author: "শায়খ আহমাদুল্লাহ",
    category: "দোয়া, দরূদ ও যিকর",
    availability: 1,
    image_url:
      "https://rokbucket.rokomari.io/ProductNew20190903/260X372/11254e6eb_210878.jpg",
    stock: 49,
  },
];

const bigBookList = [
  {
    title: "রাজিয়া সুলতানা",
    author: "খান আসিফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/55593072e_213580.jpg",
    stock: 50,
  },
  {
    title: "বক্তৃতা দিতে শিখুন",
    author: "ওয়াহিদ তুষার",
    category: "ক্যারিয়ার উন্নয়ন",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Boktrita_Dite_Sikhun-Wahid_Tusar-0e378-285080.png",
    stock: 67,
  },
  {
    title: "রাজিয়া সুলতানা",
    author: "খান আসিফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/55593072e_213580.jpg",
    stock: 30,
  },
  {
    title: "দি ওল্ড ম্যান অ্যান্ড দ্য সি",
    author: "আর্নেস্ট হেমিংওয়ে",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Old_Man_and_the_Sea-Ernest_Hemingway-59a14-394617.jpg",
    stock: 30,
  },
  {
    title: "জাস্ট ওয়ান লুক",
    author: "হারলান কোবেন",
    category: "রহস্য, গোয়েন্দা",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Just_one_look-Harlan_coben-517fe-386756.jpg",
    stock: 60,
  },
  {
    title: "জেমস পটার অ্যান্ড দ্য কার্স অব দ্য গেটকিপার",
    author: " জি. নরম্যান লিপার্ট",
    category: "রহস্য, গোয়েন্দা",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/1fd6bcf11_208742.jpg",
    stock: 80,
  },
  {
    title: "দ্য আর্ট অব ওয়ার",
    author: " ইসরাত জাহান বিথী",
    category: "যুদ্ধকৌশল ও পররাষ্ট্রনীতি",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/The_Art_of_War-Sun_Tzu-37e01-426422.jpg",
    stock: 87,
  },
  {
    title: "রাসূলুল্লাহ (সা.) এর সকাল সন্ধ্যার দু’আ ও যিকর এবং দোয়ার কার্ড",
    author: "শায়খ আহমাদুল্লাহ",
    category: "দোয়া, দরূদ ও যিকর",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/11254e6eb_210878.jpg",
    stock: 48,
  },
  {
    title: " মুনাজাতে মাকবূল ও মাসনূন দুআ (বড়)",
    author: "হাকীমুল উম্মত মাওলানা",
    category: " দোয়া, দরূদ ও যিকর",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Munajat_Mokbhula_O_Masnun_Dowa_Boro-Hakimul_ummat_Maolana_Ashraf_Ali_Thanvi_-ebf89-44644.jpg",
    stock: 60,
  },
  {
    title: "আই উইল ফাইন্ড ইউ",
    author: "হারলান কোবেন",
    category: "রহস্য, গোয়েন্দা,",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/I_Will_Find_You-Harlan_coben-130e7-335558.png",
    stock: 70,
  },
  {
    title: "জার্নি আন্ডার দ্য মিডনাইট সান (পূর্ণাঙ্গ অনুবাদ)",
    author: "কেইগো হিগাশিনো",
    category: "Category: রহস্য, গোয়েন্দা",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Journey_Under_The_Midnight_Sun-Keigo_Higashino-4f916-333204.jpg",
    stock: 70,
  },
  {
    title: "৮৪,চ্যারিং ক্রস রোড",
    author: "হেলেন হ্যানফ",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/84_Charing_Cross_Road-Helen_Hanof-0ebc7-415661.jpg",
    stock: 70,
  },
  {
    title: "থ্রি মাস্কেটিয়ার্স",
    author: " আলেকজান্ডার দ্যুমা",
    category: "অনুবাদ উপন্যাস",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Three_Musketeers-Alexandre_Dumas-e2134-423136.png",
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
    title: "তাতারীদের ইতিহাস (২ খণ্ড একত্রে)",
    author: "মুহাম্মদ যাইনুল আবিদীন",
    category: " ইসলামি ইতিহাস ও ঐতিহ্য",
    availability: 1,
    image_url: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Tatarider_Itihas_2_Khondo_Akotre-Muhammod_Jainul_Abidin-5573a-123961.jpg",
    stock: 20,
  },
];

const insertBooks = async (bookList) => {
  const conn = await db();

  try {
    for (const book of bookList) {
      const book_id = generateBookId();

      const query = `
        INSERT INTO books 
          (book_id, title, author, category, availability, image_url, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          author = VALUES(author),
          category = VALUES(category),
          availability = VALUES(availability),
          image_url = VALUES(image_url),
          stock = VALUES(stock)
      `;

      await conn.execute(query, [
        book_id,
        book.title,
        book.author,
        book.category,
        book.availability,
        book.image_url,
        book.stock,
      ]);
    }

    console.log("Books inserted successfully!");
  } catch (error) {
    console.error("Error inserting books:", error);
  } finally {
    await conn.end();
  }
};


// Call the function
insertBooks(bigBookList);
