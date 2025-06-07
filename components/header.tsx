'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Books', href: '/books' },
	{ label: 'Dashboard', href: '/dashboard' },
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-white'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4'>
				{/* Logo */}
				<Link href='/' className='text-xl font-bold tracking-tight'>
					RGT
				</Link>

				{/* Navigation */}
				<nav className='hidden md:flex gap-6'>
					{navItems.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className={`text-sm font-medium transition-colors hover:text-primary ${
								pathname === item.href
									? 'text-primary'
									: 'text-muted-foreground'
							}`}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Actions */}
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm'>
						Sign In
					</Button>
				</div>
			</div>
		</header>
	);
}
