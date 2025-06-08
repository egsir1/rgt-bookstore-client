'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BookStatus, categoryOptions } from '@/lib/config';
import RichTextEditor from './rich-text-editor';
import { useCreateBook, useUpdateBook } from '@/hooks/books';
import { Book } from '@/types/book';
import { InputBlock } from './input-block';

type Props = { mode: 'create'; book?: never } | { mode: 'update'; book: Book };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* ──────────────────────── validation ───────────────────── */
const BookSchema = z.object({
	title: z.string().min(3),
	author: z.string().min(3),
	category: z.enum(categoryOptions as [string, ...string[]]),
	status: z.enum(BookStatus as [string, ...string[]]),
	price: z.number({ invalid_type_error: 'Enter a price' }).nonnegative(),
	edition: z.string().min(1),
	language: z.string().min(1),
	publisher: z.string().min(2),
	publication_date: z.string().min(4),
	print_length: z.number({ invalid_type_error: 'Pages?' }).positive(),
	amount: z.number({ invalid_type_error: 'Amount?' }).positive(),
	description: z.string().min(10),
	thumbnailUrl: z.string().min(1, 'Thumbnail is required'),
});
type BookFormValues = z.infer<typeof BookSchema>;

/* ─────────────────────── component ─────────────────────── */
export default function CreateBookForm({ mode, book }: Props) {
	const router = useRouter();
	const createBook = useCreateBook();
	const updateBook = useUpdateBook();

	/* local UI state */
	const [localFile, setLocalFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(
		mode === 'update' ? `${BASE_URL}${book.thumbnailUrl}` : null
	);
	const [uploading, setUploading] = useState(false);

	/* RHF */
	const {
		register,
		handleSubmit,
		control,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<BookFormValues>({
		resolver: zodResolver(BookSchema),
		defaultValues:
			mode === 'update'
				? {
						title: book.title,
						author: book.author,
						category: book.category,
						status: book.book_status,
						price: book.price,
						edition: book.edition,
						language: book.language,
						publisher: book.publisher,
						publication_date: book.publication_date.slice(0, 10),
						print_length: book.print_length,
						amount: book.amount,
						description: book.description,
						thumbnailUrl: book.thumbnailUrl,
				  }
				: {
						category: 'TECHNOLOGY',
						status: 'ACTIVE',
						description: '',
				  },
	});

	/* ───────────── thumbnail upload handler ───────────── */
	const handleUpload = async () => {
		if (!localFile) return toast.error('Choose an image first');

		const fd = new FormData();
		fd.append('file', localFile, localFile.name);

		try {
			setUploading(true);
			const { data } = await axios.post(`${BASE_URL}/upload/book/single`, fd, {
				withCredentials: true,
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setValue('thumbnailUrl', data.path, { shouldValidate: true });
			setPreview(URL.createObjectURL(localFile));
			toast.success('Image uploaded!');
		} catch (e) {
			toast.error((e as Error).message);
		} finally {
			setUploading(false);
		}
	};

	/* ───────────── submit handler ───────────── */
	const onSubmit = async (values: BookFormValues) => {
		try {
			if (mode === 'create') {
				await createBook.mutateAsync(values);
				toast.success('Book created!');
			} else {
				await updateBook.mutateAsync({ bookId: book.id, ...values });
				toast.success('Book updated!');
			}
			reset();
			router.push('/mg-dashboard/books');
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	/* ───────────── JSX (original layout untouched) ───────────── */
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-3xl mx-auto space-y-6 bg-background p-6 rounded-lg shadow'
		>
			<h1 className='text-2xl font-bold'>
				{mode === 'create' ? 'Add a New Book' : 'Update Book'}
			</h1>

			{/* Title / Author */}
			<InputBlock label='Title' error={errors.title?.message}>
				<Input
					placeholder='Designing Data-Intensive Applications'
					{...register('title')}
				/>
			</InputBlock>
			<InputBlock label='Author' error={errors.author?.message}>
				<Input placeholder='Martin Kleppmann' {...register('author')} />
			</InputBlock>

			{/* Category & Price */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<InputBlock label='Category' error={errors.category?.message}>
					<Select
						defaultValue={mode === 'update' ? book.category : 'TECHNOLOGY'}
						onValueChange={v => setValue('category', v as any)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{categoryOptions.map(opt => (
								<SelectItem key={opt} value={opt}>
									{opt.charAt(0) + opt.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</InputBlock>

				<InputBlock label='Price (USD)' error={errors.price?.message}>
					<Input
						type='number'
						step='0.01'
						{...register('price', { valueAsNumber: true })}
					/>
				</InputBlock>
			</div>

			{/* Edition / Publisher */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<InputBlock label='Edition' error={errors.edition?.message}>
					<Input placeholder='1st' {...register('edition')} />
				</InputBlock>
				<InputBlock label='Publisher' error={errors.publisher?.message}>
					<Input placeholder='O’Reilly Media' {...register('publisher')} />
				</InputBlock>
			</div>

			{/* Publication date / Pages / Language / Amount / Status */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<InputBlock
					label='Publication date'
					error={errors.publication_date?.message}
				>
					<Input type='date' {...register('publication_date')} />
				</InputBlock>
				<InputBlock label='Pages' error={errors.print_length?.message}>
					<Input
						type='number'
						{...register('print_length', { valueAsNumber: true })}
					/>
				</InputBlock>
				<InputBlock label='Language' error={errors.language?.message}>
					<Input placeholder='English' {...register('language')} />
				</InputBlock>
				<InputBlock label='Amount' error={errors.amount?.message}>
					<Input
						type='number'
						{...register('amount', { valueAsNumber: true })}
					/>
				</InputBlock>
				<InputBlock label='Status' error={errors.status?.message}>
					<Select
						defaultValue={mode === 'update' ? book.book_status : 'ACTIVE'}
						onValueChange={v => setValue('status', v as any)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{BookStatus.map(opt => (
								<SelectItem key={opt} value={opt}>
									{opt.charAt(0) + opt.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</InputBlock>
			</div>

			{/* Description */}
			<InputBlock label='Description' error={errors.description?.message}>
				<Controller
					name='description'
					control={control}
					render={({ field }) => (
						<RichTextEditor
							initialHTML={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
			</InputBlock>

			{/* Thumbnail */}
			<InputBlock label='Thumbnail' error={errors.thumbnailUrl?.message}>
				<div className='flex items-center gap-3'>
					<Input
						type='file'
						accept='image/*'
						onChange={e => {
							const f = e.target.files?.[0];
							if (f) setLocalFile(f);
						}}
						className='flex-1'
					/>
					<Button
						type='button'
						variant='secondary'
						disabled={!localFile || uploading}
						onClick={handleUpload}
					>
						{uploading ? 'Uploading…' : 'Upload'}
					</Button>
				</div>

				{preview && (
					<Image
						src={preview}
						alt='preview'
						width={200}
						height={300}
						className='rounded mt-2'
					/>
				)}
			</InputBlock>

			<Button
				type='submit'
				disabled={isSubmitting}
				className='w-full md:w-auto'
			>
				{isSubmitting
					? 'Saving…'
					: mode === 'create'
					? 'Create book'
					: 'Update book'}
			</Button>
		</form>
	);
}
