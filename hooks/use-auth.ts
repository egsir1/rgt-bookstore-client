import { customAxios, HttpMethod } from '@/lib/custom-axios';
import { useUserStore } from '@/stores/useUserStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useSignup = () => {
	return useMutation({
		mutationFn: async (data: {
			fullName: string;
			email: string;
			password: string;
		}) => {
			const res = await customAxios({
				url: '/user/signup',
				method: HttpMethod.POST,
				data,
			});
			console.log('🚀 ~ useSignup ~ res:', res);
			return res;
		},
	});
};

export const useVerify = () => {
	return useMutation({
		mutationFn: async (data: { code: string; token: string | null }) => {
			const res = await customAxios({
				url: '/user/verify-email',
				method: HttpMethod.PATCH,
				data,
			});
			console.log('🚀 ~ mutationFn: ~ res:', res);

			return res;
		},
	});
};

export const useLogin = () => {
	const setUser = useUserStore(state => state.setUser);

	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await customAxios({
				url: '/user/login',
				method: HttpMethod.POST,
				data,
			});
			console.log('🚀 ~ useLogin ~ res:', res);
			if (res.data) {
				setUser(res.data);
			}
			return res;
		},
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: async () => {
			const res = await customAxios({
				url: '/user/logout',
				method: HttpMethod.POST,
			});
			console.log('🚀 ~ useLogout ~ res:', res);
			return res;
		},
	});
};

export const useMe = () => {
	const setUser = useUserStore(state => state.setUser);
	const query = useQuery({
		// enabled,
		queryKey: ['me'],
		queryFn: () => customAxios({ url: '/user/me', method: HttpMethod.GET }),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data);
		}
	}, [query.data, setUser]);

	return query;
};
