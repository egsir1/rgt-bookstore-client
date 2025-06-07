import { customAxios, HttpMethod } from '@/lib/custom-axios';
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
		mutationFn: async (otpcode: string) => {
			const res = await customAxios({
				url: '/user/verify-email',
				method: HttpMethod.POST,
				data: { activationCode: otpcode },
			});
			console.log('🚀 ~ mutationFn: ~ res:', res);

			return res;
		},
	});
};

export const useLogin = () => {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await customAxios({
				url: '/user/login',
				method: HttpMethod.POST,
				data,
			});
			console.log('🚀 ~ useLogin ~ res:', res);
			return res;
		},
	});
};
