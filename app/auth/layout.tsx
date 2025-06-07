// app/auth/layout.tsx
import React from 'react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
			<div className='w-full max-w-lg dark:bg-gray-800 rounded-lg p-8'>
				{children}
			</div>
		</div>
	);
}
