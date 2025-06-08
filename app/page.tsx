'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { BookCard } from '@/components/admin/books-card';
import BookCardSkeleton from '@/components/admin/book-card-skeleton';
import { Pagination } from '@/components/admin/pagination';

import { categoryOptions, sortOptions } from '@/lib/config';
import { useAllBooks } from '@/hooks/books';
import { useUserStore } from '@/stores/useUserStore';

export default function BooksPage() {
	/* pagination / filters */
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [sort, setSort] = useState('newest');
	const [category, setCategory] = useState('');
	const limit = 10;

	const router = useRouter();
	const { user } = useUserStore();

	/* query */
	const {
		data: books,
		isLoading,
		refetch,
	} = useAllBooks({
		page,
		limit,
		search: debouncedSearch,
		sort,
		category,
	});

	/* debounce search */
	useEffect(() => {
		const id = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(1);
		}, 600);
		return () => clearTimeout(id);
	}, [search]);

	/* refetch on param change */
	useEffect(() => {
		refetch();
	}, [page, debouncedSearch, sort, category, refetch]);

	/* read total pages from API meta */
	useEffect(() => {
		if (books?.meta?.totalPages) setTotalPages(books.meta.totalPages);
	}, [books]);

	/* render */
	return (
		<section className='container py-8'>
			{/* ─── admin only: new-book button ───────────────────────── */}
			{user && String(user?.role) === 'ADMIN' && (
				<div className='mb-4 flex justify-end'>
					<Button onClick={() => router.push('/mg-dashboard/new-book')}>
						+ New Book
					</Button>
				</div>
			)}

			{/* ─── filters ───────────────────────────────────────────── */}
			<div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<Input
					placeholder='Search books…'
					value={search}
					onChange={e => setSearch(e.target.value)}
					className='w-full md:w-1/3'
				/>

				<div className='flex w-full gap-4 md:w-auto'>
					{/* sort */}
					<Select value={sort} onValueChange={setSort}>
						<SelectTrigger className='w-[160px]'>
							<SelectValue placeholder='Sort by' />
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map(opt => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* category */}
					<Select
						value={category || 'All'}
						onValueChange={v => {
							setCategory(v === 'All' ? '' : v);
							setPage(1);
						}}
					>
						<SelectTrigger className='w-[170px]'>
							<SelectValue placeholder='Category' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='All'>All</SelectItem>
							{categoryOptions.map(cat => (
								<SelectItem key={cat} value={cat}>
									{cat.charAt(0) + cat.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* ─── grid ──────────────────────────────────────────────── */}
			<div className='flex flex-wrap gap-6'>
				{isLoading
					? Array.from({ length: limit }).map((_, i) => (
							<BookCardSkeleton key={i} />
					  ))
					: books?.data?.map((b: any) => (
							<BookCard key={b.id} book={b} path='/books' />
					  ))}
			</div>

			{/* ─── pagination ───────────────────────────────────────── */}
			<div className='mt-10 flex justify-center'>
				<Pagination
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>
		</section>
	);
}
