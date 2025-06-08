export function InputBlock({
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
