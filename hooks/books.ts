import { customAxios, HttpMethod } from '@/lib/custom-axios';
import { CreateBook } from '@/types/book';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAllBooks = (queryData: {
	limit: number;
	page: number;
	search?: string;
	sort?: string;
	category?: string;
}) => {
	const { limit, page, search, sort, category } = queryData;

	return useQuery({
		queryKey: ['all-books', limit, page, search, sort, category],
		queryFn: async () => {
			const params = new URLSearchParams();

			params.append('limit', String(limit));
			params.append('page', String(page));
			if (search) params.append('search', search);
			if (sort) params.append('sort', sort);
			if (category) params.append('category', category);

			const result = await customAxios({
				url: `/book/all-books?${params.toString()}`,
				method: HttpMethod.GET,
			});
			return result;
		},
		enabled: !!page && !!limit,
	});
};

export const useCreateBook = () => {
	return useMutation({
		mutationFn: async (data: CreateBook) => {
			const result = await customAxios({
				url: '/book/create',
				method: HttpMethod.POST,
				data,
			});
			console.log('🚀 ~ mutationFn: ~ result:', result);
			return result;
		},
	});
};

export const useUpdateBook = () => {
	return useMutation({
		mutationFn: async (data: any) => {
			const result = await customAxios({
				url: '/book/update',
				method: HttpMethod.PUT,
				data,
			});
			console.log('🚀 ~ mutationFn: ~ result:', result);
			return result;
		},
	});
};

export const useDeleteBook = () => {
	return useMutation({
		mutationFn: async (data: { bookId: number }) => {
			const result = await customAxios({
				url: '/book/delete',
				method: HttpMethod.DELETE,
				data,
			});
			console.log('🚀 ~ mutationFn: ~ result:', result);
			return result;
		},
	});
};

// export const useSingleBook = (bookId: any) => {
// 	return useQuery({
// 		queryKey: ['single-book', bookId],
// 		queryFn: async () => {
// 			const result = await customAxios({
// 				url: `/book/${bookId}`,
// 				method: HttpMethod.GET,
// 			});
// 			return result;
// 		},
// 		enabled: !!bookId,
// 	});
// };
