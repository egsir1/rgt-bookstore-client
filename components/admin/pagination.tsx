import { Button } from '@/components/ui/button';

interface Props {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
	return (
		<div className='flex gap-4 items-center'>
			<Button
				variant='outline'
				size='sm'
				disabled={page === 1}
				onClick={() => onPageChange(page - 1)}
			>
				Prev
			</Button>
			<span className='text-sm font-medium'>
				Page {page} of {totalPages}
			</span>
			<Button
				variant='outline'
				size='sm'
				disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</Button>
		</div>
	);
}
