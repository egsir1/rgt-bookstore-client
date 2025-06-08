'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import { categoryOptions } from '@/lib/config';
import RichTextEditor from './rich-text-editor';

/* --------------------------- 1. validation schema -------------------------- */

const BookSchema = z.object({
	title: z.string().min(3, 'Title is too short'),
	author: z.string().min(3, 'Author is too short'),
	category: z.enum(categoryOptions as [string, ...string[]]),
	price: z
		.number({ invalid_type_error: 'Enter a price' })
		.nonnegative('Price must be ≥ 0'),
	edition: z.string().min(1, 'Edition is required'),
	publisher: z.string().min(2, 'Publisher is required'),
	publicationDate: z.string().min(4, 'Publication date is required'),
	printLength: z
		.number({ invalid_type_error: 'Pages?' })
		.positive('Must be > 0'),
	description: z.string().min(10, 'Add a short description'),
	thumbnail: z
		.any() // accept anything first
		.refine(
			files => files instanceof FileList && files.length === 1,
			'Thumbnail is required'
		),
});

type BookFormValues = z.infer<typeof BookSchema>;

/* ------------------------------ 2. component ------------------------------ */

export default function CreateBookForm() {
	const router = useRouter();
	const [preview, setPreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<BookFormValues>({
		resolver: zodResolver(BookSchema),
		defaultValues: {
			category: 'TECHNOLOGY',
		},
	});

	/* live thumbnail preview */
	const file = watch('thumbnail');
	if (file?.length && !preview) {
		setPreview(URL.createObjectURL(file[0]));
	}

	const onSubmit = async (data: BookFormValues) => {
		const form = new FormData();
		Object.entries(data).forEach(([k, v]) => {
			if (k === 'thumbnail') form.append(k, (v as FileList)[0]);
			else form.append(k, String(v));
		});

		try {
			const res = await fetch('/api/admin/books', {
				method: 'POST',
				body: form,
			});
			if (!res.ok) throw new Error('Failed to create book');
			toast.success('Book created!');
			reset();
			router.push('/admin/books');
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
					error={errors.publicationDate?.message}
				>
					<Input type='date' {...register('publicationDate')} />
				</InputBlock>

				<InputBlock label='Pages' error={errors.printLength?.message}>
					<Input
						type='number'
						{...register('printLength', { valueAsNumber: true })}
					/>
				</InputBlock>
			</div>

			{/* Description */}
			<InputBlock label='Description' error={errors.description?.message}>
				<RichTextEditor
					initialHTML={watch('description')}
					onChange={html =>
						register('description').onChange({ target: { value: html } })
					}
				/>
			</InputBlock>

			{/* Thumbnail */}
			<InputBlock label='Thumbnail' error={errors.thumbnail?.message}>
				<Input type='file' accept='image/*' {...register('thumbnail')} />
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
