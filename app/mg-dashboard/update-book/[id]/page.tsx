import { notFound } from 'next/navigation';
import CreateBookForm from '@/components/admin/create-book-form';
import { Book } from '@/types/book';

// SSR: Fetch book data
async function getBook(id: string): Promise<Book | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
		cache: 'no-store',
		credentials: 'include',
	});
	if (!res.ok) return null;
	return res.json();
}

export default async function UpdateBookPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const book = await getBook(id);
	if (!book) return notFound();

	return (
		<main className='container py-10'>
			<CreateBookForm mode='update' book={book} />
		</main>
	);
}
