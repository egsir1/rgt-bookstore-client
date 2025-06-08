import React from 'react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen flex items-center justify-center border rounded-sm'>
			<div className='w-full max-w-lg rounded-lg p-8'>{children}</div>
		</div>
	);
}
