import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookCardSkeleton() {
	return (
		<Card className='h-[450px] w-[350px] animate-pulse'>
			<CardHeader>
				{/* title + author placeholders */}
				<CardTitle className='h-5 w-2/3 rounded bg-muted' />
				<div className='mt-2 h-4 w-1/3 rounded bg-muted' />
			</CardHeader>

			<CardContent className='flex flex-col gap-2'>
				{/* cover image placeholder */}
				<div className='h-[230px] w-full rounded-md bg-muted' />

				{/* description lines */}
				<div className='h-3 w-full rounded bg-muted/70' />
				<div className='h-3 w-5/6 rounded bg-muted/70' />
				<div className='h-3 w-2/3 rounded bg-muted/70' />

				{/* price + category row */}
				<div className='mt-auto flex justify-between pt-1'>
					<div className='h-4 w-16 rounded bg-muted' />
					<div className='h-4 w-24 rounded-full bg-muted' />
				</div>
			</CardContent>
		</Card>
	);
}
