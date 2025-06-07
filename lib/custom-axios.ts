import axios from 'axios';
import apiClient from './api-client';

// enums
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

interface RequestOptions<T> {
	url: string;
	method: HttpMethod;
	data?: T;
	headers?: Record<string, string>;
	unauthenticated?: boolean;
}

export const customAxios = async <T>({
	url,
	method,
	data,
	headers,
	unauthenticated = false,
}: RequestOptions<T>) => {
	try {
		const client = unauthenticated
			? axios.create({
					baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4007',
					withCredentials: false,
			  })
			: apiClient;

		const response = await client({
			url,
			method,
			data,
			headers: {
				...apiClient.defaults.headers.common,
				...headers,
			},
		});

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as {
			response?: { data?: { message?: string }; status?: number };
		};
		const errorMessage =
			axiosError.response?.data?.message || 'An unexpected error occurred';

		const status = axiosError.response?.status || 500;
		console.log('🚀 ~ errorMessage:', errorMessage);
		console.log('🚀 ~ status:', status);
		const err = new Error(errorMessage) as Error & { status?: number };
		err.status = status;
		throw err;
	}
};
