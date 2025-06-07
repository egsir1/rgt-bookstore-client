'use client';

import AppSidebar from '@/components/admin/sidebar';
import React, { useState } from 'react';

export default function InstructorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className='min-h-screen bg-muted/30 w-full'>
			<div className='mx-auto flex w-full max-w-[1440px]'>
				<div
					className={`${
						isOpen
							? 'w-1/6 min-w-[200px] max-w-[280px]'
							: 'min-w-[70px] max-w-[280px]'
					}`}
				>
					<AppSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
				</div>

				<main className='w-full'>
					<div className='px-4 py-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
