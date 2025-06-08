export enum userRole {
	STUDENT,
	ADMIN,
}
export type User = {
	id: number;
	email: string;
	name?: string;
	role: userRole;
	isVerified: boolean;
	books?: any;
	createdAt: Date;
	updatedAt: Date;
};
