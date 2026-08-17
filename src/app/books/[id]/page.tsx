import { getBookById } from '@/src/services/book'
import DetailsCard from '@/src/app/books/[id]/components/DetailsCard/index';
import RelatedBookGrid from '@/src/app/books/[id]/components/RelatedBookGrid/index';
import AuthorBooks from '@/src/app/books/[id]/components/AuthorBooks';
import HeaderLayout from '@/src/layouts/HeaderLayout';

const Index = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const bookDetailsResponse = await getBookById(id)
  const book = bookDetailsResponse.data;

  return (
    <HeaderLayout>
        <div className="container">
          <DetailsCard book={book} />
          <AuthorBooks category={book.category}  />
          <RelatedBookGrid book={book}  />
      </div>
    </HeaderLayout>
  );
};

export default Index;


