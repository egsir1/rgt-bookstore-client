'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer';

export default function FooterConditional() {
	const pathname = usePathname();
	if (pathname.startsWith('/mg-dashboard')) return null;
	return <Footer />;
}
