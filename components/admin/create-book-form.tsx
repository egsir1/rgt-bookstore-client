'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { useCreateBook } from '@/hooks/books';
import axios from 'axios';

/* --------------------------- 1. validation schema -------------------------- */

const BookSchema = z.object({
	title: z.string().min(3, 'Title is too short'),
	author: z.string().min(3, 'Author is too short'),
	category: z.enum(categoryOptions as [string, ...string[]]),
	status: z.enum(BookStatus as [string, ...string[]]),
	price: z
		.number({ invalid_type_error: 'Enter a price' })
		.nonnegative('Price must be ≥ 0'),
	edition: z.string().min(1, 'Edition is required'),
	language: z.string().min(1, 'Language is required'),
	publisher: z.string().min(2, 'Publisher is required'),
	publication_date: z.string().min(4, 'Publication date is required'),
	print_length: z
		.number({ invalid_type_error: 'Pages?' })
		.positive('Must be > 0'),
	amount: z.number({ invalid_type_error: 'Amount?' }).positive('Must be > 0'),
	description: z.string().min(10, 'Add a short description'),
	thumbnailUrl: z.string().min(1, 'Thumbnail is required'),
});

type BookFormValues = z.infer<typeof BookSchema>;

/* ------------------------------ 2. component ------------------------------ */

export default function CreateBookForm() {
	const router = useRouter();
	const [preview, setPreview] = useState<string | null>(null);
	const [localFile, setLocalFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		watch,
		control,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<BookFormValues>({
		resolver: zodResolver(BookSchema),
		defaultValues: {
			category: 'TECHNOLOGY',
			status: 'ACTIVE',
			description: '',
		},
	});
	const createBookHandler = useCreateBook();
	/* live thumbnail preview */

	/* ------------------------- thumbnail upload ------------------------ */
	const handleUpload = async () => {
		if (!localFile) {
			toast.error('Choose an image first');
			return;
		}
		const imageFile = new FormData();
		imageFile.append('file', localFile, localFile.name);
		console.log('🚀 ~ handleUpload ~ imageFile:', imageFile);

		try {
			setUploading(true);
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/upload/book/single`,
				imageFile,
				{
					withCredentials: true,
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);
			if (res.data) {
				setValue('thumbnailUrl', res?.data?.path, { shouldValidate: true });
				toast.success('Image uploaded!');
			}
		} catch (e) {
			toast.error((e as Error).message);
		} finally {
			setUploading(false);
		}
	};

	const file = watch('thumbnailUrl') as unknown as FileList;
	if (file?.length && !preview) {
		setPreview(URL.createObjectURL(file[0]));
	}

	const onSubmit = async (data: BookFormValues) => {
		console.log('🚀 ~ onSubmit ~ data:', data);

		try {
			const result = await createBookHandler.mutateAsync(data);
			if (result) {
				toast.success('Book created!');
				reset();
				router.push('/mg-dashboard/books');
			}
		} catch (err) {
			toast.error((err as Error).message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-3xl mx-auto space-y-6 bg-background p-6 rounded-lg shadow'
		>
			<h1 className='text-2xl font-bold'>Add a New Book</h1>

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
						defaultValue='TECHNOLOGY'
						onValueChange={v => (register('category').onChange as any)(v)}
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

			{/* Publication date / Pages */}
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
						defaultValue='ACTIVE'
						onValueChange={v => (register('status').onChange as any)(v)}
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
					rules={{ required: true }}
					render={({ field }) => (
						<RichTextEditor
							initialHTML={field.value}
							onChange={field.onChange} // RHF handles value + validation
						/>
					)}
				/>
			</InputBlock>

			{/* Thumbnail */}
			<InputBlock
				label='Thumbnail'
				error={errors.thumbnailUrl?.message as string}
			>
				<div className='flex items-center gap-3'>
					<Input
						type='file'
						accept='image/*'
						onChange={e => {
							const f = e.target.files?.[0];
							if (f) {
								setLocalFile(f);
								setPreview(URL.createObjectURL(f));
							}
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
				{isSubmitting ? 'Saving…' : 'Create book'}
			</Button>
		</form>
	);
}

/* --------------------------- helpers / sub-components --------------------------- */

function InputBlock({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label className='font-medium'>{label}</label>
			{children}
			{error && <p className='text-destructive text-sm'>{error}</p>}
		</div>
	);
}
