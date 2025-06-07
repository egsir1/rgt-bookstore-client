export function Footer() {
	return (
		<footer className='border-t mt-10 py-6 bg-muted'>
			<div className='container mx-auto px-4 flex flex-col md:flex-row items-center justify-between'>
				<p className='text-sm text-muted-foreground'>
					© {new Date().getFullYear()} RGT
				</p>
				<div className='flex gap-4 text-sm text-muted-foreground'>
					<a href='/'>Privacy</a>
					<a href='/'>Terms</a>
				</div>
			</div>
		</footer>
	);
}
