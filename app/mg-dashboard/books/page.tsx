'use client';

import { useEffect, useState } from 'react';
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
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const sortOptions = [
	{ value: 'newest', label: 'Newest' },
	{ value: 'top_rated', label: 'Top Rated' },
	{ value: 'most_sold', label: 'Best Sellers' },
];

const categoryOptions = [
	'FICTION',
	'NONFICTION',
	'SCIENCE',
	'TECHNOLOGY',
	'HISTORY',
	'BIOGRAPHY',
	'BUSINESS',
	'CHILDREN',
	'FANTASY',
];

export default function BooksPage() {
	const [books, setBooks] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('newest');
	const [category, setCategory] = useState('');

	const fetchBooks = async () => {
		const params = new URLSearchParams({
			page: String(page),
			limit: '10',
			...(search && { search }),
			...(sort && { sort }),
			...(category && { category }),
		});

		const res = await fetch(`${BASE_URL}/books?${params.toString()}`);
		const json = await res.json();
		setBooks(json.data);
		setTotalPages(json.totalPages);
	};

	useEffect(() => {
		fetchBooks();
	}, [page, search, sort, category]);

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
				{books?.map((book: any) => (
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
