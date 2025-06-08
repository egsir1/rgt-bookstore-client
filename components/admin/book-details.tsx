'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/book';
import './text-editor.css';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDeleteBook } from '@/hooks/books';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface Props {
	book: Book;
}

export default function BookDetail({ book }: Props) {
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
	const router = useRouter();
	const deleteBook = useDeleteBook();

	return (
		<section className='container py-10'>
			{/* ==== GRID LAYOUT ==== */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
				{/* ── Left: Cover ───────────────────────────── */}
				<div className='w-full'>
					<Image
						src={`${BASE_URL}${book.thumbnailUrl}` || '/placeholder.png'}
						alt={book.title}
						width={400}
						height={600}
						className='rounded shadow mx-auto md:mx-0'
						priority
					/>
				</div>

				{/* ── Center: Details ───────────────────────── */}
				<div className='md:col-span-1 flex flex-col gap-4'>
					<h1 className='text-3xl font-bold leading-snug'>{book.title}</h1>
					<p className='text-muted-foreground'>by {book.author}</p>

					{/* Rating + Category */}
					<div className='flex items-center gap-3 flex-wrap'>
						<span className='text-yellow-500 font-semibold'>
							{book.ratings.toFixed(1)} ★
						</span>
						<Badge variant='default'>{book.category}</Badge>
						{book.soldCount > 100 && (
							<Badge variant='destructive'>🔥 Best Seller</Badge>
						)}
					</div>

					{/* Description */}
					<div
						className='rich-text'
						dangerouslySetInnerHTML={{ __html: book.description }}
					/>

					{/* Meta */}
					<ul className='space-y-1 text-sm'>
						<li>
							<span className='font-semibold'>Edition:</span> {book.edition}
						</li>
						<li>
							<span className='font-semibold'>Publisher:</span> {book.publisher}
						</li>
						<li>
							<span className='font-semibold'>Published:</span>{' '}
							{new Date(book.publication_date).toDateString()}
						</li>
						<li>
							<span className='font-semibold'>Pages:</span> {book.print_length}
						</li>
					</ul>
				</div>

				{/* ── Right: Actions ───────────────────────── */}
				<div className='flex gap-5'>
					<Button
						onClick={() => router.push(`/mg-dashboard/update-book/${book.id}`)}
					>
						Update
					</Button>
					<AlertDialog>
						{/* the “Delete” button becomes the dialog trigger */}
						<AlertDialogTrigger asChild>
							<Button variant='destructive' disabled={deleteBook.isPending}>
								{deleteBook.isPending ? 'Deleting…' : 'Delete'}
							</Button>
						</AlertDialogTrigger>

						{/* dialog markup */}
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete this book?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. The book and all related data
									will be permanently removed from the database.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>

								{/* Confirm button triggers the mutation */}
								<AlertDialogAction
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'
									disabled={deleteBook.isPending}
									onClick={async () => {
										try {
											const data = { bookId: book.id };
											await deleteBook.mutateAsync(data);
											toast.success('Book deleted');
											router.push('/mg-dashboard/books');
										} catch (e) {
											toast.error((e as Error).message);
										}
									}}
								>
									{deleteBook.isPending ? 'Deleting…' : 'Yes, delete'}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</section>
	);
}
