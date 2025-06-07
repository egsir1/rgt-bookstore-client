'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/book';

interface Props {
	book: Book;
}

export default function BookDetail({ book }: Props) {
	const [qty, setQty] = useState(1);
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
					<p className='text-sm leading-relaxed text-muted-foreground'>
						{book.description}
					</p>

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

				{/* ── Right: Buy Box ───────────────────────── */}
				<div className='md:col-start-3 md:row-start-1 md:sticky md:top-24'>
					<div className='border rounded p-4 shadow flex flex-col gap-4'>
						<h2 className='text-2xl font-bold'>${book.price.toFixed(2)}</h2>

						<div className='space-y-1'>
							<label htmlFor='qty' className='text-sm font-medium'>
								Quantity
							</label>
							<select
								id='qty'
								value={qty}
								onChange={e => setQty(Number(e.target.value))}
								className='border rounded p-2 w-full'
							>
								{[...Array(Math.min(book.amount ?? 10, 10)).keys()].map(n => (
									<option key={n + 1}>{n + 1}</option>
								))}
							</select>
						</div>

						<Button className='w-full'>Add to Cart</Button>
						<Button variant='outline' className='w-full'>
							Buy Now
						</Button>

						<p className='text-xs text-muted-foreground text-center'>
							Ships &amp; sold by BookStore • 30-day return policy
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
