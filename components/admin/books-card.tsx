import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function BookCard({ book }: { book: any }) {
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
	const router = useRouter();
	return (
		<Card
			className='cursor-pointer'
			onClick={() => router.push(`/mg-dashboard/books/${book.id}`)}
		>
			<CardHeader>
				<CardTitle className='text-lg'>{book.title}</CardTitle>
				<p className='text-sm text-muted-foreground'>by {book.author}</p>
			</CardHeader>
			<CardContent className='flex flex-col gap-2'>
				<Image
					src={`${BASE_URL}${book.thumbnailUrl}` || '/default-cover.jpg'}
					alt={book.title}
					width={400}
					height={300}
					className='rounded-md object-cover w-full h-[200px]'
				/>
				<p className='text-sm text-muted-foreground line-clamp-3'>
					{book.description}
				</p>
				<div className='text-sm font-medium text-primary'>${book.price}</div>
			</CardContent>
		</Card>
	);
}
