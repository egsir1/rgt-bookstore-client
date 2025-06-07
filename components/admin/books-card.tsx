import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BookCard({ book }: { book: any }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg'>{book.title}</CardTitle>
				<p className='text-sm text-muted-foreground'>by {book.author}</p>
			</CardHeader>
			<CardContent className='flex flex-col gap-2'>
				<Image
					src={book.thumbnailUrl || '/default-cover.jpg'}
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
