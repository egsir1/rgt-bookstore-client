'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { BookCard } from '@/components/admin/books-card';
import { Pagination } from '@/components/admin/pagination';
import { categoryOptions, sortOptions } from '@/lib/config';
import { useAllBooks } from '@/hooks/books';

export default function BooksPage() {
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('newest');
	const [category, setCategory] = useState('');
	const limit = 10;
	const {
		data: books,
		isLoading,
		refetch,
	} = useAllBooks({
		page,
		limit,
		search,
		sort,
		category,
	});
	console.log('🚀 ~ BooksPage ~ booksList:', books);
	return (
		<section className='container py-8'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
				<Input
					placeholder='Search books...'
					value={search}
					onChange={e => {
						setSearch(e.target.value);
						setPage(1);
					}}
					className='w-full md:w-1/3'
				/>

				<div className='flex gap-4 w-full md:w-auto'>
					<Select value={sort} onValueChange={val => setSort(val)}>
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

					<Select
						value={category}
						onValueChange={val => {
							setCategory(val);
							setPage(1);
						}}
					>
						<SelectTrigger className='w-[160px]'>
							<SelectValue placeholder='Filter by category' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='All'>All</SelectItem>
							{categoryOptions.map(cat => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Book Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{books?.data?.map((book: any) => (
					<BookCard key={book.id} book={book} />
				))}
			</div>

			{/* Pagination */}
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
