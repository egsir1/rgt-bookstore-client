import { notFound } from 'next/navigation';
import { Book } from '@/types/book';
import BookDetail from '@/components/admin/book-details';

// SSR
async function getBook(id: string): Promise<Book | null> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
			cache: 'no-store',
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

export default async function BookDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const book = await getBook(id);
	if (!book) return notFound();

	return <BookDetail book={book} />;
}
