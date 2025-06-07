import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getInitials = (nameOrEmail: string): string => {
	if (!nameOrEmail) return '';
	const nameParts = nameOrEmail.trim().split(' ');
	if (nameParts.length === 1) {
		return nameOrEmail.slice(0, 2).toUpperCase(); // from email
	}
	return nameParts[0][0]?.toUpperCase() + nameParts[1]?.[0]?.toUpperCase();
};
