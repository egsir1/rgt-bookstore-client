import { customAxios, HttpMethod } from '@/lib/custom-axios';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAllBooks = (queryData: any) => {
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
