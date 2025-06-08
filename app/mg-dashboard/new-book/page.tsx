import CreateBookForm from '@/components/admin/create-book-form';

export default function CreateBookPage() {
	return (
		<main className='container py-10'>
			<CreateBookForm mode='create' />
		</main>
	);
}
