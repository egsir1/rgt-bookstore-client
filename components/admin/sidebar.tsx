'use client';

import {
	IconTrendingUp,
	IconUser,
	IconBell,
	IconUsers,
	IconStar,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
	IconBook,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getInitials } from '@/lib/utils';

const navItems = [
	{
		title: 'Books',
		href: '/instructor/courses',
		icon: IconBook,
	},
	{
		title: 'Users',
		href: '/instructor/students',
		icon: IconUsers,
	},
	{
		title: 'Performance',
		href: '/instructor/performance',
		icon: IconTrendingUp,
	},

	{
		title: 'Profile',
		href: '/instructor/profile',
		icon: IconUser,
	},
	{
		title: 'Notifications',
		href: '/instructor/notifications',
		icon: IconBell,
	},

	{
		title: 'Reviews',
		href: '/instructor/reviews',
		icon: IconStar,
	},
];

type Props = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export default function AppSidebar({ isOpen, setIsOpen }: Props) {
	const pathname = usePathname();
	const user = {
		name: 'Sam Egamberdiev',
		email: 'samdev@example.com',
	};

	const initials = getInitials(user.name || user.email);
	const displayName = user.name || user.email;

	return (
		<motion.aside
			initial={false}
			animate={{ width: isOpen ? 256 : 64 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className='fixed left-0 top-0 h-full border-r z-20 mt-[4rem] bg-white dark:bg-black dark:border-gray-800 overflow-hidden'
		>
			<div className='flex items-center justify-between px-4 py-2'>
				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.h2
							key='label'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className='text-lg font-bold text-gray-900 dark:text-white'
						>
							Admin Panel
						</motion.h2>
					)}
				</AnimatePresence>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='cursor-pointer text-gray-600 dark:text-gray-300 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
				>
					{isOpen ? (
						<IconLayoutSidebarLeftCollapse className='h-5 w-5' />
					) : (
						<IconLayoutSidebarLeftExpand className='h-5 w-5' />
					)}
				</button>
			</div>
			<ul className='space-y-2 mt-4 px-2'>
				{navItems.map(item => {
					const Icon = item.icon;
					const active = pathname.startsWith(item.href);
					return (
						<li key={item.href}>
							<Link
								href={item.href}
								className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors 
                  ${
										active
											? 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white'
											: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
									}
					${!isOpen && 'w-[85%]'}

                `}
							>
								<Icon className='h-5 w-5' />
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.span
											key='text'
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -10 }}
										>
											{item.title}
										</motion.span>
									)}
								</AnimatePresence>
							</Link>
						</li>
					);
				})}
			</ul>
			<div className='mt-4 w-full border-t dark:border-gray-700 px-4 py-3'>
				<div className='flex items-center gap-3'>
					<div className='relative'>
						<div className='bg-black text-white dark:bg-white dark:text-black rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold'>
							{initials}
						</div>
					</div>
					<AnimatePresence initial={false}>
						{isOpen && (
							<motion.div
								key='name'
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className='flex flex-col'
							>
								<span className='text-sm font-medium text-gray-900 dark:text-white'>
									{displayName}
								</span>
								<span className='text-xs text-gray-500 dark:text-gray-400'>
									ADMIN
								</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.aside>
	);
}
