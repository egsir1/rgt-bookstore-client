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
import { useUserStore } from '@/stores/useUserStore';
import {
	BookOpen,
	Boxes,
	CalendarDays,
	FileText,
	Globe,
	Hash,
	Landmark,
	PackageCheck,
	ShoppingCart,
	Star,
	User2,
} from 'lucide-react';

interface Props {
	book: Book;
}

export default function BookDetail({ book }: Props) {
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
	const router = useRouter();
	const deleteBook = useDeleteBook();
	const { user } = useUserStore();
	return (
		<section className='container py-10 '>
			<div className='flex gap-10'>
				<div className='w-full '>
					<Image
						src={`${BASE_URL}${book.thumbnailUrl}` || '/assets/book-cover.png'}
						alt={book.title}
						width={400}
						height={600}
						className='rounded shadow mx-auto md:mx-0 bg-red-300 '
						loading='lazy'
					/>
				</div>

				<div className='md:col-span-1 flex flex-col gap-4'>
					<h1 className='text-3xl font-bold leading-snug'>{book.title}</h1>
					<p className='text-muted-foreground'>by {book.author}</p>

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
				</div>

				{user && String(user?.role) === 'ADMIN' && (
					<div>
						<div className='flex  w-[200px] gap-5'>
							<Button
								variant={'outline'}
								onClick={() =>
									router.push(`/mg-dashboard/update-book/${book.id}`)
								}
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
											This action cannot be undone. The book and all related
											data will be permanently removed from the database.
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
						<div className='grid grid-cols-1 gap-3 rounded-xl border p-4 mt-2 shadow-sm  bg-white'>
							<div className='flex items-center gap-3'>
								<Boxes size={18} />
								<p className='text-sm text-gray-700 dark:text-gray-300'>
									Total Stock:{' '}
									<span className='font-semibold'>{book.amount}</span>
								</p>
							</div>

							<div className='flex items-center gap-3'>
								<ShoppingCart size={18} />
								<p className='text-sm text-gray-700 dark:text-gray-300'>
									Sold: <span className='font-semibold'>{book.soldCount}</span>
								</p>
							</div>

							<div className='flex items-center gap-3'>
								<BookOpen size={18} />
								<p className='text-sm text-gray-700 dark:text-gray-300'>
									Remaining:{' '}
									<span className='font-semibold'>
										{Number(book.amount) - Number(book.soldCount)}
									</span>
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className='grid grid-cols-2 md:grid-cols-7 sm:grid-cols-4 gap-4 py-4 border border-gray-100 rounded-md mt-2'>
				<div className='flex flex-col items-center'>
					<Hash className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Edition</p>
					<p className='font-semibold text-sm'>{book.edition}</p>
				</div>

				<div className='flex flex-col items-center'>
					<Landmark className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Publisher</p>
					<p className='font-semibold text-sm'>{book.publisher}</p>
				</div>

				<div className='flex flex-col items-center'>
					<CalendarDays className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Published</p>
					<p className='font-semibold text-sm'>
						{new Date(book.publication_date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>

				<div className='flex flex-col items-center'>
					<FileText className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Pages</p>
					<p className='font-semibold text-sm'>{book.print_length}</p>
				</div>

				<div className='flex flex-col items-center'>
					<Globe className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Language</p>
					<p className='font-semibold text-sm'>{book.language}</p>
				</div>

				<div className='flex flex-col items-center'>
					<PackageCheck className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Status</p>
					<p className='font-semibold text-sm capitalize'>{book.book_status}</p>
				</div>

				<div className='flex flex-col items-center'>
					<User2 className='text-muted-foreground mb-1' size={20} />
					<p className='text-xs text-gray-500'>Owner</p>
					<p className='font-semibold text-sm'>{book.owner?.email || 'N/A'}</p>
				</div>
			</div>
		</section>
	);
}
