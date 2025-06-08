'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/stores/useUserStore';
import { useLogout } from '@/hooks/use-auth';
import { toast } from 'sonner';

const navItems = [
	{ label: 'Home', href: '/' },
	{ label: 'Dashboard', href: '/mg-dashboard/books' },
];

export function Header() {
	const pathname = usePathname();
	const router = useRouter();

	const { user, clearUser } = useUserStore();

	const visibleNav = user ? navItems : navItems.filter(i => i.href === '/');
	const logout = useLogout();
	const handleLogout = async () => {
		try {
			const result = await logout.mutateAsync();
			if (result) {
				toast.success('Logout success');
				clearUser();
				router.replace('/auth');
			}
		} catch (error: Error | any) {
			toast.error(error?.message);
		}
	};

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-gray-100'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4'>
				{/* Logo */}
				<Link href='/' className='text-xl font-bold tracking-tight'>
					RGT
				</Link>

				{/* Navigation */}
				{/* <nav className='hidden md:flex gap-6'>
					{visibleNav.map(item => (
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
				</nav> */}

				{/* Actions */}
				<div className='flex items-center gap-2'>
					{!user && (
						<Button
							onClick={() => router.push('/auth')}
							variant='outline'
							size='sm'
							className='cursor-pointer'
						>
							Sign In
						</Button>
					)}

					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className='w-8 h-8 rounded-full bg-primary p-5 text-white flex items-center justify-center cursor-pointer'>
									{user.email.slice(0, 2).toUpperCase()}
								</div>
							</DropdownMenuTrigger>

							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className='cursor-pointer'
									onClick={() => router.push('/mg-dashboard/books')}
								>
									Dashboard
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className='text-destructive focus:text-destructive cursor-pointer'
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}
