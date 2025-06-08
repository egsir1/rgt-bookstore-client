export interface Book {
	id: number;
	title: string;
	author: string;
	description: string;
	price: number;
	ratings: number;
	soldCount: number;
	book_status: string;
	language: string;
	amount: number;
	edition: string;
	publisher: string;
	publication_date: string;
	thumbnailUrl: string;
	category: string;
	print_length: number;
}

export interface CreateBook {
	title: string;
	author: string;
	description: string;
	price: number;
	amount: number;
	thumbnailUrl: string;
	edition: number | string;
	publisher: string;
	publication_date: string;
	category: string;
	language: string;
	print_length: number;
	status: string;
}
