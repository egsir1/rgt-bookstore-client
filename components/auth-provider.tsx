'use client';

import { useMe } from '@/hooks/use-auth';

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data, isLoading, isError } = useMe();

	return <>{children}</>;
}
