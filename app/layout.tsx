import './globals.css';
import type { Metadata } from 'next';

import Providers from '@/components/providers';
import AuthProvider from '@/components/auth-provider';
import { Header } from '@/components/header';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import FooterConditional from '@/components/footer-conditional';

export const metadata: Metadata = {
	title: 'RGT',
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
				<Providers>
					<AuthProvider>
						<ReactQueryDevtools initialIsOpen={false} />
						<Toaster position='top-center' />

						<Header />
						<main className='container mx-auto px-4 py-6 min-h-[calc(100vh-8rem)]'>
							{children}
						</main>
						<FooterConditional />
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
