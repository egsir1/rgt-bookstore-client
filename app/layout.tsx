import { Header } from '@/components/header';
import './globals.css';

import type { Metadata } from 'next';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
	title: 'BookVerse',
	description: 'Online book marketplace',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='bg-background text-foreground font-sans'>
				<Header />

				<main className='container mx-auto px-4 py-6 min-h-[calc(100vh-8rem)]'>
					{children}
				</main>

				<Footer />
			</body>
		</html>
	);
}
